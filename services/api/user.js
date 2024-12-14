import auth from "./auth";

const BASE_URL = "/user";
/**
 *  用户相关接口
 */
const user = {
  // 修改用户信息
  setUser: {
    url: BASE_URL + "/v1/setUser",
    method: "POST",
    data: null,
    auth: true,
  },

  // 修改用户头像
  upateAvatar: {
    url: BASE_URL + "/v1/updateAvatar",
    method: "POST",
    data: null,
    auth: true,
  },

  // 获取用户信息
  getUser: {
    url: BASE_URL + "/v1/getUser",
    method: "POST",
    data: null,
    auth: true,
  },
  // 每天随机健康小知识
  healthTips: {
    url: BASE_URL + "/v1/health-tips",
    method: "POST",
    data: null,
    auth: true,
  },
  // 用户的二维码
  getUseroR: {
    url: BASE_URL + "/v1/getUserOR",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  user,
};
