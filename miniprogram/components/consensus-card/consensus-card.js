Component({
  properties: {
    result: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tapconsensus', { id: this.data.result.questionId })
    }
  }
})
