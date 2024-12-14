import request_util from "../../../utils/request_util";
import im from "../../../services/api/im";
const app = getApp();

Page({
  data: {
    userInfo: {
      nickname: "",
      avatar: "",
      id: "",
    },
    secondUser: {
      nickname: "",
      avatar: "",
      id: "",
    },
    messageList: [],
    inputValue: "",
    receiverId: "",
  },

  onLoad(options) {
    this.setData({ receiverId: options.id });
    this.boundHandleMessage = this.handleMessage.bind(this);
    app.subscribe("message", this.boundHandleMessage);
    this.getChatDetail(options);
  },

  // 页面卸载时触发
  onUnload: function () {
    app.unsubscribe("message", this.boundHandleMessage);
    im.im.readMessage.data = {
      id: this.data.receiverId,
      lastCreateTime: null,
    };
    request_util.request(im.im.readMessage);
  },

  // 获取聊天详情
  async getChatDetail(options) {
    im.im.getChatList.data = {
      id: options.id,
      lastCreateTime: null,
    };

    const res = await request_util.request(im.im.getChatList);
    if (res.isSuccess) {
      const { data } = res;
      this.setData({
        userInfo: {
          nickname: data.nickname,
          avatar: data.avatar,
          id: data.id,
        },
        secondUser: {
          nickname: data.seNickname,
          avatar: data.seAvatar,
          id: data.seId,
        },
      });

      const formattedMessages = this.formatMessageList(data.chatList);
      this.setData({
        messageList: formattedMessages,
      });
      wx.setNavigationBarTitle({
        title: data.seNickname,
      });
      this.scrollToBottom();
    }
  },

  handleMessage(result) {
    const message = JSON.parse(result);
    const newMessage = {
      content: message.content,
      createTime: new Date().toISOString(), // ISO 格式，不会有问题
      sender: message.sender,
      receiver: message.receiver,
      type: message.type,
    };

    const formattedMessage = {
      id: Date.now(),
      content: newMessage.content,
      time: this.formatTime(newMessage.createTime), // 修复日期格式
      showTime: false,
      isSelf: false,
    };
    this.setData({
      messageList: [...this.data.messageList, formattedMessage],
      inputValue: "",
    });
    this.scrollToBottom();
  },

  formatMessageList(chatList) {
    return chatList.map((msg, index, array) => {
      const showTime = this.shouldShowTime(msg, array[index - 1]);
      const isSelf = msg.sender !== this.data.receiverId;

      return {
        id: msg.id,
        content: msg.content,
        time: this.formatTime(msg.createTime), // 修复日期格式
        showTime: showTime,
        isSelf: isSelf,
      };
    });
  },

  shouldShowTime(currentMsg, prevMsg) {
    if (!prevMsg) return true;
    const currentTime = new Date(
      currentMsg.createTime.replace(" ", "T")
    ).getTime(); // 修复日期格式
    const prevTime = new Date(prevMsg.createTime.replace(" ", "T")).getTime(); // 修复日期格式
    return currentTime - prevTime > 5 * 60 * 1000;
  },

  formatTime(timeStr) {
    const fixedTimeStr = timeStr.replace(" ", "T"); // 替换空格为 T
    const date = new Date(fixedTimeStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  async sendMessage() {
    if (!this.data.inputValue.trim()) return;
    const newMessage = {
      messageType: "message",
      content: this.data.inputValue,
      createTime: new Date().toISOString(), // ISO 格式，不会有问题
      sender: this.data.userInfo.id,
      receiver: this.data.secondUser.id,
      avatar: this.data.userInfo.avatar,
      type: 0,
      sendFailed: false,
    };
    const formattedMessage = {
      id: Date.now(),
      content: newMessage.content,
      time: this.formatTime(newMessage.createTime), // 修复日期格式
      showTime: true,
      isSelf: true,
      sendFailed: false,
    };

    this.setData({
      messageList: [...this.data.messageList, formattedMessage],
      inputValue: "",
    });
    this.scrollToBottom();

    try {
      app.sendMessage(
        JSON.stringify(newMessage),
        () => {},
        () => {
          const messageList = this.data.messageList.map((msg) => {
            if (msg.id === formattedMessage.id) {
              return { ...msg, sendFailed: true };
            }
            return msg;
          });
          this.setData({ messageList });
        }
      );
    } catch (error) {
      console.error("发送消息失败：", error);
    }
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  scrollToBottom() {
    setTimeout(() => {
      wx.createSelectorQuery()
        .select("#message-list")
        .boundingClientRect((rect) => {
          wx.pageScrollTo({
            scrollTop: rect.height,
            duration: 0,
          });
        })
        .exec();
    }, 50);
  },

  resendMessage(e) {
    const messageId = e.currentTarget.dataset.id;
    const message = this.data.messageList.find((msg) => msg.id === messageId);
    if (!message) return;

    app.sendMessage(
      JSON.stringify({
        messageType: "message",
        content: message.content,
        createTime: new Date().toISOString(), // ISO 格式，不会有问题
        sender: this.data.userInfo.id,
        receiver: this.data.secondUser.id,
        avatar: this.data.userInfo.avatar,
        type: 0,
      }),
      () => {
        const messageList = this.data.messageList.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, sendFailed: false };
          }
          return msg;
        });
        this.setData({ messageList });
      },
      () => {}
    );
  },
});
