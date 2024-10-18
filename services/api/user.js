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

  healthTips: {
    url: BASE_URL + "/v1/health-tips",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  user,
};
