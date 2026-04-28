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
    if (!keyword) return
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
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

  goSearchTab() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
