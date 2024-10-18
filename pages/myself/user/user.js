import RequestUtils from "../../../utils/request_util";
import Recommend from "../../../services/api/recommend";
import User from "../../../services/api/user";
// user.js
Component({
  properties: {
    // 定义属性
  },

  data: {
    userInfo: {
      avatar:
        "http://119.91.145.137:9001/choose/2024/06/03/7595dce18c3440208c55204af85b8430.png",
      nickname: "用户名",
      description: "简约而不简单",
    },
    userTags: ["运动", "健康饮食", "瑜伽"],
    healthTip: "每天喝8杯水有助于保持身体水分平衡，促进新陈代谢。",
    recommendations: [
      {
        image:
          "http://119.91.145.137:9001/choose/2024/06/03/7595dce18c3440208c55204af85b8430.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
    ],
  },

  methods: {
    editUserInfo: function () {
      console.log("兼容");
      console.log("User page shown");
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

    getTips: async function () {
      const helData = await RequestUtils.request(User.user.healthTips);
      this.setData({
        healthTip: helData.data.tips,
      });
    },
  },

  attached: async function () {
    console.log("既然");

    const userInfo = wx.getStorageSync("userInfo");
    console.log("Initial userInfo:", userInfo);
    this.setData({ userInfo });
    Recommend.recommend.recommendRecord.data = {
      page: 1,
    };
    const data = await RequestUtils.request(
      Recommend.recommend.recommendRecord
    );
    console.log(data);
    const helData = await RequestUtils.request(User.user.healthTips);
    this.setData({
      recommendations: data.data.list,
      healthTip: helData.data.tips,
    });
  },
});
