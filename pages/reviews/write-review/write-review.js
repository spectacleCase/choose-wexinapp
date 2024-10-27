Page({
  data: {
    shopName: '',
    content: '',
    imagePaths: []
  },

  onLoad: function(options) {
    this.setData({
      shopName: options.shopName || '未知店铺'
    });
  },

  onContentInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  chooseImage: function() {
    wx.chooseImage({
      count: 9 - this.data.imagePaths.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imagePaths: this.data.imagePaths.concat(res.tempFilePaths)
        });
      }
    });
  },

  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const imagePaths = this.data.imagePaths;
    imagePaths.splice(index, 1);
    this.setData({ imagePaths });
  },

  previewImage: function(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imagePaths
    });
  },

  submitReview: function() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    // 这里添加提交评论的逻辑
    console.log('提交评论:', {
      content: this.data.content,
      images: this.data.imagePaths
    });
    wx.showToast({
      title: '评论提交成功',
      icon: 'success'
    });
  }
});
