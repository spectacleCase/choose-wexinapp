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
};

export default {
  comment,
};
