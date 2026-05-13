const service = require('../../../utils/mockService.js')

function buildAgeOptions() {
  const monthOptions = Array.from({ length: 25 }, (_, index) => `${index}个月`)
  const yearOptions = Array.from({ length: 17 }, (_, index) => `${index + 2}岁`)
  return monthOptions.concat(yearOptions)
}

const ageOptions = buildAgeOptions()
const genderOptions = ['男宝', '女宝']

function normalizeDraftBaby(profile) {
  const baby = profile.baby || {}
  return {
    name: baby.name && baby.name !== '未设置' ? baby.name : '',
    age: baby.age && baby.age !== '未设置' ? baby.age : '',
    gender: baby.gender && baby.gender !== '未设置' ? baby.gender : '',
    allergy: baby.allergy && baby.allergy !== '暂无记录' ? baby.allergy : ''
  }
}

Page({
  data: {
    draftBaby: {},
    ageOptions,
    ageIndex: 0,
    genderOptions,
    genderIndex: 0,
    profileIconPaths: service.profileIconPaths
  },

  onLoad() {
    const profile = service.getProfile()
    const draftBaby = normalizeDraftBaby(profile)
    this.setData({
      draftBaby,
      ageIndex: this.getAgeIndex(draftBaby.age),
      genderIndex: this.getGenderIndex(draftBaby.gender)
    })
  },

  getAgeIndex(age) {
    const index = this.data.ageOptions.indexOf(age)
    return index > -1 ? index : 0
  },

  getGenderIndex(gender) {
    const index = this.data.genderOptions.indexOf(gender)
    return index > -1 ? index : 0
  },

  onBabyInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draftBaby.${field}`]: event.detail.value
    })
  },

  onAgeChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      ageIndex: index,
      'draftBaby.age': this.data.ageOptions[index] || this.data.ageOptions[0]
    })
  },

  onGenderChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      genderIndex: index,
      'draftBaby.gender': this.data.genderOptions[index] || this.data.genderOptions[0]
    })
  },

  saveBaby() {
    const draft = this.data.draftBaby || {}
    const current = service.getProfile()
    if (!current.isLoggedIn) {
      service.loginProfile({ nickName: '新手村家长' })
    }
    service.saveBabyProfile({
      name: (draft.name || '').trim() || '未设置',
      age: draft.age || '未设置',
      gender: draft.gender || '未设置',
      allergy: (draft.allergy || '').trim() || '暂无记录'
    })
    wx.showToast({ title: '宝宝信息已保存', icon: 'none' })
    wx.navigateBack()
  },

  cancelEdit() {
    wx.navigateBack()
  }
})
