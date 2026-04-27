const service = require('../../utils/mockService.js')

const filters = [
  { type: 'all', name: '全部' },
  { type: 'doctor', name: '儿科医生' },
  { type: 'guide', name: '医学指南' },
  { type: 'wiki', name: '育儿百科' },
  { type: 'creator', name: '认证达人' }
]

function normalizeType(type) {
  return filters.some((item) => item.type === type) ? type : 'all'
}

Page({
  data: {
    filters,
    activeType: 'all',
    questionId: '',
    sources: [],
    warnings: ['精神差/持续高热', '呼吸急促', '抽搐', '伴随严重脱水'],
    relatedQuestions: []
  },

  onLoad(options) {
    const activeType = normalizeType(options.type || 'all')
    const questionId = options.questionId || ''
    const result = questionId ? service.getQuestionResult({ id: questionId }) : null
    this.setData({
      activeType,
      questionId,
      relatedQuestions: result ? result.relatedQuestionItems : service.questions.slice(0, 2)
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

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  }
})
