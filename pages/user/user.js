Page({
  data: {
    userInfo: {
      avatar: "",
      nickname: "用户名",
    },
    userTags: ["运动", "健康饮食", "瑜伽"],
    healthTip: "每天喝8杯水有助于保持身体水分平衡，促进新陈代谢。",
    recommendations: [
      { image: "", title: "10分钟早晨瑜伽" },
    ],
  },

  onLoad: function () {
    // 在这里可以加载用户信息、标签偏好等数据
  },

  editUserInfo: function () {
    // 跳转到编辑用户信息页面
    wx.navigateTo({
      url: "/pages/edit_user_info/edit_user_info",
    });
  },

  editTags: function () {
    // 跳转到编辑标签偏好页面
    wx.navigateTo({
      url: "/pages/edit_tags/edit_tags",
    });
  },

  navigateToAboutUs: function () {
    // 跳转到关于我们页面
    wx.navigateTo({
      url: "/pages/about_us/about_us",
    });
  },
});
