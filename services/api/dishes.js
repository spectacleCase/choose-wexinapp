const BASE_URL = "/dishes";
/**
 *  菜品相关接口
 */
const dishes = {
  //添加新店铺
  addShop: {
    url: BASE_URL + "/v1/addShop",
    method: "POST",
    data: null,
    auth: true,
  },
  // 添加新菜品
  addMark: {
    url: BASE_URL + "/v1/addMark",
    method: "POST",
    data: null,
    auth: true,
  },

  //获取全部店铺
  getShopList: {
    url: BASE_URL + "/v1/getShopList",
    method: "POST",
    data: null,
    auth: true,
  },

  // 首页获取推荐店铺
  getRecommendShops: {
    url: BASE_URL + "/v1/getRecommendShops",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  dishes,
};
