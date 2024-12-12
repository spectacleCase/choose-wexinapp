import RequestUtils from "../../utils/request_util.js";
import Recommend from "../../services/api/recommend.js";
import User from "../../services/api/user.js";
const toast = require("../../companies/toast.js").default;
// user.js
Component({
  properties: {
    // 定义属性
  },
  pageLifetimes: {
    // 页面显示时触发
    show() {
      const userInfo = wx.getStorageSync("userInfo");
      this.setData({ userInfo });
    },
  },

  data: {
    userInfo: {
      avatar: "",
      nickname: "用户名",
      description: "简约而不简单",
    },

    userTags: ["运动", "健康饮食", "瑜伽"],
    healthTip: "每天喝8杯水有助于保持身体水分平衡，促进新陈代谢。",
    recommendations: [
      {
        image: "",
        tagName: "店铺",
        dishesName: "红烧肉",
        distance: "20km",
      },
    ],
    page: 1,
    pageSize: 10,
    hasMore: true,
  },

  methods: {
    editUserInfo: function () {
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
        url: "/pages/myself/about-us/about-us",
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
    loadMore: async function (params) {
      this.getrecommendRecord();
    },

    getrecommendRecord: async function () {
      if (!this.data.hasMore) {
        return;
      }
      wx.showLoading({
        title: "加载中...",
      });
      Recommend.recommend.recommendRecord.data = {
        page: this.data.page,
      };

      const data = await RequestUtils.request(
        Recommend.recommend.recommendRecord
      );
      this.setData({
        recommendations: this.data.recommendations.concat(data.data.list),
        page: this.data.page + 1,
        hasMore: data.data.list.length === this.data.pageSize,
      });
      wx.hideLoading();
    },

    viewAllRecommendations: function () {
      wx.navigateTo({
        url: "/pages/myself/all-recommendations/all-recommendations",
      });
    },

    goShop: function (e) {
      const shopId = e.currentTarget.dataset.shopId;
      if (shopId) {
        wx.navigateTo({
          url: "/pages/shop/shop/shop?shopId=" + shopId,
        });
      } else {
        wx.showToast({
          title: "商铺信息不存在",
          icon: "none",
        });
      }
    },
    showQRCode: function (e) {
      // 阻止事件冒泡
      // e.stopPropagation();
      wx.navigateTo({
        url: "/pages/myself/qrcode/qrcode",
      });
    },
  },

  attached: async function () {
    console.log("既然");

    const userInfo = wx.getStorageSync("userInfo");
    console.log("Initial userInfo:", userInfo);
    this.setData({ userInfo });
    Recommend.recommend.recommendRecord.data = {
      page: this.data.page,
    };

    const data = await RequestUtils.request(
      Recommend.recommend.recommendRecord
    );
    console.log(data);
    const helData = await RequestUtils.request(User.user.healthTips);
    this.setData({
      recommendations: data.data.list,
      healthTip: helData.data.tips,
      page: this.data.page + 1,
      hasMore: data.data.list.length === this.data.pageSize,
    });
  },
});
