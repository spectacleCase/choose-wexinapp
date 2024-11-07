import RequestUtils from "../../../utils/request_util";
import Recommend from "../../../services/api/recommend";

Component({
  data: {
    recommendations: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
  },

  methods: {
    loadMore: async function () {
      if (!this.data.hasMore) {
        return;
      }

      wx.showLoading({
        title: "加载中...",
      });

      try {
        Recommend.recommend.recommendRecord.data = {
          page: this.data.page,
        };

        const data = await RequestUtils.request(
          Recommend.recommend.recommendRecord
        );

        this.setData({
          recommendations: this.data.recommendations.concat(data.data.list),
          page: this.data.page + 1,
          hasMore: data.data.list.length === this.data.pageSize,
        });
      } catch (error) {
        console.error("加载推荐失败:", error);
      } finally {
        wx.hideLoading();
      }
    },
    goShop: function(e) {
        const shopId = e.currentTarget.dataset.shopId;
        if (shopId) {
            wx.navigateTo({
                url: "/pages/shop/shop/shop?shopId=" + shopId
            });
        } else {
            wx.showToast({
                title: '商铺信息不存在',
                icon: 'none'
            });
        }
    },
  },

  attached: async function () {
    this.loadMore();
  },
});
