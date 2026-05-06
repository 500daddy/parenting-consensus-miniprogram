const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    categories: [],
    activeCategory: 'all',
    suggestions: [],
    history: [],
    sectionTitle: '推荐问题',
    sectionHint: '按热度排序'
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.setData({
      history: service.getHistory(),
      categories: [{ id: 'all', name: '全部', iconPath: service.actionIconPaths.question }].concat(service.categories)
    })
    this.updateSuggestions(this.data.keyword)
  },

  onInput(event) {
    const keyword = event.detail.value
    this.setData({ keyword })
    this.updateSuggestions(keyword)
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
    if (!keyword) return
    service.addHistory(keyword)
    wx.navigateTo({ url: `/pages/question/result?keyword=${encodeURIComponent(keyword)}` })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    const question = service.getQuestionById(id)
    if (!question) return
    wx.navigateTo({ url: `/pages/question/result?id=${id}` })
  },

  clearKeyword() {
    this.setData({ keyword: '' })
    this.updateSuggestions('')
  },

  changeCategory(event) {
    const id = event.currentTarget.dataset.id || 'all'
    this.setData({ activeCategory: id })
    this.updateSuggestions(this.data.keyword)
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

  updateSuggestions(keyword) {
    const text = (keyword || '').trim()
    const source = text ? service.searchQuestions(text) : service.getAvailableQuestions()
    const questions = this.data.activeCategory === 'all'
      ? source
      : source.filter((item) => item.categoryId === this.data.activeCategory)
    this.setData({
      suggestions: questions.map((item) => Object.assign({}, item, {
        heatText: service.formatHeat(item.heat)
      })),
      sectionTitle: text ? '相关问题' : '推荐问题',
      sectionHint: this.data.activeCategory === 'all'
        ? (text ? `${questions.length} 个匹配` : '按热度排序')
        : `${questions.length} 个问题`
    })
  }
})
