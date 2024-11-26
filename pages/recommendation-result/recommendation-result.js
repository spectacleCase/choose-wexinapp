import RequestUtils from "../../utils/request_util";
import Recommend from "../../services/api/recommend";
Page({
  data: {
    bubbles: [],
    recommendations: [
      {
        dishesName: "特色菜品18",
        aiDescription: "还行",
        columnId: 0,
        id: 1847894023606030300,
        image: "",
        mark: 1.2,
        shopId: 9,
        shopName: "中文店铺4",
        tagName: ["距离适中", "酸辣辣"],
        coordinate: "110.921815, 21.682233",
      },
      {
        dishesName: "特色菜品18",
        aiDescription: "还行",
        columnId: 0,
        id: 1847894023606030301,
        image: "",
        mark: 4.4,
        shopId: 9,
        shopName: "中文店铺4",
        tagName: ["距离适中", "酸辣辣"],
        coordinate: "110.921815, 21.682233",
      },
    ],
    currentIndex: 0,
    selectedCount: 1,
    bubbleColors: ["#FDF1E7", "#F07A10", "#FDF3E8", "#FDF3E8", "#FDF3E8"],
  },

  onLoad: function (options) {
    let index = options.selectedCount.split("个")[0];
    this.setData({
      selectedCount: index,
    });
    this.generateBubbles();
    this.generateStarsForRecommendations();
  },
  recommend: function () {
    Recommend.recommend.recommend.data = {
      num: 1,
    };
    const data = RequestUtils.request(Recommend.recommend.recommend);
    console.log("推荐结果", data);
  },

  generateBubbles: function () {
    const bubbles = [];
    const icons = [
      "../../assets/images/食物&器皿－披萨.png",
      "../../assets/images/食物.png",
      "../../assets/images/食物&器皿－酒.png",
    ];
    // 减少圆形个数到5个
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
    this.setData({
      currentIndex: e.detail.current,
    });
  },

  switchToPrevious: function () {
    let newIndex = this.data.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.data.recommendations.length - 1;
    }
    this.setData({
      currentIndex: newIndex,
    });
  },

  switchToNext: function () {
    let newIndex = this.data.currentIndex + 1;
    if (newIndex >= this.data.recommendations.length) {
      newIndex = 0;
    }
    this.setData({
      currentIndex: newIndex,
    });
  },

  generateStarsForRecommendations: async function () {
    let List = [];
    Recommend.recommend.recommend.data = {
      num: this.data.selectedCount,
    };
    const data = await RequestUtils.request(Recommend.recommend.recommend);
    List = data.data.list;
    // List.push(data.data);
    // console.log(data.data);
    // console.log(List);

    // this.setData({ recommendations: List });
    const updatedRecommendations = List.map((item) => {
      return {
        ...item,
        stars: this.generateStars(item.mark),
      };
    });
    this.setData({ recommendations: updatedRecommendations });
  },
  navigationShop: function (event) {
    console.log(event.currentTarget.dataset);

    const coordinate = event.currentTarget.dataset.coordinate;
    const dishesName = event.currentTarget.dataset.dishesname;
    const [longitude, latitude] = coordinate.split(",");
    console.log(latitude, longitude);
    console.log(dishesName);

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
    wx.navigateTo({
      url: "/pages/shop/shop/shop?shopId=" + shopId,
    });
  },

  generateStars: function (mark) {
    const fullStars = Math.floor(mark);
    const halfStar = mark % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars)
    );
  },
});
