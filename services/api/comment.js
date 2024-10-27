const BASE_URL = "/comment";
/**
 *  评论相关接口
 */
const comment = {
  //获取发送给用户的消息
  getUserComment: {
    url: BASE_URL + "/v1/getUserComment",
    method: "POST",
    data: null,
    auth: true,
  },

  // 获取全部未读信息
  getIsReadNum: {
    url: BASE_URL + "/v1/getIsReadNum",
    method: "POST",
    data: null,
    auth: true,
  },

  // 阅读评论
  read: {
    url: BASE_URL + "/v1/read",
    method: "POST",
    data: null,
    auth: true,
  },

  // 获取店铺首页的部分评论
  getShopCommentList: {
    url: BASE_URL + "/v1/getShopCommentList",
    method: "POST",
    data: null,
    auth: true,
  },

  // 获取店铺的全部评论
  getShopAllCommentList: {
    url: BASE_URL + "/v1/getShopAllCommentList",
    method: "POST",
    data: null,
    auth: true,
  },

  // 获取店铺评论的详情
  getShpCommentDetails: {
    url: BASE_URL + "/v1/getShpCommentDetails",
    method: "POST",
    data: null,
    auth: true,
  },

  // 添加店铺评论
  addShopComment: {
    url: BASE_URL + "/v1/addShopComment",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  comment,
};
