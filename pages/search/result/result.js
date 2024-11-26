import request_util from "../../../utils/request_util";
import common from "../../../services/api/common";
Page({
  data: {
    searchTerm: "", // 搜索关键词
    results: [], // 搜索结果
    suggestions: [], // 相关搜索词
    // 模拟数据
    mockData: [
      {
        // id,shopName,rating,reviewConut,shopImage,dishesList[image,name],address,shopId,
        id: 1,
        shopName: "披萨店",
        rating: 4.5,
        reviewCount: 120,
        image1:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
        dieshesList: [
          {
            image:
              "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
            name: "披萨1",
          },
          {
            image:
              "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
            name: "披萨2",
          },
          {
            image:
              "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
            name: "披萨3",
          },
        ],
      },
      {
        id: 2,
        name: "招牌汉堡",
        shopName: "汉堡店",
        rating: 4.0,
        reviewCount: 80,
        image1:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
        image2:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
        image3:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1",
      },
      {
        id: 3,
        name: "经典寿司",
        description: "新鲜的生鱼片，搭配米饭",
        price: 45,
        image: "https://example.com/images/sushi.jpg", // 图片链接
      },
      {
        id: 4,
        name: "美味披萨",
        description: "外脆内嫩的炸鸡",
        price: 40,
        image: "https://example.com/images/chicken.jpg", // 图片链接
      },
      {
        id: 5,
        name: "美味披萨",
        description: "经典的意大利面，搭配自制酱料",
        price: 50,
        image:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1", // 图片链接
      },
      {
        id: 6,
        name: "美味披萨",
        description: "新鲜的蔬菜沙拉，健康美味",
        price: 30,
        image:
          "https://ts2.cn.mm.bing.net/th?id=OSK.02623dd7053c0ba4e0ba6df4409e8fca&w=612&h=407&c=7&rs=1&qlt=80&o=6&cdv=1&pid=16.1", // 图片链接
      },
      {
        id: 7,
        name: "香浓咖啡",
        description: "醇厚的咖啡，提神醒脑",
        price: 20,
        image: "https://example.com/images/coffee.jpg", // 图片链接
      },
      {
        id: 8,
        name: "特色小吃",
        description: "各种风味的小吃，满足你的味蕾",
        price: 25,
        image: "https://example.com/images/snacks.jpg", // 图片链接
      },
    ],
  },

  onLoad(options) {
    this.setData({
      searchTerm: options.term || "", // 获取传递的搜索关键词
    });
    console.log(this.data.searchTerm);

    this.fetchResults();
  },

  async fetchResults() {
    const url = common.common.search.url;
    common.common.search.url += this.data.searchTerm;
    const data = await request_util.request(common.common.search);

    // 使用模拟数据
    // this.setData({
    //   results: this.data.mockData.filter((item) =>
    //     item.name.includes(this.data.searchTerm)
    //   ), // 根据搜索关键词过滤结果
    // });
    this.setData({
      results: data.data.list,
    });
    common.common.search.url = url;
  },

  // 查看详细信息
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const selectedItem = this.data.results[index];
    wx.navigateTo({
      url: `/pages/detail/detail?id=${selectedItem.id}`, // 假设每个结果有一个id属性
    });
  },

  // 跳转到店铺页面
  goToShop(e) {
    const index = e.currentTarget.dataset.index;
    // const selectedItem = this.data.results[index];
    wx.navigateTo({
      url: `/pages/shop/shop/shop?shopId=${index}`, // 假设每个结果有一个id属性
    });
  },
  handleInput(e) {
    const inputItem = e.detail.value;
    console.log(inputItem);

    this.setData({
      searchTerm: inputItem,
    });
    this.fetchResults();
  },
  handleInputs(e) {
    const inputValue = e.detail.value;
    this.updateSuggestions(inputValue);
  },

  // 更新相关搜索词
  async updateSuggestions(inputValue) {
    const url = common.common.search_terms.url;
    common.common.search_terms.url =
      common.common.search_terms.url + inputValue;

    const data = await request_util.request(common.common.search_terms);

    this.setData({
      suggestions: data.data.list,
    });
    common.common.search_terms.url = url;
  },
  handleSearch(e) {
    console.log(e.currentTarget.dataset.search);

    this.setData({
      searchTerm: e.currentTarget.dataset.search,
      suggestions: [],
    });
    this.fetchResults();
  },
});
