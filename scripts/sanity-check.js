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

for (const id of Object.keys(data.questionResults)) {
  const result = service.getQuestionResult({ id })
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
