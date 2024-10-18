const BASE_URL = "/common";
/**
 * 通用接口
 */
const common = {

  // 上传文件接口
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
