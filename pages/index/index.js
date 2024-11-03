// components/index-component/index-component.js
import RequestUtils from "../../utils/request_util";
import User from "../../services/api/user";
import Dishes from "../../services/api/dishes";
import config from "../../config/config.js";
const toast = require("../../companies/toast.js").default;
Component({
  properties: {
    // 定义属性
  },

  data: {
    webSocket: null,
    showFilter: false,
    showRecommend: false,
    healthTip: "多吃水果蔬菜,少吃油炸食品。",
    recommendationCounts: ["1个", "3个", "5个"],
    recommendationCategories: ["菜品", "下午茶", "糕点"],
    selectedCount: "3个",
    selectedCategory: "菜品",
    recommendationResults: [
      {
        id: 1,
        image:
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        shopName: "门店",
        mark: "4.5",
        coordinate: "20km",
      },
    ],
    locationName: "茂名市", // 添加这一行
  },

  methods: {
    getTips: async function () {
      const helData = await RequestUtils.request(User.user.healthTips);
      this.setData({
        healthTip: helData.data.tips,
      });
    },

    getRecommendShops: async function () {
      console.log("进入了推荐门店");

      const shopList = await RequestUtils.request(
        Dishes.dishes.getRecommendShops
      );

      let List = shopList.data.list
        .map((item) => {
          return {
            id: item.id,
            image: item.image,
            shopName: item.shopName,
            coordinate: item.coordinate,
            mark: item.mark,
          };
        })
        .filter(Boolean);
      this.setData({
        recommendationResults: List,
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
      wx.showToast({
        title: "正在为您推荐",
        icon: "loading",
        duration: 1000,
      });
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/recommendation-result/recommendation-result",
        });
      }, 1000);
    },

    resetFilter() {
      this.setData({
        selectedCount: "3个", // 设置为默认值
        selectedCategory: "菜品", // 设置为默认值
      });
    },

    onPublishTap() {
      // this.triggerEvent("navigateToPage", { url: "/pages/publish/publish" });
      wx.navigateTo({
        url: "/pages/publish/publish-dishes/publish-dishes",
      });
    },

    onCollectionTap() {
      this.triggerEvent("navigateToPage", { url: "/pages/collect/collect" });
    },
    navigateToShop(event) {
      const shopId = event.currentTarget.dataset.shopid;
      console.log(shopId);
      wx.navigateTo({
        url: "/pages/shop/shop/shop?shopId=" + shopId,
      });
    },
  },

  ready: function () {
    console.log("Index component ready");
    this.getTips();
    this.getRecommendShops();
  },
});
