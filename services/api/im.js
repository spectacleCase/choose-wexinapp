const BASE_URL = "/chat";
/**
 * im相关接口
 */
const im = {
  //获取添加好友列表
  getNewFriendList: {
    url: BASE_URL + "/v1/getNewFriendList",
    method: "POST",
    data: null,
    auth: true,
  },
  // 修改好友状态
  updateFriend: {
    url: BASE_URL + "/v1/updateFriend",
    method: "POST",
    data: null,
    auth: true,
  },
  // 获取全部好友
  getFriendList: {
    url: BASE_URL + "/v1/getFriendList",
    method: "POST",
    data: null,
    auth: true,
  },
  // 获取在线聊天的用户
  getChatUserList: {
    url: BASE_URL + "/v1/getChatUserList",
    method: "POST",
    data: null,
    auth: true,
  },
  // 获取聊天记录
  getChatList: {
    url: BASE_URL + "/v1/getChatList",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  im,
};
