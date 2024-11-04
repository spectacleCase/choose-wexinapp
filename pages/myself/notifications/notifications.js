import RequestUtil from "../../../utils/request_util";
import Comment from "../../../services/api/comment";

Page({
  data: {
    page: 1,
    notifications: [],
    isLoading: false,
    hasMore: true,
  },

  onLoad: function () {
    this.getUserComment();
  },

  goToPostDetail: function (e) {
    const topId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${topId}&focus=comment`,
    });
  },

  getUserComment: async function () {
    if (this.data.isLoading || !this.data.hasMore) return;

    this.setData({ isLoading: true });

    Comment.comment.getUserComment.data = {
      page: this.data.page,
    };
    const data = await RequestUtil.request(Comment.comment.getUserComment);

    const newNotifications = data.data.list || [];
    this.setData({
      notifications: [...this.data.notifications, ...newNotifications],
      page: this.data.page + 1,
      isLoading: false,
      hasMore: newNotifications.length > 0,
    });
  },

  onReachBottom: function () {
    this.getUserComment();
  },
});
