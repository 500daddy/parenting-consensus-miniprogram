const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

function getSortTime(record) {
  return String(record.updatedAt || record.createdAt || '')
}

function enrichDoctorRecord(record) {
  const templates = record.templateQuestionsTouched
    ? record.templateQuestions
    : (record.templateQuestions && record.templateQuestions.length
      ? record.templateQuestions
      : toolService.getDoctorQuestionTemplates(record.categoryId))

  return Object.assign({}, record, {
    type: 'doctor',
    typeLabel: '就医',
    iconPath: '/assets/icons/pixel-v2/action/doctor-note.png',
    displayTitle: '就医前记录单',
    sourceTitle: record.questionTitle || '',
    displayTime: toolService.formatRecordTime(record.updatedAt || record.createdAt),
    questions: templates.concat(record.customQuestions || [])
  })
}

function enrichFeedingRecord(record) {
  const amountText = record.amount && String(record.amount).indexOf('ml') === -1
    ? `${record.amount} ml`
    : record.amount

  return Object.assign({}, record, {
    type: 'feeding',
    typeLabel: '喂养',
    iconPath: '/assets/icons/pixel-v2/category/feeding.png',
    displayTitle: '奶量记录',
    displayTime: toolService.formatRecordTime(record.updatedAt || record.createdAt),
    amountText
  })
}

function enrichVaccineRecord(record) {
  const vaccineNameText = record.vaccineNameCustom || record.vaccineName || ''
  const reactionText = record.reactionCustom || record.reaction || ''
  return Object.assign({}, record, {
    type: 'vaccine',
    typeLabel: '疫苗',
    iconPath: '/assets/icons/pixel-v2/category/vaccine.png',
    displayTitle: '疫苗记录',
    sourceTitle: record.questionTitle || '',
    displayTime: toolService.formatRecordTime(record.updatedAt || record.createdAt),
    vaccineNameText,
    reactionText,
    questions: record.nextQuestions || []
  })
}

function getDateKey(record) {
  const source = record.fedAt || record.createdAt || record.updatedAt || ''
  const match = String(source).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) return `${match[1]}-${match[2]}-${match[3]}`
  const date = new Date(source)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function formatDateLabel(key) {
  const parts = String(key || '').split('-')
  if (parts.length !== 3) return key || ''
  return `${Number(parts[1])}月${Number(parts[2])}日`
}

function buildFeedingDaySummaries(records) {
  const byDate = {}
  records.forEach((record) => {
    const key = getDateKey(record)
    if (!key) return
    if (!byDate[key]) {
      byDate[key] = { key, label: formatDateLabel(key), count: 0, totalAmount: 0 }
    }
    const value = Number(String(record.amount || '').replace(/[^\d.]/g, ''))
    byDate[key].count += 1
    byDate[key].totalAmount += Number.isFinite(value) ? value : 0
  })
  return Object.keys(byDate)
    .sort((left, right) => right.localeCompare(left))
    .map((key) => byDate[key])
}

Page({
  data: {
    records: [],
    visibleRecords: [],
    feedingRecordCount: 0,
    feedingDaySummaries: [],
    visibleFeedingDaySummaries: [],
    isFeedingExpanded: false,
    isFeedingSummaryExpanded: false,
    showFeedingTools: true,
    activeType: 'all',
    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'doctor', name: '就医' },
      { id: 'feeding', name: '喂养' },
      { id: 'vaccine', name: '疫苗' }
    ],
    actionIconPaths: service.actionIconPaths
  },

  onShow() {
    const doctorRecords = toolService.getDoctorVisitRecords().map(enrichDoctorRecord)
    const feedingRecords = toolService.getFeedingRecords().map(enrichFeedingRecord)
    const vaccineRecords = toolService.getVaccineRecords().map(enrichVaccineRecord)
    const daySummaries = buildFeedingDaySummaries(feedingRecords)
    const showFeedingTools = this.data.activeType === 'all' || this.data.activeType === 'feeding'
    const records = this.buildRecords(
      doctorRecords,
      feedingRecords,
      vaccineRecords,
      this.data.isFeedingExpanded,
      this.data.activeType
    )

    this.setData({
      records: records.allRecords,
      visibleRecords: records.visibleRecords,
      feedingRecordCount: feedingRecords.length,
      feedingDaySummaries: daySummaries,
      visibleFeedingDaySummaries: this.data.isFeedingSummaryExpanded ? daySummaries : daySummaries.slice(0, 2),
      showFeedingTools
    })
  },

  buildRecords(doctorRecords, feedingRecords, vaccineRecords, expanded, activeType) {
    const shownFeedingRecords = expanded ? feedingRecords : feedingRecords.slice(0, 1)
    const allRecords = doctorRecords.concat(feedingRecords, vaccineRecords)
      .sort((left, right) => getSortTime(right).localeCompare(getSortTime(left)))

    let typedRecords = doctorRecords.concat(shownFeedingRecords, vaccineRecords)
    if (activeType === 'doctor') {
      typedRecords = doctorRecords
    } else if (activeType === 'feeding') {
      typedRecords = shownFeedingRecords
    } else if (activeType === 'vaccine') {
      typedRecords = vaccineRecords
    }

    return {
      allRecords,
      visibleRecords: typedRecords.sort((left, right) => getSortTime(right).localeCompare(getSortTime(left)))
    }
  },

  goNewRecord() {
    wx.showActionSheet({
      itemList: ['就医前记录单', '奶量记录', '疫苗记录'],
      success: (res) => {
        const paths = [
          '/pages/tools/doctor-visit/index',
          '/pages/tools/feeding-log/index',
          '/pages/tools/vaccine-log/index'
        ]
        wx.navigateTo({ url: paths[res.tapIndex] || paths[0] })
      }
    })
  },

  toggleFeedingRecords() {
    this.setData({
      isFeedingExpanded: !this.data.isFeedingExpanded
    })
    this.onShow()
  },

  toggleFeedingSummary() {
    this.setData({
      isFeedingSummaryExpanded: !this.data.isFeedingSummaryExpanded
    })
    this.onShow()
  },

  changeFilter(event) {
    const type = event.currentTarget.dataset.type || 'all'
    this.setData({ activeType: type })
    this.onShow()
  },

  editRecord(event) {
    const id = event.currentTarget.dataset.id
    const type = event.currentTarget.dataset.type
    if (!id) return

    const paths = {
      doctor: '/pages/tools/doctor-visit/index',
      feeding: '/pages/tools/feeding-log/index',
      vaccine: '/pages/tools/vaccine-log/index'
    }
    wx.navigateTo({ url: `${paths[type] || paths.doctor}?recordId=${id}` })
  },

  deleteRecord(event) {
    const id = event.currentTarget.dataset.id
    const type = event.currentTarget.dataset.type
    if (!id) return
    wx.showModal({
      title: '删除记录',
      content: '删除后，这条本地记录无法恢复。',
      confirmText: '删除',
      confirmColor: '#d96f45',
      success: (res) => {
        if (!res.confirm) return
        if (type === 'feeding') {
          toolService.deleteFeedingRecord(id)
        } else if (type === 'vaccine') {
          toolService.deleteVaccineRecord(id)
        } else {
          toolService.deleteDoctorVisitRecord(id)
        }
        this.onShow()
        wx.showToast({ title: '已删除', icon: 'none' })
      }
    })
  }
})
