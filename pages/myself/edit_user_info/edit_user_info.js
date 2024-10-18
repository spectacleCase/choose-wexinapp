// pages/myself/edit_user_info.js
import RequestUtils from "../../../utils/request_util";
import User from "../../../services/api/user";
import util from "../../../utils/util";

Page({
  data: {
    userInfo: {
      avatar: "",
      nickname: "",
      gender: "",
      phone: "",
      description: "",
    },
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
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        const fileData = await util.uploadFileUitl(tempFilePaths[0]);
        User.user.upateAvatar.data = fileData.filePath;
        await RequestUtils.request(User.user.upateAvatar);
        const userData = await RequestUtils.request(User.user.getUser);
        console.log(userData);
        wx.setStorageSync("userInfo", userData.data);
        this.setData({
          userInfo: userData.data,
        });
        // wx.uploadFile({
        //   //! 图片要上传到的后端接口url,会返回图片的外网url
        //   url: "http://localhost:12150/choose/common/v1/upload",
        //   // 被上传的文件的路径url
        //   filePath: tempFilePaths[0],
        //   // 上传的文件的名称 后台来获取文件
        //   name: "file",
        //   // 顺带的文本信息
        //   formData: {},
        //   success: (result) => {
        //     console.log(result.data);
        //     const resFile = JSON.parse(result.data);
        //     this.setData({
        //       "userInfo.avatar": resFile.data.fileName,
        //     });
        //   },
        // });

        // 这里应该上传图片到服务器
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

    User.user.setUser.data = {
      nickname: this.data.userInfo.nickname,
      avatar: this.data.userInfo.avatar,
      gender: this.data.userInfo.gender,
      description: this.data.userInfo.description,
    };
    RequestUtils.request(User.user.setUser).then((res) => {
      wx.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
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
