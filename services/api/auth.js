const BASE_URL = "/user"
const auth = {
  // 鉴权相关接口
  login: {
    url: BASE_URL + '/v1/login-applet',
    method: 'POST',
    data: null,
    auth: false,
  },
  getDate: {
    url: "/getData",
    method: 'GET',
    auth: true
  }
}

export default {
  auth
}