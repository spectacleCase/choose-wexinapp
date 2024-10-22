// pages/shop/shop/shop.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeTab: "dishes",
    scrollIntoView: "",
    dishes: [
      // 示例菜品数据

      {
        id: 1,
        title: "示例菜品1",
        image:
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        tags: ["热销", "推荐"],
      },
      {
        id: 1,
        title: "示例菜品1",
        image:
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        tags: ["热销", "推荐"],
      },
      { id: 2, title: "示例菜品2", image: "path/to/dish2.jpg", tags: ["新品"] },
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
    shopRating: 2, // 店铺总评分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

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
    // 实现导航功能
    wx.openLocation({
      latitude: 0, // 替换为实际纬度
      longitude: 0, // 替换为实际经度
      name: "店铺名称",
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

  methods: {},
});
