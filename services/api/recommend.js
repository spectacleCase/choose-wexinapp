const BASE_URL = "/recommend";
/**
 *  推荐相关的
 */
const recommend = {
  // 获取推荐记录
  recommendRecord: {
    url: BASE_URL + "/v1/recommend-record",
    method: "POST",
    auth: true,
    data: null,
  },
};

export default {
  recommend,
};
