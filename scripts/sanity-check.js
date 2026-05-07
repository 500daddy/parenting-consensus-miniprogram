const fs = require('fs')
const path = require('path')

const capturedComponents = []
const capturedPages = []
const mockStorage = {}

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
  getStorageSync(key) {
    return mockStorage[key]
  },
  setStorageSync(key, value) {
    mockStorage[key] = value
  },
  removeStorageSync(key) {
    delete mockStorage[key]
  },
  getUserProfile(options) {
    if (options && typeof options.success === 'function') {
      options.success({ userInfo: { nickName: '测试家长', avatarUrl: '' } })
    }
  }
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
const privateProjectConfigPath = path.join(root, 'project.private.config.json')
const privateProjectConfig = fs.existsSync(privateProjectConfigPath) ? readJson(privateProjectConfigPath) : null
const brandName = '养娃新手村'

assertInvariant(projectConfig.miniprogramRoot === 'miniprogram/', 'project.config.json miniprogramRoot should be miniprogram/')
assertInvariant(projectConfig.description.indexOf(brandName) > -1, 'project.config.json description should use the current brand name')
assertInvariant(projectConfig.projectname === brandName, 'project.config.json projectname should use the current brand name')
assertInvariant(projectConfig.setting.urlCheck === true, 'project.config.json urlCheck should be enabled before upload')
assertInvariant(projectConfig.setting.minified === true, 'project.config.json minified should be enabled before upload')
assertInvariant(projectConfig.setting.uploadWithSourceMap === true, 'project.config.json should keep source maps during seed-user MVP debugging')
if (privateProjectConfig && privateProjectConfig.setting) {
  assertInvariant(privateProjectConfig.setting.urlCheck === true, 'project.private.config.json urlCheck should match upload readiness')
}
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
const toolService = require(path.join(miniprogramRoot, 'utils/toolService.js'))
const resultPageSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/question/result.wxml'), 'utf8')
const resultLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/question/result.js'), 'utf8')
const homePageSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/index/index.wxml'), 'utf8')
const homeLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/index/index.js'), 'utf8')
const searchLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/search/index.js'), 'utf8')
const searchPageSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/search/index.wxml'), 'utf8')
const profilePageSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/profile/index.wxml'), 'utf8')
const profileLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/profile/index.js'), 'utf8')
const authorityPageSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/authority/index.wxml'), 'utf8')
const authorityLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'pages/authority/index.js'), 'utf8')
const customTabBarSource = fs.readFileSync(path.join(miniprogramRoot, 'custom-tab-bar/index.wxml'), 'utf8')
const customTabBarLogicSource = fs.readFileSync(path.join(miniprogramRoot, 'custom-tab-bar/index.js'), 'utf8')
const categoryIds = new Set(data.categories.map((item) => item.id))
const questionIds = new Set(data.questions.map((item) => item.id))
const authorityIds = new Set(data.authoritySources.map((item) => item.id))
const authorityTypes = new Set(['doctor', 'guide', 'wiki', 'creator'])
const trustLevels = new Set(['high', 'medium'])
const reasonTones = new Set(['green', 'orange', 'red', 'purple'])

assertInvariant(Array.isArray(data.communityPosts), 'communityPosts should remain as a reserved array boundary')
assertInvariant(typeof service.getGlossaryEntry('生理性溢奶') === 'object', 'Glossary should explain physiological spit-up')
assertInvariant(typeof service.getGlossaryEntry('喷射状呕吐') === 'object', 'Glossary should explain projectile vomiting')
assertInvariant(service.buildGlossarySegments('区分生理性溢奶与喷射状呕吐').some((item) => item.term === '生理性溢奶'), 'Glossary segmentation should mark physiological spit-up')
assertInvariant(homePageSource.indexOf('glossary-term') > -1, 'Home announcement should underline glossary terms')
assertInvariant(homeLogicSource.indexOf('conclusionSegments') > -1, 'Home page should pre-split glossary terms')
assertInvariant(!/goQuestion\s*\([^)]*\)\s*\{[\s\S]*?addHistory/.test(searchLogicSource), 'Browsing recommended questions should not be recorded as search history')
assertInvariant(resultPageSource.indexOf('glossary-term') > -1, 'Result conclusion should underline glossary terms')
assertInvariant(resultLogicSource.indexOf('conclusionSegments') > -1, 'Result page should pre-split glossary terms')
assertInvariant(homePageSource.indexOf('glossaryPopup') > -1 && resultPageSource.indexOf('glossaryPopup') > -1, 'Glossary popups should be available on home and result pages')
assertInvariant(resultPageSource.indexOf('多数观点') > -1, 'Result page should avoid presenting the consensus copy as an absolute answer')
assertInvariant(resultPageSource.indexOf('judgement-pill') > -1, 'Result page should show a primary judgement label near the current question')
assertInvariant(resultPageSource.indexOf('bindtap="changeQuestion"') > -1, 'Result page change button should switch to another question in place')
assertInvariant(resultPageSource.indexOf('wx:if="{{!noResult}}" class="change-btn"') > -1, 'Result page should hide change button when there is no search result')
assertInvariant(resultLogicSource.indexOf('changeQuestion()') > -1 && resultLogicSource.indexOf('loadResult({ id: nextQuestion.id })') > -1, 'Result page should load the next question without leaving the page')
assertInvariant(resultLogicSource.indexOf('slice(0, 4)') > -1, 'Result no-match page should show four fallback questions')
assertInvariant(resultPageSource.indexOf('提交这个问题') > -1 && resultLogicSource.indexOf('addPendingQuestion') > -1, 'Result empty state should let users submit missing questions')
assertInvariant(searchPageSource.indexOf('提交这个问题') > -1 && searchLogicSource.indexOf('addPendingQuestion') > -1, 'Search empty state should collect missing questions')
assertInvariant(resultLogicSource.indexOf('validatePendingQuestion') > -1 && searchLogicSource.indexOf('validatePendingQuestion') > -1, 'Missing-question submission should validate question quality before storing')
assertInvariant(searchPageSource.indexOf('宝宝夜里频繁醒怎么办') > -1 && resultPageSource.indexOf('宝宝夜里频繁醒怎么办') > -1, 'Missing-question empty states should show a complete-question example')
assertInvariant(searchPageSource.indexOf('scroll-view class="category-scroll"') === -1, 'Search categories should be fully visible instead of hidden behind horizontal scroll')
assertInvariant(resultLogicSource.indexOf('不是实时联网搜索结果') > -1, 'Result page should disclose that answers are not live web search results')
assertInvariant(resultPageSource.indexOf('不同观点在说什么') > -1, 'Result page should explain viewpoint groups, not only show percentages')
assertInvariant(resultPageSource.indexOf('作为补充参考') > -1, 'Result page should demote viewpoint groups below the primary answer')
assertInvariant(resultPageSource.indexOf('健康提醒') > -1, 'Result page should keep health/risk reminders near the answer')
assertInvariant(resultLogicSource.indexOf('按宝宝档案提醒') > -1, 'Result page should expose local baby-profile reminders after login')
assertInvariant(resultLogicSource.indexOf('完善宝宝档案') > -1 && resultPageSource.indexOf('bindtap="goProfile"') > -1, 'Result page should guide users to complete missing baby profile fields')
assertInvariant(resultPageSource.indexOf('内容说明') > -1, 'Result page should keep the MVP content boundary as a lower-priority note')
assertInvariant(resultPageSource.indexOf('更多内容') === -1 && resultLogicSource.indexOf('goAuthority') === -1, 'Result page should keep authority content inline instead of pushing users to a secondary page')
assertInvariant(profilePageSource.indexOf('隐私说明') > -1, 'Profile page should expose the MVP privacy explanation')
assertInvariant(profilePageSource.indexOf('审核备注') > -1, 'Profile page should expose review-note guidance')
assertInvariant(profilePageSource.indexOf('内测反馈') > -1, 'Profile page should provide a seed-user feedback path')
assertInvariant(profilePageSource.indexOf('bindtap="goFavorites"') > -1 && profilePageSource.indexOf('bindtap="goHistory"') > -1, 'Profile stats should navigate to favorites and history')
assertInvariant(profilePageSource.indexOf('帮我们补问题') > -1 && profilePageSource.indexOf('建议') > -1, 'Profile page should expose the pending-question pool with user-facing copy')
assertInvariant(profileLogicSource.indexOf('getPendingQuestions') > -1, 'Profile page should read pending-question count from local storage')
assertInvariant(profileLogicSource.indexOf('正式上线后会接后台') > -1, 'Pending-question pool should explain the current local-only backend boundary')
assertInvariant(profileLogicSource.indexOf('clearDoctorVisitRecords') > -1, 'Logout should clear local baby-related doctor visit records')
assertInvariant(profileLogicSource.indexOf('已退出并清空档案') > -1, 'Logout should tell users the baby profile was cleared')
assertInvariant(profileLogicSource.indexOf('不上传宝宝档案') > -1, 'Privacy modal should state local-only profile storage')
assertInvariant(profileLogicSource.indexOf('无后台请求、无支付、无客服系统') > -1, 'Review-note modal should state MVP backend/payment/support boundaries')
assertInvariant(customTabBarLogicSource.indexOf('hidden: false') > -1, 'Custom tabBar should support temporary hiding')
assertInvariant(customTabBarSource.indexOf('wx:if="{{!hidden}}"') > -1, 'Custom tabBar should be removable while native pickers are open')
assertInvariant(profileLogicSource.indexOf('setCustomTabBarHidden(true)') > -1, 'Profile pickers should hide the custom tabBar before opening')
assertInvariant(profileLogicSource.indexOf('setCustomTabBarHidden(false)') > -1, 'Profile pickers should restore the custom tabBar after closing')
assertInvariant(profilePageSource.indexOf('bindcancel="onProfilePickerClose"') > -1, 'Profile pickers should restore the custom tabBar when iOS picker is cancelled')
assertInvariant(authorityPageSource.indexOf('home-illus') === -1, 'Authority page should avoid decorative hero art that competes with content')
assertInvariant(authorityLogicSource.indexOf('relatedQuestionItems.slice(0, 2)') > -1, 'Authority page should show two related question cards')
assertInvariant(authorityPageSource.indexOf('related-action') > -1 && authorityPageSource.indexOf('查看') > -1, 'Authority related cards should use a clear action button')

for (const iconPath of Object.values(service.actionIconPaths)) {
  assertMiniProgramAsset(iconPath)
}

for (const iconPath of Object.values(service.profileIconPaths)) {
  assertMiniProgramAsset(iconPath)
}

for (const category of service.categories) {
  assertMiniProgramAsset(category.iconPath)
  assertInvariant(category.iconPath !== service.actionIconPaths.question, `Category ${category.id} should use a matched category icon`)
}

for (const question of service.getAvailableQuestions()) {
  assertMiniProgramAsset(question.tagIconPath)
  assertInvariant(question.tagIconPath !== service.actionIconPaths.question, `Question ${question.id} should use a matched question icon`)
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
const feverThresholdResult = service.getQuestionResult({ id: 'q_001' })
assertInvariant(feverThresholdResult.conclusion.indexOf('38.0°C') > -1, 'Fever threshold answer should directly mention 38.0°C')
assertInvariant(service.getQuestionResult({ id: 'q_011' }).conclusion.indexOf('2-3 小时') > -1, 'Newborn feeding interval should give a practical 2-3 hour reference')
assertInvariant(service.getQuestionResult({ id: 'q_012' }).conclusion.indexOf('固定毫升数') > -1, 'Daily milk intake answer should explain why fixed ml numbers are not enough')
assertInvariant(service.getQuestionResult({ id: 'q_014' }).conclusion.indexOf('喂后拍嗝') > -1, 'Gas and colic answer should provide ordered home-care actions')
assertInvariant(service.getQuestionResult({ id: 'q_041' }).conclusion.indexOf('复核测量') > -1, 'Growth concern answer should start with re-measuring and growth-curve records')
assertInvariant(service.getQuestionResult({ id: 'q_043' }).conclusion.indexOf('6 个月') > -1 && service.getQuestionResult({ id: 'q_043' }).conclusion.indexOf('18 个月') > -1, 'Development milestone answer should include practical month anchors')
assertInvariant(service.getQuestionResult({ id: 'q_047' }).conclusion.indexOf('饿不饿') > -1, 'Crying answer should provide an ordered cause checklist')
const calibratedAnswerIds = [
  'q_002', 'q_003', 'q_004', 'q_005', 'q_006', 'q_008',
  'q_011', 'q_012', 'q_013', 'q_014', 'q_017', 'q_018',
  'q_019', 'q_020', 'q_021', 'q_024', 'q_027', 'q_028',
  'q_030', 'q_034', 'q_039', 'q_041', 'q_043', 'q_047', 'q_050'
]
const plannerPhrases = ['展示', '解释不同', '按条件判断', '匹配当前场景', '先看宝宝的精神、呼吸、进食饮水和症状变化，再决定居家观察、咨询医生或就医']
for (const id of calibratedAnswerIds) {
  const result = service.getQuestionResult({ id })
  assertInvariant(Boolean(result), `Calibrated answer ${id} should be available`)
  if (result) {
    const resultCopy = [
      result.conclusion,
      result.mainstreamConsensus,
      result.authorityView,
      ...(result.viewpoints || []).map((item) => `${item.title} ${item.summary}`),
      ...(result.reasons || []).map((item) => `${item.title} ${item.description}`)
    ].join(' ')
    plannerPhrases.forEach((phrase) => {
      assertInvariant(resultCopy.indexOf(phrase) === -1, `Calibrated answer ${id} still contains planner phrase "${phrase}"`)
    })
    assertInvariant(/^主流共识认为：/.test(result.conclusion), `Calibrated answer ${id} should keep the consensus prefix`)
    assertInvariant(result.conclusion.length >= 40, `Calibrated answer ${id} conclusion is too thin`)
    assertInvariant(result.authorityView.indexOf('儿科科普通常') === -1, `Calibrated answer ${id} has awkward authority copy`)
  }
}

const loggedInProfile = service.loginProfile({ nickName: '测试家长' })
assertInvariant(loggedInProfile.isLoggedIn === true, 'Profile login should mark user as logged in')
service.clearPendingQuestions()
assertInvariant(service.validatePendingQuestion('发烧').valid === false, 'Pending question validation should reject broad one-word symptoms')
assertInvariant(service.validatePendingQuestion('宝宝夜里频繁醒怎么办？').valid === true, 'Pending question validation should accept complete parenting questions')
assertInvariant(service.addPendingQuestion('发烧', 'sanity').valid === false, 'Pending question pool should not store broad one-word symptoms')
service.addPendingQuestion('宝宝总是揉眼睛怎么办', 'sanity')
service.addPendingQuestion('宝宝总是揉眼睛怎么办', 'sanity')
const pendingQuestions = service.getPendingQuestions()
assertInvariant(pendingQuestions.length === 1 && pendingQuestions[0].hitCount === 2, 'Pending question pool should de-duplicate repeated missing searches')
service.clearPendingQuestions()
assertInvariant(fs.existsSync(path.join(root, 'docs/question-bank-expansion-2026-05-06.md')), 'Question-bank expansion plan should be documented')
assertInvariant(fs.existsSync(path.join(root, 'docs/pending-question-backend-contract.md')), 'Pending-question backend contract should be documented')
const savedProfile = service.saveBabyProfile({ name: '小豆', age: '9个月', gender: '女宝', allergy: '蛋白过敏' })
assertInvariant(savedProfile.baby.name === '小豆' && savedProfile.baby.age === '9个月', 'Baby profile should save editable fields')
const storedProfile = service.getProfile()
assertInvariant(storedProfile.isLoggedIn === true && storedProfile.baby.allergy === '蛋白过敏', 'Baby profile should persist in local storage')
toolService.saveDoctorVisitRecord({ babyName: '小豆', babyAge: '9个月', symptoms: '发烧' })
const loggedOutProfile = service.logoutProfile()
toolService.clearDoctorVisitRecords()
assertInvariant(loggedOutProfile.isLoggedIn === false && loggedOutProfile.baby.name === '未设置' && loggedOutProfile.baby.age === '未设置', 'Logout should return a logged-out empty baby profile')
assertInvariant(service.getProfile().isLoggedIn === false && service.getProfile().baby.name === '未设置', 'Logged-out profile should stay empty in local storage')
assertInvariant(toolService.getDoctorVisitRecords().length === 0, 'Logout privacy path should clear doctor visit records')

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
