Component({
  data: {
    hidden: false,
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
        text: '问问',
        iconPath: '/assets/tab/qa.png',
        selectedIconPath: '/assets/tab/qa-active.png'
      },
      {
        pagePath: '/pages/favorites/index',
        text: '收藏',
        iconPath: '/assets/icons/pixel-v2/action/favorite.png',
        selectedIconPath: '/assets/icons/pixel-v2/action/star.png'
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
      wx.switchTab({ url: path })
    }
  }
})
