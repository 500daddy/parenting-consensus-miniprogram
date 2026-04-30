const service = require('../../utils/mockService.js')

Page({
  data: {
    profile: service.profile,
    favoriteCount: 0,
    historyCount: 0,
    actionIconPaths: service.actionIconPaths,
    profileIconPaths: service.profileIconPaths
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    this.setData({
      favoriteCount: service.getFavorites().length,
      historyCount: service.getHistory().length
    })
  },

  goFavorites() {
    wx.navigateTo({ url: '/pages/favorites/index' })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/index' })
  },

  showFeedback() {
    wx.showToast({ title: '反馈功能暂未开放', icon: 'none' })
  },

  showDisclaimer() {
    wx.showModal({
      title: '免责声明',
      content: '本小程序内容仅用于育儿信息参考，不能替代医生诊断。涉及疾病、用药或紧急情况时，请及时咨询医生或就医。',
      showCancel: false
    })
  }
})
