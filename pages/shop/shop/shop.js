import RequestUtils from "../../../utils/request_util";
import Dishes from "../../../services/api/dishes";
import Comment from "../../../services/api/comment";

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
      {
        id: "1849642654176563202",
        userId: "1795446000771051522",
        shopId: "1848368549850701826",
        parentId: null,
        content: "4",
        imageUrl: null,
        userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        userName: "桌角的眼镜",
        createTime: "2024-10-25 10:42:28",
        children: [
          {
            id: "1849668238390816769",
            userId: "1795446000771051522",
            shopId: "1848368549850701826",
            parentId: "1849642654176563202",
            content: "44",
            imageUrl: null,
            userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
            userName: "桌角的眼镜",
            createTime: "2024-10-25 12:24:08",
            children: [],
          },
          {
            id: "1849668234880184321",
            userId: "1795446000771051522",
            shopId: "1848368549850701826",
            parentId: "1849642654176563202",
            content: "43",
            imageUrl: null,
            userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
            userName: "桌角的眼镜",
            createTime: "2024-10-25 12:24:07",
            children: [],
          },
        ],
      },
      {
        id: "1849642333832400897",
        userId: "1795446000771051522",
        shopId: "1848368549850701826",
        parentId: null,
        content: "3",
        imageUrl: null,
        userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        userName: "桌角的眼镜",
        createTime: "2024-10-25 10:41:12",
        children: [],
      },
      {
        id: "1849635806291603457",
        userId: "1795446000771051522",
        shopId: "1848368549850701826",
        parentId: null,
        content: "2",
        imageUrl: null,
        userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        userName: "桌角的眼镜",
        createTime: "2024-10-25 10:15:15",
        children: [],
      },
      {
        id: "1849635789275312129",
        userId: "1795446000771051522",
        shopId: "1848368549850701826",
        parentId: null,
        content: "1",
        imageUrl: null,
        userAvatar: "2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        userName: "桌角的眼镜",
        createTime: "2024-10-25 10:15:11",
        children: [],
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
    Comment.comment.getShopCommentList.data = {
      shopId: shopId,
      page: 1,
    };

    const shopList = await RequestUtils.request(
      Comment.comment.getShopCommentList
    );
    const data = await RequestUtils.request(Dishes.dishes.getShopDetails);
    console.log(data);

    this.setData({
      shopId: shopId,
      dishes: data.data.dishesDetailsList,
      image: data.data.image,
      coordinate: data.data.coordinate,
      shopName: data.data.shopName,
      mark: data.data.mark,
      reviews: shopList.data.list,
    });
  },

  navigateToReviews: function () {
    wx.navigateTo({
      url: `/pages/reviews/all-reviews/all-reviews?shopId=${this.data.shopId}`,
    });
  },

  // 在 Page 对象中添加以下方法
  goToReview: function () {
    // 跳转到评论页面的逻辑
    wx.navigateTo({
      url: `/pages/reviews/write-review/write-review?shopId=${this.data.shopId}&shopName=${this.data.shopName}`,
    });
  },
});
