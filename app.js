// app.js
// 引入 toast 模块
const toast = require("./companies/toast.js").default;
import config from "./config/config";

App({
  globalData: {
    isLoggedIn: false,
    socket: null,
    subscribeMap: {}, // 订阅者映射表
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
    // this.createWebSocket();
    const user = wx.getStorageSync("userInfo");
    let url = `ws://${config.ip}/choose-websocket?userId=${user.id}`;
    this.initWebsocket(url);

    this.interceptPageNavigation();
  },
  /* TODO 单例websocket */
  initWebsocket(url) {
    const { socket, subscribeMap } = this.globalData;

    if (socket) {
      console.log("Websocket 已实例");
      return;
    }

    this.globalData.socket = wx.connectSocket({
      url: url,
      success: () => {
        console.log("Websocket 链接成功");
      },
      fail: (err) => {
        console.error("websocket 链接错误", err);
      },
    });

    // 监听Websocket 信息
    wx.onSocketMessage((res) => {
      console.log("app.js收到信息", res.data);
      this.notifySubscribers(res.data);
    });

    wx.onSocketClose(() => {
      console.log("webSocket 链接关闭");
      // todo 设置心跳
      this.globalData.socket = null;
    });

    wx.onSocketError((err) => {
      console.log("WebSocket 连接错误", err);
    });
  },

  // 发送消息
  sendMessage(data, successCallback, failCallback) {
    const { socket } = this.globalData;
    if (!socket) {
      console.log("WebSocket 未连接");
      failCallback && failCallback("WebSocket 未连接");
      return;
    }

    wx.sendSocketMessage({
      data: data,
      success: () => {
        console.log("消息发送成功");
        successCallback && successCallback();
      },
      fail: (err) => {
        console.error("消息发送失败", err);
        failCallback && failCallback(err);
      },
    });
  },

  // 订阅消息
  subscribe(eventName, callback) {
    const { subscribeMap } = this.globalData;
    console.log("现在的", subscribeMap);
    if (!subscribeMap[eventName]) {
      subscribeMap[eventName] = [];
    }
    subscribeMap[eventName].push(callback);
  },

  // 取消订阅
  unsubscribe(eventName, callback) {
    const { subscribeMap } = this.globalData;
    console.log(eventName);

    if (subscribeMap[eventName]) {
      subscribeMap[eventName] = subscribeMap[eventName].filter(
        (cb) => cb !== callback
      );
      console.log("卸载之后的", subscribeMap);
    }
  },

  // 通知订阅者
  notifySubscribers(data) {
    const { subscribeMap } = this.globalData;
    const messageType = JSON.parse(data).messageType;
    if (subscribeMap[messageType]) {
      subscribeMap[messageType].forEach((callback) => {
        callback(data);
      });
    }
  },

  // 关闭WebSocket 链接
  closeWebsocket() {
    const { socket } = this.globalData;
    if (socket) {
      wx.closeSocket();
      this.globalData.socket = null;
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
