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
    imageNames: [],
    isSubmitting: false,
  },

  onLoad: function (options) {
    console.log(options);
    console.log("店铺");

    this.setData({
      shopName: options.shopName || "未知店铺",
      shopId: options.shopId,
    });

    this.submitReview = this.debounce(this._submitReview.bind(this), 500);
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
        const imageNames = this.data.imageNames.concat(fileData.filePath);
        this.setData({
          imagePaths: shopImages.slice(0, maxImages),
          imageNames: imageNames,
        });
        toast.showToast("保存成功", "success");
      },
    });
  },

  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const imagePaths = this.data.imagePaths;
    const imageNames = this.data.imageNames;
    imagePaths.splice(index, 1);
    imageNames.splice(index, 1);
    this.setData({ imagePaths, imageNames });
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imagePaths,
    });
  },

  debounce(fn, delay = 500) {
    let timer = null;
    return function (...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },

  async _submitReview() {
    if (this.data.isSubmitting) return;

    if (!this.data.content.trim()) {
      wx.showToast({
        title: "请输入评论内容",
        icon: "none",
      });
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      let images = "";
      this.data.imageNames.forEach((item) => {
        images += item + ",";
      });
      if (images.length > 0) {
        images = images.slice(0, -1);
      }
      console.log(this.data.imageNames);
      console.log(images);

      let user = wx.getStorageSync("userInfo");
      Comment.comment.addShopComment.data = {
        topId: "",
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
    } catch (error) {
      console.error("提交评论失败:", error);
      toast.showToast("评论提交失败，请重试", "error");
    } finally {
      this.setData({ isSubmitting: false });
    }
  },

  submitReview: null,
});
