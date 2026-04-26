const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    suggestions: [],
    history: [],
    emptyText: ''
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.setData({
      suggestions: service.questions.slice(0, 6).map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      history: service.getHistory()
    })
  },

  onInput(event) {
    this.setData({ keyword: event.detail.value })
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
    service.addHistory(question.shortTitle)
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  clearKeyword() {
    this.setData({ keyword: '' })
  },

  clearHistory() {
    service.clearHistory()
    this.setData({ history: [] })
  }
})
