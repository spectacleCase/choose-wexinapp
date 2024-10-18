// pages/login.js
import Auth from "../../services/api/auth.js";
import RequestUtils from "../../utils/request_util";
// 引入 toast 模块
const toast = require("../../companies/toast.js").default;

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  test: function () {
    console.log("进入了");
    Auth.auth.login.data = {
      code: "1234",
    };
    RequestUtils.request(Auth.auth.login)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      // 用户同意授权
      wx.login({
        success: (res) => {
          if (res.code) {
            // 获取到登录凭证（code）
            console.log("登录成功，code:", res.code);
            Auth.auth.login.data = {
              code: res.code,
            };
            wx.showLoading({
              title: "登录中",
            });
            // const token = {
            //   token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjkzNTY3NzQsInVzZXJJZCI6IjE3OTU0NDYwMDA3NzEwNTE1MjIifQ.1xYB_fSJgU0QtklbAu6lrO5QmAbf90ugL4Ujfwrk6JA",
            //   tokenTimeout: "2024-12-22 00:52:54",
            // };
            // wx.setStorageSync("token", token);
            // wx.hideLoading();
            // toast.showToast("登录成功", "success");
            // setTimeout(() => {
            //   wx.reLaunch({
            //     url: "/pages/main/main",
            //   });
            // }, 500);
            RequestUtils.request(Auth.auth.login)
              .then((data) => {
                const token = {
                  token: data.data.token,
                  tokenTimeout: data.data.tokenTimeout,
                };
                wx.setStorageSync("token", token);
                wx.setStorageSync("userInfo", data.data.userInfo);
                wx.hideLoading();
                // 使用新的 toast 方法
                toast.showToast("登录成功", "success");
                setTimeout(() => {
                  wx.switchTab({
                    url: "/pages/main/main",
                  });
                }, 500);
              })
              .catch((err) => {
                wx.showToast({
                  title: "登录失败",
                  icon:"error"
                });
                console.log(err);
                // 使用新的 toast 方法显示错误信息
                toast.showToast("登录失败", "error");
              });
          } else {
            console.log("登录失败：" + res.errMsg);
            // 使用新的 toast 方法显示错误信息
            toast.showToast("登录失败", "error");
          }
        },
      });
    } else {
      // 用户拒绝授权
      console.log("用户拒绝授权");
      // 使用新的 toast 方法显示提示信息
      toast.showToast("授权失败", "error");
    }
  },
});
