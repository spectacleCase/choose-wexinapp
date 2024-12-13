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

  data: {
    startX: 0,
    moveDistance: 0, // 添加移动距离状态
  },

  observers: {
    show: function (show) {
      if (show) {
        this.startAutoHide();
        // 重置移动距离
        this.setData({
          moveDistance: 0,
        });
      }
    },
  },

  methods: {
    startAutoHide() {
      setTimeout(() => {
        this.triggerEvent("popupClick");
      }, 2000);
    },

    handleTap() {
      wx.navigateTo({
        url: `/pages/im/chat-detail/chat-detail?id=${
          this.properties.chatId
        }&username=${"12"}`,
      });
      this.triggerEvent("popupClick");
    },

    handleTouchStart(e) {
      this.setData({
        startX: e.touches[0].clientX,
        moveDistance: 0,
      });
    },

    handleTouchMove(e) {
      const moveX = e.touches[0].clientX;
      const moveDistance = moveX - this.data.startX;

      // 只允许向右滑动
      if (moveDistance >= 0) {
        this.setData({
          moveDistance: moveDistance,
        });
      }

      if (moveDistance > 100) {
        this.triggerEvent("popupClick");
      }
    },

    handleTouchEnd() {
      // 如果没有达到关闭阈值，则回弹
      if (this.data.moveDistance < 100) {
        this.setData({
          moveDistance: 0,
        });
      }
    },
  },
});
