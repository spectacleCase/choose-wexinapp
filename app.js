// app.js
// 引入 toast 模块
const toast = require("./companies/toast.js").default;
import config from "./config/config";

App({
  globalData: {
    isLoggedIn: false,
    socket: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 3,
  },

  // 使用引入的 showToast 方法
  showToast: toast.showToast,
  onLaunch: function () {
    if (wx.getStorageSync("token")) {
      // wx.reLaunch({
      //   url: "/pages/login/login",
      // });
    }
    // 拦截页面跳转
    this.createWebSocket();
    this.interceptPageNavigation();
  },

  createWebSocket: function () {
    const user = wx.getStorageSync("userInfo");
    let url = `ws://${config.ip}/choose-websocket?userId=${user.id}`;
    console.log(url);

    // 创建 WebSocket 连接
    this.globalData.socket = wx.connectSocket({
      url: url,
      success: (res) => {
        console.log("WebSocket 连接成功", res);
        this.globalData.reconnectAttempts = 0; // 重置重连次数
      },
      fail: (err) => {
        console.error("WebSocket 连接失败", err);
        this.reconnectWebSocket();
      },
    });

    // 监听 WebSocket 连接打开事件
    wx.onSocketOpen((res) => {
      console.log("WebSocket 连接已打开", res);
    });

    // 监听 WebSocket 消息事件
    wx.onSocketMessage((res) => {
      console.log("收到 WebSocket 消息", res.data);
      // wx.setStorageSync("isReadNum");
      // this.setData({
      //   notificationCount: this.data.notificationCount + 1,
      // });
      // wx.setStorageSync("isReadNum", this.data.notificationCount);
      // console.log("notificationCount 增加到", this.data.notificationCount);
    });

    // 监听 WebSocket 错误事件
    wx.onSocketError((err) => {
      console.error("WebSocket 错误", err);
    });

    // 监听 WebSocket 关闭事件
    wx.onSocketClose((res) => {
      console.log("WebSocket 连接已关闭", res);
      this.reconnectWebSocket();
    });
  },
  reconnectWebSocket: function () {
    if (
      this.globalData.reconnectAttempts < this.globalData.maxReconnectAttempts
    ) {
      this.globalData.reconnectAttempts++;
      console.log(`尝试重新连接，第 ${this.globalData.reconnectAttempts} 次`);
      setTimeout(() => {
        this.createWebSocket();
      }, 2000); // 2秒后尝试重新连接
    } else {
      console.error("WebSocket 重连失败，已达最大重连次数");
    }
  },

  interceptPageNavigation: function () {
    const originalNavigateTo = wx.navigateTo;
    const originalRedirectTo = wx.redirectTo;
    const originalReLaunch = wx.reLaunch;
    const originalSwitchTab = wx.switchTab;

    wx.navigateTo = function (options) {
      if (this.shouldIntercept(options.url)) {
        // 进行拦截处理
        console.log("Intercepted navigateTo:", options.url);
        return;
      }
      originalNavigateTo.call(this, options);
    }.bind(this);

    wx.redirectTo = function (options) {
      if (this.shouldIntercept(options.url)) {
        // 进行拦截处理
        console.log("Intercepted redirectTo:", options.url);
        return;
      }
      originalRedirectTo.call(this, options);
    }.bind(this);

    wx.reLaunch = function (options) {
      if (this.shouldIntercept(options.url)) {
        // 进行拦截处理
        console.log("Intercepted reLaunch:", options.url);
        return;
      }
      originalReLaunch.call(this, options);
    }.bind(this);

    wx.switchTab = function (options) {
      if (this.shouldIntercept(options.url)) {
        // 进行拦截处理
        console.log("Intercepted switchTab:", options.url);
        return;
      }
      originalSwitchTab.call(this, options);
    }.bind(this);
  },

  shouldIntercept: function (url) {
    console.log("拦截", url);
    const token = wx.getStorageSync("token");
    if (token && token.token && token.tokenTimeout) {
      const currentTime = new Date().getTime();
      const tokenExpireTime = new Date(token.tokenTimeout).getTime();
      console.log("时间", currentTime, tokenExpireTime);
      console.log(currentTime < tokenExpireTime);
      if (currentTime < tokenExpireTime) {
        console.log("时间没有");
        this.globalData.isLoggedIn = true;
      } else {
        // Token已过期，清除存储的token
        console.log("时间过期了");
        wx.removeStorageSync("token");
        wx.removeStorageSync("userInfo");
        this.globalData.isLoggedIn = false;
      }
    } else {
      this.globalData.isLoggedIn = false;
    }

    // 检查用户是否登录
    console.log("是否登录", !this.globalData.isLoggedIn);
    if (!this.globalData.isLoggedIn && !url.startsWith("/pages/login")) {
      toast.showToast("请先登录", "info");
      console.log("跳转登录");

      wx.reLaunch({
        url: "/pages/login/login",
      });
      return true;
    }
    return false;
  },
});
