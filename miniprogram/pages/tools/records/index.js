const service = require('../../../utils/mockService.js')
const toolService = require('../../../utils/toolService.js')

function enrichRecord(record) {
  const templates = record.templateQuestionsTouched
    ? record.templateQuestions
    : record.templateQuestions && record.templateQuestions.length
    ? record.templateQuestions
    : toolService.getDoctorQuestionTemplates(record.categoryId)
  return Object.assign({}, record, {
    displayTime: toolService.formatRecordTime(record.updatedAt || record.createdAt),
    questions: templates.concat(record.customQuestions || [])
  })
}

Page({
  data: {
    records: [],
    actionIconPaths: service.actionIconPaths
  },

  onShow() {
    this.setData({
      records: toolService.getDoctorVisitRecords().map(enrichRecord)
    })
  },

  goNewRecord() {
    wx.navigateTo({ url: '/pages/tools/doctor-visit/index' })
  },

  goSearch() {
    wx.switchTab({ url: '/pages/search/index' })
  },

  editRecord(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({ url: `/pages/tools/doctor-visit/index?recordId=${id}` })
  },

  deleteRecord(event) {
    const id = event.currentTarget.dataset.id
    if (!id) return
    wx.showModal({
      title: '删除记录',
      content: '删除后，这条本地记录无法恢复。',
      confirmText: '删除',
      confirmColor: '#d96f45',
      success: (res) => {
        if (!res.confirm) return
        const records = toolService.deleteDoctorVisitRecord(id).map(enrichRecord)
        this.setData({ records })
        wx.showToast({ title: '已删除', icon: 'none' })
      }
    })
  }
})
