Page({
  data: {
    currentPage: "index",
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
        currentPage: options.page
      });
      console.log("Page changed to:", options.page);
    }
  },
  onPullDownRefresh() {
    // 触发 Component 中的刷新逻辑
    // this.selectComponent('#myComponent').refreshData();
        // 获取当前显示的组件实例
        const currentComponent = this.selectComponent("#" + this.data.currentPage);
        if (currentComponent) {
          // 调用组件的刷新方法
          currentComponent.refreshData();
        }
    console.log("开始刷新");
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  }
});