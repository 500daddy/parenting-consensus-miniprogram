const data = require('../mock/data.js')

const HISTORY_KEY = 'parenting_consensus_history'
const FAVORITES_KEY = 'parenting_consensus_favorites'
const PENDING_CATEGORY_KEY = 'pending_category_id'
const PROFILE_KEY = 'parenting_consensus_profile'
const ICON_ROOT = '/assets/icons/pixel-v2'
const categoryIconPaths = {
  fever_care: `${ICON_ROOT}/category/fever-care.png`,
  common_illness: `${ICON_ROOT}/category/common-illness.png`,
  feeding: `${ICON_ROOT}/category/feeding.png`,
  solid_food: `${ICON_ROOT}/category/solid-food.png`,
  sleep: `${ICON_ROOT}/category/sleep.png`,
  skin_allergy: `${ICON_ROOT}/category/skin-allergy.png`,
  vaccine: `${ICON_ROOT}/category/vaccine.png`,
  vaccine_check: `${ICON_ROOT}/category/vaccine.png`,
  early_education: `${ICON_ROOT}/category/early-education.png`,
  early_development: `${ICON_ROOT}/category/growth.png`,
  emotion: `${ICON_ROOT}/category/emotion.png`,
  toilet: `${ICON_ROOT}/category/toilet.png`,
  safety_first: `${ICON_ROOT}/category/safety-first.png`
}
const questionIconOverrides = {
  q_041: `${ICON_ROOT}/category/growth.png`,
  q_043: `${ICON_ROOT}/category/growth.png`,
  q_050: `${ICON_ROOT}/category/safety-first.png`
}
const sourceIconPaths = {
  doctor: `${ICON_ROOT}/source/doctor.png`,
  guide: `${ICON_ROOT}/source/medical-guide.png`,
  wiki: `${ICON_ROOT}/source/parenting-wiki.png`,
  creator: `${ICON_ROOT}/source/verified-creator.png`
}
const actionIconPaths = {
  authority: `${ICON_ROOT}/action/authority.png`,
  consensus: `${ICON_ROOT}/action/consensus.png`,
  favorite: `${ICON_ROOT}/action/favorite.png`,
  history: `${ICON_ROOT}/action/history.png`,
  hot: `${ICON_ROOT}/action/hot.png`,
  minority: `${ICON_ROOT}/action/minority.png`,
  question: `${ICON_ROOT}/action/question.png`,
  reminder: `${ICON_ROOT}/action/reminder.png`,
  search: `${ICON_ROOT}/action/search.png`,
  share: `${ICON_ROOT}/action/share.png`,
  star: `${ICON_ROOT}/action/star.png`,
  warning: `${ICON_ROOT}/action/warning.png`
}
const profileIconPaths = {
  allergy: `${ICON_ROOT}/profile/allergy.png`,
  family: `${ICON_ROOT}/profile/family.png`,
  gender: `${ICON_ROOT}/profile/gender.png`,
  month: `${ICON_ROOT}/profile/month.png`,
  name: `${ICON_ROOT}/profile/name.png`
}
const reasonIconPaths = {
  green: actionIconPaths.consensus,
  orange: actionIconPaths.reminder,
  red: actionIconPaths.warning,
  purple: actionIconPaths.question
}
const glossaryTerms = {
  '生理性溢奶': {
    title: '生理性溢奶',
    summary: '宝宝喝奶后少量奶液从嘴角流出，常见于小月龄宝宝胃容量小、食管括约肌还没发育成熟。',
    reminder: '通常量少、宝宝精神和吃奶正常；如果频繁喷射、体重增长差或精神差，要咨询医生。'
  },
  '喷射状呕吐': {
    title: '喷射状呕吐',
    summary: '呕吐力量很大，奶液或食物像被冲出来一样喷出，不是普通吐奶或嘴角流奶。',
    reminder: '如果反复出现，或伴随精神差、尿少、发热、体重增长差，应及时就医。'
  },
  '脱水': {
    title: '脱水',
    summary: '身体水分不足，宝宝可能表现为尿量明显变少、哭时眼泪少、口唇干、精神差。',
    reminder: '小宝宝脱水进展可能较快，持续呕吐、腹泻或高热时要特别留意。'
  },
  '红旗信号': {
    title: '红旗信号',
    summary: '提示可能有风险、需要优先就医或咨询医生的表现，比如呼吸费力、精神明显变差、抽搐、尿量明显减少。',
    reminder: '看到红旗信号时，不要只等平台答案，应优先线下处理。'
  },
  '精神状态': {
    title: '精神状态',
    summary: '观察宝宝是否和平时一样有反应、能安抚、能吃奶/玩耍，而不只看一个体温或症状数字。',
    reminder: '精神明显差、嗜睡、反应弱，通常比单个症状更值得重视。'
  },
  '低月龄': {
    title: '低月龄',
    summary: '一般指月龄较小的宝宝，尤其 3 个月以内。这个阶段症状变化更需要谨慎看待。',
    reminder: '低月龄宝宝发热、吃奶差、精神差时，建议更早咨询医生。'
  },
  '退烧药': {
    title: '退烧药',
    summary: '用于缓解发热不适的药物，儿童用药需要看月龄、体重、药品成分和医生/说明书建议。',
    reminder: '不要自行叠加多种退烧药，也不要只为追求降温数字而用药。'
  },
  '过敏反应': {
    title: '过敏反应',
    summary: '接触食物、药物或环境刺激后出现皮疹、呕吐、腹泻、咳喘、面部肿胀等表现。',
    reminder: '如果出现呼吸异常、面部肿胀或全身反应，要及时就医。'
  },
  '辅食过敏': {
    title: '辅食过敏',
    summary: '添加新食物后出现皮疹、呕吐、腹泻、咳喘等疑似过敏表现。',
    reminder: '添加新食物建议少量、单一、连续观察，严重反应及时就医。'
  },
  '卡噎': {
    title: '卡噎',
    summary: '食物或异物堵住气道，宝宝可能咳不出声、呼吸困难、脸色发青。',
    reminder: '这是急救场景，出现呼吸困难或意识异常时应立即急救并联系急救电话。'
  }
}

function sortQuestions(left, right) {
  const leftRank = typeof left.priorityRank === 'number' ? left.priorityRank : 99
  const rightRank = typeof right.priorityRank === 'number' ? right.priorityRank : 99
  if (leftRank !== rightRank) return leftRank - rightRank
  if (left.heat !== right.heat) return right.heat - left.heat
  return left.id.localeCompare(right.id)
}

function getQuestionSearchText(question) {
  return [
    question.title,
    question.shortTitle,
    question.categoryName,
    question.scene,
    question.tag,
    (question.tags || []).join(' '),
    (question.searchTerms || []).join(' '),
    question.summary
  ].filter(Boolean).join(' ').toLowerCase()
}

function getQuestionSearchScore(question, keyword) {
  const text = (keyword || '').trim().toLowerCase()
  if (!text) return 0
  const haystack = getQuestionSearchText(question)
  let score = 0
  if (question.title && question.title.toLowerCase().indexOf(text) > -1) score += 80
  if (question.shortTitle && question.shortTitle.toLowerCase().indexOf(text) > -1) score += 70
  if (haystack.indexOf(text) > -1) score += 50
  if (text.indexOf((question.shortTitle || '').toLowerCase()) > -1) score += 35
  ;(question.searchTerms || []).forEach((term) => {
    const lowerTerm = term.toLowerCase()
    if (lowerTerm.indexOf(text) > -1 || text.indexOf(lowerTerm) > -1) score += 45
  })
  ;(question.tags || []).forEach((tag) => {
    const lowerTag = tag.toLowerCase()
    if (text.indexOf(lowerTag) > -1) score += 12
  })
  return score
}

function getGlossaryEntry(term) {
  return glossaryTerms[term] || null
}

function buildGlossarySegments(text) {
  const source = text || ''
  if (!source) return []
  const terms = Object.keys(glossaryTerms).sort((left, right) => right.length - left.length)
  const segments = []
  let index = 0
  while (index < source.length) {
    const term = terms.find((item) => source.indexOf(item, index) === index)
    if (term) {
      segments.push({
        text: term,
        term,
        entry: glossaryTerms[term]
      })
      index += term.length
      continue
    }
    let nextIndex = source.length
    terms.forEach((item) => {
      const foundIndex = source.indexOf(item, index + 1)
      if (foundIndex > -1 && foundIndex < nextIndex) {
        nextIndex = foundIndex
      }
    })
    segments.push({ text: source.slice(index, nextIndex) })
    index = nextIndex
  }
  return segments
}
function getCategory(id) {
  const category = data.categories.find((item) => item.id === id)
  return category ? enrichCategory(category) : category
}

function getCategoryIconPath(categoryId) {
  return categoryIconPaths[categoryId] || actionIconPaths.question
}

function getQuestionIconPath(question) {
  if (!question) return actionIconPaths.question
  return questionIconOverrides[question.id] || getCategoryIconPath(question.categoryId)
}

function enrichCategory(category) {
  return Object.assign({}, category, {
    iconPath: getCategoryIconPath(category.id)
  })
}

function enrichQuestion(question) {
  if (!question) return question
  return Object.assign({}, question, {
    category: getCategory(question.categoryId),
    tagIconPath: getQuestionIconPath(question)
  })
}

function enrichSource(source) {
  if (!source) return source
  return Object.assign({}, source, {
    iconPath: sourceIconPaths[source.type] || actionIconPaths.authority
  })
}

function formatHeat(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(value >= 100000 ? 1 : 2).replace(/\.0$/, '') + '万'
  }
  return String(value)
}

function getQuestionById(id) {
  return enrichQuestion(data.questions.find((item) => item.id === id))
}

function hasQuestionResult(id) {
  return Boolean(id && data.questionResults[id])
}

function getAvailableQuestions() {
  return data.questions.filter((item) => hasQuestionResult(item.id)).slice().sort(sortQuestions).map(enrichQuestion)
}

function getPriorityQuestions(priority) {
  const target = priority || 'P0'
  return getAvailableQuestions().filter((item) => item.priority === target)
}

function getDefaultQuestionId(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions.length ? availableQuestions[0].id : ''
  const scored = availableQuestions.map((item) => ({
    id: item.id,
    score: getQuestionSearchScore(item, text),
    heat: item.heat
  })).filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || right.heat - left.heat)
  return scored.length ? scored[0].id : ''
}

function searchQuestions(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions
  const direct = availableQuestions.map((item) => Object.assign({}, item, {
    searchScore: getQuestionSearchScore(item, text)
  })).filter((item) => item.searchScore > 0)
    .sort((left, right) => right.searchScore - left.searchScore || sortQuestions(left, right))
  if (direct.length) return direct
  const fallbackId = getDefaultQuestionId(text)
  return hasQuestionResult(fallbackId) ? [getQuestionById(fallbackId)] : []
}

function buildDonutStyle(viewpoints) {
  let start = 0
  const segments = viewpoints.map((item, index) => {
    const end = index === viewpoints.length - 1 ? 100 : Math.min(start + item.percentage, 100)
    const segment = `${item.color} ${start}% ${end}%`
    start = end
    return segment
  })
  return `background: conic-gradient(${segments.join(', ')});`
}

function getQuestionResult(options) {
  const id = options && options.id ? options.id : getDefaultQuestionId(options && options.keyword)
  if (!id || !data.questionResults[id]) return null
  const result = Object.assign({}, data.questionResults[id])
  result.question = getQuestionById(id)
  result.category = getCategory(result.categoryId)
  result.donutStyle = buildDonutStyle(result.viewpoints)
  result.reasons = result.reasons.map((reason) => Object.assign({}, reason, {
    iconPath: reasonIconPaths[reason.tone] || actionIconPaths.question
  }))
  result.authoritySources = result.authoritySourceIds.map((sourceId) => {
    return enrichSource(data.authoritySources.find((source) => source.id === sourceId))
  }).filter(Boolean)
  result.relatedQuestionItems = result.relatedQuestions.map(getQuestionById).filter((item) => item && hasQuestionResult(item.id))
  return result
}

function getDailyQuestionId(date) {
  const questions = getAvailableQuestions()
  if (!questions.length) return ''
  const current = date instanceof Date ? date : new Date()
  const startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  const dayIndex = Math.floor(startOfDay.getTime() / 86400000)
  return questions[dayIndex % questions.length].id
}

function getTodayQuestionResult(date) {
  return getQuestionResult({ id: getDailyQuestionId(date) })
}

function getAuthoritySources(type, questionId) {
  return data.authoritySources.filter((item) => {
    const typeMatched = !type || type === 'all' || item.type === type
    const questionMatched = !questionId || item.questionIds.indexOf(questionId) > -1
    return typeMatched && questionMatched
  }).map(enrichSource)
}

function getQuestionsByCategory(categoryId) {
  const availableQuestions = getAvailableQuestions()
  if (!categoryId || categoryId === 'all') return availableQuestions
  return availableQuestions.filter((item) => item.categoryId === categoryId)
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

function getStorageObject(key) {
  try {
    const value = wx.getStorageSync(key)
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null
  } catch (error) {
    return null
  }
}

function setStorageObject(key, value) {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function sanitizeHistory(items) {
  const seen = {}
  return items.filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => {
      if (!item || seen[item]) return false
      seen[item] = true
      return true
    })
    .slice(0, 12)
}

function sanitizeFavoriteIds(items) {
  const seen = {}
  return items.filter((id) => typeof id === 'string' && hasQuestionResult(id))
    .filter((id) => {
      if (seen[id]) return false
      seen[id] = true
      return true
    })
}

function addHistory(keyword) {
  const text = (keyword || '').trim()
  if (!text) return
  const history = sanitizeHistory(getStorageList(HISTORY_KEY)).filter((item) => item !== text)
  history.unshift(text)
  setStorageList(HISTORY_KEY, history.slice(0, 12))
}

function getHistory() {
  return sanitizeHistory(getStorageList(HISTORY_KEY))
}

function clearHistory() {
  setStorageList(HISTORY_KEY, [])
}

function setPendingCategory(categoryId) {
  try {
    wx.setStorageSync(PENDING_CATEGORY_KEY, categoryId)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
}

function consumePendingCategory() {
  try {
    const categoryId = wx.getStorageSync(PENDING_CATEGORY_KEY)
    wx.removeStorageSync(PENDING_CATEGORY_KEY)
    return categoryId || ''
  } catch (error) {
    return ''
  }
}

function getFavorites() {
  const ids = sanitizeFavoriteIds(getStorageList(FAVORITES_KEY))
  return ids.map(getQuestionById).filter((item) => item && hasQuestionResult(item.id))
}

function isFavorite(questionId) {
  return hasQuestionResult(questionId) && sanitizeFavoriteIds(getStorageList(FAVORITES_KEY)).indexOf(questionId) > -1
}

function toggleFavorite(questionId) {
  if (!hasQuestionResult(questionId)) return false
  const ids = sanitizeFavoriteIds(getStorageList(FAVORITES_KEY))
  const index = ids.indexOf(questionId)
  if (index > -1) {
    ids.splice(index, 1)
  } else {
    ids.unshift(questionId)
  }
  setStorageList(FAVORITES_KEY, ids)
  return index === -1
}

function normalizeProfile(profile) {
  const saved = profile || {}
  const savedBaby = saved.baby || {}
  return {
    isLoggedIn: Boolean(saved.isLoggedIn),
    nickName: saved.nickName || data.profile.nickName,
    avatarUrl: saved.avatarUrl || '',
    avatarText: saved.avatarText || data.profile.avatarText,
    baby: {
      name: savedBaby.name || data.profile.baby.name,
      age: savedBaby.age || data.profile.baby.age,
      gender: savedBaby.gender || data.profile.baby.gender,
      allergy: savedBaby.allergy || data.profile.baby.allergy
    }
  }
}

function getProfile() {
  return normalizeProfile(getStorageObject(PROFILE_KEY))
}

function saveProfile(profile) {
  const normalized = normalizeProfile(profile)
  setStorageObject(PROFILE_KEY, normalized)
  return normalized
}

function loginProfile(userInfo) {
  const current = getProfile()
  return saveProfile(Object.assign({}, current, {
    isLoggedIn: true,
    nickName: userInfo && userInfo.nickName ? userInfo.nickName : current.nickName,
    avatarUrl: userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : current.avatarUrl,
    avatarText: userInfo && userInfo.nickName ? userInfo.nickName.slice(0, 1) : current.avatarText
  }))
}

function saveBabyProfile(baby) {
  const current = getProfile()
  return saveProfile(Object.assign({}, current, {
    baby: Object.assign({}, current.baby, baby || {})
  }))
}

function logoutProfile() {
  try {
    wx.removeStorageSync(PROFILE_KEY)
  } catch (error) {
    // Storage may be unavailable in some preview runtimes.
  }
  return getProfile()
}

module.exports = {
  HISTORY_KEY,
  FAVORITES_KEY,
  PENDING_CATEGORY_KEY,
  PROFILE_KEY,
  categories: data.categories.map(enrichCategory),
  questions: data.questions.map(enrichQuestion),
  profile: normalizeProfile(data.profile),
  actionIconPaths,
  profileIconPaths,
  getCategoryIconPath,
  getQuestionIconPath,
  getGlossaryEntry,
  buildGlossarySegments,
  formatHeat,
  getCategory,
  getQuestionById,
  hasQuestionResult,
  getAvailableQuestions,
  getDefaultQuestionId,
  getDailyQuestionId,
  getTodayQuestionResult,
  searchQuestions,
  getQuestionResult,
  getPriorityQuestions,
  getAuthoritySources,
  getQuestionsByCategory,
  addHistory,
  getHistory,
  clearHistory,
  setPendingCategory,
  consumePendingCategory,
  getFavorites,
  isFavorite,
  toggleFavorite,
  getProfile,
  saveProfile,
  loginProfile,
  saveBabyProfile,
  logoutProfile
}
