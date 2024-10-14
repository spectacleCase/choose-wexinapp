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
});