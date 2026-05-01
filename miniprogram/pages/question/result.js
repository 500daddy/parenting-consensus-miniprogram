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

function prepareResult(result) {
  if (!result) return result
  return Object.assign({}, result, {
    riskNotice: getRiskNotice(result),
    contentBoundaryNotice: '养娃新手村当前为本地数据 MVP，内容用于问前梳理和家长沟通参考，不提供诊断、处方或急救替代方案。'
  })
}

Page({
  data: {
    keyword: '',
    result: null,
    isFavorite: false,
    noResult: false,
    fallbackQuestions: [],
    actionIconPaths: service.actionIconPaths
  },

  onLoad(options) {
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
      this.setData({ isFavorite: service.isFavorite(this.data.result.questionId) })
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
  }
})
