import request_util from "../../utils/request_util";
import comment from "../../services/api/comment";

Page({
  data: {
    post: {
      id: 1,
      avatar: "",
      userName: "",
      createTime: "",
      content: "",
      images: [],
    },
    totalComments: 0,
    subComments: [
      {
        id: 1,
        avatar: "",
        userName: "",
        content: "",
        createTime: "",
        subComments: [
          {
            id: 11,
            avatar: "",
            userName: "",
            content: "",
            createTime: "",
          },
        ],
      },
    ],
    commentText: "",
    replyTo: "",
    replyId: null,
    inputFocus: false,
  },

  async onLoad(options) {
    // 获取帖子ID并加载数据
    console.log("j上打分");

    const postId = options.id;
    await this.loadPostDetail(postId, true);
    this.loadComments(postId);
  },

  async loadPostDetail(postId, isPost) {
    comment.comment.getShpCommentDetails.data = {
      commentId: postId,
    };
    // 加载帖子详情
    const data = await request_util.request(
      comment.comment.getShpCommentDetails
    );
    if (data.data.images) {
      data.data.images = data.data.images.split(",");
    }
    if (isPost) {
      this.setData({
        post: data.data,
      });
    }
    this.setData({
      subComments: data.data.subComments,
      totalComments: data.data.subComments.length,
    });
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

  onCommentTap(e) {
    const { id, name } = e.currentTarget.dataset;
    this.setData({
      replyTo: name,
      replyId: id,
      inputFocus: true,
    });
  },

  async onSendComment() {
    if (!this.data.commentText.trim()) {
      return;
    }
    const userInfo = wx.getStorageSync("userInfo");

    try {
      comment.comment.addShopComment.data = {
        topId: this.data.post.id,
        content: this.data.commentText,
        imageUrl: "",
        sendAvatar: userInfo.avatar,
        senderName: userInfo.nickname,
        senderId: userInfo.id,
        parentId: this.data.replyId || this.data.post.id, // 如果是回复则带上父评论ID
      };
      await request_util.request(comment.comment.addShopComment);

      // 发送成功后刷新评论列表
      await this.loadPostDetail(this.data.post.id, false);

      // 清空输入框
      this.setData({
        commentText: "",
        replyTo: "",
        replyId: null,
      });

      wx.showToast({
        title: "评论成功",
        icon: "success",
      });
    } catch (error) {
      console.error("发送评论失败:", error);
      wx.showToast({
        title: "评论失败，请重试",
        icon: "none",
      });
    }
  },

  addFriend(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/myself/edit_user_info/edit_user_info?isAdd=ture&id=${id}`,
    });
  },
});
