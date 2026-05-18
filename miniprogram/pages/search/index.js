const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    categories: [],
    activeCategory: 'all',
    suggestions: [],
    history: [],
    showBackToTop: false,
    submitTip: null,
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
    this.setData({ keyword, submitTip: null })
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

  onPageScroll(event) {
    const shouldShow = event.scrollTop > 640
    if (shouldShow === this.data.showBackToTop) return
    this.setData({ showBackToTop: shouldShow })
  },

  scrollToTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({ scrollTop: 0, duration: 220 })
    }
    this.setData({ showBackToTop: false })
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

  submitMissingQuestion() {
    const keyword = (this.data.keyword || '').trim()
    const validation = service.validatePendingQuestion(keyword)
    if (!validation.valid) {
      this.setData({ submitTip: this.buildSubmitTip(validation) })
      return
    }
    service.addPendingQuestion(validation.text, 'search_empty')
    this.setData({ submitTip: null })
    wx.showToast({ title: '已加入待补充问题池', icon: 'none' })
  },

  buildSubmitTip(validation) {
    const text = validation.text || (this.data.keyword || '').trim()
    if (validation.reason === 'missing_parenting_term') {
      return {
        title: '再补一个宝宝场景就可以提交',
        text: '我们还没识别到这是育儿问题。可以加上“宝宝/孩子/小朋友”，例如：小朋友多大可以穿拖鞋？',
        actionText: text && text.indexOf('宝宝') !== 0 && text.indexOf('孩子') !== 0 && text.indexOf('小朋友') !== 0 ? '帮我补成宝宝问题' : ''
      }
    }
    if (validation.reason === 'missing_question_intent') {
      return {
        title: '写成一句完整提问更容易补充',
        text: '可以加上“怎么办/能不能/多大/什么时候”等问法，例如：宝宝夜里频繁醒怎么办？',
        actionText: text && !/[?？]$/.test(text) ? '加上问号' : ''
      }
    }
    return {
      title: validation.message || '这个问题还需要再补充一下',
      text: '请尽量写清楚宝宝场景和想问的点，例如：宝宝夜里频繁醒怎么办？',
      actionText: ''
    }
  },

  applySubmitTipAction() {
    const tip = this.data.submitTip
    const text = (this.data.keyword || '').trim()
    if (!tip || !text) return
    let nextText = text
    if (tip.actionText === '帮我补成宝宝问题') {
      nextText = `宝宝${text}`
    } else if (tip.actionText === '加上问号') {
      nextText = `${text}？`
    }
    this.setData({ keyword: nextText, submitTip: null })
    this.updateSuggestions(nextText)
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
