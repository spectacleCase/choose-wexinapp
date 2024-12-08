// pages/chat/chat.js
import request_util from "../../utils/request_util";
import im from "../../services/api/im";
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activeTab: "chat",
    chatList: [],
    contactGroups: [],
  },
  methods: {
    // 切换标签
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        activeTab: tab,
      });
    },

    // 跳转到聊天详情
    gotoChat(e) {
      const chatId = e.currentTarget.dataset.id;
      // 找到对应的聊天信息
      const chat = this.data.chatList.find((item) => item.id === chatId);
      wx.navigateTo({
        url: `/pages/im/chat-detail/chat-detail?id=${chatId}&username=${chat.username}`,
      });
    },

    // 跳转到新的朋友页面
    gotoNewFriends() {
      wx.navigateTo({
        url: "/pages/im/new-friends/new-friends",
      });
    },
  },
  attached: async function () {
    const data = await request_util.request(im.im.getFriendList);
    const chatList = await request_util.request(im.im.getChatUserList);
    this.setData({
      contactGroups: data.data.list,
      chatList: chatList.data.list,
    });
  },
});
