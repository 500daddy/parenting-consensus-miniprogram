const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

const spiritOptions = ['和平时差不多', '比平时蔫一些', '很难安抚或嗜睡', '呼吸/意识异常']

function buildDraft(options) {
  const profile = service.getProfile()
  const baby = profile.baby || {}
  const question = options && options.questionId ? service.getQuestionById(options.questionId) : null
  return {
    id: options.id || options.recordId || '',
    questionId: options.questionId || '',
    questionTitle: question ? question.title : (options.questionTitle || ''),
    categoryId: options.categoryId || (question ? question.categoryId : ''),
    babyName: baby.name && baby.name !== '未设置' ? baby.name : '',
    babyAge: baby.age && baby.age !== '未设置' ? baby.age : '',
    temperature: '',
    startedAt: '',
    spirit: '',
    feeding: '',
    urine: '',
    symptoms: '',
    medicine: '',
    notes: '',
    customQuestions: []
  }
}

function getProfileBabyFields() {
  const profile = service.getProfile()
  const baby = profile.baby || {}
  return {
    babyName: baby.name && baby.name !== '未设置' ? baby.name : '',
    babyAge: baby.age && baby.age !== '未设置' ? baby.age : ''
  }
}

function getBabyProfileState(draft) {
  return {
    isBabyProfileReady: Boolean(draft.babyName && draft.babyAge),
    babyProfileHintText: '完善宝宝信息后，可自动带入宝宝和月龄。'
  }
}

Page({
  data: {
    draft: {},
    spiritOptions,
    spiritIndex: 0,
    templateQuestions: [],
    customQuestionRows: [''],
    isBabyProfileReady: false,
    babyProfileHintText: '',
    actionIconPaths: service.actionIconPaths
  },

  onShow() {
    if (!this.data.draft || !Object.keys(this.data.draft).length) return
    const babyFields = getProfileBabyFields()
    const nextDraft = Object.assign({}, this.data.draft, babyFields)
    const babyProfileState = getBabyProfileState(nextDraft)
    this.setData({
      'draft.babyName': babyFields.babyName,
      'draft.babyAge': babyFields.babyAge,
      isBabyProfileReady: babyProfileState.isBabyProfileReady,
      babyProfileHintText: babyProfileState.babyProfileHintText
    })
  },

  onLoad(options) {
    const savedRecord = options && options.recordId ? toolService.getDoctorVisitRecord(options.recordId) : null
    const draft = savedRecord
      ? Object.assign(buildDraft(savedRecord), savedRecord)
      : buildDraft(options || {})
    const templateQuestions = savedRecord && savedRecord.templateQuestionsTouched
      ? savedRecord.templateQuestions
      : toolService.getDoctorQuestionTemplates(draft.categoryId)
    const customQuestionRows = savedRecord && savedRecord.customQuestions && savedRecord.customQuestions.length
      ? savedRecord.customQuestions
      : ['']
    const spiritIndex = this.data.spiritOptions.indexOf(draft.spirit)
    const babyProfileState = getBabyProfileState(draft)
    this.setData({
      draft,
      spiritIndex: spiritIndex > -1 ? spiritIndex : 0,
      templateQuestions,
      customQuestionRows,
      isBabyProfileReady: babyProfileState.isBabyProfileReady,
      babyProfileHintText: babyProfileState.babyProfileHintText
    })
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draft.${field}`]: event.detail.value
    })
  },

  onSpiritChange(event) {
    const index = Number(event.detail.value || 0)
    this.setData({
      spiritIndex: index,
      'draft.spirit': this.data.spiritOptions[index] || ''
    })
  },

  onCustomQuestionInput(event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    const rows = this.data.customQuestionRows.slice()
    rows[index] = event.detail.value
    this.setData({ customQuestionRows: rows })
  },

  addCustomQuestion() {
    const rows = this.data.customQuestionRows.slice()
    rows.push('')
    this.setData({ customQuestionRows: rows })
  },

  removeCustomQuestion(event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    const rows = this.data.customQuestionRows.slice()
    if (rows.length <= 1) {
      rows[0] = ''
    } else {
      rows.splice(index, 1)
    }
    this.setData({ customQuestionRows: rows })
  },

  removeTemplateQuestion(event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    const questions = this.data.templateQuestions.slice()
    questions.splice(index, 1)
    this.setData({ templateQuestions: questions })
  },

  resetDraft() {
    const base = buildDraft(this.data.draft || {})
    this.setData({
      draft: base,
      spiritIndex: 0,
      customQuestionRows: [''],
      templateQuestions: toolService.getDoctorQuestionTemplates(base.categoryId)
    })
  },

  saveRecord() {
    const draft = this.data.draft || {}
    const hasCoreInfo = [
      draft.temperature,
      draft.startedAt,
      draft.spirit,
      draft.feeding,
      draft.urine,
      draft.symptoms,
      draft.medicine,
      draft.notes,
      (this.data.customQuestionRows || []).join('')
    ].some((item) => String(item || '').trim())

    if (!hasCoreInfo) {
      wx.showToast({ title: '先记录一点症状或问题', icon: 'none' })
      return
    }

    const customQuestions = (this.data.customQuestionRows || [])
      .map((item) => item.trim())
      .filter(Boolean)

    const savedRecord = toolService.saveDoctorVisitRecord(Object.assign({}, draft, {
      templateQuestions: this.data.templateQuestions,
      templateQuestionsTouched: true,
      customQuestions
    }))
    draft.id = savedRecord.id
    this.setData({
      'draft.id': savedRecord.id
    })
    wx.showToast({ title: '清单已保存', icon: 'none' })
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  goEditBabyProfile() {
    wx.navigateTo({ url: '/pages/profile/baby-edit/index?from=doctor_visit' })
  }
})
