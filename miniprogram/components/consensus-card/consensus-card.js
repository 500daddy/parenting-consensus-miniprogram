Component({
  properties: {
    result: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      const id = this.data.result && this.data.result.questionId
      if (!id) return
      this.triggerEvent('tapconsensus', { id })
    }
  }
})
