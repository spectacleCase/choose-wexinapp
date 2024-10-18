import ApiBaseUrl from "../config/config";
import RequestCode from "../constant/RequestCodeConstant";
const request = async (config) => {
  const { url, method, auth, data } = config;

  console.log(auth);

  // 检查是否需要鉴权
  if (auth) {
    const token = wx.getStorageSync("token");
    if (!token) {
      // 如果没有token，跳转到登录页面
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return;
    }
    // 如果有token，将其添加到请求头
    config.header = {
      ...config.header,
      Token: token.token,
    };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${ApiBaseUrl.apiBaseUrl}${url}`,
        method,
        data,
        header: config.header,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
    console.log(response);

    if (response.statusCode === RequestCode.UNAUTHORIZED) {
      wx.removeStorageSync("token");
      wx.removeStorageSync("userInfo");
      wx.showToast({
        title: "请重新登录",
      });
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/login/login",
        });
      }, 500);

      return;
    } else if (response.data.code === RequestCode.SUCCESS) {
      // 检查响应状态码
      return response.data;
    } else if (response.data.code === RequestCode.ERROR) {
      throw new Error("服务器内部错误");
    } else {
      throw new Error(`请求失败，状态码：${response.data.code}`);
    }
  } catch (error) {
    // 处理错误
    throw error;
  }
};

export default {
  request,
};
