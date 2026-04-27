const service = require('../../utils/mockService.js')

Page({
  data: {
    categories: [],
    activeCategory: 'all',
    questions: [],
    authoritySources: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    const pending = wx.getStorageSync('pending_category_id')
    if (pending) {
      wx.removeStorageSync('pending_category_id')
      this.setData({ activeCategory: pending })
    }
    this.setData({
      categories: [{ id: 'all', name: '全部', icon: '全' }].concat(service.categories),
      authoritySources: service.getAuthoritySources('all').slice(0, 3)
    })
    this.loadQuestions()
  },

  changeCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.id })
    this.loadQuestions()
  },

  loadQuestions() {
    this.setData({
      questions: service.getQuestionsByCategory(this.data.activeCategory).map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      }))
    })
  },

  goQuestion(event) {
    wx.navigateTo({ url: `/pages/question/result?id=${event.currentTarget.dataset.id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  },

  goAuthority() {
    wx.navigateTo({ url: '/pages/authority/index' })
  }
})
