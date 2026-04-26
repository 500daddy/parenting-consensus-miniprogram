Component({
  properties: {
    source: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      this.triggerEvent('tapsource', { id: this.data.source.id, type: this.data.source.type })
    }
  }
})
