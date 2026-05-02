const service = require('../../utils/mockService.js')

Page({
  data: {
    favorites: [],
    touchStartX: 0,
    touchStartY: 0,
    swipedId: '',
    actionIconPaths: service.actionIconPaths
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    this.setData({
      favorites: service.getFavorites().map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      swipedId: ''
    })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    if (this.data.swipedId && this.data.swipedId !== id) {
      this.setData({ swipedId: '' })
      return
    }
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  onTouchStart(event) {
    const touch = event.touches && event.touches[0]
    if (!touch) return
    this.setData({
      touchStartX: touch.clientX,
      touchStartY: touch.clientY
    })
  },

  onTouchEnd(event) {
    const touch = event.changedTouches && event.changedTouches[0]
    const id = event.currentTarget.dataset.id
    if (!touch || !id) return
    const deltaX = touch.clientX - this.data.touchStartX
    const deltaY = touch.clientY - this.data.touchStartY
    if (Math.abs(deltaY) > 36 || Math.abs(deltaX) < 34) return
    this.setData({ swipedId: deltaX < 0 ? id : '' })
  },

  removeFavorite(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    if (service.isFavorite(id)) {
      service.toggleFavorite(id)
    }
    this.setData({
      favorites: this.data.favorites.filter((item) => item.id !== id),
      swipedId: ''
    })
    wx.showToast({ title: '已取消收藏', icon: 'none' })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
