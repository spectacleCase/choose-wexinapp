// pages/shop/dishes/dishes.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    currentCategory: 1,
    currentDish: {},
    comments: [],
    isDropdownVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 模拟获取分类数据
    this.setData({
      categories: [
        { id: 1, name: "热门" },
        { id: 2, name: "主食" },
        { id: 3, name: "小吃" },
        { id: 4, name: "饮品" },
      ],
    });

    // 模拟获取当前菜品数据
    this.setData({
      currentDish: {
        title: "红烧肉",
        image:
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        tags: ["热门", "肉类", "家常菜"],
        description: "红烧肉是一道著名的中国菜，口感软糯，味道浓郁。",
      },
    });

    // 模拟获取评论数据
    this.setData({
      comments: [
        {
          id: 1,
          userAvatar: "https://example.com/avatar1.jpg",
          userName: "张三",
          time: "2023-04-15 12:30",
          rating: 5,
          content: "非常好吃，肉质鲜嫩，味道浓郁！",
        },
        {
          id: 2,
          userAvatar: "https://example.com/avatar2.jpg",
          userName: "李四",
          time: "2023-04-14 18:45",
          rating: 4,
          content: "整体不错，就是有点偏咸。",
        },
      ],
    });
  },

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

  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId
    });
    // 这里应该根据分类 ID 获取对应的菜品数据
    console.log('切换到分类：', categoryId);
  },

  toggleCategoryDropdown() {
    this.setData({
      isDropdownVisible: !this.data.isDropdownVisible
    });
  },

  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId,
      isDropdownVisible: false
    });
    // 这里应该根据分类 ID 获取对应的菜品数据
    console.log('选择并切换到分类：', categoryId);
  }
});
