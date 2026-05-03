const service = require('../../utils/mockService.js')

function prepareTodayResult(result) {
  if (!result) return result
  return Object.assign({}, result, {
    conclusionSegments: service.buildGlossarySegments(result.conclusion)
  })
}

Page({
  data: {
    categories: [],
    hotQuestions: [],
    todayResult: null,
    safetyWarnings: [],
    primaryWarning: '',
    glossaryPopup: null,
    homeKeyword: '',
    heroPaddingTop: 112,
    heroSignTop: 132,
    actionIconPaths: service.actionIconPaths
  },

  onLoad() {
    const todayResult = prepareTodayResult(service.getTodayQuestionResult() || service.getQuestionResult({ id: 'q_001' }))
    const heroLayout = this.getHeroLayout()
    this.setData({
      heroPaddingTop: heroLayout.paddingTop,
      heroSignTop: heroLayout.signTop,
      categories: service.categories.slice(0, 4),
      hotQuestions: this.getDiverseHotQuestions().map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      todayResult,
      safetyWarnings: todayResult ? todayResult.warnings.slice(0, 1) : [],
      primaryWarning: todayResult && todayResult.warnings.length ? todayResult.warnings[0] : ''
    })
  },

  getDiverseHotQuestions() {
    const picked = []
    const usedCategories = {}
    const questions = service.getPriorityQuestions('P0')
    questions.forEach((item) => {
      if (picked.length >= 4 || usedCategories[item.categoryId]) return
      picked.push(item)
      usedCategories[item.categoryId] = true
    })
    if (picked.length < 4) {
      questions.forEach((item) => {
        if (picked.length >= 4 || picked.some((pickedItem) => pickedItem.id === item.id)) return
        picked.push(item)
      })
    }
    return picked
  },

  getHeroLayout() {
    try {
      const menu = wx.getMenuButtonBoundingClientRect && wx.getMenuButtonBoundingClientRect()
      const system = wx.getSystemInfoSync && wx.getSystemInfoSync()
      if (!menu || !system || !system.windowWidth) {
        return { paddingTop: 112, signTop: 132 }
      }
      const safeBottomPx = menu.bottom + 10
      const paddingTop = Math.max(112, Math.round((safeBottomPx * 750) / system.windowWidth))
      const signTop = Math.max(118, Math.round(((menu.bottom + 8) * 750) / system.windowWidth))
      return { paddingTop, signTop }
    } catch (error) {
      return { paddingTop: 112, signTop: 132 }
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

  onHomeInput(event) {
    this.setData({ homeKeyword: event.detail.value })
  },

  searchHome() {
    const keyword = (this.data.homeKeyword || '').trim()
    if (!keyword) {
      wx.showToast({ title: '先输入问题', icon: 'none' })
      return
    }
    service.addHistory(keyword)
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
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
  },

  showGlossary(event) {
    const term = event.currentTarget.dataset.term
    const entry = service.getGlossaryEntry(term)
    if (!entry) return
    this.setData({ glossaryPopup: entry })
  },

  hideGlossary() {
    this.setData({ glossaryPopup: null })
  },

  noop() {}
})
