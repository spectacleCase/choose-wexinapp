Page({
  data: {
    post: {
      id: 1,
      avatarUrl:
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
      username: "用户名",
      time: "2小时前",
      content: "这是一条示例帖子内容，展示详细的帖子信息...",
      images: [
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
      ],
    },
    totalComments: 56,
    comments: [
      {
        id: 1,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
        username: "评论用户1",
        content: "这是一条父评论",
        time: "1小时前",
        replies: [
          {
            id: 11,
            avatarUrl:
              "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
            username: "回复用户1",
            content: "这是一条子评论",
            time: "30分钟前",
          },
        ],
      },
      // 更多评论...
    ],
    commentText: "",
  },

  onLoad(options) {
    // 获取帖子ID并加载数据
    const postId = options.id;
    this.loadPostDetail(postId);
    this.loadComments(postId);
  },

  loadPostDetail(postId) {
    // 加载帖子详情
  },

  loadComments(postId) {
    // 加载评论列表
  },

  onInputChange(e) {
    this.setData({
      commentText: e.detail.value,
    });
  },

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.post.images;

    wx.previewImage({
      current: images[index],
      urls: images,
    });
  },

  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title:
        post.content.substring(0, 30) + (post.content.length > 30 ? "..." : ""),
      path: `/pages/post-detail/post-detail?id=${post.id}`,
      imageUrl: post.images?.[0] || "",
    };
  },
});
