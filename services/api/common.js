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
  // 删除全部的搜索词
  delSearch: {
    url: BASE_URL + "/v1/delSearch",
    method: "POST",
    auth: true,
    data: null,
  },

  // 搜索结果
  search: {
    url: BASE_URL + "/v1/search?keyword=",
    method: "POST",
    auth: true,
    data: null,
  },
  // 查询地址名称和距离
  getAddressDit: {
    url: BASE_URL + "/v1/getAddressDit",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  common,
};
