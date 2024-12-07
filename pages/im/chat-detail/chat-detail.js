Page({
  data: {
    userInfo: {
      id: 1,
      avatar: "../../../assets/images/3.1 评论.png",
      username: "张三",
    },
    messageList: [
      {
        id: 1,
        type: "text",
        content: "你好啊！",
        isSelf: false,
        time: "14:22",
        showTime: true, // 第一条消息显示时间
      },
      {
        id: 2,
        type: "text",
        content: "最近在忙什么呢？",
        isSelf: true,
        time: "14:23",
        showTime: false,
      },
      {
        id: 3,
        type: "text",
        content: "在写一个小程序，你呢？",
        isSelf: false,
        time: "14:23",
        showTime: false,
      },
      {
        id: 4,
        type: "text",
        content: "我在准备下周的演讲",
        isSelf: true,
        time: "14:24",
        showTime: true, // 间隔一定时间后显示时间
      },
    ],
    inputValue: "",
  },

  // 输入框内容变化
  onInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  // 发送消息
  sendMessage() {
    if (!this.data.inputValue.trim()) return;

    const currentTime = new Date();
    const showTime = this.shouldShowTime(currentTime);

    const newMessage = {
      id: Date.now(),
      type: "text",
      content: this.data.inputValue,
      isSelf: true,
      time: this.formatTime(currentTime),
      showTime: showTime,
    };

    this.setData({
      messageList: [...this.data.messageList, newMessage],
      inputValue: "",
    });

    this.scrollToBottom();
  },

  // 格式化时间
  formatTime(date) {
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  },

  // 滚动到底部
  scrollToBottom() {
    wx.createSelectorQuery()
      .select("#message-list")
      .boundingClientRect((rect) => {
        wx.pageScrollTo({
          scrollTop: rect.height,
          duration: 300,
        });
      })
      .exec();
  },
  shouldShowTime(currentTime) {
    const messages = this.data.messageList;
    if (messages.length === 0) return true;

    const lastMessage = messages[messages.length - 1];
    const lastTime = new Date(lastMessage.time);
    // 如果与上一条消息间隔超过5分钟，显示时间
    return currentTime - lastTime > 5 * 60 * 1000;
  },

  onLoad(options) {
    // 从路由参数获取用户信息
    if (options.username) {
      wx.setNavigationBarTitle({
        title: options.username,
      });
    }

    // 页面加载时滚动到底部
    setTimeout(() => {
      this.scrollToBottom();
    }, 200);
  },
});
