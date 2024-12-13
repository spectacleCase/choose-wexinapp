// import page_container from "../../components/page-container";
const app = getApp();
Page({
  data: {
    currentPage: "index",
    showMessagePopup: false,
    newMessageAvatar:
      "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/12/12/492bec4f80224d4f991c6c9299cde7fd.jpg",
    newMessageChatId: "",
    socket: null,
  },

  onLoad: function (options) {
    console.log("Current page:", this.data.currentPage);
    const token = wx.getStorageSync("token");
    console.log(token);
    if (token && token.token && token.tokenTimeout) {
      const currentTime = new Date().getTime();
      const tokenExpireTime = new Date(token.tokenTimeout).getTime();
      console.log("时间", currentTime, tokenExpireTime);
      if (currentTime > tokenExpireTime) {
        {
          // Token已过期，清除存储的token
          wx.removeStorageSync("token");
          wx.removeStorageSync("userInfo");
          wx.navigateTo({
            url: "/pages/login/login",
          });
        }
      }
    } else {
      wx.removeStorageSync("userInfo");
      wx.navigateTo({
        url: "/pages/login/login",
      });
    }
    if (options.page) {
      this.setData({
        currentPage: options.page,
      });
      console.log("Page changed to:", options.page);
    }
    this.boundHandleMessage = this.handleMessage.bind(this);
    app.subscribe("message", this.boundHandleMessage);
  },

  onShow() {
    app.subscribe("message", this.boundHandleMessage);
  },
  onHide() {
    const app = getApp();
    app.unsubscribe("message", this.boundHandleMessage);
  },

  // 处理弹窗点击事件
  onPopupClick() {
    this.setData({
      showMessagePopup: false,
    });
  },

  // 显示新消息提示
  showNewMessagePopup(avatar, chatId) {
    this.setData({
      showMessagePopup: true,
      newMessageAvatar: avatar,
      newMessageChatId: chatId,
    });
  },

  handleMessage(result) {
    const message = JSON.parse(result);
    console.log("收到新的信息提示", message);
    if (app.globalData.currentPage !== "chat") {
      this.showNewMessagePopup(message.avatar, message.sender);
    }
  },

  onPullDownRefresh() {
    // 触发 Component 中的刷新逻辑
    // this.selectComponent('#myComponent').refreshData();
    // 获取当前显示的组件实例
    const currentComponent = this.selectComponent("#" + this.data.currentPage);
    if (currentComponent) {
      currentComponent.refreshData();
    }
    console.log("开始刷新");
    wx.stopPullDownRefresh();
  },
});
