// pages/index.js
Page({
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
        image: "../../images/食物.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../images/食物1.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../images/食物.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
      {
        image: "../../images/食物1.png",
        tag: "主菜",
        name: "红烧肉",
        distance: "20km",
      },
      {
        image: "../../images/食物.png",
        tag: "甜品",
        name: "水果沙拉",
        distance: "10km",
      },
      {
        image: "../../images/食物1.png",
        tag: "糕点",
        name: "蛋糕",
        distance: "5km",
      },
    ],
    locationName: "北京市", // 添加这一行
  },

  onLoad: function () {
    console.log("Index page loaded");
    // 这里可以添加一些初始化逻辑,比如获取初始的推荐结果
  },

  onAvatarTap() {
    // 处理头像点击,例如导航到用户页面
    wx.navigateTo({
      url: "/pages/user/user",
    });
  },

  onRefreshTip() {
    // 刷新健康小知识
    // 这里应该调用一个API来获取新的小知识,暂时用随机数模拟
    const tips = [
      "每天喝8杯水有助于保持身体健康。",
      "适度运动可以提高免疫力。",
      "保持良好的作息习惯对身体很重要。",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    this.setData({ healthTip: randomTip });
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
      title: '正在为您推荐',
      icon: 'loading',
      duration: 1000
    });
    // 模拟API调用延迟
    setTimeout(() => {
      this.setData({ recommendationResults: mockResults });
    }, 1000);
  },

  resetFilter() {
    this.setData({
      selectedCount: "3个", // 设置为默认值
      selectedCategory: "菜品", // 设置为默认值
    });
  },
});
