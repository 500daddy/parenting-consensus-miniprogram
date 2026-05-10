const DOCTOR_VISIT_RECORDS_KEY = 'parenting_tool_doctor_visit_records'
const FEEDING_RECORDS_KEY = 'parenting_tool_feeding_records'
const VACCINE_RECORDS_KEY = 'parenting_tool_vaccine_records'
const GROWTH_RECORDS_KEY = 'parenting_tool_growth_records'

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
  vaccine_check: ['doctor_visit', 'vaccine_log', 'growth_log'],
  safety_first: ['doctor_visit'],
  feeding: ['feeding_log']
}

const toolMatchRules = [
  {
    id: 'doctor_visit',
    categories: ['fever_care', 'common_illness', 'skin_allergy', 'safety_first'],
    keywords: ['发烧', '发热', '咳嗽', '有痰', '湿疹', '过敏', '皮疹', '误食', '卡噎', '呕吐', '腹泻', '精神差', '尿少', '就医', '医生', '用药']
  },
  {
    id: 'feeding_log',
    categories: ['feeding'],
    keywords: ['奶量', '喝奶', '吃奶', '喂奶', '母乳', '配方奶', '辅食', '吐奶', '溢奶', '体重增长']
  },
  {
    id: 'vaccine_log',
    categories: ['vaccine_check'],
    keywords: ['疫苗', '接种', '针', '打完疫苗', '接种后', '接种门诊']
  },
  {
    id: 'growth_log',
    categories: ['vaccine_check', 'feeding', 'early_development'],
    keywords: ['身高', '体重', '头围', '生长', '曲线', '不达标', '增长', '体检指标']
  }
]

const toolMeta = {
  doctor_visit: {
    id: 'doctor_visit',
    iconPath: '/assets/icons/pixel-v2/action/doctor-note.png',
    label: '小工具',
    title: '就医前记录单',
    desc: '体温、状态、用药和想问的问题，一页整理好带去问医生。',
    actionText: '打开',
    path: '/pages/tools/doctor-visit/index'
  },
  feeding_log: {
    id: 'feeding_log',
    iconPath: '/assets/icons/pixel-v2/category/feeding.png',
    label: '小工具',
    title: '奶量记录',
    desc: '记录单次奶量、喂养方式和吐奶情况，方便回看今天总量。',
    actionText: '打开',
    path: '/pages/tools/feeding-log/index'
  },
  vaccine_log: {
    id: 'vaccine_log',
    iconPath: '/assets/icons/pixel-v2/category/vaccine.png',
    label: '小工具',
    title: '疫苗记录',
    desc: '记录接种日期、疫苗名称和接种后反应，回看时以接种本为准。',
    actionText: '打开',
    path: '/pages/tools/vaccine-log/index'
  },
  growth_log: {
    id: 'growth_log',
    iconPath: '/assets/icons/pixel-v2/category/growth.png',
    label: '小工具',
    title: '生长记录',
    desc: '记录体重、身高和头围，方便回看近期变化。',
    actionText: '打开',
    path: '/pages/tools/growth-log/index'
  }
}

const GROWTH_REFERENCE_SOURCE = 'WS/T 423-2022 7岁以下儿童生长标准'
const growthStandardRows = {
  boy: [
    [0, 2.7, 3.5, 4.3, 47.3, 51.2, 55.0],
    [1, 3.6, 4.6, 5.6, 51.1, 55.1, 59.2],
    [2, 4.6, 5.8, 7.2, 54.7, 59.0, 63.2],
    [3, 5.5, 6.8, 8.4, 57.8, 62.2, 66.6],
    [4, 6.0, 7.5, 9.3, 60.3, 64.8, 69.4],
    [5, 6.5, 8.0, 9.9, 62.3, 66.9, 71.6],
    [6, 6.8, 8.4, 10.5, 64.0, 68.7, 73.5],
    [7, 7.1, 8.8, 10.9, 65.4, 70.3, 75.1],
    [8, 7.4, 9.1, 11.3, 66.8, 71.7, 76.7],
    [9, 7.6, 9.4, 11.6, 68.0, 73.1, 78.1],
    [10, 7.8, 9.6, 11.9, 69.2, 74.3, 79.4],
    [11, 8.0, 9.8, 12.2, 70.3, 75.5, 80.7],
    [12, 8.2, 10.1, 12.4, 71.4, 76.7, 81.9],
    [13, 8.3, 10.3, 12.7, 72.5, 77.8, 83.1],
    [14, 8.5, 10.5, 12.9, 73.5, 78.9, 84.3],
    [15, 8.7, 10.7, 13.2, 74.5, 80.0, 85.5],
    [16, 8.8, 10.9, 13.4, 75.5, 81.0, 86.6],
    [17, 9.0, 11.1, 13.7, 76.4, 82.1, 87.7],
    [18, 9.2, 11.3, 14.0, 77.4, 83.1, 88.8],
    [19, 9.4, 11.5, 14.2, 78.3, 84.1, 89.9],
    [20, 9.5, 11.7, 14.5, 79.2, 85.1, 91.0],
    [21, 9.7, 11.9, 14.8, 80.1, 86.1, 92.0],
    [22, 9.9, 12.2, 15.0, 81.0, 87.0, 93.1],
    [23, 10.1, 12.4, 15.3, 81.9, 88.0, 94.1],
    [24, 10.2, 12.6, 15.6, 82.0, 88.2, 94.4],
    [36, 11.9, 14.6, 18.3, 90.5, 97.5, 104.5],
    [48, 13.5, 16.7, 21.1, 97.2, 104.9, 112.6],
    [60, 15.1, 19.1, 24.5, 103.6, 112.0, 120.4],
    [72, 16.8, 21.6, 28.4, 109.7, 118.8, 127.9]
  ],
  girl: [
    [0, 2.6, 3.3, 4.1, 46.6, 50.3, 54.1],
    [1, 3.4, 4.3, 5.3, 50.1, 54.1, 58.1],
    [2, 4.3, 5.4, 6.7, 53.5, 57.7, 61.9],
    [3, 5.0, 6.2, 7.7, 56.4, 60.8, 65.1],
    [4, 5.5, 6.9, 8.6, 58.8, 63.3, 67.7],
    [5, 6.0, 7.4, 9.2, 60.7, 65.3, 69.9],
    [6, 6.3, 7.8, 9.7, 62.4, 67.1, 71.7],
    [7, 6.6, 8.1, 10.2, 63.9, 68.7, 73.4],
    [8, 6.9, 8.4, 10.6, 65.3, 70.1, 75.0],
    [9, 7.1, 8.7, 10.9, 66.5, 71.5, 76.4],
    [10, 7.3, 9.0, 11.2, 67.8, 72.8, 77.8],
    [11, 7.5, 9.2, 11.5, 68.9, 74.0, 79.1],
    [12, 7.7, 9.4, 11.8, 70.1, 75.2, 80.4],
    [13, 7.8, 9.6, 12.1, 71.1, 76.4, 81.7],
    [14, 8.0, 9.8, 12.3, 72.2, 77.5, 82.9],
    [15, 8.2, 10.0, 12.6, 73.2, 78.6, 84.1],
    [16, 8.3, 10.3, 12.9, 74.2, 79.7, 85.2],
    [17, 8.5, 10.5, 13.1, 75.2, 80.8, 86.4],
    [18, 8.7, 10.7, 13.4, 76.2, 81.9, 87.5],
    [19, 8.9, 10.9, 13.7, 77.1, 82.9, 88.6],
    [20, 9.0, 11.1, 13.9, 78.1, 83.9, 89.7],
    [21, 9.2, 11.3, 14.2, 79.0, 84.9, 90.8],
    [22, 9.4, 11.5, 14.5, 79.9, 85.8, 91.8],
    [23, 9.5, 11.7, 14.8, 80.7, 86.8, 92.8],
    [24, 9.7, 11.9, 15.0, 80.8, 87.0, 93.1],
    [36, 11.4, 14.1, 17.9, 89.3, 96.2, 103.2],
    [48, 13.0, 16.2, 20.8, 96.0, 103.7, 111.3],
    [60, 14.5, 18.4, 23.8, 102.5, 110.8, 119.1],
    [72, 16.1, 20.7, 27.3, 108.5, 117.5, 126.5]
  ]
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

function makeFeedingRecordId() {
  return `feeding_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function makeVaccineRecordId() {
  return `vaccine_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function makeGrowthRecordId() {
  return `growth_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

function formatMetricNumber(number, precision) {
  if (!Number.isFinite(number) || number <= 0) return ''
  const fixed = String(Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision))
  return fixed.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
}

function normalizeWeightValue(value) {
  const text = String(value || '').trim().toLowerCase()
  if (!text) return ''
  const match = text.replace(',', '.').match(/\d+(?:\.\d+)?/)
  if (!match) return ''
  let number = Number(match[0])
  if (!Number.isFinite(number) || number <= 0) return ''
  if ((/克|(^|[^k])g\b/.test(text) || number > 80) && text.indexOf('kg') === -1) {
    number /= 1000
  }
  return formatMetricNumber(number, 2)
}

function normalizeLengthValue(value) {
  const text = String(value || '').trim().toLowerCase()
  if (!text) return ''
  const match = text.replace(',', '.').match(/\d+(?:\.\d+)?/)
  if (!match) return ''
  let number = Number(match[0])
  if (!Number.isFinite(number) || number <= 0) return ''
  if ((text.indexOf('m') > -1 || /米/.test(text)) && text.indexOf('cm') === -1 && text.indexOf('厘米') === -1) {
    number *= 100
  }
  return formatMetricNumber(number, 1)
}

function parseBabyAgeMonths(age) {
  const text = String(age || '').trim()
  if (!text || text === '未设置') return null
  const monthMatch = text.match(/(\d+)\s*个月/)
  if (monthMatch) return Number(monthMatch[1])
  const yearMatch = text.match(/(\d+)\s*岁/)
  if (yearMatch) return Number(yearMatch[1]) * 12
  return null
}

function getGenderKey(gender) {
  const text = String(gender || '')
  if (text.indexOf('男') > -1) return 'boy'
  if (text.indexOf('女') > -1) return 'girl'
  return ''
}

function findGrowthStandardRow(genderKey, ageMonths) {
  const rows = growthStandardRows[genderKey] || []
  return rows.find((row) => row[0] === ageMonths) || null
}

function makeMetricReference(row, options, recordValue) {
  const number = Number(String(recordValue || '').replace(/[^\d.]/g, ''))
  const diff = Number.isFinite(number) && number > 0 ? number - options.median : null
  let diffText = ''
  if (diff !== null && Math.abs(diff) >= 0.05) {
    diffText = `比参考中位数${diff > 0 ? '多' : '少'} ${formatMetricNumber(Math.abs(diff), options.precision)} ${options.unit}`
  } else if (diff !== null) {
    diffText = '与参考中位数接近'
  }
  return {
    key: options.key,
    label: options.label,
    unit: options.unit,
    rangeText: `${formatMetricNumber(options.low, options.precision)}-${formatMetricNumber(options.high, options.precision)} ${options.unit}`,
    medianText: `${formatMetricNumber(options.median, options.precision)} ${options.unit}`,
    diffText
  }
}

function getGrowthStandardReference(babyProfile, latestRecord) {
  const baby = babyProfile || {}
  const ageMonths = parseBabyAgeMonths(baby.age)
  const genderKey = getGenderKey(baby.gender)
  if (!genderKey || ageMonths === null) {
    return {
      available: false,
      reason: 'missing_profile',
      message: '完善宝宝档案里的性别和月龄后，可看到当前月龄的身高体重参考。'
    }
  }
  const row = findGrowthStandardRow(genderKey, ageMonths)
  if (!row) {
    return {
      available: false,
      reason: 'unsupported_age',
      message: '当前月龄暂未提供参考。'
    }
  }
  const record = latestRecord || {}
  return {
    available: true,
    sourceTitle: GROWTH_REFERENCE_SOURCE,
    sourceNote: '参考范围为 -2SD 到 +2SD，中位数仅用于对照。',
    gender: baby.gender,
    age: baby.age,
    ageMonths,
    metricItems: [
      makeMetricReference(row, {
        key: 'weight',
        label: '体重',
        unit: 'kg',
        low: row[1],
        median: row[2],
        high: row[3],
        precision: 1
      }, record.weight),
      makeMetricReference(row, {
        key: 'height',
        label: ageMonths < 24 ? '身长' : '身高',
        unit: 'cm',
        low: row[4],
        median: row[5],
        high: row[6],
        precision: 1
      }, record.height)
    ]
  }
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

function normalizeFeedingRecord(record) {
  const source = record || {}
  return {
    id: source.id || makeFeedingRecordId(),
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
    questionId: source.questionId || '',
    questionTitle: source.questionTitle || '',
    categoryId: source.categoryId || 'feeding',
    babyName: source.babyName || '',
    babyAge: source.babyAge || '',
    fedAt: source.fedAt || '',
    feedType: source.feedType || '',
    amount: source.amount || '',
    duration: source.duration || '',
    spitUp: source.spitUp || '',
    diaper: source.diaper || '',
    notes: source.notes || ''
  }
}

function sanitizeFeedingRecords(records) {
  const seen = {}
  return records.filter((item) => item && typeof item === 'object')
    .map(normalizeFeedingRecord)
    .filter((item) => {
      if (seen[item.id]) return false
      seen[item.id] = true
      return true
    })
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
    .slice(0, 80)
}

function normalizeVaccineRecord(record) {
  const source = record || {}
  return {
    id: source.id || makeVaccineRecordId(),
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
    questionId: source.questionId || '',
    questionTitle: source.questionTitle || '',
    categoryId: source.categoryId || 'vaccine_check',
    babyName: source.babyName || '',
    babyAge: source.babyAge || '',
    vaccinatedAt: source.vaccinatedAt || '',
    vaccineName: source.vaccineName || '',
    vaccineNameCustom: source.vaccineNameCustom || '',
    vaccineManufacturer: source.vaccineManufacturer || '',
    doseNo: source.doseNo || '',
    place: source.place || '',
    reaction: source.reaction || '',
    reactionCustom: source.reactionCustom || '',
    reactionStartedAt: source.reactionStartedAt || '',
    nextVaccinationAt: source.nextVaccinationAt || '',
    notes: source.notes || '',
    nextQuestions: Array.isArray(source.nextQuestions) ? source.nextQuestions.filter(Boolean) : []
  }
}

function sanitizeVaccineRecords(records) {
  const seen = {}
  return records.filter((item) => item && typeof item === 'object')
    .map(normalizeVaccineRecord)
    .filter((item) => {
      if (seen[item.id]) return false
      seen[item.id] = true
      return true
    })
    .sort((left, right) => String(right.updatedAt).localeCompare(String(left.updatedAt)))
    .slice(0, 60)
}

function normalizeGrowthRecord(record) {
  const source = record || {}
  return {
    id: source.id || makeGrowthRecordId(),
    createdAt: source.createdAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.createdAt || new Date().toISOString(),
    questionId: source.questionId || '',
    questionTitle: source.questionTitle || '',
    categoryId: source.categoryId || 'vaccine_check',
    babyName: source.babyName || '',
    babyAge: source.babyAge || '',
    measuredAt: source.measuredAt || '',
    weight: normalizeWeightValue(source.weight),
    height: normalizeLengthValue(source.height),
    headCircumference: normalizeLengthValue(source.headCircumference),
    sourceType: source.sourceType || '',
    notes: source.notes || ''
  }
}

function sanitizeGrowthRecords(records) {
  const seen = {}
  return records.filter((item) => item && typeof item === 'object')
    .map(normalizeGrowthRecord)
    .filter((item) => {
      if (seen[item.id]) return false
      seen[item.id] = true
      return true
    })
    .sort((left, right) => String(right.measuredAt || right.updatedAt).localeCompare(String(left.measuredAt || left.updatedAt)))
    .slice(0, 80)
}

function getToolsByCategory(categoryId) {
  const ids = toolRegistry[categoryId] || []
  return ids.map((id) => toolMeta[id]).filter(Boolean)
}

function getAllTools() {
  return ['doctor_visit', 'feeding_log', 'vaccine_log', 'growth_log']
    .map((id) => toolMeta[id])
    .filter(Boolean)
}

function getRecommendedTools(context) {
  const source = context || {}
  const question = source.question || {}
  const text = [
    source.title,
    source.categoryId,
    question.title,
    question.shortTitle,
    question.summary,
    question.scene,
    question.tag,
    Array.isArray(question.keywords) ? question.keywords.join(' ') : '',
    Array.isArray(question.aliases) ? question.aliases.join(' ') : ''
  ].filter(Boolean).join(' ')
  const categoryId = source.categoryId || question.categoryId || ''
  const scored = toolMatchRules.map((rule, index) => {
    const categoryScore = rule.categories.indexOf(categoryId) > -1 ? 1 : 0
    const keywordScore = rule.keywords.reduce((sum, keyword) => (
      text.indexOf(keyword) > -1 ? sum + 1 : sum
    ), 0)
    const score = keywordScore * 3 + categoryScore
    return { rule, index, score, keywordScore }
  }).filter((item) => item.score > 0 && (item.keywordScore > 0 || item.rule.id === 'doctor_visit'))
    .sort((left, right) => right.score - left.score || left.index - right.index)

  return scored.slice(0, 2).map((item) => toolMeta[item.rule.id]).filter(Boolean)
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

function getFeedingRecords() {
  return sanitizeFeedingRecords(getStorageList(FEEDING_RECORDS_KEY))
}

function getFeedingRecord(id) {
  return getFeedingRecords().find((item) => item.id === id) || null
}

function getVaccineRecords() {
  return sanitizeVaccineRecords(getStorageList(VACCINE_RECORDS_KEY))
}

function getVaccineRecord(id) {
  return getVaccineRecords().find((item) => item.id === id) || null
}

function getGrowthRecords() {
  return sanitizeGrowthRecords(getStorageList(GROWTH_RECORDS_KEY))
}

function getGrowthRecord(id) {
  return getGrowthRecords().find((item) => item.id === id) || null
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

function saveFeedingRecord(record) {
  const normalized = normalizeFeedingRecord(Object.assign({}, record, {
    id: record && record.id ? record.id : makeFeedingRecordId(),
    updatedAt: new Date().toISOString()
  }))
  const records = getFeedingRecords().filter((item) => item.id !== normalized.id)
  records.unshift(normalized)
  setStorageList(FEEDING_RECORDS_KEY, sanitizeFeedingRecords(records))
  return normalized
}

function deleteFeedingRecord(id) {
  const records = getFeedingRecords().filter((item) => item.id !== id)
  setStorageList(FEEDING_RECORDS_KEY, records)
  return records
}

function saveVaccineRecord(record) {
  const normalized = normalizeVaccineRecord(Object.assign({}, record, {
    id: record && record.id ? record.id : makeVaccineRecordId(),
    updatedAt: new Date().toISOString()
  }))
  const records = getVaccineRecords().filter((item) => item.id !== normalized.id)
  records.unshift(normalized)
  setStorageList(VACCINE_RECORDS_KEY, sanitizeVaccineRecords(records))
  return normalized
}

function deleteVaccineRecord(id) {
  const records = getVaccineRecords().filter((item) => item.id !== id)
  setStorageList(VACCINE_RECORDS_KEY, records)
  return records
}

function saveGrowthRecord(record) {
  const normalized = normalizeGrowthRecord(Object.assign({}, record, {
    id: record && record.id ? record.id : makeGrowthRecordId(),
    updatedAt: new Date().toISOString()
  }))
  const records = getGrowthRecords().filter((item) => item.id !== normalized.id)
  records.unshift(normalized)
  setStorageList(GROWTH_RECORDS_KEY, sanitizeGrowthRecords(records))
  return normalized
}

function deleteGrowthRecord(id) {
  const records = getGrowthRecords().filter((item) => item.id !== id)
  setStorageList(GROWTH_RECORDS_KEY, records)
  return records
}

function clearDoctorVisitRecords() {
  setStorageList(DOCTOR_VISIT_RECORDS_KEY, [])
}

function clearFeedingRecords() {
  setStorageList(FEEDING_RECORDS_KEY, [])
}

function clearVaccineRecords() {
  setStorageList(VACCINE_RECORDS_KEY, [])
}

function clearGrowthRecords() {
  setStorageList(GROWTH_RECORDS_KEY, [])
}

function parseDateValue(value) {
  if (!value) return null
  const text = String(value)
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/)
  if (match) {
    return new Date(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      Number(match[4] || 0),
      Number(match[5] || 0)
    )
  }
  return new Date(value)
}

function formatRecordTime(value) {
  if (!value) return ''
  const date = parseDateValue(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${hour}:${minute}`
}

function getDateKey(value) {
  const date = value ? parseDateValue(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function getRecordDateKey(record) {
  return getDateKey(record && record.fedAt) || getDateKey(record && record.createdAt)
}

function getTodayFeedingSummary(date) {
  const targetKey = getDateKey(date || new Date())
  const records = getFeedingRecords().filter((item) => getRecordDateKey(item) === targetKey)
  const totalAmount = records.reduce((sum, item) => {
    const value = Number(String(item.amount || '').replace(/[^\d.]/g, ''))
    return Number.isFinite(value) ? sum + value : sum
  }, 0)
  return {
    count: records.length,
    totalAmount,
    records
  }
}

function getGrowthTrendSummary() {
  const records = getGrowthRecords()
  const latest = records[0] || null
  const previous = records[1] || null
  function diff(field) {
    if (!latest || !previous) return ''
    const current = Number(String(latest[field] || '').replace(/[^\d.]/g, ''))
    const before = Number(String(previous[field] || '').replace(/[^\d.]/g, ''))
    if (!Number.isFinite(current) || !Number.isFinite(before) || current === before) return ''
    const delta = Math.round((current - before) * 10) / 10
    return delta > 0 ? `+${delta}` : `${delta}`
  }
  return {
    count: records.length,
    latest,
    previous,
    weightDiff: diff('weight'),
    heightDiff: diff('height'),
    headDiff: diff('headCircumference')
  }
}

module.exports = {
  DOCTOR_VISIT_RECORDS_KEY,
  FEEDING_RECORDS_KEY,
  VACCINE_RECORDS_KEY,
  GROWTH_RECORDS_KEY,
  getToolsByCategory,
  getAllTools,
  getRecommendedTools,
  hasDoctorVisitTool,
  getDoctorQuestionTemplates,
  getDoctorVisitRecords,
  getDoctorVisitRecord,
  getFeedingRecords,
  getFeedingRecord,
  getVaccineRecords,
  getVaccineRecord,
  getGrowthRecords,
  getGrowthRecord,
  saveDoctorVisitRecord,
  saveFeedingRecord,
  saveVaccineRecord,
  saveGrowthRecord,
  deleteDoctorVisitRecord,
  deleteFeedingRecord,
  deleteVaccineRecord,
  deleteGrowthRecord,
  clearDoctorVisitRecords,
  clearFeedingRecords,
  clearVaccineRecords,
  clearGrowthRecords,
  formatRecordTime,
  getTodayFeedingSummary,
  getGrowthTrendSummary,
  getGrowthStandardReference
}
