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

  console.log("这个是", auth);

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `http://192.168.235.2:12150/choose${url}`,
        method,
        data,
        header: config.header,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });

    // 检查响应状态码
    if (response.data.code === 200) {
      return response.data;
    } else if (response.data.code === 500) {
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
