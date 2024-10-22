// pages/publish/publish-shop/publish-shop.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopName: "",
    shopImages: [],
    location: "",
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

  onShopNameInput(e) {
    this.setData({
      shopName: e.detail.value,
    });
  },

  chooseImage() {
    const maxImages = 3;
    const currentCount = this.data.shopImages.length;
    wx.chooseImage({
      count: maxImages - currentCount,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const newImages = res.tempFilePaths;
        const shopImages = this.data.shopImages.concat(newImages);
        this.setData({
          shopImages: shopImages.slice(0, maxImages),
        });
      },
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const shopImages = this.data.shopImages;
    shopImages.splice(index, 1);
    this.setData({ shopImages });
  },

  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res.address,
        });
      },
    });
  },

  publishShop() {
    if (!this.data.shopName) {
      wx.showToast({
        title: "请输入店铺名称",
        icon: "none",
      });
      return;
    }

    if (this.data.shopImages.length === 0) {
      wx.showToast({
        title: "请上传至少一张店铺图片",
        icon: "none",
      });
      return;
    }

    if (!this.data.location) {
      wx.showToast({
        title: "请选择店铺位置",
        icon: "none",
      });
      return;
    }

    // 这里添加发布店铺的逻辑
    console.log("发布店铺", this.data);
    wx.showToast({
      title: "店铺发布成功",
      icon: "success",
      duration: 2000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      },
    });
  },
});
