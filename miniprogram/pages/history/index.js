const service = require('../../utils/mockService.js')

Page({
  data: {
    history: []
  },

  onShow() {
    this.setData({ history: service.getHistory() })
  },

  goSearch(event) {
    const keyword = event.currentTarget.dataset.keyword
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
  },

  clearHistory() {
    service.clearHistory()
    this.setData({ history: [] })
  },

  goSearchTab() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
