const fs = require('fs')
const path = require('path')

global.App = (config) => config
global.Page = (config) => config
global.Component = (config) => config
global.wx = {
  navigateTo() {},
  switchTab() {},
  redirectTo() {},
  showToast() {},
  showModal() {},
  getStorageSync() {
    return []
  },
  setStorageSync() {},
  removeStorageSync() {}
}

const root = path.resolve(__dirname, '..')
const miniprogramRoot = path.join(root, 'miniprogram')
const missing = []
const invariantErrors = []

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function assertExists(relativePath) {
  const fullPath = path.join(miniprogramRoot, relativePath)
  if (!fs.existsSync(fullPath)) {
    missing.push(relativePath)
  }
}

function assertInvariant(condition, message) {
  if (!condition) {
    invariantErrors.push(message)
  }
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath)
    } else if (fullPath.endsWith('.json')) {
      readJson(fullPath)
    } else if (fullPath.endsWith('.js')) {
      require(fullPath)
    }
  }
}

const app = readJson(path.join(miniprogramRoot, 'app.json'))

for (const page of app.pages) {
  for (const ext of ['js', 'json', 'wxml', 'wxss']) {
    assertExists(`${page}.${ext}`)
  }
}

for (const item of app.tabBar.list) {
  assertExists(item.iconPath)
  assertExists(item.selectedIconPath)
}

for (const ext of ['js', 'json', 'wxml', 'wxss']) {
  assertExists(`custom-tab-bar/index.${ext}`)
}

walk(miniprogramRoot)

const data = require(path.join(miniprogramRoot, 'mock/data.js'))
const service = require(path.join(miniprogramRoot, 'utils/mockService.js'))
const categoryIds = new Set(data.categories.map((item) => item.id))
const questionIds = new Set(data.questions.map((item) => item.id))
const authorityIds = new Set(data.authoritySources.map((item) => item.id))

for (const question of data.questions) {
  assertInvariant(categoryIds.has(question.categoryId), `Question ${question.id} uses unknown category ${question.categoryId}`)
}

for (const id of Object.keys(data.questionResults)) {
  const result = service.getQuestionResult({ id })
  const rawResult = data.questionResults[id]
  assertInvariant(questionIds.has(id), `Question result ${id} has no matching question`)
  assertInvariant(rawResult.questionId === id, `Question result ${id} has mismatched questionId ${rawResult.questionId}`)
  assertInvariant(categoryIds.has(rawResult.categoryId), `Question result ${id} uses unknown category ${rawResult.categoryId}`)
  assertInvariant(rawResult.viewpoints.reduce((sum, item) => sum + item.percentage, 0) === 100, `Question result ${id} viewpoint percentages do not sum to 100`)
  assertInvariant(rawResult.viewpoints.every((item) => item.color && /^#[0-9A-Fa-f]{6}$/.test(item.color)), `Question result ${id} has invalid viewpoint color`)
  for (const sourceId of rawResult.authoritySourceIds) {
    assertInvariant(authorityIds.has(sourceId), `Question result ${id} references missing authority source ${sourceId}`)
  }
  assertInvariant(Boolean(result), `Missing service result for ${id}`)
  if (result) {
    for (const item of result.relatedQuestionItems) {
      assertInvariant(service.hasQuestionResult(item.id), `Related question ${item.id} from ${id} has no result`)
    }
    for (const source of result.authoritySources) {
      assertInvariant(source.questionIds.indexOf(id) > -1, `Authority source ${source.id} is not linked to ${id}`)
    }
  }
}

for (const source of data.authoritySources) {
  for (const questionId of source.questionIds) {
    assertInvariant(questionIds.has(questionId), `Authority source ${source.id} references missing question ${questionId}`)
  }
}

const keywordExpectations = [
  ['宝宝发烧能洗澡吗', 'q_001'],
  ['宝宝夜醒频繁怎么办', 'q_002'],
  ['第一口辅食吃什么', 'q_003'],
  ['宝宝咳嗽有痰', 'q_004'],
  ['挑食不爱吃蔬菜', 'q_005'],
  ['疫苗后低烧', 'q_006']
]

for (const [keyword, expectedId] of keywordExpectations) {
  const actualId = service.getDefaultQuestionId(keyword)
  assertInvariant(actualId === expectedId, `Keyword "${keyword}" maps to ${actualId || 'none'} instead of ${expectedId}`)
  assertInvariant(service.searchQuestions(keyword).some((item) => item.id === expectedId), `Search results for "${keyword}" do not include ${expectedId}`)
}

for (const category of data.categories) {
  for (const question of service.getQuestionsByCategory(category.id)) {
    assertInvariant(service.hasQuestionResult(question.id), `Category ${category.id} exposes unavailable question ${question.id}`)
  }
}

if (missing.length) {
  console.error(`Missing files:\n${missing.join('\n')}`)
  process.exit(1)
}

if (invariantErrors.length) {
  console.error(`Data invariant errors:\n${invariantErrors.join('\n')}`)
  process.exit(1)
}

console.log('project sanity ok')
