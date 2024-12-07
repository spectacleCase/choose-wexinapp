Component({
  properties: {
    isOpen: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          this.openTabbar();
        } else {
          this.closeTabbar();
        }
      },
    },
  },

  data: {
    pageAnimation: {},
    tabItems: [
      {
        icon: "../../assets/images/首页.png",
        text: "首页",
        url: "/pages/index/index",
      },
      {
        icon: "../../assets/images/聊天.png",
        text: "搭子",
        url: "/pages/chat/chat",
      },
      {
        icon: "../../assets/images/发布.png",
        text: "今日",
        url: "/pages/forum/forum",
      },

      {
        icon: "../../assets/images/收藏.png",
        text: "收藏库",
        url: "/pages/collect/collect",
      },
      {
        icon: "../../assets/images/我的.png",
        text: "我的",
        url: "/pages/user/user",
      },
    ],
    userInfo: {},
    activeTab: 0,
  },

  lifetimes: {
    attached: function () {
      const userInfo = wx.getStorageSync("userInfo") || {};
      this.setData({ userInfo });
    },
  },

  methods: {
    openTabbar: function () {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease",
      });
      animation.translateX(250).translateY(150).rotateZ(-20).step();

      this.setData({
        pageAnimation: animation.export(),
      });
    },

    closeTabbar: function () {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease",
      });
      animation.translateX(0).translateY(0).rotateZ(0).step();

      this.setData({
        pageAnimation: animation.export(),
      });
    },

    onTabItemTap: function (e) {
      const index = e.currentTarget.dataset.index;
      const item = this.data.tabItems[index];
      this.setData({ activeTab: index });
      this.triggerEvent("tabchange", { index: index, url: item.url });

      // 关闭侧边栏
      this.triggerEvent("closetabbar");
    },
  },
});
