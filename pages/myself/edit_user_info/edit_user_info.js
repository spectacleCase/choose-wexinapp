// pages/myself/edit_user_info.js
import RequestUtils from "../../../utils/request_util";
import User from "../../../services/api/user";
import util from "../../../utils/util";
const toast = require("../../../companies/toast.js").default;

Page({
  data: {
    userInfo: {
      avatar: "",
      nickname: "",
      gender: "",
      phone: "",
      description: "",
    },
    filePath: "",
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync("userInfo");
    console.log("Initial userInfo:", userInfo);
    this.setData({ userInfo });
  },

  changeAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: async (res) => {
        wx.showLoading({
          title: "正在上传中",
        });
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        const fileData = await util.uploadFileUitl(tempFilePaths[0]);
        this.setData({
          "userInfo.avatar": fileData.fileName,
          filePath: fileData.filePath,
        });
        wx.setStorageSync("userInfo", this.data.userInfo);
        toast.showToast("保存成功", "success");
      },
    });
  },

  onNicknameChange: function (e) {
    this.setData({
      "userInfo.nickname": e.detail.value,
    });
  },

  onGenderChange: function (e) {
    this.setData({
      "userInfo.gender": e.detail.value,
    });
  },

  onPhoneChange: function (e) {
    this.setData({
      "userInfo.phone": e.detail.value,
    });
  },

  onDescriptionChange: function (e) {
    console.log("Signature changed:", e.detail.value);
    this.setData({
      "userInfo.description": e.detail.value,
    });
  },

  saveUserInfo: function () {
    // 这里应该将修改后的用户信息保存到服务器
    console.log("保存的用户信息：", this.data.userInfo);
    wx.showLoading({
      title: "正在保存中",
    });
    User.user.setUser.data = {
      nickname: this.data.userInfo.nickname,
      avatar: this.data.filePath,
      gender: this.data.userInfo.gender,
      description: this.data.userInfo.description,
    };
    RequestUtils.request(User.user.setUser).then((res) => {
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
      console.log(res.data);
      if (!res.data) {
        wx.getStorageSync("userInfo", res.data);
      }
      toast.showToast("保存成功", "success");
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    });

    // 保存成功后返回上一页
  },
  getUser: async function () {
    const userData = await RequestUtils.request(User.user.getUser);
    console.log(userData);
  },
});
