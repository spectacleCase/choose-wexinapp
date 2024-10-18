Component({
  properties: {
    currentPage: {
      type: String,
      value: "index",
    },
  },

  data: {
    isTabbarOpen: false,
    pageAnimation: {},
    pages: {
      index: { url: "/pages/index/index", title: "首页" },
      settings: { url: "/pages/settings/settings", title: "设置" },
      user: { url: "/pages/myself/user/user", title: "我的" },
    },
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    canSlide: false,
    someData: null,
  },

  methods: {
    toggleTabbar: function () {
      const isOpen = !this.data.isTabbarOpen;
      this.setData({ isTabbarOpen: isOpen });
      this.animatePage(isOpen);
    },

    onTabChange: function (e) {
      const { url } = e.detail;
      this.navigateTo(url);
    },

    navigateTo: function (url) {
      const page = Object.keys(this.data.pages).find(
        (key) => this.data.pages[key].url === url
      );
      console.log("结果是", page);
      if (page) {
        this.setData({ currentPage: page });
      }
      this.toggleTabbar();
    },

    animatePage: function (isOpen) {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: "ease",
      });

      if (isOpen) {
        animation.translateX(250).translateY(100).rotateZ(-15).step();
      } else {
        animation.translateX(0).translateY(0).rotateZ(0).step();
      }

      this.setData({
        pageAnimation: animation.export(),
      });
    },

    touchStart: function (e) {
      this.setData({
        startX: e.touches[0].pageX,
        startY: e.touches[0].pageY,
        moveX: 0,
        moveY: 0,
        canSlide: false,
      });
    },

    touchMove: function (e) {
      const moveX = e.touches[0].pageX - this.data.startX;
      const moveY = e.touches[0].pageY - this.data.startY;
      const absMoveX = Math.abs(moveX);
      const absMoveY = Math.abs(moveY);

      // 如果横向移动距离大于纵向移动距离，则允许滑动
      if (absMoveX > absMoveY && !this.data.canSlide) {
        this.setData({ canSlide: true });
      }

      if (this.data.canSlide && moveX > 0 && moveX <= this.rpxToPx(250)) {
        const animation = wx.createAnimation({
          duration: 0,
        });
        animation.translateX(moveX).step();
        this.setData({
          pageAnimation: animation.export(),
          moveX: moveX,
        });
      }
    },

    rpxToPx: function (rpx) {
      const windowInfo = wx.getWindowInfo();
      return (rpx / 750) * windowInfo.windowWidth;
    },

    touchEnd: function () {
      if (this.data.canSlide) {
        if (this.data.moveX > this.rpxToPx(100)) {
          this.toggleTabbar();
        } else {
          this.animatePage(false);
        }
      }
      this.setData({ moveX: 0, canSlide: false });
    },
  },
});
