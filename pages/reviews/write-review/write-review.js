import util from "../../../utils/util";
const toast = require("../../../companies/toast.js").default;
import RequestUtil from "../../../utils/request_util.js";
import Comment from "../../../services/api/comment.js";
Page({
  data: {
    shopName: "",
    shopId: null,
    content: "",
    imagePaths: [],
  },

  onLoad: function (options) {
    console.log(options);
    console.log("店铺");

    this.setData({
      shopName: options.shopName || "未知店铺",
      shopId: options.shopId,
    });
  },

  onContentInput: function (e) {
    this.setData({
      content: e.detail.value,
    });
  },

  chooseImage: function () {
    const maxImages = 3;
    wx.chooseImage({
      count: maxImages - this.data.imagePaths.length,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        wx.showLoading({
          title: "正在上传中",
        });
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        const fileData = await util.uploadFileUitl(tempFilePaths[0]);
        const shopImages = this.data.imagePaths.concat(fileData.fileName);
        this.setData({
          imagePaths: shopImages.slice(0, maxImages),
        });
        toast.showToast("保存成功", "success");
      },
    });
  },

  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const imagePaths = this.data.imagePaths;
    imagePaths.splice(index, 1);
    this.setData({ imagePaths });
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imagePaths,
    });
  },

  submitReview: async function () {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: "请输入评论内容",
        icon: "none",
      });
      return;
    }

    // 这里添加提交评论的逻辑
    console.log("提交评论:", {
      content: this.data.content,
      images: this.data.imagePaths,
    });

    let images = "";
    this.data.imagePaths.forEach((item) => {
      images = item + ",";
    });
    if (images.length > 0) {
      images = images.slice(0, -1);
    }
    let user = wx.getStorageSync("userInfo");
    Comment.comment.addShopComment.data = {
      shopId: this.data.shopId,
      content: this.data.content,
      imageUrl: images,
      sendAvatar: user.avatar,
      senderName: user.nickname,
      parentId: "",
      senderId: "",
    };
    await RequestUtil.request(Comment.comment.addShopComment);
    toast.showToast("评论提交成功", "success");
    setTimeout(() => {
      wx.navigateBack();
    }, 2000);
  },
});
