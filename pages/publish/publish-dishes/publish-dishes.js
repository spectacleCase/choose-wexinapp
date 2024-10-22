// pages/publish/publish-dishes/publish-dishes.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: ["中餐", "西餐", "日料", "韩餐"],
    shops: ["店铺1", "店铺2", "店铺3"],
    selectedCategory: "",
    selectedShop: "",
    selectedTags: [],
    showTagSelector: false,
    allTags: [
      { id: 1, tag: "辣" },
      { id: 2, tag: "甜" },
      { id: 3, tag: "酸" },
      { id: 4, tag: "咸" },
      { id: 5, tag: "素食" },
      { id: 6, tag: "海鲜" },
      { id: 7, tag: "烧烤" },
      { id: 8, tag: "炖煮" },
      { id: 9, tag: "凉拌" },
      { id: 10, tag: "小吃" },
      { id: 11, tag: "烧烤" },
      { id: 12, tag: "炖煮" },
      { id: 13, tag: "凉拌" },
      { id: 14, tag: "小吃" },
    ],
    tempFilePaths: [],
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

  showTagSelector() {
    this.setData({
      showTagSelector: true,
    });
  },

  hideTagSelector() {
    this.setData({
      showTagSelector: false,
    });
  },

  toggleTag(e) {
    const tagId = e.currentTarget.dataset.id;
    let selectedTags = this.data.selectedTags;
    const index = selectedTags.findIndex((item) => item.id === tagId);

    if (index > -1) {
      selectedTags.splice(index, 1);
    } else if (selectedTags.length < 5) {
      const tag = this.data.allTags.find((item) => item.id === tagId);
      selectedTags.push(tag);
    } else {
      wx.showToast({
        title: "最多只能选择5个标签",
        icon: "none",
      });
    }

    this.setData({ selectedTags });
  },

  confirmTags() {
    this.hideTagSelector();
  },

  publishDish() {
    console.log("发布菜品");
    // 实现发布逻辑
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedCategory: this.data.categories[index],
    });
  },

  onShopChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedShop: this.data.shops[index],
    });
  },

  addNewShop() {
    wx.navigateTo({
      url: "/pages/publish/publish-shop/publish-shop",
    });
  },

  chooseImage: function () {
    const maxImages = 5; // 将最大图片数量改为5
    const currentCount = this.data.tempFilePaths.length;
    wx.chooseImage({
      count: maxImages - currentCount,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        // 将新选择的图片添加到数组的开头
        const newTempFilePaths = res.tempFilePaths.concat(
          this.data.tempFilePaths
        );
        this.setData({
          tempFilePaths: newTempFilePaths.slice(0, maxImages),
        });
      },
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.tempFilePaths, // 需要预览的图片http链接列表
    });
  },

  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index;
    let tempFilePaths = this.data.tempFilePaths;
    tempFilePaths.splice(index, 1);
    this.setData({
      tempFilePaths: tempFilePaths,
    });
  },
});
