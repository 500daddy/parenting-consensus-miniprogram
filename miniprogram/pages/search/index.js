const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    suggestions: [],
    history: [],
    sectionTitle: '推荐问题',
    sectionHint: '按热度排序'
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.setData({ history: service.getHistory() })
    this.updateSuggestions(this.data.keyword)
  },

  onInput(event) {
    const keyword = event.detail.value
    this.setData({ keyword })
    this.updateSuggestions(keyword)
  },

  search() {
    const keyword = (this.data.keyword || '').trim()
    if (!keyword) {
      wx.showToast({ title: '先输入问题', icon: 'none' })
      return
    }
    service.addHistory(keyword)
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
  },

  searchHistory(event) {
    const keyword = event.currentTarget.dataset.keyword
    service.addHistory(keyword)
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    const question = service.getQuestionById(id)
    if (!question) return
    service.addHistory(question.shortTitle)
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  clearKeyword() {
    this.setData({ keyword: '' })
    this.updateSuggestions('')
  },

  clearHistory() {
    if (!this.data.history.length) return
    wx.showModal({
      title: '清空搜索历史',
      content: '清空后，本地保存的搜索记录会被删除。',
      confirmText: '清空',
      confirmColor: '#d96f45',
      success: (res) => {
        if (!res.confirm) return
        service.clearHistory()
        this.setData({ history: [] })
        wx.showToast({ title: '已清空', icon: 'none' })
      }
    })
  },

  updateSuggestions(keyword) {
    const text = (keyword || '').trim()
    const questions = text ? service.searchQuestions(text) : service.getAvailableQuestions()
    this.setData({
      suggestions: questions.map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      sectionTitle: text ? '相关问题' : '推荐问题',
      sectionHint: text ? `${questions.length} 个匹配` : '按热度排序'
    })
  }
})
