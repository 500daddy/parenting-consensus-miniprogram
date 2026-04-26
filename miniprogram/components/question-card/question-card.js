Component({
  properties: {
    question: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tapquestion', { id: this.data.question.id })
    }
  }
})
