// pages/publish/publish-shop/publish-shop.js
import util from "../../../utils/util";
const toast = require("../../../companies/toast.js").default;
import RequestUtil from "../../../utils/request_util.js";
import Dishes from "../../../services/api/dishes.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopImages: [],
    location: {
      lat: "",
      lng: "",
      address: "",
    },
    shop: {
      shopName: "",
      image: "",
      coordinate: "",
    },
    isAdd: false,
  },

  onShopNameInput(e) {
    this.setData({
      "shop.shopName": e.detail.value,
    });
  },

  chooseImage() {
    const maxImages = 3;
    const currentCount = this.data.shopImages.length;
    wx.chooseImage({
      count: maxImages - currentCount,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        wx.showLoading({
          title: "正在上传中",
        });
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        const fileData = await util.uploadFileUitl(tempFilePaths[0]);
        const shopImages = this.data.shopImages.concat(fileData.fileName);
        this.setData({
          shopImages: shopImages.slice(0, maxImages),
        });
        toast.showToast("保存成功", "success");
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
        console.log(res);

        this.setData({
          "location.address": res.address,
          "location.lat": res.latitude,
          "location.lng": res.longitude,
        });
        console.log(this.data.location);
      },
    });
  },

  async publishShop() {
    if (!this.data.shop.shopName) {
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

    if (!this.data.location.lat && !this.data.location.lng) {
      wx.showToast({
        title: "请选择店铺位置",
        icon: "none",
      });
      return;
    }

    // 这里添加发布店铺的逻辑
    console.log("发布店铺", this.data);
    let images = "";
    this.setData({
      isAdd: true,
    });
    this.data.shopImages.forEach((item) => {
      images += item + ",";
    });

    // 删除最后一个逗号
    if (images.length > 0) {
      images = images.slice(0, -1);
    }

    Dishes.dishes.addShop.data = {
      shopName: this.data.shop.shopName,
      image: images,
      coordinate: this.data.location.lat + "," + this.data.location.lng,
    };
    await RequestUtil.request(Dishes.dishes.addShop);
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
