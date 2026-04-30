const service = require('../../utils/mockService.js')

Page({
  data: {
    categories: [],
    hotQuestions: [],
    todayResult: null,
    safetyWarnings: [],
    heroPaddingTop: 112,
    actionIconPaths: service.actionIconPaths
  },

  onLoad() {
    const todayResult = service.getTodayQuestionResult() || service.getQuestionResult({ id: 'q_001' })
    const heroPaddingTop = this.getHeroPaddingTop()
    this.setData({
      heroPaddingTop,
      categories: service.categories,
      hotQuestions: service.getPriorityQuestions('P0').slice(0, 3).map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      todayResult,
      safetyWarnings: todayResult ? todayResult.warnings.slice(0, 4) : []
    })
  },

  getHeroPaddingTop() {
    try {
      const menu = wx.getMenuButtonBoundingClientRect && wx.getMenuButtonBoundingClientRect()
      const system = wx.getSystemInfoSync && wx.getSystemInfoSync()
      if (!menu || !system || !system.windowWidth) return 112
      const safeBottomPx = menu.bottom + 10
      return Math.max(112, Math.round((safeBottomPx * 750) / system.windowWidth))
    } catch (error) {
      return 112
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  goCategory(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    service.setPendingCategory(id)
    wx.navigateTo({ url: '/pages/category/index' })
  },

  goAuthority(event) {
    const type = event.currentTarget.dataset.type || 'all'
    wx.navigateTo({ url: `/pages/authority/index?type=${type}` })
  },

  goToday() {
    const questionId = this.data.todayResult && this.data.todayResult.questionId
    if (!questionId) return
    wx.navigateTo({ url: `/pages/question/result?id=${questionId}` })
  }
})
