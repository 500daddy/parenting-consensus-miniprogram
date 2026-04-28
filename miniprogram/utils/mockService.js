const data = require('../mock/data.js')

const HISTORY_KEY = 'parenting_consensus_history'
const FAVORITES_KEY = 'parenting_consensus_favorites'
const PENDING_CATEGORY_KEY = 'pending_category_id'

function getCategory(id) {
  return data.categories.find((item) => item.id === id)
}

function formatHeat(value) {
  if (value >= 10000) {
    return (value / 10000).toFixed(value >= 100000 ? 1 : 2).replace(/\.0$/, '') + '万'
  }
  return String(value)
}

function getQuestionById(id) {
  return data.questions.find((item) => item.id === id)
}

function hasQuestionResult(id) {
  return Boolean(id && data.questionResults[id])
}

function getAvailableQuestions() {
  return data.questions.filter((item) => hasQuestionResult(item.id))
}

function getDefaultQuestionId(keyword) {
  const text = (keyword || '').trim()
  if (!text) return 'q_001'
  if (/夜醒|睡眠|入睡|哄睡/.test(text)) return 'q_002'
  if (/辅食|米粉|吃什么|第一口/.test(text)) return 'q_003'
  if (/发烧|发热|洗澡|退烧|体温/.test(text)) return 'q_001'
  const matched = data.questions.find((item) => item.title.indexOf(text) > -1 || text.indexOf(item.shortTitle) > -1)
  return matched ? matched.id : ''
}

function searchQuestions(keyword) {
  const text = (keyword || '').trim()
  const availableQuestions = getAvailableQuestions()
  if (!text) return availableQuestions.slice(0, 5)
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
  result.authoritySources = result.authoritySourceIds.map((sourceId) => {
    return data.authoritySources.find((source) => source.id === sourceId)
  }).filter(Boolean)
  result.relatedQuestionItems = result.relatedQuestions.map(getQuestionById).filter(Boolean)
  return result
}

function getAuthoritySources(type, questionId) {
  return data.authoritySources.filter((item) => {
    const typeMatched = !type || type === 'all' || item.type === type
    const questionMatched = !questionId || item.questionIds.indexOf(questionId) > -1
    return typeMatched && questionMatched
  })
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
  categories: data.categories,
  questions: data.questions,
  profile: data.profile,
  formatHeat,
  getCategory,
  getQuestionById,
  hasQuestionResult,
  getAvailableQuestions,
  getDefaultQuestionId,
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
