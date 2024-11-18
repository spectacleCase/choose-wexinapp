// pages/search/search.js
import common from "../../services/api/common";
import request_util from "../../utils/request_util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchHistory: [
      "美食",
      "蛋糕",
      "披萨",
      "汉堡",
      "寿司",
      "沙拉",
      "意大利面",
      "咖啡",
      "饮料",
      "小吃",
    ], // 搜索历史记录
    suggestions: [], // 相关搜索词
    showMore: false, // 控制是否显示更多记录
    searchInput: "", // 当前输入的搜索词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateDisplayedHistory();
  },

  // 更新显示的历史记录
  async updateDisplayedHistory() {
    const data = await request_util.request(common.common.getSearchHistory);
    this.setData({
      searchHistory: data.data.list,
    });
    const { searchHistory, showMore } = this.data;
    const displayedHistory = showMore
      ? searchHistory
      : searchHistory.slice(0, 12); // 默认显示前12条
    if (!showMore) {
      this.setData({
        displayedHistory,
        showMoreButton: searchHistory.length > 12, // 只有当记录超过12条时才显示按钮
      });
    } else {
      this.setData({
        displayedHistory,
      });
    }
  },

  // 显示所有记录并隐藏按钮
  showAllHistory() {
    this.setData(
      {
        showMore: true,
        showMoreButton: false, // 隐藏按钮
      },
      this.updateDisplayedHistory
    );
  },

  // 处理搜索输入
  handleInput(e) {
    const inputValue = e.detail.value;

    this.setData({
      searchInput: inputValue,
    });
    this.updateSuggestions(inputValue);
  },

  // 更新相关搜索词
  async updateSuggestions(inputValue) {
    const url = common.common.search_terms.url;
    const allSuggestions = [
      "美食",
      "蛋糕",
      "披萨",
      "汉堡",
      "寿司",
      "沙拉",
      "意大利面",
      "咖啡",
      "饮料",
      "小吃",
      "小吃",
    ]; // 示例相关搜索词
    common.common.search_terms.url =
      common.common.search_terms.url + inputValue;

    const data = await request_util.request(common.common.search_terms);

    this.setData({
      suggestions: data.data.list,
    });
    common.common.search_terms.url = url;
  },

  // 删除单个历史记录
  deleteHistory(e) {
    const index = e.currentTarget.dataset.index;
    const newHistory = this.data.searchHistory.filter((_, i) => i !== index);
    this.setData(
      {
        searchHistory: newHistory,
      },
      this.updateDisplayedHistory
    );
  },

  // 删除所有历史记录
  deleteAllHistory() {
    this.setData(
      {
        searchHistory: [],
        showMore: false,
        showMoreButton: false, // 隐藏按钮
      },
      this.updateDisplayedHistory
    );
  },
});
