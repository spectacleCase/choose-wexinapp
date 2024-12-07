// pages/chat/chat.js
Component({
  /**
   * 页面的初始数据
   */
  data: {
    activeTab: "chat",
    chatList: [
      {
        id: 1,
        avatar: "../../assets/images/开发者.jpg",
        username: "张三",
        lastMessage: "周末一起去打球吗？",
        lastTime: "14:30",
      },
      {
        id: 2,
        avatar: "../../assets/images/开发者1.jpg",
        username: "李四",
        lastMessage: "项目文档我已经发给你了，请查收",
        lastTime: "12:20",
      },
      {
        id: 3,
        avatar: "../../assets/images/开发者.jpg",
        username: "王五",
        lastMessage: "好的，明天见！",
        lastTime: "昨天",
      },
      {
        id: 4,
        avatar: "../../assets/images/开发者1.jpg",
        username: "技术群",
        lastMessage: "[有人分享了一个文件]",
        lastTime: "昨天",
      },
    ],
    contactGroups: [
      {
        letter: "L",
        contacts: [
          {
            id: 2,
            avatar: "../../assets/images/开发者1.jpg",
            username: "李四",
          },
        ],
      },
      {
        letter: "W",
        contacts: [
          {
            id: 3,
            avatar: "../../assets/images/开发者1.jpg",
            username: "王五",
          },
        ],
      },
      {
        letter: "X",
        contacts: [
          {
            id: 5,
            avatar: "../../assets/images/开发者.jpg",
            username: "小明",
          },
        ],
      },
      {
        letter: "Z",
        contacts: [
          {
            id: 1,
            avatar: "../../assets/images/开发者1.jpg",
            username: "张三",
          },
          {
            id: 4,
            avatar: "../../assets/images/开发者.jpg",
            username: "赵六",
          },
        ],
      },
    ],
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
        url: '/pages/im/new-friends/new-friends',
      });
    },
  },
});
