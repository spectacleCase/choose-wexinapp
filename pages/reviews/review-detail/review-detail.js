Page({
  data: {
    review: null,
    commentText: "",
  },

  onLoad: function (options) {
    // 这里应该根据传入的reviewId从服务器获取评论详情
    // 以下是模拟数据
    this.setData({
      review: {
        id: options.reviewId,
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户1",
        time: "2023-04-20 14:30",
        content: "这家店的菜品非常美味,服务也很好!",
        images: [
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        ],
        subComments: [
          {
            id: 1,
            avatar:
              "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
            username: "用户2",
            time: "2023-04-20 15:00",
            content: "我也觉得很不错,下次一起去吃吧!",
            replyTo: "用户1",
            subComments: [
              {
                id: 3,
                avatar:
                  "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
                username: "用户4",
                time: "2023-04-20 16:00",
                content: "好啊,我也想去!",
                replyTo: "用户2"
              }
            ]
          },
          {
            id: 2,
            avatar:
              "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
            username: "用户3",
            time: "2023-04-20 15:30",
            content: "价格如何?",
            replyTo: "用户1"
          }
        ],
      },
    });
  },

  onCommentInput: function (e) {
    this.setData({
      commentText: e.detail.value,
    });
  },

  publishComment: function () {
    console.log("发布评论:", this.data.commentText);
    // 这里添加发布评论的逻辑
    this.setData({
      commentText: "",
    });
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.url;
    const urls = this.data.review.images;
    wx.previewImage({
      current: current,
      urls: urls,
    });
  },
});
