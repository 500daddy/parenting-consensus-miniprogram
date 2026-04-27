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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function assertExists(relativePath) {
  const fullPath = path.join(miniprogramRoot, relativePath)
  if (!fs.existsSync(fullPath)) {
    missing.push(relativePath)
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

if (missing.length) {
  console.error(`Missing files:\n${missing.join('\n')}`)
  process.exit(1)
}

console.log('project sanity ok')
