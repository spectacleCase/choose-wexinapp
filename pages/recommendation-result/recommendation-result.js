Page({
  data: {
    bubbles: [],
    recommendations: [
      {
        dishesName: "特色菜品18",
        aiDescription: "还行",
        columnId: 0,
        id: 1847894023606030300,
        image:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/19/87829ec592bb44778ee4886505a17290.png",
        mark: 1.2,
        shopId: 9,
        shopName: "中文店铺4",
        tagName: ["距离适中", "酸辣辣"],
      },
      {
        dishesName: "特色菜品18",
        aiDescription: "还行",
        columnId: 0,
        id: 1847894023606030301,
        image:
          "https://choose-1326057669.cos.ap-guangzhou.myqcloud.com/2024/10/19/87829ec592bb44778ee4886505a17290.png",
        mark: 4.4,
        shopId: 9,
        shopName: "中文店铺4",
        tagName: ["距离适中", "酸辣辣"],
      },
      // 添加更多推荐项...
    ],
    currentIndex: 0,
    bubbleColors: ["#FDF1E7", "#F07A10", "#FDF3E8", "#FDF3E8", "#FDF3E8"],
  },

  onLoad: function () {
    this.generateBubbles();
    this.generateStarsForRecommendations();
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

  generateStarsForRecommendations: function () {
    const updatedRecommendations = this.data.recommendations.map((item) => {
      return {
        ...item,
        stars: this.generateStars(item.mark),
      };
    });
    this.setData({ recommendations: updatedRecommendations });
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
