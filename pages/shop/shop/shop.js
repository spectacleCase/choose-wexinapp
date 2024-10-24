import RequestUtils from "../../../utils/request_util";
import Dishes from "../../../services/api/dishes";

// pages/shop/shop/shop.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: null,
    activeTab: "dishes",
    scrollIntoView: "",
    iamge: "",
    coordinate: "",
    shopName: "",
    mark: null,
    dishes: [
      // 示例菜品数据

      {
        id: 1,
        dishesNmae: "示例菜品1",
        dishesImage:
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        dishesTags: ["热销", "推荐"],
      },
    ],
    reviews: [
      // 示例评价数据

      {
        id: 1,
        name: "用户1",
        avatar: "../../../assets/images/OIP-C.jpg",
        date: "2023-04-01",
        rating: 4.5,
        content: "很好吃！",
      },

      {
        id: 2,
        name: "用户2",
        avatar: "../../../assets/images/功能排行榜.png",
        date: "2023-03-30",
        rating: 3,
        content:
          "这些修改实现了以下效果：选项卡（tab-bar）不再平分整行，而是从左到右排列，右边留白。！菜品部分的布局调整为图片在左，标题和标签在右。标题字体变大。",
      },
    ],
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  navigateToDishes(event) {
    let id = event.currentTarget.dataset.dishesid;
    let dishesList = this.data.dishes
      .map((item) => {
        return {
          id: item.id,
          dishesName: item.dishesName,
          iamge: item.dishesImage,
          dishesTag: item.dishesTags,
        };
      })
      .filter(Boolean);
    dishesList = JSON.stringify(dishesList);
    wx.navigateTo({
      url: `/pages/shop/dishes/dishes?id=${id}&data=${encodeURIComponent(
        dishesList
      )}`,
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });

    // 滚动到对应的部分
    wx.createSelectorQuery()
      .select(`#${tab}-section`)
      .boundingClientRect((rect) => {
        wx.createSelectorQuery()
          .select(".sticky-wrapper")
          .boundingClientRect((stickyRect) => {
            wx.pageScrollTo({
              scrollTop: rect.top - stickyRect.height,
              duration: 300,
            });
          })
          .exec();
      })
      .exec();
  },

  navigate() {
    let location = this.data.coordinate.split(",");

    // 实现导航功能
    wx.openLocation({
      latitude: Number(location[1]),
      longitude: Number(location[0]),
      name: this.data.shopName,
      address: "店铺地址",
    });
  },

  onPageScroll(e) {
    const query = wx.createSelectorQuery();
    query.select("#dishes-section").boundingClientRect();
    query.select("#reviews-section").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      const [dishesSection, reviewsSection, scrollOffset] = res;

      // 更新活动标签
      const scrollTop = scrollOffset.scrollTop;
      const windowHeight = wx.getWindowInfo().windowHeight;

      if (
        dishesSection.top <= windowHeight / 2 &&
        dishesSection.bottom >= windowHeight / 2
      ) {
        this.setData({ activeTab: "dishes" });
      } else if (
        reviewsSection.top <= windowHeight / 2 &&
        reviewsSection.bottom >= windowHeight / 2
      ) {
        this.setData({ activeTab: "reviews" });
      }
    });
  },

  onLoad: async function (options) {
    // 获取传递的参数
    const shopId = options.shopId;
    console.log(options);
    console.log("Shop ID:", shopId);
    Dishes.dishes.getShopDetails.data = {
      shopId: shopId,
    };
    const data = await RequestUtils.request(Dishes.dishes.getShopDetails);
    console.log(data);

    this.setData({
      shopId: shopId,
      dishes: data.data.dishesDetailsList,
      image: data.data.image,
      coordinate: data.data.coordinate,
      shopName: data.data.shopName,
      mark: data.data.mark,
    });
  },

  methods: {
    navigateToDishes: function () {
      wx.navigateTo({
        url: "/pages/shop/dishes/dishes",
      });
    },
  },
});
