Component({
  properties: {
    source: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTap() {
      const source = this.data.source || {}
      if (!source.id) return
      this.triggerEvent('tapsource', { id: source.id, type: source.type })
    }
  }
})
