import RequestUtils from "../../utils/request_util";
import Comment from "../../services/api/comment";

Component({
  options: {
    pureDataPattern: /^_/,
  },

  data: {
    activeTab: "new",
    hotPosts: [],
    newPosts: [],
    currentPosts: [],
    isScrolling: false,
    _scrollTimer: null,
    page: 1,
    pageSize: 10,
    hasMore: true,
    isLoading: false,
  },

  methods: {
    async switchTab(e) {
      const tab = e.currentTarget.dataset.tab;
      this.setData({
        activeTab: tab,
        page: 1,
        hasMore: true,
        currentPosts: []
      });
      
      if (tab === 'hot') {
        await this.getHotCommentList();
      } else {
        await this.getLatestCommentList();
      }
    },

    async getLatestCommentList(isLoadMore = false) {
      if (this.data.isLoading || (!isLoadMore && !this.data.hasMore)) return;

      this.setData({ isLoading: true });

      try {
        const params = {
          page: this.data.page,
          pageSize: this.data.pageSize,
        };

        const data = await this._fetchCommentList(Comment.comment.getLatestCommentList, params);
        this._updatePostsList('newPosts', data, isLoadMore);
      } catch (error) {
        this._handleError(error);
      } finally {
        this.setData({ isLoading: false });
      }
    },

    async getHotCommentList(isLoadMore = false) {
      if (this.data.isLoading || (!isLoadMore && !this.data.hasMore)) return;

      this.setData({ isLoading: true });

      try {
        const params = {
          page: this.data.page,
          pageSize: this.data.pageSize,
        };

        const data = await this._fetchCommentList(Comment.comment.getHotCommentList, params);
        this._updatePostsList('hotPosts', data, isLoadMore);
      } catch (error) {
        this._handleError(error);
      } finally {
        this.setData({ isLoading: false });
      }
    },

    async _fetchCommentList(api, params) {
      api.data = params;
      const response = await RequestUtils.request(api);
      return response.data.list.map(item => ({
        ...item,
        images: item.images ? item.images.split(",") : [],
      }));
    },

    _updatePostsList(listType, newData, isLoadMore) {
      const updateData = {};
      
      if (isLoadMore) {
        updateData[listType] = [...this.data[listType], ...newData];
        updateData.currentPosts = [...this.data.currentPosts, ...newData];
        updateData.page = this.data.page + 1;
      } else {
        updateData[listType] = newData;
        updateData.currentPosts = newData;
        updateData.page = 2;
      }
      
      updateData.hasMore = newData.length === this.data.pageSize;
      
      this.setData(updateData);
    },

    _handleError(error) {
      console.error("获取评论列表失败:", error);
      wx.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
    },

    onScrollToLower() {
      if (this.data.hasMore && !this.data.isLoading) {
        if (this.data.activeTab === 'hot') {
          this.getHotCommentList(true);
        } else {
          this.getLatestCommentList(true);
        }
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

    onShareTap(e) {
      const postId = e.currentTarget.dataset.id;
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },

    onCommentTap(e) {
      const postId = e.currentTarget.dataset.id;
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

    onFloatBallTap() {
      wx.navigateTo({
        url: "/pages/reviews/write-review/write-review?shopId=1848368549850701826",
      });
    },
  },

  lifetimes: {
    attached() {
      this.getLatestCommentList();
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
