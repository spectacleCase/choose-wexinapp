const BASE_URL = "/tag";
/**
 *  推荐相关的
 */
const tag = {
  // 获取全部标签
  getTag: {
    url: BASE_URL + "/v1/recommend-record",
    method: "POST",
    auth: true,
    data: null,
  },

};

export default {
  tag,
};
