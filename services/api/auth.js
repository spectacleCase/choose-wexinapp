const BASE_URL = "/user";
/**
 *  鉴权相关接口
 */
const auth = {
  //登录
  login: {
    url: BASE_URL + "/v1/login-applet",
    method: "POST",
    data: null,
    auth: false,
  },
};

export default {
  auth,
};
