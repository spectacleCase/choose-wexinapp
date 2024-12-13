Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    avatar: {
      type: String,
      value: "",
    },
    chatId: {
      type: String,
      value: "",
    },
  },

  methods: {
    handleTap() {
      wx.navigateTo({
        url: `/pages/chat/chat?id=${this.properties.chatId}`,
      });
      this.triggerEvent("popupClick");
    },
  },
});
