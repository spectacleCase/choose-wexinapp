Page({
  data: {
    notifications: [
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户A",
        message: "你的推荐真的很棒！",
        time: "2023-05-20 14:30",
      },
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },

      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },
      {
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户B",
        message: "这道菜我也很喜欢。",
        time: "2023-05-19 09:15",
      },
      {
        message:
          "系统维护通知：本周六凌晨2点-4点进行系统升级，期间服务可能暂时不可用。",
        time: "2023-05-18 10:00",
      },
      {
        message: "新功能上线：现在可以查看更详细的营养成分信息了！",
        time: "2023-05-15 15:30",
      },
    ],
  },

  onLoad: function () {
    // 页面加载时可以从服务器获取最新的通知信息
    // this.getNotifications();
  },

  getNotifications: function () {
    // 这里可以添加从服务器获取通知的逻辑
    // wx.request({
    //   url: 'your_api_url',
    //   success: (res) => {
    //     this.setData({
    //       notifications: res.data.notifications
    //     });
    //   }
    // });
  },
});
