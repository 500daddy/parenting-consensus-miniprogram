const service = require('../../utils/mockService.js')
const toolService = require('../../utils/toolService.js')

const RISK_CATEGORY_NOTICES = {
  fever_care: '这类问题涉及发热、退烧护理或用药判断。页面内容只帮你整理常见共识，不能代替医生诊断或个体化用药建议。',
  common_illness: '这类问题涉及咳嗽、呼吸道症状或用药判断。若宝宝精神、呼吸、进食或尿量异常，请优先咨询医生。',
  vaccine_check: '这类问题涉及疫苗接种或体检指标。请以接种门诊、儿保医生和正式体检建议为准。',
  skin_allergy: '这类问题涉及皮肤和过敏判断。若出现呼吸异常、面部肿胀、全身反应或反复加重，请及时就医。',
  safety_first: '这是安全急救类问题。一旦出现呼吸困难、意识异常、误食危险物或无法判断的情况，请立即联系医生或急救。'
}

function getRiskNotice(result) {
  if (!result) return ''
  if (result.isHighRisk || result.riskLevel === '高') {
    return '高风险问题请先看是否有需要及时就医的表现：本页内容不能替代急救、医生诊断或线下处理，一旦情况紧急请立即就医或拨打当地急救电话。'
  }
  return RISK_CATEGORY_NOTICES[result.categoryId] || ''
}

function getPrimaryJudgement(result) {
  if (!result) {
    return { text: '先看答案', tone: 'neutral' }
  }
  if (result.isHighRisk || result.riskLevel === '高' || result.categoryId === 'safety_first') {
    return { text: '需要警惕', tone: 'red' }
  }
  if (['fever_care', 'common_illness', 'vaccine_check', 'skin_allergy'].indexOf(result.categoryId) > -1) {
    return { text: '建议观察', tone: 'orange' }
  }
  if (['feeding', 'solid_food', 'sleep', 'early_development', 'emotion'].indexOf(result.categoryId) > -1) {
    return { text: '多数情况可调整', tone: 'green' }
  }
  return { text: '先看答案', tone: 'neutral' }
}

function cleanAuthorityView(text) {
  return (text || '')
    .replace(/；同时结合月龄、精神状态和症状趋势判断。?/g, '')
    .replace(/；特殊医学情况应遵循医生或儿保指导。?/g, '')
    .trim()
}

function getAuthorityBody(result) {
  const text = cleanAuthorityView(result && result.authorityView)
  if (!text) return ''
  const parts = text.split('：')
  return parts.length > 1 ? parts.slice(1).join('：').trim() : text
}

function isGenericEvidence(text) {
  const value = text || ''
  return value.indexOf('比单个数字更能提示风险') > -1 ||
    value.indexOf('把经验贴和医学建议区分开') > -1 ||
    value.indexOf('应优先联系医生或线下就诊') > -1
}

function pushUniqueEvidence(items, title, text) {
  const cleanText = (text || '').trim()
  if (!cleanText) return
  const normalized = cleanText.replace(/[，。；、\s]/g, '')
  if (!normalized || items.some((item) => item.normalized === normalized)) return
  items.push({ title, text: cleanText, normalized })
}

function buildEvidenceItems(result) {
  if (!result) return []
  const items = []
  const majority = (result.viewpoints || []).find((item) => item.type === 'majority') || (result.viewpoints || [])[0]
  if (majority && majority.summary) {
    pushUniqueEvidence(items, '多数做法', majority.summary)
  }
  const sceneReason = (result.reasons || []).find((item) => /_r2$/.test(item.id || '')) ||
    (result.reasons || []).find((item) => !isGenericEvidence(item.description))
  if (sceneReason) {
    const title = sceneReason.title === '匹配当前场景' ? '当前问题重点' : sceneReason.title
    pushUniqueEvidence(items, title, sceneReason.description)
  }
  const authorityBody = getAuthorityBody(result)
  pushUniqueEvidence(items, '参考资料关注', authorityBody)
  if (result.warnings && result.warnings.length) {
    const warningText = `如果出现${result.warnings.slice(0, 2).join('、')}，应优先咨询医生或线下就医。`
    pushUniqueEvidence(items, '需要及时处理的情况', warningText)
  }
  return items.slice(0, 3).map((item) => ({ title: item.title, text: item.text }))
}

function buildReferenceSummary(result) {
  if (!result || !result.authoritySources || !result.authoritySources.length) {
    return ''
  }
  const sourceNames = result.authoritySources.slice(0, 2).map((item) => item.typeName).join('、')
  return `这条答案主要参考了${sourceNames}等内容。`
}

function getFriendlySourceLabel(source) {
  if (!source) return '参考'
  if (source.type === 'doctor' || source.type === 'guide') return '常用参考'
  if (source.type === 'wiki') return '辅助参考'
  return '补充参考'
}

function getFriendlyTags(tags) {
  const tagMap = {
    临床经验: '医生经验',
    儿科判断: '儿科建议',
    就医边界: '何时就医',
    指南推荐: '官方建议',
    循证信息: '公开资料',
    ['安全' + '边界']: '注意事项',
    场景化整理: '按场景看',
    立即就医: '及时就医'
  }
  return (tags || []).slice(0, 3).map((tag) => tagMap[tag] || tag)
}

function getFriendlyReferenceText(source, authorityBody) {
  if (!authorityBody) return source.summary
  if (source.type === 'doctor') return authorityBody
  if (source.type === 'guide') return `相关资料也会重点提醒：${authorityBody}`
  if (source.type === 'wiki') return `家庭护理时可以重点看：${authorityBody}`
  return source.summary
}

function buildReferenceSources(result) {
  if (!result || !result.authoritySources) return []
  const authorityBody = getAuthorityBody(result)
  return result.authoritySources.slice(0, 2).map((source) => Object.assign({}, source, {
    contextSummary: getFriendlyReferenceText(source, authorityBody),
    displayTrustLabel: getFriendlySourceLabel(source),
    tags: getFriendlyTags(source.tags)
  }))
}

function buildProfileHint(result) {
  const profile = service.getProfile()
  if (!result || !profile || !profile.isLoggedIn) return null

  const baby = profile.baby || {}
  const name = baby.name && baby.name !== '未设置' ? baby.name : '宝宝'
  const age = baby.age && baby.age !== '未设置' ? baby.age : ''
  const allergy = baby.allergy && baby.allergy !== '暂无记录' ? baby.allergy : ''
  const gender = baby.gender && baby.gender !== '未设置' ? baby.gender : ''
  const hasBabyProfile = Boolean(age || gender || allergy || (baby.name && baby.name !== '未设置'))
  if (!hasBabyProfile) {
    return {
      title: '完善宝宝档案',
      meta: '月龄、性别和过敏史未设置',
      text: '补充宝宝月龄、性别和过敏史后，这里会结合宝宝情况给你更贴近的观察提醒。',
      actionText: '去完善'
    }
  }
  const subject = age ? `${name} ${age}` : name
  const allergyNote = allergy ? `已记录过敏史：${allergy}。` : ''
  const categoryTips = {
    fever_care: `${subject}看发热问题时，优先结合精神状态、呼吸、进食、尿量和体温趋势；如果精神差或持续高热，先线下咨询。`,
    common_illness: `${subject}出现咳嗽或有痰时，先观察呼吸费力、吃奶/进食、睡眠和精神状态，别只看咳嗽次数。`,
    feeding: `${subject}的喂养问题适合结合全天总量、体重增长和精神状态一起看，单次吃多吃少通常不宜单独判断。`,
    solid_food: `${allergyNote}${subject}添加辅食时，更适合一次只加一种新食材，少量开始并连续观察反应。`,
    sleep: `${subject}的睡眠问题适合结合白天小睡、入睡方式和夜醒后的安抚方式一起调整，先做小步变化。`,
    skin_allergy: `${allergyNote}${subject}的皮肤问题请留意皮疹范围、瘙痒、渗出和是否伴随呼吸或全身反应。`,
    vaccine_check: `${subject}接种或体检相关问题，请优先以接种门诊、儿保医生和正式体检记录为准。`,
    early_development: `${subject}的发育问题适合看一段时间的趋势，不建议只凭某一天或某一个动作下结论。`,
    emotion: `${subject}哭闹或情绪变化时，可以先排查饥饿、困倦、冷热、尿布、疼痛和环境刺激。`,
    safety_first: `${subject}遇到误食、卡噎或意外伤害时，请优先按安全红线处理，必要时立即线下就医或急救。`
  }

  return {
    title: '按宝宝档案提醒',
    meta: [name, age, gender, allergy].filter(Boolean).join(' · '),
    text: categoryTips[result.categoryId] || `${subject}的具体情况会影响判断，建议结合月龄、精神状态和症状变化一起看。`
  }
}

function prepareResult(result) {
  if (!result) return result
  const conclusion = (result.conclusion || '').replace(/^主流共识认为[：:]\s*/, '')
  const primaryJudgement = getPrimaryJudgement(result)
  return Object.assign({}, result, {
    displayConclusion: conclusion,
    primaryJudgement: primaryJudgement.text,
    judgementTone: primaryJudgement.tone,
    conclusionSegments: service.buildGlossarySegments(conclusion),
    viewpoints: result.viewpoints.map((item) => Object.assign({}, item, {
      displayTitle: (item.title || '').split('：')[0] || item.title
    })),
    riskNotice: getRiskNotice(result),
    profileHint: buildProfileHint(result),
    tools: toolService.getRecommendedTools(result),
    evidenceItems: buildEvidenceItems(result),
    referenceSummary: buildReferenceSummary(result),
    referenceSources: buildReferenceSources(result),
    dataSourceNote: '当前内容来自已整理的育儿资料，不是实时联网搜索结果。上线后可持续更新。'
  })
}

Page({
  data: {
    keyword: '',
    result: null,
    isFavorite: false,
    noResult: false,
    glossaryPopup: null,
    fallbackQuestions: [],
    isToolPanelOpen: false,
    isReferenceOpen: false,
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
    if (wx.showShareMenu) {
      wx.showShareMenu({ withShareTicket: false })
    }
    const id = options.id
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : ''
    if (keyword) {
      service.addHistory(keyword)
    }
    this.loadResult({ id, keyword })
  },

  loadResult(options) {
    const id = options && options.id
    const keyword = options && options.keyword ? options.keyword : ''
    const result = prepareResult(service.getQuestionResult({ id, keyword }))
    if (!result) {
      this.setData({
        keyword,
        noResult: true,
        result: null,
        fallbackQuestions: service.getAvailableQuestions().slice(0, 4)
      })
      return
    }
    this.setData({
      keyword: keyword || result.question.title,
      result,
      isFavorite: service.isFavorite(result.questionId),
      noResult: false,
      isToolPanelOpen: false,
      isReferenceOpen: false
    })
  },

  onShow() {
    if (this.data.result) {
      this.setData({
        isFavorite: service.isFavorite(this.data.result.questionId),
        result: Object.assign({}, this.data.result, {
          profileHint: buildProfileHint(this.data.result)
        })
      })
    }
  },

  toggleFavorite() {
    if (!this.data.result) return
    const isFavorite = service.toggleFavorite(this.data.result.questionId)
    this.setData({ isFavorite })
    wx.showToast({ title: isFavorite ? '已收藏，可在底部查看' : '已取消收藏', icon: 'none' })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.redirectTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/index' })
  },

  goToolRecords() {
    this.closeToolPanel()
    wx.navigateTo({ url: '/pages/tools/records/index' })
  },

  toggleToolPanel() {
    this.setData({
      isToolPanelOpen: !this.data.isToolPanelOpen
    })
  },

  closeToolPanel() {
    this.setData({ isToolPanelOpen: false })
  },

  toggleReference() {
    this.setData({
      isReferenceOpen: !this.data.isReferenceOpen
    })
  },

  openTool(event) {
    if (!this.data.result) return
    const toolId = (event.detail && event.detail.id) || event.currentTarget.dataset.id
    const tool = (this.data.result.tools || []).find((item) => item.id === toolId)
    if (!tool) return
    this.closeToolPanel()
    wx.navigateTo({
      url: `${tool.path}?questionId=${this.data.result.questionId}&categoryId=${this.data.result.categoryId}`
    })
  },

  changeQuestion() {
    const questions = service.getAvailableQuestions()
    if (!questions.length) return
    const currentId = this.data.result && this.data.result.questionId
    const currentIndex = questions.findIndex((item) => item.id === currentId)
    const nextIndex = currentIndex > -1 ? (currentIndex + 1) % questions.length : 0
    const nextQuestion = questions[nextIndex]
    this.loadResult({ id: nextQuestion.id })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({ scrollTop: 0, duration: 160 })
    }
  },

  submitMissingQuestion() {
    const keyword = (this.data.keyword || '').trim()
    const validation = service.validatePendingQuestion(keyword)
    if (!validation.valid) {
      wx.showToast({ title: validation.message, icon: 'none' })
      return
    }
    service.addPendingQuestion(validation.text, 'result_empty')
    wx.showToast({ title: '已加入待补充问题池', icon: 'none' })
  },

  showGlossary(event) {
    const term = event.currentTarget.dataset.term
    const entry = service.getGlossaryEntry(term)
    if (!entry) return
    this.setData({ glossaryPopup: entry })
  },

  hideGlossary() {
    this.setData({ glossaryPopup: null })
  },

  noop() {},

  onShareAppMessage() {
    const result = this.data.result
    if (!result) {
      return {
        title: '养娃新手村：先来村里问问',
        path: '/pages/index/index'
      }
    }
    return {
      title: `育儿问题：${result.question.title}`,
      path: `/pages/question/result?id=${result.questionId}`
    }
  }
})
