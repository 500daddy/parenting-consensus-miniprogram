const data = require('../mock/data.js')

const HISTORY_KEY = 'parenting_consensus_history'
const FAVORITES_KEY = 'parenting_consensus_favorites'
const PENDING_CATEGORY_KEY = 'pending_category_id'
const ICON_ROOT = '/assets/icons/pixel-v2'
const categoryIconPaths = {
  feeding: `${ICON_ROOT}/category/feeding.png`,
  sleep: `${ICON_ROOT}/category/sleep.png`,
  fever_care: `${ICON_ROOT}/category/fever-care.png`,
  solid_food: `${ICON_ROOT}/category/solid-food.png`,
  early_education: `${ICON_ROOT}/category/early-education.png`,
  vaccine: `${ICON_ROOT}/category/vaccine.png`,
  emotion: `${ICON_ROOT}/category/emotion.png`,
  toilet: `${ICON_ROOT}/category/toilet.png`
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
const keywordRules = [
  { pattern: /夜醒|睡眠|入睡|哄睡/, questionId: 'q_002' },
  { pattern: /辅食|米粉|吃什么|第一口/, questionId: 'q_003' },
  { pattern: /咳嗽|咳痰|有痰|呼吸/, questionId: 'q_004' },
  { pattern: /挑食|蔬菜|不爱吃|吃菜|喂养/, questionId: 'q_005' },
  { pattern: /疫苗|接种|低烧|退烧药|发热反应/, questionId: 'q_006' },
  { pattern: /发烧|发热|高烧|高热|洗澡|退烧|体温/, questionId: 'q_001' }
]

function getCategory(id) {
  const category = data.categories.find((item) => item.id === id)
  return category ? enrichCategory(category) : category
}

function enrichCategory(category) {
  return Object.assign({}, category, {
    iconPath: categoryIconPaths[category.id] || actionIconPaths.question
  })
}

function enrichQuestion(question) {
  if (!question) return question
  return Object.assign({}, question, {
    category: getCategory(question.categoryId),
    tagIconPath: categoryIconPaths[question.categoryId] || actionIconPaths.question
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
  return data.questions.filter((item) => hasQuestionResult(item.id)).map(enrichQuestion)
}

function getDefaultQuestionId(keyword) {
  const text = (keyword || '').trim()
  if (!text) return 'q_001'
  const rule = keywordRules.find((item) => item.pattern.test(text))
  if (rule) return rule.questionId
  const matched = data.questions.find((item) => item.title.indexOf(text) > -1 || text.indexOf(item.shortTitle) > -1)
  return matched ? matched.id : ''
}

function searchQuestions(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions
  const lower = text.toLowerCase()
  const direct = availableQuestions.filter((item) => {
    const category = getCategory(item.categoryId)
    return item.title.toLowerCase().indexOf(lower) > -1 ||
      item.shortTitle.toLowerCase().indexOf(lower) > -1 ||
      item.tag.toLowerCase().indexOf(lower) > -1 ||
      (category && category.name.toLowerCase().indexOf(lower) > -1)
  })
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

module.exports = {
  HISTORY_KEY,
  FAVORITES_KEY,
  PENDING_CATEGORY_KEY,
  categories: data.categories.map(enrichCategory),
  questions: data.questions.map(enrichQuestion),
  profile: data.profile,
  actionIconPaths,
  profileIconPaths,
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
  getAuthoritySources,
  getQuestionsByCategory,
  addHistory,
  getHistory,
  clearHistory,
  setPendingCategory,
  consumePendingCategory,
  getFavorites,
  isFavorite,
  toggleFavorite
}
