const service = require('../../utils/mockService.js')

const filters = [
  { type: 'all', name: '全部' },
  { type: 'doctor', name: '儿科医生' },
  { type: 'guide', name: '医学指南' },
  { type: 'wiki', name: '育儿百科' },
  { type: 'creator', name: '认证达人' }
]

const defaultWarnings = ['精神差/持续高热', '呼吸急促', '抽搐', '伴随严重脱水']

function normalizeType(type) {
  return filters.some((item) => item.type === type) ? type : 'all'
}

function getFallbackQuestions(questionId) {
  return service.getAvailableQuestions().filter((item) => item.id !== questionId).slice(0, 2)
}

Page({
  data: {
    filters,
    activeType: 'all',
    questionId: '',
    sources: [],
    warnings: defaultWarnings,
    relatedQuestions: []
  },

  onLoad(options) {
    const activeType = normalizeType(options.type || 'all')
    const requestedQuestionId = options.questionId || ''
    const result = requestedQuestionId ? service.getQuestionResult({ id: requestedQuestionId }) : null
    const questionId = result ? requestedQuestionId : ''
    this.setData({
      activeType,
      questionId,
      warnings: result ? result.warnings : defaultWarnings,
      relatedQuestions: result && result.relatedQuestionItems.length ? result.relatedQuestionItems : getFallbackQuestions(questionId)
    })
    this.loadSources()
  },

  loadSources() {
    this.setData({
      sources: service.getAuthoritySources(this.data.activeType, this.data.questionId)
    })
  },

  changeFilter(event) {
    this.setData({ activeType: normalizeType(event.currentTarget.dataset.type) })
    this.loadSources()
  },

  showAllSources() {
    this.setData({ activeType: 'all' })
    this.loadSources()
  },

  showSourceDetail(event) {
    const id = event.currentTarget.dataset.id
    const source = this.data.sources.find((item) => item.id === id)
    if (!source) return
    wx.showModal({
      title: source.name,
      content: `${source.summary}\n\n依据标签：${source.tags.join('、')}`,
      showCancel: false,
      confirmText: '知道了'
    })
  },

  showTrustTip() {
    wx.showModal({
      title: '可信来源优先',
      content: '优先展示医生、指南、百科等信息更完整的来源，再结合观点分歧和安全提醒进行判断。',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
