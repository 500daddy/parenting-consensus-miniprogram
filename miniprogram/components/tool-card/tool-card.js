Component({
  properties: {
    tool: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      const tool = this.data.tool || {}
      this.triggerEvent('select', { id: tool.id, tool })
    }
  }
})
