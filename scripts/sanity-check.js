const fs = require('fs')
const path = require('path')

const capturedComponents = []
const capturedPages = []

global.App = (config) => config
global.Page = (config) => {
  capturedPages.push(config)
  return config
}
global.Component = (config) => {
  capturedComponents.push(config)
  return config
}
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

function readPngSize(relativePath) {
  const buffer = fs.readFileSync(path.join(miniprogramRoot, relativePath))
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  }
}

function assertExists(relativePath) {
  const fullPath = path.join(miniprogramRoot, relativePath)
  if (!fs.existsSync(fullPath)) {
    missing.push(relativePath)
  }
}

function assertMiniProgramAsset(assetPath) {
  if (!assetPath || assetPath[0] !== '/') {
    invariantErrors.push(`Invalid miniprogram asset path: ${assetPath || 'empty'}`)
    return
  }
  assertExists(assetPath.replace(/^\//, ''))
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
const projectConfig = readJson(path.join(root, 'project.config.json'))
const brandName = '养娃新手村'

assertInvariant(projectConfig.miniprogramRoot === 'miniprogram/', 'project.config.json miniprogramRoot should be miniprogram/')
assertInvariant(projectConfig.description.indexOf(brandName) > -1, 'project.config.json description should use the current brand name')
assertInvariant(projectConfig.projectname === brandName, 'project.config.json projectname should use the current brand name')
assertInvariant(app.window.navigationBarTitleText === brandName, 'app.json window title should use the current brand name')
assertInvariant(app.tabBar.custom === true, 'app.json should keep the custom tabBar enabled')
assertInvariant(app.tabBar.list.length === 4, 'app.json tabBar should expose exactly 4 MVP tabs')
assertInvariant(app.tabBar.list.some((item) => item.pagePath === 'pages/favorites/index' && item.text === '收藏'), 'Favorites should be promoted to a top-level tab')
assertInvariant(app.tabBar.list.every((item) => item.pagePath !== 'pages/category/index'), 'Category should not duplicate Q&A as a top-level tab')
assertInvariant(app.tabBar.list.every((item) => item.pagePath.indexOf('community') === -1 && item.text !== '社区'), 'Community tab should remain hidden in MVP')
assertInvariant(app.pages.every((page) => page.indexOf('community') === -1), 'Community page should not be registered in MVP')
assertExists('assets/hero/village-hero.png')
const heroSize = readPngSize('assets/hero/village-hero.png')
assertInvariant(heroSize.width === 690 && heroSize.height === 300, 'village hero image should be 690x300')

for (const page of ['pages/search/index', 'pages/favorites/index', 'pages/profile/index']) {
  const pageConfig = readJson(path.join(miniprogramRoot, `${page}.json`))
  assertInvariant(pageConfig.navigationBarTitleText === '', `${page}.json should keep tab page title hidden`)
}

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

for (const page of capturedPages) {
  const context = Object.assign({}, page, {
    data: Object.assign({}, page.data || {}),
    setData(data) {
      this.data = Object.assign({}, this.data, data)
    },
    getTabBar() {
      return { setData() {} }
    }
  })
  if (typeof page.onLoad === 'function') {
    page.onLoad.call(context, {})
  }
  if (typeof page.onShow === 'function') {
    page.onShow.call(context)
  }
}

const customTabBar = capturedComponents.find((config) => config.data && Array.isArray(config.data.list))
assertInvariant(Boolean(customTabBar), 'Custom tabBar component config was not loaded')
if (customTabBar) {
  assertInvariant(customTabBar.data.list.length === app.tabBar.list.length, 'Custom tabBar item count should match app.json')
  app.tabBar.list.forEach((item, index) => {
    const customItem = customTabBar.data.list[index]
    assertInvariant(Boolean(customItem), `Custom tabBar missing item at index ${index}`)
    if (customItem) {
      assertInvariant(customItem.pagePath.replace(/^\//, '') === item.pagePath, `Custom tabBar pagePath mismatch at index ${index}`)
      assertInvariant(customItem.text === item.text, `Custom tabBar text mismatch at index ${index}`)
    }
  })
}

const data = require(path.join(miniprogramRoot, 'mock/data.js'))
const service = require(path.join(miniprogramRoot, 'utils/mockService.js'))
const categoryIds = new Set(data.categories.map((item) => item.id))
const questionIds = new Set(data.questions.map((item) => item.id))
const authorityIds = new Set(data.authoritySources.map((item) => item.id))
const authorityTypes = new Set(['doctor', 'guide', 'wiki', 'creator'])
const trustLevels = new Set(['high', 'medium'])
const reasonTones = new Set(['green', 'orange', 'red', 'purple'])

assertInvariant(Array.isArray(data.communityPosts), 'communityPosts should remain as a reserved array boundary')

for (const iconPath of Object.values(service.actionIconPaths)) {
  assertMiniProgramAsset(iconPath)
}

for (const iconPath of Object.values(service.profileIconPaths)) {
  assertMiniProgramAsset(iconPath)
}

for (const category of service.categories) {
  assertMiniProgramAsset(category.iconPath)
}

for (const question of service.getAvailableQuestions()) {
  assertMiniProgramAsset(question.tagIconPath)
}

for (const source of service.getAuthoritySources('all')) {
  assertMiniProgramAsset(source.iconPath)
}

for (const question of data.questions) {
  assertInvariant(categoryIds.has(question.categoryId), `Question ${question.id} uses unknown category ${question.categoryId}`)
}

for (const id of Object.keys(data.questionResults)) {
  const result = service.getQuestionResult({ id })
  const rawResult = data.questionResults[id]
  assertInvariant(questionIds.has(id), `Question result ${id} has no matching question`)
  assertInvariant(rawResult.questionId === id, `Question result ${id} has mismatched questionId ${rawResult.questionId}`)
  assertInvariant(categoryIds.has(rawResult.categoryId), `Question result ${id} uses unknown category ${rawResult.categoryId}`)
  assertInvariant(rawResult.viewpoints.length === 3, `Question result ${id} should include exactly 3 viewpoints`)
  assertInvariant(rawResult.reasons.length === 4, `Question result ${id} should include exactly 4 reasons`)
  assertInvariant(rawResult.warnings.length === 4, `Question result ${id} should include exactly 4 warnings`)
  assertInvariant(rawResult.authoritySourceIds.length >= 2, `Question result ${id} should include at least 2 authority sources`)
  assertInvariant(rawResult.viewpoints.reduce((sum, item) => sum + item.percentage, 0) === 100, `Question result ${id} viewpoint percentages do not sum to 100`)
  assertInvariant(rawResult.viewpoints.every((item) => item.color && /^#[0-9A-Fa-f]{6}$/.test(item.color)), `Question result ${id} has invalid viewpoint color`)
  assertInvariant(rawResult.reasons.every((item) => reasonTones.has(item.tone)), `Question result ${id} has invalid reason tone`)
  assertInvariant(Boolean(rawResult.disclaimer), `Question result ${id} should include disclaimer`)
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
  assertInvariant(authorityTypes.has(source.type), `Authority source ${source.id} has invalid type ${source.type}`)
  assertInvariant(trustLevels.has(source.trustLevel), `Authority source ${source.id} has invalid trustLevel ${source.trustLevel}`)
  for (const questionId of source.questionIds) {
    assertInvariant(questionIds.has(questionId), `Authority source ${source.id} references missing question ${questionId}`)
    assertInvariant(service.hasQuestionResult(questionId), `Authority source ${source.id} references unavailable question ${questionId}`)
  }
}

const keywordExpectations = [
  ['宝宝发烧到多少度', 'q_001'],
  ['宝宝发烧能洗澡吗', 'q_002'],
  ['宝宝夜醒频繁怎么办', 'q_027'],
  ['第一口辅食吃什么', 'q_020'],
  ['宝宝咳嗽有痰', 'q_008'],
  ['疫苗后发烧', 'q_039'],
  ['高热能洗澡吗', 'q_002'],
  ['退烧药什么时候吃', 'q_004']
]

for (const [keyword, expectedId] of keywordExpectations) {
  const actualId = service.getDefaultQuestionId(keyword)
  assertInvariant(actualId === expectedId, `Keyword "${keyword}" maps to ${actualId || 'none'} instead of ${expectedId}`)
  assertInvariant(service.searchQuestions(keyword).some((item) => item.id === expectedId), `Search results for "${keyword}" do not include ${expectedId}`)
}

const todayQuestionId = service.getDailyQuestionId(new Date(2026, 3, 30))
assertInvariant(service.hasQuestionResult(todayQuestionId), `Daily consensus question ${todayQuestionId || 'none'} should have a result`)
assertInvariant(Boolean(service.getTodayQuestionResult(new Date(2026, 3, 30))), 'Today consensus result should be available')

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
