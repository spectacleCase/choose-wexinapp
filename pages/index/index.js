// components/index-component/index-component.js
import RequestUtils from "../../utils/request_util";
import User from "../../services/api/user";
import Dishes from "../../services/api/dishes";
import util from "../../utils/util.js";
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
    searchInput: "",
    // 论文 5.2 常用查询示例
    queryExamples: [
      "附近适合减脂期的健康粤菜",
      "想吃辣但最近胃不好",
      "推荐适合约会的餐厅",
      "人均80元的清淡日料",
      "高蛋白低脂的午餐",
      "想吃热的暖胃的",
    ],
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
    refreshData() {
      console.log("index 组件正在刷新数据...");
      // 在这里实现你的刷新逻辑
    },
    getTips: async function () {
      const helData = await RequestUtils.request(User.user.healthTips);
      this.setData({
        healthTip: helData.data.tips,
      });
    },

    getRecommendShops: async function () {
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
      this.setData({ searchInput: e.detail.value || "" });
    },
    goToScan() {
      util.scanQRCode();
    },

    showFilterOptions() {
      this.setData({
        showFilter: true,
      });
    },

    showRecommendOptions() {
      this.setData({
        showRecommend: true,
      });
    },

    onCountSelect(e) {
      const selectedCount = e.currentTarget.dataset.count;
      this.setData({
        selectedCount,
      });
    },

    onCategorySelect(e) {
      const selectedCategory = e.currentTarget.dataset.category;
      this.setData({
        selectedCategory,
      });
    },

    confirmFilter() {
      this.setData({
        showFilter: false,
      });
      // 这里可以添加筛选后的逻辑,如更新推荐列表
    },

    confirmRecommend() {
      this.setData({
        showRecommend: false,
      });
      this.getRecommendations();
    },

    onRecommendTap() {
      // 直接调用获取推荐的函数，不显示弹出层
      this.getRecommendations();
    },

    getRecommendations() {
      // 论文 5.2: 把搜索框内容(若有)作为自然语言 query 传给 Agent 推荐流
      const query = (this.data.searchInput || "").trim() || "为我推荐美食";
      wx.showToast({
        title: "Agent 协作推荐中",
        icon: "loading",
        duration: 1500,
      });
      // 同步取定位,失败不阻塞
      const go = (location) => {
        const url = `/pages/recommendation-result/recommendation-result`
          + `?selectedCount=${this.data.selectedCount}`
          + `&query=${encodeURIComponent(query)}`
          + (location ? `&location=${encodeURIComponent(location)}` : "");
        setTimeout(() => wx.navigateTo({ url }), 800);
      };
      wx.getLocation({
        type: "gcj02",
        success: (res) => go(res.longitude + "," + res.latitude),
        fail: () => go(""),
      });
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
      this.triggerEvent("navigateToPage", {
        url: "/pages/collect/collect",
      });
    },
    navigateToShop(event) {
      const shopId = event.currentTarget.dataset.shopid;
      console.log(shopId);
      wx.navigateTo({
        url: "/pages/shop/shop/shop?shopId=" + shopId,
      });
    },

    goToSearch() {
      wx.navigateTo({
        url: "/pages/search/search", // 跳转到搜索页面
      });
    },

    /** 论文 5.2 常用查询示例: 点击 chip 直接带 keyword 跳搜索页 */
    onExampleTap(e) {
      const text = e.currentTarget.dataset.text;
      if (!text) return;
      wx.navigateTo({
        url: "/pages/search/search?keyword=" + encodeURIComponent(text),
      });
    },
  },

  ready: function () {
    console.log("Index component ready");
    this.getTips();
    this.getRecommendShops();
  },
});
