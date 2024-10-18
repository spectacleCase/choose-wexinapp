const BASE_URL = "/common";
const common = {
  // 鉴权相关接口
  upload: {
    url: BASE_URL + "/v1/upload",
    method: "POST",
    auth: true,
    data: null,
  },
};

export default {
  common,
};
