const service = require('../../utils/mockService.js')
const toolService = require('../../utils/toolService.js')

const PROFILE_EDIT_INTENT_KEY = 'parenting_profile_edit_intent'

function buildAgeOptions() {
  const monthOptions = Array.from({ length: 25 }, (_, index) => `${index}个月`)
  const yearOptions = Array.from({ length: 17 }, (_, index) => `${index + 2}岁`)
  return ['未设置'].concat(monthOptions, yearOptions)
}

function getBabyIcon(gender) {
  if (gender === '男宝') return { babyIconTone: 'boy' }
  if (gender === '女宝') return { babyIconTone: 'girl' }
  return { babyIconTone: 'neutral' }
}

function hasBabyEditIntent() {
  try {
    return Boolean(wx.getStorageSync(PROFILE_EDIT_INTENT_KEY))
  } catch (error) {
    return false
  }
}

function clearBabyEditIntent() {
  try {
    wx.removeStorageSync(PROFILE_EDIT_INTENT_KEY)
  } catch (error) {
    // Storage may be unavailable in preview runtimes.
  }
}

const initialProfile = service.getProfile()
const ageOptions = buildAgeOptions()
const initialAgeIndex = ageOptions.indexOf(initialProfile.baby.age)

Page({
  data: {
    profile: initialProfile,
    draftBaby: initialProfile.baby,
    isEditingBaby: false,
    ageOptions,
    ageIndex: initialAgeIndex > -1 ? initialAgeIndex : 0,
    genderOptions: ['未设置', '男宝', '女宝'],
    genderIndex: 0,
    babyIconTone: getBabyIcon(initialProfile.baby.gender).babyIconTone,
    favoriteCount: 0,
    historyCount: 0,
    pendingQuestionCount: 0,
    toolRecordCount: 0,
    toolCount: toolService.getAllTools().length,
    actionIconPaths: service.actionIconPaths,
    profileIconPaths: service.profileIconPaths
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3, hidden: false })
    }
    const profile = service.getProfile()
    const icon = getBabyIcon(profile.baby.gender)
    const shouldEditBaby = profile.isLoggedIn && hasBabyEditIntent()
    if (shouldEditBaby) {
      clearBabyEditIntent()
    }
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      ageIndex: this.getAgeIndex(profile.baby.age),
      genderIndex: this.getGenderIndex(profile.baby.gender),
      babyIconTone: icon.babyIconTone,
      isEditingBaby: shouldEditBaby,
      favoriteCount: service.getFavorites().length,
      historyCount: service.getHistory().length,
      pendingQuestionCount: service.getPendingQuestions().length,
      toolCount: toolService.getAllTools().length,
      toolRecordCount: toolService.getDoctorVisitRecords().length + toolService.getFeedingRecords().length + toolService.getVaccineRecords().length + toolService.getGrowthRecords().length
    })
  },

  getGenderIndex(gender) {
    const index = this.data.genderOptions.indexOf(gender)
    return index > -1 ? index : 0
  },

  getAgeIndex(age) {
    const index = this.data.ageOptions.indexOf(age)
    return index > -1 ? index : 0
  },

  setCustomTabBarHidden(hidden) {
    if (typeof this.getTabBar !== 'function') return
    const tabBar = this.getTabBar()
    if (!tabBar) return
    tabBar.setData({ hidden: Boolean(hidden) })
  },

  onProfilePickerOpen() {
    this.setCustomTabBarHidden(true)
  },

  onProfilePickerClose() {
    this.setCustomTabBarHidden(false)
  },

  login() {
    if (wx.getUserProfile) {
      wx.getUserProfile({
        desc: '用于展示家长昵称并保存宝宝档案',
        success: (res) => {
          const profile = service.loginProfile(res.userInfo || {})
          const icon = getBabyIcon(profile.baby.gender)
          const shouldEditBaby = hasBabyEditIntent()
          if (shouldEditBaby) {
            clearBabyEditIntent()
          }
          this.setData({
            profile,
            draftBaby: Object.assign({}, profile.baby),
            ageIndex: this.getAgeIndex(profile.baby.age),
            genderIndex: this.getGenderIndex(profile.baby.gender),
            babyIconTone: icon.babyIconTone,
            isEditingBaby: shouldEditBaby
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
    const icon = getBabyIcon(profile.baby.gender)
    const shouldEditBaby = hasBabyEditIntent()
    if (shouldEditBaby) {
      clearBabyEditIntent()
    }
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      ageIndex: this.getAgeIndex(profile.baby.age),
      genderIndex: this.getGenderIndex(profile.baby.gender),
      babyIconTone: icon.babyIconTone,
      isEditingBaby: shouldEditBaby
    })
    wx.showToast({ title: '已进入新手村', icon: 'none' })
  },

  startEditBaby() {
    if (!this.data.profile.isLoggedIn) {
      wx.showToast({ title: '先登录再记录宝宝档案', icon: 'none' })
      return
    }
    const icon = getBabyIcon(this.data.profile.baby.gender)
    this.setData({
      isEditingBaby: true,
      ageIndex: this.getAgeIndex(this.data.profile.baby.age),
      genderIndex: this.getGenderIndex(this.data.profile.baby.gender),
      babyIconTone: icon.babyIconTone
    })
  },

  cancelEditBaby() {
    const icon = getBabyIcon(this.data.profile.baby.gender)
    this.setData({
      isEditingBaby: false,
      draftBaby: Object.assign({}, this.data.profile.baby),
      ageIndex: this.getAgeIndex(this.data.profile.baby.age),
      genderIndex: this.getGenderIndex(this.data.profile.baby.gender),
      babyIconTone: icon.babyIconTone
    })
  },

  onBabyInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draftBaby.${field}`]: event.detail.value
    })
  },

  onAgeChange(event) {
    this.onProfilePickerClose()
    const index = Number(event.detail.value || 0)
    this.setData({
      ageIndex: index,
      'draftBaby.age': this.data.ageOptions[index] || '未设置'
    })
  },

  onGenderChange(event) {
    this.onProfilePickerClose()
    const index = Number(event.detail.value || 0)
    const gender = this.data.genderOptions[index] || '未设置'
    const icon = getBabyIcon(gender)
    this.setData({
      genderIndex: index,
      'draftBaby.gender': gender,
      babyIconTone: icon.babyIconTone
    })
  },

  saveBaby() {
    const draft = this.data.draftBaby || {}
    const profile = service.saveBabyProfile({
      name: (draft.name || '').trim() || '未设置',
      age: draft.age || '未设置',
      gender: draft.gender || '未设置',
      allergy: (draft.allergy || '').trim() || '暂无记录'
    })
    const icon = getBabyIcon(profile.baby.gender)
    this.setData({
      profile,
      draftBaby: Object.assign({}, profile.baby),
      ageIndex: this.getAgeIndex(profile.baby.age),
      genderIndex: this.getGenderIndex(profile.baby.gender),
      babyIconTone: icon.babyIconTone,
      isEditingBaby: false
    })
    wx.showToast({ title: '宝宝档案已保存', icon: 'none' })
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后会清空本机宝宝档案和工具记录。收藏、搜索历史和问题建议仍会保留。',
      confirmText: '退出',
      confirmColor: '#d96f45',
      success: (res) => {
        if (!res.confirm) return
        const profile = service.logoutProfile()
        toolService.clearDoctorVisitRecords()
        toolService.clearFeedingRecords()
        toolService.clearVaccineRecords()
        toolService.clearGrowthRecords()
        const icon = getBabyIcon(profile.baby.gender)
        this.setData({
          profile,
          draftBaby: Object.assign({}, profile.baby),
          ageIndex: this.getAgeIndex(profile.baby.age),
          genderIndex: this.getGenderIndex(profile.baby.gender),
          babyIconTone: icon.babyIconTone,
          isEditingBaby: false,
          toolRecordCount: 0
        })
        wx.showToast({ title: '已退出并清空档案', icon: 'none' })
      }
    })
  },

  goFavorites() {
    wx.switchTab({ url: '/pages/favorites/index' })
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/history/index' })
  },

  goToolRecords() {
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  showFeedback() {
    wx.showModal({
      title: '内测反馈',
      content: '当前版本面向小范围种子用户。遇到内容不准确、搜索不到问题或页面异常时，请在内测群反馈问题截图、宝宝月龄和搜索词，方便我们优先修正。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showPendingQuestions() {
    const pendingQuestions = service.getPendingQuestions()
    if (!pendingQuestions.length) {
      wx.showModal({
        title: '问题建议',
        content: '当前本机还没有收集到未命中问题。朋友测试时可以让大家直接搜索，没搜到就点“提交这个问题”，并尽量写成完整育儿问题。',
        confirmText: '知道了',
        showCancel: false
      })
      return
    }
    const recent = pendingQuestions.slice(0, 8).map((item, index) => `${index + 1}. ${item.keyword}${item.hitCount > 1 ? ` ×${item.hitCount}` : ''}`)
    wx.showModal({
      title: `问题建议（${pendingQuestions.length}）`,
      content: `当前为本机收集，正式上线后会接后台。\n${recent.join('\n')}`,
      confirmText: '知道了',
      showCancel: false
    })
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私说明',
      content: '当前版本不接后端，不上传宝宝档案。微信头像和昵称仅用于本机展示；宝宝昵称、月龄、性别、过敏史、收藏和搜索历史仅保存在本机微信小程序缓存中，删除小程序或清理缓存后会丢失。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showReviewNote() {
    wx.showModal({
      title: '审核备注建议',
      content: '当前版本为本地数据 MVP，无后台请求、无支付、无客服系统。页面内容为固定育儿科普样例，仅供家长信息参考和就医沟通前梳理，不能替代医生诊断、个体化处方或急救处理。涉及疾病、用药、疫苗反应或紧急情况时，请及时咨询医生、接种门诊或线下就医。',
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
