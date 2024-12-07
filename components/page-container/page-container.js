import Common from "../../services/api/common";
import Comment from "../../services/api/comment";
import RequestUtil from "../../utils/request_util";
import config from "../../config/config";

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
      forum: { url: "/pages/forum/forum", title: "今日" },
      collect: { url: "/pages/collect/collect", title: "收藏" },
      chat: { url: "/pages/chat/chat", title: "搭子" },
      user: { url: "/pages/user/user", title: "我的" },
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
    hasNewNotification: false, // 将初始值设置为 false
    notificationCount: 0,
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
      RequestUtil.request(Comment.comment.read);
      this.setData({ notificationCount: 0 });
      wx.setStorageSync("isReadNum", 0);
      wx.navigateTo({
        url: "/pages/myself/notifications/notifications",
      });
    },

    navigateTo: function (url) {
      const page = Object.keys(this.data.pages).find(
        (key) => this.data.pages[key].url === url
      );
      console.log(url);

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

    createWebSocket: function () {
      const user = wx.getStorageSync("userInfo");
      let url = `ws://${config.ip}/choose-websocket?userId=${user.id}`;
      console.log(url);

      // 创建 WebSocket 连接
      this.data.socketTask = wx.connectSocket({
        url: url,
        success: (res) => {
          console.log("WebSocket 连接成功", res);
        },
        fail: (err) => {
          console.error("WebSocket 连接失败", err);
        },
      });

      // 监听 WebSocket 连接打开事件
      wx.onSocketOpen((res) => {
        console.log("WebSocket 连接已打开", res);
      });

      // 监听 WebSocket 消息事件
      wx.onSocketMessage((res) => {
        console.log("收到 WebSocket 消息", res.data);
        wx.setStorageSync("isReadNum");
        this.setData({
          notificationCount: this.data.notificationCount + 1,
        });
        wx.setStorageSync("isReadNum", this.data.notificationCount);
        console.log("notificationCount 增加到", this.data.notificationCount);
      });

      // 监听 WebSocket 错误事件
      wx.onSocketError((err) => {
        console.error("WebSocket 错误", err);
      });

      // 监听 WebSocket 关闭事件
      wx.onSocketClose((res) => {
        console.log("WebSocket 连接已关闭", res);
      });
    },

    // 发送消息
    sendMessage: function () {
      if (this.data.socketTask) {
        this.data.socketTask.send({
          data: "Hello, WebSocket!",
          success: (res) => {
            console.log("消息发送成功", res);
          },
          fail: (err) => {
            console.error("消息发送失败", err);
          },
        });
      }
    },

    // 关闭 WebSocket 连接
    closeWebSocket: function () {
      if (this.data.socketTask) {
        this.data.socketTask.close({
          success: (res) => {
            console.log("WebSocket 连接已关闭", res);
          },
          fail: (err) => {
            console.error("WebSocket 关闭失败", err);
          },
        });
      }
    },
  },

  attached: async function () {
    this.getWeather();
    const data = await RequestUtil.request(Comment.comment.getIsReadNum);
    wx.setStorageSync("isReadNum", data.data.num);
    console.log("att触发");
    this.setData({
      notificationCount: wx.getStorageSync("isReadNum")
        ? wx.getStorageSync("isReadNum")
        : 0,
    });
    this.createWebSocket();
  },
  moved: function () {
    console.log("moved触发");
    this.createWebSocket();
  },
  detached: function () {
    this.closeWebSocket();
  },
});
