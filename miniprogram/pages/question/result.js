const service = require('../../utils/mockService.js')

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
    return '高风险问题请先看红旗信号：本页内容不能替代急救、医生诊断或线下处理，一旦情况紧急请立即就医或拨打当地急救电话。'
  }
  return RISK_CATEGORY_NOTICES[result.categoryId] || ''
}

function buildProfileHint(result) {
  const profile = service.getProfile()
  if (!result || !profile || !profile.isLoggedIn) return null

  const baby = profile.baby || {}
  const name = baby.name || '宝宝'
  const age = baby.age && baby.age !== '未设置' ? baby.age : ''
  const allergy = baby.allergy && baby.allergy !== '暂无记录' ? baby.allergy : ''
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
    meta: [name, age, baby.gender && baby.gender !== '未设置' ? baby.gender : '', allergy].filter(Boolean).join(' · '),
    text: categoryTips[result.categoryId] || `${subject}的具体情况会影响判断，建议结合月龄、精神状态和症状变化一起看。`
  }
}

function prepareResult(result) {
  if (!result) return result
  const conclusion = (result.conclusion || '').replace(/^主流共识认为[：:]\s*/, '')
  return Object.assign({}, result, {
    displayConclusion: conclusion,
    conclusionSegments: service.buildGlossarySegments(conclusion),
    viewpoints: result.viewpoints.map((item) => Object.assign({}, item, {
      displayTitle: (item.title || '').split('：')[0] || item.title
    })),
    riskNotice: getRiskNotice(result),
    profileHint: buildProfileHint(result),
    dataSourceNote: '当前答案来自本地种子题库和 mock 数据，不是实时联网搜索结果。上线后可替换为真实内容样本和后台统计。',
    contentBoundaryNotice: '养娃新手村当前为本地数据 MVP，内容用于问前梳理和家长沟通参考，不提供诊断、处方或急救替代方案。'
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
    const result = prepareResult(service.getQuestionResult({ id, keyword }))
    if (!result) {
      this.setData({
        keyword,
        noResult: true,
        fallbackQuestions: service.getAvailableQuestions().slice(0, 3)
      })
      return
    }
    this.setData({
      keyword: keyword || result.title,
      result,
      isFavorite: service.isFavorite(result.questionId),
      noResult: false
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

  goAuthority(event) {
    if (!this.data.result) return
    const type = event && event.currentTarget ? event.currentTarget.dataset.type : ''
    const typeQuery = type ? `&type=${type}` : ''
    wx.navigateTo({ url: `/pages/authority/index?questionId=${this.data.result.questionId}${typeQuery}` })
  },

  goQuestion(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.redirectTo({ url: `/pages/question/result?id=${id}` })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
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
