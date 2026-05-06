const DOCTOR_VISIT_RECORDS_KEY = 'parenting_tool_doctor_visit_records'

const doctorToolCategoryIds = [
  'fever_care',
  'common_illness',
  'skin_allergy',
  'vaccine_check',
  'safety_first'
]

const toolRegistry = {
  fever_care: ['doctor_visit'],
  common_illness: ['doctor_visit'],
  skin_allergy: ['doctor_visit'],
  vaccine_check: ['doctor_visit'],
  safety_first: ['doctor_visit']
}

const toolMeta = {
  doctor_visit: {
    id: 'doctor_visit',
    iconPath: '/assets/icons/pixel-v2/action/doctor-note.png',
    label: '小工具',
    title: '就医前记录单',
    desc: '体温、状态、用药和想问的问题，一页整理好带去问医生。',
    actionText: '打开',
    path: '/pages/tools/doctor-visit/index'
  }
}

const doctorQuestionTemplates = {
  fever_care: [
    '目前这些表现是否需要线下就医或急诊？',
    '退热药是否适合宝宝的月龄和体重？剂量和间隔应该怎么确认？',
    '如果体温反复升高，哪些情况需要复诊？'
  ],
  common_illness: [
    '咳嗽/鼻塞/有痰目前更像普通观察还是需要检查？',
    '哪些呼吸、精神或进食变化需要马上就医？',
    '家里护理时哪些药或做法不建议自行使用？'
  ],
  skin_allergy: [
    '这些皮疹更像过敏、湿疹还是感染，需要做检查吗？',
    '是否需要暂停某种食物、药物或护肤品？',
    '出现哪些全身反应需要立即就医？'
  ],
  vaccine_check: [
    '接种后的这些反应是否在常见范围内？',
    '发热或局部红肿需要怎么观察，多久不缓解要复诊？',
    '下一针是否需要调整时间或提前告知接种门诊？'
  ],
  safety_first: [
    '当前情况是否需要急诊处理或进一步观察？',
    '回家后需要重点观察哪些危险信号？',
    '是否需要复查，复查时间和科室怎么安排？'
  ],
  default: [
    '宝宝目前这些表现最需要排除什么风险？',
    '居家观察时重点看哪些变化？',
    '什么情况下需要复诊或立即就医？'
  ]
}

function getStorageList(key) {
  try {
    const value = wx.getStorageSync(key)
    return Array.isArray(value) ? value : []
  } catch (error) {
    return []
  }
}

function setStorageList(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function makeRecordId() {
  return `doctor_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function normalizeRecord(record) {
  const source = record || {}
  return {
    id: source.id || makeRecordId(),
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
    questionId: source.questionId || '',
    questionTitle: source.questionTitle || '',
    categoryId: source.categoryId || '',
    babyName: source.babyName || '',
    babyAge: source.babyAge || '',
    temperature: source.temperature || '',
    startedAt: source.startedAt || '',
    spirit: source.spirit || '',
    feeding: source.feeding || '',
    urine: source.urine || '',
    symptoms: source.symptoms || '',
    medicine: source.medicine || '',
    notes: source.notes || '',
    templateQuestionsTouched: Boolean(source.templateQuestionsTouched || Array.isArray(source.templateQuestions)),
    templateQuestions: Array.isArray(source.templateQuestions) ? source.templateQuestions.filter(Boolean) : [],
    customQuestions: Array.isArray(source.customQuestions) ? source.customQuestions.filter(Boolean) : []
  }
}

function sanitizeDoctorVisitRecords(records) {
  const seen = {}
  return records.filter((item) => item && typeof item === 'object')
    .map(normalizeRecord)
    .filter((item) => {
      if (seen[item.id]) return false
      seen[item.id] = true
      return true
    })
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
    .slice(0, 30)
}

function getToolsByCategory(categoryId) {
  const ids = toolRegistry[categoryId] || []
  return ids.map((id) => toolMeta[id]).filter(Boolean)
}

function hasDoctorVisitTool(categoryId) {
  return doctorToolCategoryIds.indexOf(categoryId) > -1
}

function getDoctorQuestionTemplates(categoryId) {
  return doctorQuestionTemplates[categoryId] || doctorQuestionTemplates.default
}

function getDoctorVisitRecords() {
  return sanitizeDoctorVisitRecords(getStorageList(DOCTOR_VISIT_RECORDS_KEY))
}

function getDoctorVisitRecord(id) {
  return getDoctorVisitRecords().find((item) => item.id === id) || null
}

function saveDoctorVisitRecord(record) {
  const normalized = normalizeRecord(Object.assign({}, record, {
    id: record && record.id ? record.id : makeRecordId(),
    updatedAt: new Date().toISOString()
  }))
  const records = getDoctorVisitRecords().filter((item) => item.id !== normalized.id)
  records.unshift(normalized)
  setStorageList(DOCTOR_VISIT_RECORDS_KEY, sanitizeDoctorVisitRecords(records))
  return normalized
}

function deleteDoctorVisitRecord(id) {
  const records = getDoctorVisitRecords().filter((item) => item.id !== id)
  setStorageList(DOCTOR_VISIT_RECORDS_KEY, records)
  return records
}

function clearDoctorVisitRecords() {
  setStorageList(DOCTOR_VISIT_RECORDS_KEY, [])
}

function formatRecordTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${hour}:${minute}`
}

module.exports = {
  DOCTOR_VISIT_RECORDS_KEY,
  getToolsByCategory,
  hasDoctorVisitTool,
  getDoctorQuestionTemplates,
  getDoctorVisitRecords,
  getDoctorVisitRecord,
  saveDoctorVisitRecord,
  deleteDoctorVisitRecord,
  clearDoctorVisitRecords,
  formatRecordTime
}
