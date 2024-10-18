Page({
  data: {
    userInfo: {
      avatar:
        "http://119.91.145.137:9001/choose/2024/06/03/7595dce18c3440208c55204af85b8430.png",
      nickname: "用户名",
      signature: "简约而不简单",
    },
    userTags: ["运动", "健康饮食", "瑜伽"],
    healthTip: "每天喝8杯水有助于保持身体水分平衡，促进新陈代谢。",
    recommendations: [
      {
        image: "../../../images/食物.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../../images/食物1.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../../images/食物.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
      {
        image: "../../../images/食物1.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../../images/食物.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../../images/食物1.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
    ],
  },

  onLoad: function () {
    // 在这里可以加载用户信息、标签偏好等数据
  },

  editUserInfo: function () {
    console.log("兼容");
    
    // 跳转到编辑用户信息页面
    wx.navigateTo({
      url: "/pages/myself/edit_user_info/edit_user_info",
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

  navigateToSettings: function () {
    // 跳转到设置页面
    wx.navigateTo({
      url: "/pages/settings/settings",
    });
  },
});
