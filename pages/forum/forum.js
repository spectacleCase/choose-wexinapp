import RequestUtils from "../../utils/request_util";
import Comment from "../../services/api/comment";

Component({
  options: {
    pureDataPattern: /^_/,
  },

  data: {
    activeTab: "hot",
    hotPosts: [
      {
        id: 1,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        username: "热门用户1",
        time: "10分钟前",
        content: "这是热门第一条帖子的内容，作为示例展示在最上方的圆角卡片中。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        ],
        shareCount: 56,
        commentCount: 23,
      },
      {
        id: 2,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        username: "热门用户2",
        time: "30分钟前",
        content: "这是热门第二条帖子的内容示例。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        ],
        shareCount: 34,
        commentCount: 12,
      },
      {
        id: 3,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        username: "热门用户2",
        time: "30分钟前",
        content: "这是热门第二条帖子的内容示例。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        ],
        shareCount: 34,
        commentCount: 12,
      },
      {
        id: 4,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        username: "热门用户2",
        time: "30分钟前",
        content: "这是热门第二条帖子的内容示例。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        ],
        shareCount: 34,
        commentCount: 12,
      },
      {
        id: 5,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
        username: "热门用户2",
        time: "30分钟前",
        content: "这是热门第二条帖子的内容示例。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        ],
        shareCount: 34,
        commentCount: 12,
      },
    ],
    newPosts: [
      {
        id: 1,
        avatarUrl:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/d2e19ab78033477691ec95115ef51ddc.png",
        username: "最新用户1",
        time: "5分钟前",
        content: "这是最新发布的第一条帖子内容。",
        images: [
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/20d354d551aa4f3cb0212951a9565ec4.png",
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/11/01/38794909df0046a282e3cd6c2370cb99.png",
        ],
        shareCount: 12,
        commentCount: 5,
      },
    ],
    currentPosts: [],
    isScrolling: false,
    _scrollTimer: null,
    page: 1,
    pageSize: 10,
    hasMore: true,
    isLoading: false,
  },

  methods: {
    switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        activeTab: tab,
        currentPosts: tab === "hot" ? this.data.hotPosts : this.data.newPosts,
      });
    },

    onLoad() {
      // 初始化显示热门帖子
      this.setData({
        currentPosts: this.data.hotPosts,
      });
    },

    onShareTap(e) {
      const postId = e.currentTarget.dataset.id;
      const currentPost = [...this.data.hotPosts, ...this.data.newPosts].find(
        (post) => post.id === postId
      );

      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },

    onCommentTap(e) {
      const postId = e.currentTarget.dataset.id;
      // 直接跳转到详情页的评论区
      wx.navigateTo({
        url: `/pages/post-detail/post-detail?id=${postId}&focus=comment`,
      });
    },

    onPostTap(e) {
      const postId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/post-detail/post-detail?id=${postId}`,
      });
    },

    pageScroll({ scrollTop }) {
      this.setData({ isScrolling: true });

      if (this.data._scrollTimer) {
        clearTimeout(this.data._scrollTimer);
      }

      const timer = setTimeout(() => {
        this.setData({ isScrolling: false });
      }, 150);

      this.data._scrollTimer = timer;
    },

    onFloatBallTap() {
      wx.navigateTo({
        url: "/pages/reviews/write-review/write-review?shopId=1848368549850701826",
      });
    },

    onUnload() {
      if (this.data._scrollTimer) {
        clearTimeout(this.data._scrollTimer);
      }
    },

    async getLatestCommentList(isLoadMore = false) {
      if (this.data.isLoading || (!isLoadMore && !this.data.hasMore)) return;

      this.setData({ isLoading: true });

      try {
        Comment.comment.getLatestCommentList.data = {
          page: this.data.page,
          pageSize: this.data.pageSize,
        };

        const data = await RequestUtils.request(
          Comment.comment.getLatestCommentList
        );
        const list = data.data.list.map((item) => ({
          ...item,
          images: item.images ? item.images.split(",") : [],
        }));

        if (isLoadMore) {
          // 加载更多时，拼接数据
          this.setData({
            newPosts: [...this.data.newPosts, ...list],
            hotPosts: [...this.data.hotPosts, ...list],
            currentPosts:
              this.data.activeTab === "hot"
                ? [...this.data.hotPosts, ...list]
                : [...this.data.newPosts, ...list],
            page: this.data.page + 1,
            hasMore: list.length === this.data.pageSize,
          });
        } else {
          // 首次加载或刷新时，直接替换数据
          this.setData({
            newPosts: list,
            hotPosts: list,
            currentPosts: list,
            page: 2,
            hasMore: list.length === this.data.pageSize,
          });
        }
      } catch (error) {
        console.error("获取评论列表失败:", error);
        wx.showToast({
          title: "加载失败，请重试",
          icon: "none",
        });
      } finally {
        this.setData({ isLoading: false });
      }
    },

    onScrollToLower() {
      console.log("滚动到底部");
      if (this.data.hasMore && !this.data.isLoading) {
        this.getLatestCommentList(true);
      }
    },

    onScroll(e) {
      this.setData({ isScrolling: true });

      if (this.data._scrollTimer) {
        clearTimeout(this.data._scrollTimer);
      }

      const timer = setTimeout(() => {
        this.setData({ isScrolling: false });
      }, 150);

      this.data._scrollTimer = timer;
    },
  },

  lifetimes: {
    attached() {
      console.log("进入");
      this.getLatestCommentList();
      this.setData({
        currentPosts: this.data.hotPosts,
      });
    },
    detached() {
      if (this.data._scrollTimer) {
        clearTimeout(this.data._scrollTimer);
      }
    },
  },

  pageLifetimes: {
    show() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },
  },
});
