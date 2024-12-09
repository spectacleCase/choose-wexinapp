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

const scanQRCode = (type) => {
  wx.scanCode({
    success(res) {
      console.log("扫描结果：", res);
      // 处理扫描结果
      const codeData = JSON.parse(res.result);
      console.log(codeData);

      switch (codeData.type) {
        case "addFriend":
          console.log(codeData);
          wx.navigateTo({
            url: `/pages/myself/edit_user_info/edit_user_info?isAdd=ture&id=${codeData.id}`,
          });
          console.log("这个是addFriend");
          break;

        default:
          break;
      }
    },
    fail(err) {
      console.error("扫描失败：", err);
    },
  });
};

module.exports = {
  formatTime,
  uploadFileUitl,
  scanQRCode,
};
