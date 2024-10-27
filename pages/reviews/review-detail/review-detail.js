import Comment from "../../../services/api/comment";
import RequestUtils from "../../../utils/request_util";
Page({
  data: {
    review: null,
    commentText: "",
  },

  onLoad: async function (options) {
    Comment.comment.getShpCommentDetails.data = {
      commentId: options.reviewId,
    };
    const data = await RequestUtils.request(
      Comment.comment.getShpCommentDetails
    );
    if (data.data.images) {
      data.data.images = data.data.images.split(",");
    }

    this.setData({
      review: data.data,
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
