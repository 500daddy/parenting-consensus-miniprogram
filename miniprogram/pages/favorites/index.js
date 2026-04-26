const service = require('../../utils/mockService.js')

Page({
  data: {
    favorites: []
  },

  onShow() {
    this.setData({
      favorites: service.getFavorites().map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      }))
    })
  },

  goQuestion(event) {
    wx.navigateTo({ url: `/pages/question/result?id=${event.currentTarget.dataset.id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
