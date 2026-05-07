const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

const vaccineOptions = [
  '乙肝疫苗',
  '卡介苗',
  '脊灰疫苗',
  '百白破疫苗',
  '麻腮风疫苗',
  '乙脑疫苗',
  '流脑疫苗',
  '轮状病毒疫苗',
  '肺炎疫苗',
  '流感疫苗',
  '水痘疫苗',
  '其他疫苗'
]

const reactionOptions = [
  '暂无明显反应',
  '低热',
  '接种部位红肿',
  '哭闹或烦躁',
  '嗜睡',
  '皮疹',
  '呕吐或腹泻',
  '其他反应'
]

const OTHER_VACCINE = '其他疫苗'
const OTHER_REACTION = '其他反应'

const defaultQuestionRows = [
  '这次反应是否在常见范围内？',
  '哪些情况需要联系接种门诊或线下就医？'
]

function defaultDateTime() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day} ${hour}:${minute}`
}

function getDateTimeParts(value) {
  const fallback = defaultDateTime()
  const text = value && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(value) ? value : fallback
  const parts = text.split(' ')
  return {
    date: parts[0] || fallback.split(' ')[0],
    time: parts[1] || fallback.split(' ')[1]
  }
}

function getTodayDate() {
  return defaultDateTime().split(' ')[0]
}

function getCurrentTime() {
  return defaultDateTime().split(' ')[1]
}

function getMinDate() {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 6)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function buildDraft(options) {
  const profile = service.getProfile()
  const baby = profile.baby || {}
  const question = options && options.questionId ? service.getQuestionById(options.questionId) : null
  return {
    id: options.id || options.recordId || '',
    questionId: options.questionId || '',
    questionTitle: question ? question.title : (options.questionTitle || ''),
    categoryId: options.categoryId || (question ? question.categoryId : 'vaccine_check'),
    babyName: baby.name && baby.name !== '未设置' ? baby.name : '',
    babyAge: baby.age && baby.age !== '未设置' ? baby.age : '',
    vaccinatedAt: defaultDateTime(),
    vaccineName: vaccineOptions[0],
    vaccineNameCustom: '',
    vaccineManufacturer: '',
    doseNo: '',
    place: '',
    reaction: reactionOptions[0],
    reactionCustom: '',
    reactionStartedAt: '',
    notes: '',
    nextQuestions: defaultQuestionRows
  }
}

Page({
  data: {
    draft: {},
    vaccineOptions,
    vaccineIndex: 0,
    reactionOptions,
    reactionIndex: 0,
    questionRows: defaultQuestionRows,
    vaccinatedAtDate: getTodayDate(),
    vaccinatedAtTime: getCurrentTime(),
    reactionDate: getTodayDate(),
    reactionTime: getCurrentTime(),
    minDate: getMinDate(),
    maxDate: getTodayDate(),
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
    const savedRecord = options && options.recordId ? toolService.getVaccineRecord(options.recordId) : null
    const draft = savedRecord ? Object.assign(buildDraft(savedRecord), savedRecord) : buildDraft(options || {})
    const vaccineIndex = this.data.vaccineOptions.indexOf(draft.vaccineName)
    const reactionIndex = this.data.reactionOptions.indexOf(draft.reaction)
    const vaccinatedAtParts = getDateTimeParts(draft.vaccinatedAt)
    const reactionParts = getDateTimeParts(draft.reactionStartedAt || draft.vaccinatedAt)
    this.setData({
      draft: Object.assign({}, draft, {
        vaccinatedAt: `${vaccinatedAtParts.date} ${vaccinatedAtParts.time}`,
        reactionStartedAt: draft.reactionStartedAt || ''
      }),
      vaccineIndex: vaccineIndex > -1 ? vaccineIndex : 0,
      reactionIndex: reactionIndex > -1 ? reactionIndex : 0,
      questionRows: draft.nextQuestions && draft.nextQuestions.length ? draft.nextQuestions : defaultQuestionRows,
      vaccinatedAtDate: vaccinatedAtParts.date,
      vaccinatedAtTime: vaccinatedAtParts.time,
      reactionDate: reactionParts.date,
      reactionTime: reactionParts.time
    })
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field
    if (!field) return
    this.setData({
      [`draft.${field}`]: event.detail.value
    })
  },

  onVaccineChange(event) {
    const index = Number(event.detail.value || 0)
    const vaccineName = this.data.vaccineOptions[index] || this.data.vaccineOptions[0]
    this.setData({
      vaccineIndex: index,
      'draft.vaccineName': vaccineName,
      'draft.vaccineNameCustom': vaccineName === OTHER_VACCINE ? this.data.draft.vaccineNameCustom : ''
    })
  },

  onReactionChange(event) {
    const index = Number(event.detail.value || 0)
    const reaction = this.data.reactionOptions[index] || this.data.reactionOptions[0]
    this.setData({
      reactionIndex: index,
      'draft.reaction': reaction,
      'draft.reactionCustom': reaction === OTHER_REACTION ? this.data.draft.reactionCustom : ''
    })
  },

  syncVaccinatedAt(date, time) {
    const nextDate = date || this.data.vaccinatedAtDate
    const nextTime = time || this.data.vaccinatedAtTime
    this.setData({
      vaccinatedAtDate: nextDate,
      vaccinatedAtTime: nextTime,
      'draft.vaccinatedAt': `${nextDate} ${nextTime}`
    })
  },

  onVaccinatedDateChange(event) {
    this.syncVaccinatedAt(event.detail.value, this.data.vaccinatedAtTime)
  },

  onVaccinatedTimeChange(event) {
    this.syncVaccinatedAt(this.data.vaccinatedAtDate, event.detail.value)
  },

  syncReactionAt(date, time) {
    const nextDate = date || this.data.reactionDate
    const nextTime = time || this.data.reactionTime
    this.setData({
      reactionDate: nextDate,
      reactionTime: nextTime,
      'draft.reactionStartedAt': `${nextDate} ${nextTime}`
    })
  },

  onReactionDateChange(event) {
    this.syncReactionAt(event.detail.value, this.data.reactionTime)
  },

  onReactionTimeChange(event) {
    this.syncReactionAt(this.data.reactionDate, event.detail.value)
  },

  clearReactionTime() {
    this.setData({
      'draft.reactionStartedAt': ''
    })
  },

  onQuestionInput(event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    const rows = this.data.questionRows.slice()
    rows[index] = event.detail.value
    this.setData({ questionRows: rows })
  },

  addQuestion() {
    const rows = this.data.questionRows.slice()
    rows.push('')
    this.setData({ questionRows: rows })
  },

  removeQuestion(event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    const rows = this.data.questionRows.slice()
    if (rows.length <= 1) {
      rows[0] = ''
    } else {
      rows.splice(index, 1)
    }
    this.setData({ questionRows: rows })
  },

  resetDraft() {
    const base = buildDraft(this.data.draft || {})
    const vaccinatedAtParts = getDateTimeParts(base.vaccinatedAt)
    this.setData({
      draft: Object.assign({}, base, {
        vaccinatedAt: `${vaccinatedAtParts.date} ${vaccinatedAtParts.time}`
      }),
      vaccineIndex: 0,
      reactionIndex: 0,
      questionRows: defaultQuestionRows,
      vaccinatedAtDate: vaccinatedAtParts.date,
      vaccinatedAtTime: vaccinatedAtParts.time,
      reactionDate: vaccinatedAtParts.date,
      reactionTime: vaccinatedAtParts.time
    })
  },

  saveRecord() {
    const draft = this.data.draft || {}
    const vaccineNameCustom = String(draft.vaccineNameCustom || '').trim()
    const reactionCustom = String(draft.reactionCustom || '').trim()
    if (draft.vaccineName === OTHER_VACCINE && !vaccineNameCustom) {
      wx.showToast({ title: '请填写具体疫苗名称', icon: 'none' })
      return
    }
    if (draft.reaction === OTHER_REACTION && !reactionCustom) {
      wx.showToast({ title: '请填写具体反应', icon: 'none' })
      return
    }
    const hasInfo = [
      draft.vaccineName,
      vaccineNameCustom,
      draft.vaccineManufacturer,
      draft.doseNo,
      draft.place,
      draft.reaction,
      reactionCustom,
      draft.notes,
      (this.data.questionRows || []).join('')
    ].some((item) => String(item || '').trim())

    if (!hasInfo) {
      wx.showToast({ title: '先记录疫苗名称或接种情况', icon: 'none' })
      return
    }

    const nextQuestions = (this.data.questionRows || [])
      .map((item) => item.trim())
      .filter(Boolean)

    const savedRecord = toolService.saveVaccineRecord(Object.assign({}, draft, {
      vaccineNameCustom: draft.vaccineName === OTHER_VACCINE ? vaccineNameCustom : '',
      reactionCustom: draft.reaction === OTHER_REACTION ? reactionCustom : '',
      nextQuestions
    }))
    this.setData({
      'draft.id': savedRecord.id
    })
    wx.showToast({ title: '疫苗记录已保存', icon: 'none' })
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  goRecords() {
    wx.navigateTo({ url: '/pages/tools/records/index' })
  }
})
