// components/index-component/index-component.js
import RequestUtils from "../../utils/request_util";
import User from "../../services/api/user";
import Recommend from "../../services/api/recommend.js";
const toast = require("../../companies/toast.js").default;
Component({
  properties: {
    // 定义属性
  },

  data: {
    showFilter: false,
    showRecommend: false,
    healthTip: "多吃水果蔬菜,少吃油炸食品。",
    recommendationCounts: ["1个", "3个", "5个"],
    recommendationCategories: ["菜品", "下午茶", "糕点"],
    selectedCount: "3个",
    selectedCategory: "菜品",
    recommendationResults: [
      {
        image: "../../assets/images/食物.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../assets/images/食物1.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../assets/images/食物.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
      {
        image: "../../assets/images/食物1.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../assets/images/食物.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../assets/images/食物1.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
    ],
    locationName: "北京市", // 添加这一行
  },

  methods: {
    onAvatarTap() {
      // 处理头像点击,例如导航到用户页面
      wx.navigateTo({
        url: "/pages/user/user",
      });
    },

    getTips: async function () {
      const helData = await RequestUtils.request(User.user.healthTips);
      this.setData({
        healthTip: helData.data.tips,
      });
    },

    onSearchInput(e) {
      // 处理搜索输入
      console.log("Search input:", e.detail.value);
      // 这里可以添加搜索逻辑
    },

    showFilterOptions() {
      this.setData({ showFilter: true });
    },

    showRecommendOptions() {
      this.setData({ showRecommend: true });
    },

    onCountSelect(e) {
      const selectedCount = e.currentTarget.dataset.count;
      this.setData({ selectedCount });
    },

    onCategorySelect(e) {
      const selectedCategory = e.currentTarget.dataset.category;
      this.setData({ selectedCategory });
    },

    confirmFilter() {
      this.setData({ showFilter: false });
      // 这里可以添加筛选后的逻辑,如更新推荐列表
    },

    confirmRecommend() {
      this.setData({ showRecommend: false });
      this.getRecommendations();
    },

    onRecommendTap() {
      // 直接调用获取推荐的函数，不显示弹出层
      this.getRecommendations();
    },

    getRecommendations() {
      // 这里应该调用推荐API
      // 暂时使用现有的模拟数据
      const mockResults = this.data.recommendationResults;
      // 可以在这里添加一些动画或加载效果
      wx.showToast({
        title: "正在为您推荐",
        icon: "loading",
        duration: 1000,
      });
      // 模拟API调用延迟
      setTimeout(() => {
        this.recommend();
        this.setData({ recommendationResults: mockResults });
      }, 1000);
    },
    recommend: function () {
      const data = RequestUtils.request(Recommend.recommend.recommend);
      console.log("推荐结果", data);
    },

    resetFilter() {
      this.setData({
        selectedCount: "3个", // 设置为默认值
        selectedCategory: "菜品", // 设置为默认值
      });
    },
  },

  ready: function () {
    console.log("Index component ready");
    this.getTips();
  },
});
