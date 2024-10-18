const BASE_URL = "/user";
const user = {
  // 用户相关接口
  setUser: {
    url: BASE_URL + "/v1/setUser",
    method: "POST",
    data: null,
    auth: true,
  },
  upateAvatar: {
    url: BASE_URL + "/v1/updateAvatar",
    method: "POST",
    data: null,
    auth: true,
  },
  getUser: {
    url: BASE_URL + "/v1/getUser",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  user,
};
