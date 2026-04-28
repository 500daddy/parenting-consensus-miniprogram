Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      const id = this.data.question && this.data.question.id
      if (!id) return
      this.triggerEvent('tapquestion', { id })
    }
  }
})
