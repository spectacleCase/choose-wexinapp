// pages/chat/chat.js
import request_util from "../../utils/request_util";
import im from "../../services/api/im";
const app = getApp();
Component({
  pageLifetimes: {
    // 页面显示时触发
    async show() {
      const data = await request_util.request(im.im.getFriendList);
      const chatList = await request_util.request(im.im.getChatUserList);
      this.setData({
        contactGroups: data.data.list,
        chatList: chatList.data.list,
        socket:app.globalData.socket
      });
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    activeTab: "chat",
    chatList: [],
    contactGroups: [],
    socket:null
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
    formatTime(timeStr) {
      const date = new Date(timeStr);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    },
  },
  attached: async function () {
    const data = await request_util.request(im.im.getFriendList);
    const chatList = await request_util.request(im.im.getChatUserList);
    this.setData({
      contactGroups: data.data.list,
      chatList: chatList.data.list,
      socket:app.globalData.socket
    });
    wx.onSocketMessage((result) => {
      const message = JSON.parse(result.data);
      console.log("这个是chat的 ",message);
      if(this.data.chatList) {
        console.log(this.data.chatList);
        let chatList = this.data.chatList;
        
        chatList.forEach((chat) => {
          if(chat.id === message.sender) {
            console.log("进入");
            chat.chat = message.content;
            chat.createTime = this.formatTime(new Date().toISOString());
            chat.notReadCount += 1;
            this.setData({
              chatList:chatList
            })
            console.log(this.data.chatList);
            return
          }
        })
      }
    })
  },
});
