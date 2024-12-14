// pages/publish/publish-dishes/publish-dishes.js

import util from "../../../utils/util";
import RequestUtil from "../../../utils/request_util.js";
import Dishes from "../../../services/api/dishes.js";
import Ranking from "../../../services/api/ranking.js";
import Common from "../../../services/api/common.js";
const toast = require("../../../companies/toast.js").default;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      { id: 1, columnName: "中餐" },
      { id: 2, columnName: "西餐" },
      { id: 3, columnName: "日料" },
      { id: 4, columnName: "韩餐" },
      { id: 5, columnName: "中餐" },
    ],
    shops: [
      { id: 1, shopName: "店铺1" },
      { id: 2, shopName: "店铺2" },
      { id: 3, shopName: "店铺3" },
    ],
    selectedCategory: null,
    selectedShop: null,
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
    DishesName: "",
  },

  onDishesNameInput(e) {
    this.setData({
      dishesName: e.detail.value,
    });
  },
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

  async publishDish() {
    console.log(this.data);

    if (!this.data.dishesName) {
      wx.showToast({
        title: "请输入菜品名称",
        icon: "none",
      });
      return;
    }

    if (this.data.tempFilePaths.length === 0) {
      wx.showToast({
        title: "请上传至少一张店铺图片",
        icon: "none",
      });
      return;
    }

    if (!this.data.selectedCategory) {
      wx.showToast({
        title: "请选择一个栏目",
        icon: "none",
      });
      return;
    }

    if (!this.data.selectedShop) {
      wx.showToast({
        title: "请选择所属店铺",
        icon: "none",
      });
      return;
    }

    if (this.data.selectedTags.length === 0) {
      wx.showToast({
        title: "请选择相关标签",
        icon: "none",
      });
      return;
    }
    let images = "";
    this.data.tempFilePaths.forEach((item) => {
      images += item + ",";
    });

    // 删除最后一个逗号
    if (images.length > 0) {
      images = images.slice(0, -1);
    }
    let ids = [];
    this.data.selectedTags.forEach((item) => {
      ids.push(String(item.id));
    });
    console.log(this.data.dishesName);
    console.log(images);

    Dishes.dishes.addMark.data = {
      dishesName: this.data.dishesName,
      image: images,
      columId: this.data.selectedCategory.id,
      shop: this.data.selectedShop.id,
      tagIds: ids,
    };
    await RequestUtil.request(Dishes.dishes.addMark);
    toast.showToast("发布成功", "success");
    this.setData({
      dishesName: "",
      tempFilePaths: [],
      selectedCategory: null,
      selectedShop: null,
      selectedTags: [],
    });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const selectedCategory = this.data.categories[index];
    this.setData({
      selectedCategory: selectedCategory,
    });
  },

  onShopChange(e) {
    const index = e.detail.value;
    const selectedShop = this.data.shops[index];
    this.setData({
      selectedShop: selectedShop,
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
      success: async (res) => {
        wx.showLoading({
          title: "正在上传中",
        });
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        const fileData = await util.uploadFileUitl(tempFilePaths[0]);
        const shopImages = this.data.tempFilePaths.concat(fileData.fileName);
        this.setData({
          tempFilePaths: shopImages.slice(0, maxImages),
        });
        wx.showToast({
          title: "菜品发布成功",
          icon: "success",
          duration: 2000,
        });
      },
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.tempFilePaths,
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

  onLoad: async function () {
    console.log("进入");
    try {
      const columnList = await RequestUtil.request(
        Ranking.ranking.getColumnList
      );
      const shopList = await RequestUtil.request(Dishes.dishes.getShopList);
      const tagList = await RequestUtil.request(Common.common.getTag);
      let formattedShopList = [];
      let formattedColumnList = [];
      let formattedTagList = [];
      formattedShopList = shopList.data.list.map((shop) => ({
        id: shop.id,
        shopName: shop.shopName,
      }));
      formattedColumnList = columnList.data.list.map((column) => ({
        id: column.id,
        columnName: column.columnName,
      }));
      formattedTagList = tagList.data.list
        .map((tag) => {
          if (tag.tag !== "口味" && tag.tag !== "距离") {
            return {
              id: tag.id,
              tag: tag.tag,
            };
          }
        })
        .filter(Boolean);

      this.setData({
        shops: formattedShopList,
        categories: formattedColumnList,
        allTags: formattedTagList,
        selectedShop:
          formattedShopList.length > 0 ? formattedShopList[0] : null,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      wx.showToast({
        title: "获取数据失败",
        icon: "none",
      });
    }
  },
});
