const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

function getSortTime(record) {
  return String(record.fedAt || record.vaccinatedAt || record.measuredAt || record.updatedAt || record.createdAt || '')
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
    displayTime: toolService.formatRecordTime(record.fedAt || record.updatedAt || record.createdAt),
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
    displayTime: toolService.formatRecordTime(record.vaccinatedAt || record.updatedAt || record.createdAt),
    vaccineNameText,
    reactionText,
    questions: record.nextQuestions || []
  })
}

function enrichGrowthRecord(record) {
  const metricText = [
    record.weight ? `${record.weight} kg` : '',
    record.height ? `${record.height} cm` : '',
    record.headCircumference ? `头围 ${record.headCircumference} cm` : ''
  ].filter(Boolean).join(' / ')
  return Object.assign({}, record, {
    type: 'growth',
    typeLabel: '生长',
    iconPath: '/assets/icons/pixel-v2/category/growth.png',
    displayTitle: '生长记录',
    sourceTitle: record.questionTitle || '',
    displayTime: toolService.formatRecordTime(record.measuredAt || record.updatedAt || record.createdAt),
    metricText
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
    vaccineRecordCount: 0,
    growthRecordCount: 0,
    feedingDaySummaries: [],
    visibleFeedingDaySummaries: [],
    isFeedingExpanded: false,
    isFeedingSummaryExpanded: false,
    isVaccineExpanded: false,
    isGrowthExpanded: false,
    showFeedingTools: true,
    showVaccineTools: true,
    showGrowthTools: true,
    showRecordTools: false,
    activeType: 'all',
    activeToolGroup: 'all',
    toolTabs: toolService.getToolHubTabs(),
    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'doctor', name: '就医' },
      { id: 'feeding', name: '喂养' },
      { id: 'vaccine', name: '疫苗' },
      { id: 'growth', name: '生长' }
    ],
    availableTools: toolService.getAllTools(),
    visibleTools: toolService.getToolsByHubGroup('all'),
    actionIconPaths: service.actionIconPaths
  },

  onShow() {
    const doctorRecords = toolService.getDoctorVisitRecords().map(enrichDoctorRecord)
    const feedingRecords = toolService.getFeedingRecords().map(enrichFeedingRecord)
    const vaccineRecords = toolService.getVaccineRecords().map(enrichVaccineRecord)
    const growthRecords = toolService.getGrowthRecords().map(enrichGrowthRecord)
    const daySummaries = buildFeedingDaySummaries(feedingRecords)
    const showFeedingTools = this.data.activeType === 'all' || this.data.activeType === 'feeding'
    const showVaccineTools = this.data.activeType === 'all' || this.data.activeType === 'vaccine'
    const showGrowthTools = this.data.activeType === 'all' || this.data.activeType === 'growth'
    const showRecordTools = (showFeedingTools && (daySummaries.length || feedingRecords.length > 1)) ||
      (showVaccineTools && vaccineRecords.length > 1) ||
      (showGrowthTools && growthRecords.length > 1)
    const records = this.buildRecords(
      doctorRecords,
      feedingRecords,
      vaccineRecords,
      growthRecords,
      this.data.isFeedingExpanded,
      this.data.isVaccineExpanded,
      this.data.isGrowthExpanded,
      this.data.activeType
    )

    this.setData({
      records: records.allRecords,
      visibleRecords: records.visibleRecords,
      feedingRecordCount: feedingRecords.length,
      vaccineRecordCount: vaccineRecords.length,
      growthRecordCount: growthRecords.length,
      feedingDaySummaries: daySummaries,
      visibleFeedingDaySummaries: this.data.isFeedingSummaryExpanded ? daySummaries : daySummaries.slice(0, 2),
      showFeedingTools,
      showVaccineTools,
      showGrowthTools,
      showRecordTools,
      visibleTools: this.getVisibleTools(this.data.activeToolGroup)
    })
  },

  getVisibleTools(group) {
    return toolService.getToolsByHubGroup(group)
  },

  buildRecords(doctorRecords, feedingRecords, vaccineRecords, growthRecords, feedingExpanded, vaccineExpanded, growthExpanded, activeType) {
    const shownFeedingRecords = feedingExpanded ? feedingRecords : feedingRecords.slice(0, 1)
    const shownVaccineRecords = vaccineExpanded ? vaccineRecords : vaccineRecords.slice(0, 1)
    const shownGrowthRecords = growthExpanded ? growthRecords : growthRecords.slice(0, 1)
    const allRecords = doctorRecords.concat(feedingRecords, vaccineRecords, growthRecords)
      .sort((left, right) => getSortTime(right).localeCompare(getSortTime(left)))

    let typedRecords = doctorRecords.concat(shownFeedingRecords, shownVaccineRecords, shownGrowthRecords)
    if (activeType === 'doctor') {
      typedRecords = doctorRecords
    } else if (activeType === 'feeding') {
      typedRecords = shownFeedingRecords
    } else if (activeType === 'vaccine') {
      typedRecords = shownVaccineRecords
    } else if (activeType === 'growth') {
      typedRecords = shownGrowthRecords
    }

    return {
      allRecords,
      visibleRecords: typedRecords.sort((left, right) => getSortTime(right).localeCompare(getSortTime(left)))
    }
  },

  goNewRecord() {
    const tools = this.data.availableTools || []
    if (!tools.length) return
    wx.showActionSheet({
      itemList: tools.map((tool) => tool.title),
      success: (res) => {
        const tool = tools[res.tapIndex] || tools[0]
        wx.navigateTo({ url: tool.path })
      }
    })
  },

  openTool(event) {
    const id = event.detail && event.detail.id
    const tool = (this.data.availableTools || []).find((item) => item.id === id)
    if (!tool) return
    wx.navigateTo({ url: tool.path })
  },

  toggleFeedingRecords() {
    this.setData({
      isFeedingExpanded: !this.data.isFeedingExpanded
    })
    this.onShow()
  },

  toggleVaccineRecords() {
    this.setData({
      isVaccineExpanded: !this.data.isVaccineExpanded
    })
    this.onShow()
  },

  toggleGrowthRecords() {
    this.setData({
      isGrowthExpanded: !this.data.isGrowthExpanded
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

  changeToolGroup(event) {
    const group = event.currentTarget.dataset.group || 'all'
    this.setData({
      activeToolGroup: group,
      visibleTools: this.getVisibleTools(group)
    })
  },

  editRecord(event) {
    const id = event.currentTarget.dataset.id
    const type = event.currentTarget.dataset.type
    if (!id) return

    const paths = {
      doctor: '/pages/tools/doctor-visit/index',
      feeding: '/pages/tools/feeding-log/index',
      vaccine: '/pages/tools/vaccine-log/index',
      growth: '/pages/tools/growth-log/index'
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
        } else if (type === 'growth') {
          toolService.deleteGrowthRecord(id)
        } else {
          toolService.deleteDoctorVisitRecord(id)
        }
        this.onShow()
        wx.showToast({ title: '已删除', icon: 'none' })
      }
    })
  }
})
