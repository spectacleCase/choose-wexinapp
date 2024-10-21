import Common from "../../services/api/common";
import RequestUtil from "../../utils/request_util";

Component({
  properties: {
    currentPage: {
      type: String,
      value: "index",
    },
    // 添加一个事件监听器
    navigateToPageEvent: {
      type: String,
      value: "",
      observer: function (newVal) {
        if (newVal) {
          this.navigateTo(newVal);
        }
      },
    },
  },

  data: {
    isTabbarOpen: false,
    pageAnimation: {},
    pages: {
      index: { url: "/pages/index/index", title: "首页" },
      publish: { url: "/pages/publish/publish", title: "发布" },
      collect: { url: "/pages/collect/collect", title: "收藏" },
      ranking: { url: "/pages/ranking/ranking", title: "排行榜" },
      user: { url: "/pages/myself/user/user", title: "我的" },
    },
    weather: {
      weather: "",
      temperature: "",
      windpower: "",
    },
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    canSlide: false,
    someData: null,
  },

  methods: {
    onNavigateToPage: function (event) {
      const { url } = event.detail;
      this.navigateTo(url);
    },
    toggleTabbar: function () {
      const isOpen = !this.data.isTabbarOpen;
      this.setData({ isTabbarOpen: isOpen });
      this.animatePage(isOpen);
    },

    onTabChange: function (e) {
      const { url } = e.detail;
      this.navigateTo(url);
    },

    navigateToNotifications: function () {
      wx.navigateTo({
        url: "/pages/myself/notifications/notifications",
      });
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

    // 公共方法，用于外部调用
    navigateToPage: function (url) {
      this.navigateTo(url);
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

    getWeather: async function () {
      console.log("到了导航栏 ");
      const data = await RequestUtil.request(Common.common.getWeather);
      this.setData({
        weather: data.data,
      });
      console.log("结果");
      console.log(this.data.weather);
    },
  },

  attached: async function () {
    this.getWeather();
  },
});
