import Comment from "../../../services/api/comment";
import RequestUtils from "../../../utils/request_util";
Page({
  data: {
    shopId: null,
    reviews: [],
    searchQuery: "",
    showCommentInput: false,
    commentText: "",
    currentReviewId: null,
  },

  onLoad: async function (options) {
    Comment.comment.getShopAllCommentList.data = {
      shopId: options.shopId,
      page: 1,
      size: 3,
    };

    const shopList = await RequestUtils.request(
      Comment.comment.getShopAllCommentList
    );
    shopList.data.list.forEach((item) => {
      if (item.images) {
        item.images = item.images.split(",");
      }
    });
    this.setData({
      shopId: options.shopId,
      reviews: shopList.data.list,
    });
    // this.loadReviews();
  },

  loadReviews: function () {
    // 这里应该从服务器获取评论数据
    // 以下是模拟数据
    const mockReviews = [
      {
        id: 1,
        avatar: "https://example.com/avatar1.png",
        username: "用户1",
        time: "2023-04-20 14:30",
        content: "这家店的菜品非常美味,服务也很好!",
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
        subComment: [
          {
            username: "回复用户1",
            avatar: "https://example.com/avatar2.png",
            content: "我也觉得很不错,下次一起去吃吧!",
          },
          {
            username: "回复用户2",
            avatar: "https://example.com/avatar3.png",
            content: "价格如何?",
          },
        ],
      },
      {
        id: 2,
        avatar:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/18/8640c61d45424c8b9fe0506409f32902.png",
        username: "用户2",
        time: "2023-04-19 18:45",
        content: "价格有点贵,但是质量确实不错。",
        images: [
          "https://tse3-mm.cn.bing.net/th/id/OIP-C.FE9NNGqPWChozbvboayLgwHaE8?rs=1&pid=ImgDetMain",
        ],
        subComment: [{ username: "回复用户3", content: "同意" }],
      },
    ];

    this.setData({
      reviews: mockReviews,
    });
  },

  onSearchInput: function (e) {
    this.setData({
      searchQuery: e.detail.value,
    });
    // 这里可以添加搜索逻辑,根据searchQuery过滤评论
  },

  previewImage: function (e) {
    const current = e.currentTarget.dataset.url;
    const urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current: current,
      urls: urls,
    });
  },

  showCommentInput: function (e) {
    const reviewId = e.currentTarget.dataset.reviewId;
    this.setData({
      showCommentInput: true,
      currentReviewId: reviewId,
    });
  },

  hideCommentInput: function () {
    this.setData({
      showCommentInput: false,
      commentText: "",
      currentReviewId: null,
    });
  },

  onCommentInput: function (e) {
    this.setData({
      commentText: e.detail.value,
    });
  },

  publishComment: function () {
    console.log(
      "发布评论:",
      this.data.commentText,
      "对应评论ID:",
      this.data.currentReviewId
    );
    // 这里添加发布评论的逻辑
    this.setData({
      commentText: "",
      showCommentInput: false,
      currentReviewId: null,
    });
  },

  stopPropagation: function (e) {
    // 阻止事件冒泡
    e.stopPropagation();
  },

  goToWriteReview: function () {
    wx.navigateTo({
      url: "../write-review/write-review",
    });
  },

  goToReviewDetail: function (e) {
    const reviewId = e.currentTarget.dataset.reviewId;
    wx.navigateTo({
      url: `../review-detail/review-detail?reviewId=${reviewId}`,
    });
  },
});
