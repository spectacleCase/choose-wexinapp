import RequestUtils from "../../utils/request_util";
import Recommend from "../../services/api/recommend";
import Agent from "../../services/api/agent";

Page({
  data: {
    bubbles: [],
    recommendations: [],
    currentIndex: 0,
    selectedCount: 1,
    query: "",
    location: "",
    bubbleColors: ["#FDF1E7", "#F07A10", "#FDF3E8", "#FDF3E8", "#FDF3E8"],
    /** 论文 4-5 章 Agent 协作返回的链路ID,反馈接口需要 */
    traceId: "",
    /** 解析后的结构化意图,可选展示 */
    parsedIntent: null,
    /** 各 Agent 耗时 */
    agentLatency: {},
    /** P-ReAct 节省的端到端耗时 */
    pReActSavedMs: 0,
    /** 用户对当前条目的评分 1-5,key=index */
    ratings: {},
    /** 是否检测到矛盾约束 */
    conflictDetected: false,
    clarifyQuestion: "",
  },

  onLoad: function (options) {
    const count = parseInt((options.selectedCount || "3").split("个")[0]) || 3;
    this.setData({
      selectedCount: count,
      query: decodeURIComponent(options.query || "为我推荐美食"),
      location: decodeURIComponent(options.location || ""),
    });
    this.generateBubbles();
    this.callAgentRecommend();
  },

  /** 论文 4-5 章: 调多 Agent 协作推荐入口 */
  callAgentRecommend: async function () {
    Agent.agent.recommend.data = {
      query: this.data.query,
      location: this.data.location || undefined,
      num: this.data.selectedCount,
    };
    try {
      const resp = await RequestUtils.request(Agent.agent.recommend);
      const d = resp && resp.data ? resp.data : {};
      const list = Array.isArray(d.items) ? d.items : [];
      const updated = list.map((item) => ({
        ...item,
        stars: this.generateStars(item.mark || 0),
      }));
      this.setData({
        recommendations: updated,
        traceId: d.traceId || "",
        parsedIntent: d.parsedIntent || null,
        agentLatency: d.agentLatency || {},
        pReActSavedMs: d.pReActSavedMs || 0,
        conflictDetected: !!d.conflictDetected,
        clarifyQuestion: d.clarifyQuestion || "",
      });
    } catch (e) {
      console.warn("Agent 推荐失败,降级到旧推荐", e);
      this.fallbackOldRecommend();
    }
  },

  /** Agent 失败时降级到原推荐接口,保证用户始终能看到结果 */
  fallbackOldRecommend: async function () {
    Recommend.recommend.recommend.data = { num: this.data.selectedCount };
    try {
      const data = await RequestUtils.request(Recommend.recommend.recommend);
      const list = (data && data.data && data.data.list) || [];
      this.setData({
        recommendations: list.map((item) => ({
          ...item,
          stars: this.generateStars(item.mark),
        })),
      });
    } catch (e) {
      console.error("旧推荐也失败了", e);
    }
  },

  /** 用户点星评分,提交满意度 (论文 5.2) */
  onRateTap: async function (e) {
    if (!this.data.traceId) {
      wx.showToast({ title: "本次未走 Agent 链路,无法反馈", icon: "none" });
      return;
    }
    const score = parseInt(e.currentTarget.dataset.score);
    const idx = e.currentTarget.dataset.idx;
    if (!score || score < 1 || score > 5) return;

    // 同一 traceId 只允许评一次,避免重复打分
    const ratings = { ...this.data.ratings };
    if (ratings[idx] != null) {
      wx.showToast({ title: "已评分过", icon: "none" });
      return;
    }
    ratings[idx] = score;
    this.setData({ ratings });

    Agent.agent.feedback.data = {
      traceId: this.data.traceId,
      rating: score,
      comment: "",
    };
    try {
      await RequestUtils.request(Agent.agent.feedback);
      wx.showToast({ title: "感谢您的反馈", icon: "success" });
    } catch (err) {
      // 回滚 UI 状态,允许用户重试
      const r = { ...this.data.ratings };
      delete r[idx];
      this.setData({ ratings: r });
      wx.showToast({ title: "反馈失败,请重试", icon: "none" });
    }
  },

  generateBubbles: function () {
    const bubbles = [];
    const icons = [
      "../../assets/images/食物&器皿－披萨.png",
      "../../assets/images/食物.png",
      "../../assets/images/食物&器皿－酒.png",
    ];
    for (let i = 0; i < 5; i++) {
      const size = 30 + Math.random() * 50;
      bubbles.push({
        style: `
          left: ${Math.random() * 100}vw;
          width: ${size}px;
          height: ${size}px;
          background-color: ${this.getRandomColor()};
          animation-delay: ${Math.random() * 5}s;
          animation-duration: ${15 + Math.random() * 10}s;
        `,
        icon: icons[Math.floor(Math.random() * icons.length)],
      });
    }
    this.setData({ bubbles });
  },

  getRandomColor: function () {
    const colors = this.data.bubbleColors;
    return colors[Math.floor(Math.random() * colors.length)];
  },

  onSwiperChange: function (e) {
    this.setData({ currentIndex: e.detail.current });
  },

  switchToPrevious: function () {
    let n = this.data.currentIndex - 1;
    if (n < 0) n = this.data.recommendations.length - 1;
    this.setData({ currentIndex: n });
  },

  switchToNext: function () {
    let n = this.data.currentIndex + 1;
    if (n >= this.data.recommendations.length) n = 0;
    this.setData({ currentIndex: n });
  },

  navigationShop: function (event) {
    const coordinate = event.currentTarget.dataset.coordinate;
    const dishesName = event.currentTarget.dataset.dishesname;
    if (!coordinate) return;
    const [longitude, latitude] = coordinate.split(",");
    wx.openLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
      name: "美食",
      scale: 15,
      address: dishesName,
    });
  },

  goShop: function (event) {
    const shopId = event.currentTarget.dataset.shopid;
    wx.navigateTo({ url: "/pages/shop/shop/shop?shopId=" + shopId });
  },

  generateStars: function (mark) {
    const v = Number(mark) || 0;
    const fullStars = Math.floor(v);
    const halfStar = v % 1 >= 0.5 ? 1 : 0;
    const emptyStars = Math.max(0, 5 - fullStars - halfStar);
    return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);
  },
});
