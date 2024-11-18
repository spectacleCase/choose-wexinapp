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

  // 获取当前的天气情况
  getWeather: {
    url: BASE_URL + "/v1/getWeather",
    method: "POST",
    auth: true,
    data: null,
  },
  // 获取全部标签
  getTag: {
    url: BASE_URL + "/v1/getTag",
    method: "POST",
    auth: true,
    data: null,
  },
  // 获取历史搜索
  getSearchHistory: {
    url: BASE_URL + "/v1/getSearchHistory",
    method: "POST",
    auth: true,
    data: null,
  },
  // 匹配搜索词
  search_terms: {
    url: BASE_URL + "/v1/search_terms?keyword=",
    method: "POST",
    auth: true,
    data: null,
  },
};

export default {
  common,
};
