// utils/uploadFile.js
import Upload from "../services/api/common";
import ApiBaseUrl from "../config/config";

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${[year, month, day].map(formatNumber).join("/")} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(":")}`;
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

const uploadFileUitl = async (filePath, formData = {}) => {
  try {
    // let token = JSON.parse(wx.getStorageSync("token")).token;
    const token = wx.getStorageSync("token");
    console.log(token);

    if (!token.token) {
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return;
    }
    const response = await new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${ApiBaseUrl.apiBaseUrl}${Upload.common.upload.url}`,
        filePath,
        name: "file",
        formData: formData,
        header: {
          ...Upload.common.upload.header,
          Token: token.token,
        },
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });

    // 解析返回的 JSON 数据
    const result = JSON.parse(response.data);

    // 检查响应状态码
    if (result.code === 200) {
      console.log(result.data);
      return result.data;
    } else if (result.code === 500) {
      throw new Error("服务器内部错误");
    } else {
      throw new Error(`请求失败，状态码：${result.code}`);
    }
  } catch (error) {
    // 处理错误
    throw error;
  }
};

module.exports = {
  formatTime,
  uploadFileUitl,
};
