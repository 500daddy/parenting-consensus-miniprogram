Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        iconPath: '/assets/tab/home.png',
        selectedIconPath: '/assets/tab/home-active.png'
      },
      {
        pagePath: '/pages/search/index',
        text: '问答',
        iconPath: '/assets/tab/qa.png',
        selectedIconPath: '/assets/tab/qa-active.png'
      },
      {
        pagePath: '/pages/category/index',
        text: '分类',
        iconPath: '/assets/tab/category.png',
        selectedIconPath: '/assets/tab/category-active.png'
      },
      {
        pagePath: '/pages/profile/index',
        text: '我的',
        iconPath: '/assets/tab/profile.png',
        selectedIconPath: '/assets/tab/profile-active.png'
      }
    ]
  },

  methods: {
    switchTab(event) {
      const path = event.currentTarget.dataset.path
      const index = event.currentTarget.dataset.index
      this.setData({ selected: index })
      wx.switchTab({ url: path })
    }
  }
})
