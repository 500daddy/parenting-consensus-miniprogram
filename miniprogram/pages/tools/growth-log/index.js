const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

const PROFILE_EDIT_INTENT_KEY = 'parenting_profile_edit_intent'
const sourceTypeOptions = ['家里测量', '体检测量', '医院测量']
const metricFields = {
  weight: { label: '体重', min: 1, max: 80 },
  height: { label: '身高', min: 30, max: 150 },
  headCircumference: { label: '头围', min: 20, max: 70 }
}

function getTodayDate() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function getMinDate() {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 6)
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
    categoryId: options.categoryId || (question ? question.categoryId : 'vaccine_check'),
    babyName: baby.name && baby.name !== '未设置' ? baby.name : '',
    babyAge: baby.age && baby.age !== '未设置' ? baby.age : '',
    babyGender: baby.gender && baby.gender !== '未设置' ? baby.gender : '',
    measuredAt: getTodayDate(),
    weight: '',
    height: '',
    headCircumference: '',
    sourceType: sourceTypeOptions[0],
    notes: ''
  }
}

function cleanNumberInput(value) {
  const cleaned = String(value || '').replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  if (parts.length <= 1) return parts[0]
  return `${parts[0]}.${parts.slice(1).join('')}`
}

function getMetricError(draft) {
  for (const field of Object.keys(metricFields)) {
    const value = String(draft[field] || '').trim()
    if (!value) continue
    const number = Number(value)
    const rule = metricFields[field]
    if (!Number.isFinite(number) || number <= 0) {
      return `请输入正确的${rule.label}`
    }
    if (number < rule.min || number > rule.max) {
      return `请确认${rule.label}数值是否正确`
    }
  }
  return ''
}

function getGrowthPageState() {
  const profile = service.getProfile()
  const baby = profile.baby || {}
  const trendSummary = toolService.getGrowthTrendSummary()
  const isBabyProfileReady = Boolean(
    profile.isLoggedIn &&
    baby.age &&
    baby.age !== '未设置' &&
    baby.gender &&
    baby.gender !== '未设置'
  )
  return {
    trendSummary,
    growthReference: toolService.getGrowthStandardReference(baby, trendSummary.latest),
    isBabyProfileReady,
    babyProfileHintText: profile.isLoggedIn
      ? '完善宝宝月龄和性别后，可看到本月龄的身高体重参考。'
      : '登录并完善宝宝信息后，可自动带入宝宝、月龄和标准参考。'
  }
}

Page({
  data: {
    draft: {},
    sourceTypeOptions,
    sourceTypeIndex: 0,
    measuredAtDate: getTodayDate(),
    minDate: getMinDate(),
    maxDate: getTodayDate(),
    trendSummary: { count: 0, latest: null, previous: null },
    growthReference: toolService.getGrowthStandardReference({}, null),
    isBabyProfileReady: false,
    babyProfileHintText: '',
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
    const savedRecord = options && options.recordId ? toolService.getGrowthRecord(options.recordId) : null
    const draft = savedRecord ? Object.assign(buildDraft(savedRecord), savedRecord) : buildDraft(options || {})
    const sourceTypeIndex = this.data.sourceTypeOptions.indexOf(draft.sourceType)
    const pageState = getGrowthPageState()
    this.setData({
      draft,
      sourceTypeIndex: sourceTypeIndex > -1 ? sourceTypeIndex : 0,
      measuredAtDate: draft.measuredAt || getTodayDate(),
      trendSummary: pageState.trendSummary,
      growthReference: pageState.growthReference,
      isBabyProfileReady: pageState.isBabyProfileReady,
      babyProfileHintText: pageState.babyProfileHintText
    })
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    const value = metricFields[field] ? cleanNumberInput(event.detail.value) : event.detail.value
    this.setData({
      [`draft.${field}`]: value
    })
  },

  onMeasuredDateChange(event) {
    this.setData({
      measuredAtDate: event.detail.value,
      'draft.measuredAt': event.detail.value
    })
  },

  onSourceTypeChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      sourceTypeIndex: index,
      'draft.sourceType': this.data.sourceTypeOptions[index] || this.data.sourceTypeOptions[0]
    })
  },

  resetDraft() {
    const base = buildDraft(this.data.draft || {})
    this.setData({
      draft: base,
      sourceTypeIndex: 0,
      measuredAtDate: base.measuredAt
    })
  },

  saveRecord() {
    const draft = this.data.draft || {}
    const hasMetric = [
      draft.weight,
      draft.height,
      draft.headCircumference
    ].some((item) => String(item || '').trim())

    if (!hasMetric) {
      wx.showToast({ title: '先记录体重、身高或头围', icon: 'none' })
      return
    }

    const metricError = getMetricError(draft)
    if (metricError) {
      wx.showToast({ title: metricError, icon: 'none' })
      return
    }

    const savedRecord = toolService.saveGrowthRecord(draft)
    const pageState = getGrowthPageState()
    this.setData({
      'draft.id': savedRecord.id,
      trendSummary: pageState.trendSummary,
      growthReference: pageState.growthReference,
      isBabyProfileReady: pageState.isBabyProfileReady,
      babyProfileHintText: pageState.babyProfileHintText
    })
    wx.showToast({ title: '生长记录已保存', icon: 'none' })
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  goEditBabyProfile() {
    try {
      wx.setStorageSync(PROFILE_EDIT_INTENT_KEY, 'growth_log')
    } catch (error) {
      // Ignore storage failures; profile page is still reachable.
    }
    wx.switchTab({ url: '/pages/profile/index' })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/tools/records/index' })
  }
})
