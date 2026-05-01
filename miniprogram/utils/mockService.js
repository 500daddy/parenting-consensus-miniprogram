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
