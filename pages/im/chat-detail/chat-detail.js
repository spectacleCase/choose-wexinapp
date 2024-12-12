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
    socket: null,
  },

  onLoad(options) {
    this.setData({
      receiverId: options.id,
      socket: app.globalData.socket,
    });

    // this.sendMessage = function (message) {
    //   wx.sendSocketMessage({
    //     data: JSON.stringify(message),
    //     success: () => console.log("消息发送成功"),
    //     fail: (error) => console.error("消息发送失败", error),
    //   });
    // };

    wx.onSocketMessage((res) => {
      const message = JSON.parse(res.data);
      const newMessage = {
        content: message.content,
        createTime: new Date().toISOString(),
        sender: message.sender,
        receiver: message.receiver,
        type: message.type,
      };

      const formattedMessage = {
        id: Date.now(),
        content: newMessage.content,
        time: this.formatTime(newMessage.createTime),
        showTime: false,
        isSelf: false,
      };

      this.setData({
        messageList: [...this.data.messageList, formattedMessage],
        inputValue: "",
      });

      this.scrollToBottom();
    });

    this.getChatDetail(options);
  },
  onUnload: function() {
    // 页面卸载时触发
    console.log('Page onUnload');
    // 在这里可以进行一些清理工作，比如取消定时器、清除缓存等
    im.im.readMessage.data = {
      id: this.data.receiverId,
      lastCreateTime: null,
    };
    request_util.request(im.im.readMessage);

  },

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

  formatMessageList(chatList) {
    return chatList.map((msg, index, array) => {
      const showTime = this.shouldShowTime(msg, array[index - 1]);
      const isSelf = msg.sender !== this.data.receiverId;

      return {
        id: msg.id,
        content: msg.content,
        time: this.formatTime(msg.createTime),
        showTime: showTime,
        isSelf: isSelf,
      };
    });
  },

  shouldShowTime(currentMsg, prevMsg) {
    if (!prevMsg) return true;
    const currentTime = new Date(currentMsg.createTime).getTime();
    const prevTime = new Date(prevMsg.createTime).getTime();
    return currentTime - prevTime > 5 * 60 * 1000;
  },

  formatTime(timeStr) {
    const date = new Date(timeStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  },

  async sendMessage() {
    if (!this.data.inputValue.trim()) return;

    const newMessage = {
      content: this.data.inputValue,
      createTime: new Date().toISOString(),
      sender: this.data.userInfo.id,
      receiver: this.data.secondUser.id,
      type: 0,
      sendFailed: false,
    };

    const formattedMessage = {
      id: Date.now(),
      content: newMessage.content,
      time: this.formatTime(newMessage.createTime),
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
      wx.sendSocketMessage({
        data: JSON.stringify(newMessage),
        fail: () => {
          const messageList = this.data.messageList.map((msg) => {
            if (msg.id === formattedMessage.id) {
              return { ...msg, sendFailed: true };
            }
            return msg;
          });
          this.setData({ messageList });
        },
      });
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
            duration:0,
          });
        })
        .exec();
    }, 50);
  },

  resendMessage(e) {
    console.log("进入");

    const messageId = e.currentTarget.dataset.id;
    const message = this.data.messageList.find((msg) => msg.id === messageId);

    if (!message) return;

    wx.sendSocketMessage({
      data: JSON.stringify({
        content: message.content,
        createTime: new Date().toISOString(),
        sender: this.data.userInfo.id,
        receiver: this.data.secondUser.id,
        type: 0,
      }),
      success: () => {
        const messageList = this.data.messageList.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, sendFailed: false };
          }
          return msg;
        });
        this.setData({ messageList });
      },
    });
  },
});