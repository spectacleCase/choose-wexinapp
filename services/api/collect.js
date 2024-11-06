const BASE_URL = "/collect";

const collect = {
  // 添加收藏
  addCollection: {
    url: BASE_URL + "/v1/addCollection",
    method: "POST",
    data: null,
    auth: true,
  },
  // 删除收藏
  deleteCollection: {
    url: BASE_URL + "/v1/deleteCollection",
    method: "POST",
    data: null,
    auth: true,
  },
  // 修改收藏
  changeCollection: {
    url: BASE_URL + "/v1/changeCollection",
    method: "POST",
    data: null,
    auth: true,
  },
  // 检查用户收藏列表
  checkCollection: {
    url: BASE_URL + "/v1/checkCollection",
    method: "POST",
    auth: true,
  },
  // 检查收藏的子项
  checkChildren: {
    url: BASE_URL + "/v1/checkChildren",
    method: "POST",
    data: null,
    auth: true,
  },
  // 添加收藏的子项
  addChildren: {
    url: BASE_URL + "/v1/addChildren",
    method: "POST",
    data: null,
    auth: true,
  },
  // 修改收藏的子项
  changeChildren: {
    url: BASE_URL + "/v1/changeChildren",
    method: "POST",
    data: null,
    auth: true,
  },
  // 删除收藏的子项
  deleteChildren: {
    url: BASE_URL + "/v1/deleteChildren",
    method: "POST",
    data: null,
    auth: true,
  },
  // 判断有没有收藏
  checkCollectChildren: {
    url: BASE_URL + "/v1/checkCollectChildren",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  collect,
};