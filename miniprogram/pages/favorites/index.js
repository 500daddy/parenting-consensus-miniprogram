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
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
