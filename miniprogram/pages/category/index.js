const service = require('../../utils/mockService.js')

function normalizeCategoryId(id) {
  return !id || id === 'all' || service.getCategory(id) ? (id || 'all') : 'all'
}

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
    const pending = service.consumePendingCategory()
    if (pending) {
      this.setData({ activeCategory: normalizeCategoryId(pending) })
    }
    this.setData({
      categories: [{ id: 'all', name: '全部', icon: '全', iconPath: service.actionIconPaths.question }].concat(service.categories),
      authoritySources: service.getAuthoritySources('all').slice(0, 3)
    })
    this.loadQuestions()
  },

  changeCategory(event) {
    this.setData({ activeCategory: normalizeCategoryId(event.currentTarget.dataset.id) })
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
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  },

  goAuthority(event) {
    const type = event && event.currentTarget ? event.currentTarget.dataset.type : ''
    const query = type ? `?type=${type}` : ''
    wx.navigateTo({ url: `/pages/authority/index${query}` })
  }
})
