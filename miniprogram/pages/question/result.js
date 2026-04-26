const service = require('../../utils/mockService.js')

Page({
  data: {
    keyword: '',
    result: null,
    isFavorite: false,
    noResult: false
  },

  onLoad(options) {
    const id = options.id
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : ''
    if (keyword) {
      service.addHistory(keyword)
    }
    const result = service.getQuestionResult({ id, keyword })
    if (!result) {
      this.setData({ keyword, noResult: true })
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

  goAuthority() {
    if (!this.data.result) return
    wx.navigateTo({ url: `/pages/authority/index?questionId=${this.data.result.questionId}` })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    wx.redirectTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/index' })
  }
})
