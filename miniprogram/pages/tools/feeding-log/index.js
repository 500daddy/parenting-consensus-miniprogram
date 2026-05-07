const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

const feedTypeOptions = ['配方奶', '母乳瓶喂', '母乳亲喂', '混合喂养']
const spitUpOptions = ['没有吐奶', '少量溢奶', '明显吐奶', '喷射样呕吐']

function defaultFedAt() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day} ${hour}:${minute}`
}

function getFedAtParts(value) {
  const fallback = defaultFedAt()
  const text = value && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(value) ? value : fallback
  const parts = text.split(' ')
  return {
    date: parts[0] || fallback.split(' ')[0],
    time: parts[1] || fallback.split(' ')[1]
  }
}

function formatFedAtDisplay(value) {
  const parts = getFedAtParts(value)
  const dateItems = parts.date.split('-')
  return `${Number(dateItems[1])}月${Number(dateItems[2])}日 ${parts.time}`
}

function getTodayDate() {
  return defaultFedAt().split(' ')[0]
}

function getCurrentTime() {
  return defaultFedAt().split(' ')[1]
}

function getMinDate() {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function buildDraft(options) {
  const profile = service.getProfile()
  const baby = profile.baby || {}
  const question = options && options.questionId ? service.getQuestionById(options.questionId) : null
  return {
    id: options.id || options.recordId || '',
    questionId: options.questionId || '',
    questionTitle: question ? question.title : (options.questionTitle || ''),
    categoryId: options.categoryId || (question ? question.categoryId : 'feeding'),
    babyName: baby.name && baby.name !== '未设置' ? baby.name : '',
    babyAge: baby.age && baby.age !== '未设置' ? baby.age : '',
    fedAt: defaultFedAt(),
    feedType: feedTypeOptions[0],
    amount: '',
    duration: '',
    spitUp: spitUpOptions[0],
    diaper: '',
    notes: ''
  }
}

Page({
  data: {
    draft: {},
    feedTypeOptions,
    feedTypeIndex: 0,
    spitUpOptions,
    spitUpIndex: 0,
    todaySummary: { count: 0, totalAmount: 0 },
    fedAtDate: getTodayDate(),
    fedAtTime: getCurrentTime(),
    minDate: getMinDate(),
    maxDate: getTodayDate(),
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
    const savedRecord = options && options.recordId ? toolService.getFeedingRecord(options.recordId) : null
    const draft = savedRecord ? Object.assign(buildDraft(savedRecord), savedRecord) : buildDraft(options || {})
    const feedTypeIndex = this.data.feedTypeOptions.indexOf(draft.feedType)
    const spitUpIndex = this.data.spitUpOptions.indexOf(draft.spitUp)
    const fedAtParts = getFedAtParts(draft.fedAt)
    this.setData({
      draft: Object.assign({}, draft, {
        fedAt: `${fedAtParts.date} ${fedAtParts.time}`,
        fedAtDisplay: formatFedAtDisplay(`${fedAtParts.date} ${fedAtParts.time}`)
      }),
      feedTypeIndex: feedTypeIndex > -1 ? feedTypeIndex : 0,
      spitUpIndex: spitUpIndex > -1 ? spitUpIndex : 0,
      fedAtDate: fedAtParts.date,
      fedAtTime: fedAtParts.time,
      todaySummary: toolService.getTodayFeedingSummary()
    })
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draft.${field}`]: event.detail.value
    })
  },

  onFeedTypeChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      feedTypeIndex: index,
      'draft.feedType': this.data.feedTypeOptions[index] || this.data.feedTypeOptions[0]
    })
  },

  syncFedAt(date, time) {
    const nextDate = date || this.data.fedAtDate
    const nextTime = time || this.data.fedAtTime
    const fedAt = `${nextDate} ${nextTime}`
    this.setData({
      fedAtDate: nextDate,
      fedAtTime: nextTime,
      'draft.fedAt': fedAt,
      'draft.fedAtDisplay': formatFedAtDisplay(fedAt)
    })
  },

  onFedDateChange(event) {
    this.syncFedAt(event.detail.value, this.data.fedAtTime)
  },

  onFedTimeChange(event) {
    this.syncFedAt(this.data.fedAtDate, event.detail.value)
  },

  onSpitUpChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      spitUpIndex: index,
      'draft.spitUp': this.data.spitUpOptions[index] || this.data.spitUpOptions[0]
    })
  },

  resetDraft() {
    const base = buildDraft(this.data.draft || {})
    const fedAtParts = getFedAtParts(base.fedAt)
    this.setData({
      draft: Object.assign({}, base, {
        fedAt: `${fedAtParts.date} ${fedAtParts.time}`,
        fedAtDisplay: formatFedAtDisplay(`${fedAtParts.date} ${fedAtParts.time}`)
      }),
      feedTypeIndex: 0,
      spitUpIndex: 0,
      fedAtDate: fedAtParts.date,
      fedAtTime: fedAtParts.time
    })
  },

  saveRecord() {
    const draft = this.data.draft || {}
    const hasInfo = [
      draft.amount,
      draft.duration,
      draft.diaper,
      draft.notes
    ].some((item) => String(item || '').trim())

    if (!hasInfo) {
      wx.showToast({ title: '先记录奶量或喂养情况', icon: 'none' })
      return
    }

    const savedRecord = toolService.saveFeedingRecord(draft)
    this.setData({
      'draft.id': savedRecord.id,
      todaySummary: toolService.getTodayFeedingSummary()
    })
    wx.showToast({ title: '奶量已保存', icon: 'none' })
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/tools/records/index' })
  }
})
