const request = async (config) => {
  const {
    url,
    method,
    auth,
    data
  } = config;
  console.log(auth);
  // 检查是否需要鉴权
  if (auth) {
    const token = wx.getStorageSync('token'); 
    if (!token) {
      // 如果没有token，跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login',
      });
      return;
    }
    // 如果有token，将其添加到请求头
    config.header = {
      ...config.header,
      Authorization: `Bearer ${token}`,
    };
  }
  console.log("这个是", auth);
  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `http://localhost:12150/choose${url}`,
        method,
        data,
        header: config.header,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
    return response.data;
  } catch (error) {
    // 处理错误
    throw error;
  }
};



export default {
  request
};