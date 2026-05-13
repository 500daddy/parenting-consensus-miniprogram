const service = require('../../utils/mockService.js')
const toolService = require('../../utils/toolService.js')

const PROFILE_EDIT_INTENT_KEY = 'parenting_profile_edit_intent'

function buildAgeOptions() {
  const monthOptions = Array.from({ length: 25 }, (_, index) => `${index}个月`)
  const yearOptions = Array.from({ length: 17 }, (_, index) => `${index + 2}岁`)
  return monthOptions.concat(yearOptions)
}

function getBabyIcon(gender) {
  if (gender === '男宝') return { babyIconTone: 'boy' }
  if (gender === '女宝') return { babyIconTone: 'girl' }
  return { babyIconTone: 'neutral' }
}

function normalizeDraftBaby(profile) {
  const baby = profile.baby || {}
  return {
    name: baby.name && baby.name !== '未设置' ? baby.name : '',
    age: baby.age && baby.age !== '未设置' ? baby.age : '',
    gender: baby.gender && baby.gender !== '未设置' ? baby.gender : '',
    allergy: baby.allergy && baby.allergy !== '暂无记录' ? baby.allergy : ''
  }
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
    draftBaby: normalizeDraftBaby(initialProfile),
    isEditingBaby: false,
    ageOptions,
    ageIndex: initialAgeIndex > -1 ? initialAgeIndex : 0,
    genderOptions: ['男宝', '女宝'],
    genderIndex: 0,
    babyIconTone: getBabyIcon(initialProfile.baby.gender).babyIconTone,
    favoriteCount: 0,
    historyCount: 0,
    pendingQuestionCount: 0,
    toolRecordCount: 0,
    toolCount: toolService.getAllTools().length,
    isPendingQuestionModalOpen: false,
    pendingQuestionDraft: '',
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
      draftBaby: normalizeDraftBaby(profile),
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
            draftBaby: normalizeDraftBaby(profile),
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
      draftBaby: normalizeDraftBaby(profile),
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
      draftBaby: normalizeDraftBaby(this.data.profile),
      ageIndex: this.getAgeIndex(this.data.profile.baby.age),
      genderIndex: this.getGenderIndex(this.data.profile.baby.gender),
      babyIconTone: icon.babyIconTone
    })
  },

  cancelEditBaby() {
    const icon = getBabyIcon(this.data.profile.baby.gender)
    this.setData({
      isEditingBaby: false,
      draftBaby: normalizeDraftBaby(this.data.profile),
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
      'draftBaby.age': this.data.ageOptions[index] || this.data.ageOptions[0]
    })
  },

  onGenderChange(event) {
    this.onProfilePickerClose()
    const index = Number(event.detail.value || 0)
    const gender = this.data.genderOptions[index] || this.data.genderOptions[0]
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
      draftBaby: normalizeDraftBaby(profile),
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
          draftBaby: normalizeDraftBaby(profile),
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
      title: '怎么反馈问题',
      content: '当前版本还没有在线提交入口。遇到内容不准确、搜索不到问题或页面显示异常时，可以把截图、问题描述、手机型号和刚才搜索的词发给邀请你体验的人，方便我们排查。',
      confirmText: '知道了',
      showCancel: false
    })
  },

  showPendingQuestions() {
    const pendingQuestions = service.getPendingQuestions()
    if (!pendingQuestions.length) {
      this.submitPendingQuestion()
      return
    }
    wx.showActionSheet({
      itemList: ['提交新问题', '查看已提交'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.submitPendingQuestion()
        } else {
          this.viewPendingQuestions()
        }
      }
    })
  },

  submitPendingQuestion() {
    this.setData({
      isPendingQuestionModalOpen: true,
      pendingQuestionDraft: ''
    })
  },

  onPendingQuestionInput(event) {
    this.setData({
      pendingQuestionDraft: event.detail.value
    })
  },

  closePendingQuestionModal() {
    this.setData({
      isPendingQuestionModalOpen: false,
      pendingQuestionDraft: ''
    })
  },

  savePendingQuestion() {
    const validation = service.validatePendingQuestion(this.data.pendingQuestionDraft)
    if (!validation.valid) {
      wx.showToast({ title: validation.message, icon: 'none' })
      return
    }
    service.addPendingQuestion(validation.text, 'profile')
    this.setData({
      isPendingQuestionModalOpen: false,
      pendingQuestionDraft: '',
      pendingQuestionCount: service.getPendingQuestions().length
    })
    wx.showToast({ title: '已保存在本机', icon: 'none' })
  },

  viewPendingQuestions() {
    const pendingQuestions = service.getPendingQuestions()
    if (!pendingQuestions.length) {
      wx.showModal({
        title: '问题建议',
        content: '当前还没有记录。可以先补充一个你希望后续看到答案的育儿问题。',
        confirmText: '去补充',
        cancelText: '关闭',
        success: (res) => {
          if (res.confirm) this.submitPendingQuestion()
        },
        showCancel: true
      })
      return
    }
    const recent = pendingQuestions.slice(0, 8).map((item, index) => `${index + 1}. ${item.keyword}${item.hitCount > 1 ? ` ×${item.hitCount}` : ''}`)
    wx.showModal({
      title: `已提交的问题（${pendingQuestions.length}）`,
      content: `这些问题目前只保存在这台手机。\n${recent.join('\n')}`,
      confirmText: '继续补充',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm) this.submitPendingQuestion()
      },
      showCancel: true
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
  },

  noop() {}
})
