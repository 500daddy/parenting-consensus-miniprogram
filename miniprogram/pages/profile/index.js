const service = require('../../utils/mockService.js')

Page({
  data: {
    profile: service.getProfile(),
    draftBaby: service.getProfile().baby,
    isEditingBaby: false,
    genderOptions: ['未设置', '男宝', '女宝'],
    genderIndex: 0,
    favoriteCount: 0,
    historyCount: 0,
    actionIconPaths: service.actionIconPaths,
    profileIconPaths: service.profileIconPaths
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
    const profile = service.getProfile()
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      genderIndex: this.getGenderIndex(profile.baby.gender),
      isEditingBaby: false,
      favoriteCount: service.getFavorites().length,
      historyCount: service.getHistory().length
    })
  },

  getGenderIndex(gender) {
    const index = this.data.genderOptions.indexOf(gender)
    return index > -1 ? index : 0
  },

  login() {
    if (wx.getUserProfile) {
      wx.getUserProfile({
        desc: '用于展示家长昵称并保存宝宝档案',
        success: (res) => {
          const profile = service.loginProfile(res.userInfo || {})
          this.setData({
            profile,
            draftBaby: Object.assign({}, profile.baby),
            genderIndex: this.getGenderIndex(profile.baby.gender)
          })
          wx.showToast({ title: '已登录', icon: 'none' })
        },
        fail: () => {
          wx.showToast({ title: '已取消登录', icon: 'none' })
        }
      })
      return
    }
    this.loginAsGuest()
  },

  loginAsGuest() {
    const profile = service.loginProfile({ nickName: '新手村家长' })
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      genderIndex: this.getGenderIndex(profile.baby.gender)
    })
    wx.showToast({ title: '已进入新手村', icon: 'none' })
  },

  startEditBaby() {
    if (!this.data.profile.isLoggedIn) {
      wx.showToast({ title: '先登录再记录宝宝档案', icon: 'none' })
      return
    }
    this.setData({ isEditingBaby: true })
  },

  cancelEditBaby() {
    this.setData({
      isEditingBaby: false,
      draftBaby: Object.assign({}, this.data.profile.baby),
      genderIndex: this.getGenderIndex(this.data.profile.baby.gender)
    })
  },

  onBabyInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draftBaby.${field}`]: event.detail.value
    })
  },

  onGenderChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      genderIndex: index,
      'draftBaby.gender': this.data.genderOptions[index] || '未设置'
    })
  },

  saveBaby() {
    const draft = this.data.draftBaby || {}
    const profile = service.saveBabyProfile({
      name: (draft.name || '').trim() || '未设置',
      age: (draft.age || '').trim() || '未设置',
      gender: draft.gender || '未设置',
      allergy: (draft.allergy || '').trim() || '暂无记录'
    })
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      genderIndex: this.getGenderIndex(profile.baby.gender),
      isEditingBaby: false
    })
    wx.showToast({ title: '宝宝档案已保存', icon: 'none' })
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后，本地宝宝档案会回到默认展示。收藏和搜索历史仍会保留。',
      confirmText: '退出',
      confirmColor: '#d96f45',
      success: (res) => {
        if (!res.confirm) return
        const profile = service.logoutProfile()
        this.setData({
          profile,
          draftBaby: Object.assign({}, profile.baby),
          genderIndex: this.getGenderIndex(profile.baby.gender),
          isEditingBaby: false
        })
        wx.showToast({ title: '已退出', icon: 'none' })
      }
    })
  },

  goFavorites() {
    wx.switchTab({ url: '/pages/favorites/index' })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/index' })
  },

  showFeedback() {
    wx.showModal({
      title: '内测反馈',
      content: '当前版本面向小范围种子用户。遇到内容不准确、搜索不到问题或页面异常时，请在内测群反馈问题截图、宝宝月龄和搜索词，方便我们优先修正。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私说明',
      content: '当前版本不接后端，不上传宝宝档案。微信头像和昵称仅用于本机展示；宝宝月龄、性别、过敏史、收藏和搜索历史仅保存在本机微信小程序缓存中，删除小程序或清理缓存后会丢失。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showReviewNote() {
    wx.showModal({
      title: '审核备注建议',
      content: '当前版本为本地数据 MVP，无后台请求、无支付、无客服系统。数据为固定育儿科普样例，仅供信息参考，不能替代医生诊断或处方。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showDisclaimer() {
    wx.showModal({
      title: '免责声明',
      content: '本小程序内容仅用于育儿信息参考，不能替代医生诊断、个体化处方或急救处理。涉及疾病、用药、疫苗反应或紧急情况时，请及时咨询医生、接种门诊或线下就医。',
      showCancel: false
    })
  }
})
