const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    result: null,
    isFavorite: false,
    noResult: false,
    fallbackQuestions: [],
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
    const id = options.id
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : ''
    if (keyword) {
      service.addHistory(keyword)
    }
    const result = service.getQuestionResult({ id, keyword })
    if (!result) {
      this.setData({
        keyword,
        noResult: true,
        fallbackQuestions: service.getAvailableQuestions().slice(0, 3)
      })
      return
    }
    this.setData({
      keyword: keyword || result.title,
      result,
      isFavorite: service.isFavorite(result.questionId),
      noResult: false
    })
  },

  onShow() {
    if (this.data.result) {
      this.setData({ isFavorite: service.isFavorite(this.data.result.questionId) })
    }
  },

  toggleFavorite() {
    if (!this.data.result) return
    const isFavorite = service.toggleFavorite(this.data.result.questionId)
    this.setData({ isFavorite })
    wx.showToast({ title: isFavorite ? '已收藏' : '已取消', icon: 'none' })
  },

  goAuthority(event) {
    if (!this.data.result) return
    const type = event && event.currentTarget ? event.currentTarget.dataset.type : ''
    const typeQuery = type ? `&type=${type}` : ''
    wx.navigateTo({ url: `/pages/authority/index?questionId=${this.data.result.questionId}${typeQuery}` })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.redirectTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  }
})
