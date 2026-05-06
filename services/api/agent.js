const BASE_URL = "/recommend/v1/agent";

/**
 * Agent 协作相关 (论文 4-5 章)
 */
const agent = {
  /** 多 Agent 协作推荐 */
  recommend: {
    url: BASE_URL + "/recommend",
    method: "POST",
    auth: true,
    data: null,
  },

  /**
   * 美食社区智能标签提取 (论文 5.2)
   * data: { content: string }
   * resp: { matchedTags: [{id,name}], newTags: [], topics: [], keywords: [] }
   */
  extractTags: {
    url: BASE_URL + "/extract-tags",
    method: "POST",
    auth: true,
    data: null,
  },
};

export default { agent };
