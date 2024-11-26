// test.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    latitude:0,
    longitude: 0,
    markers: [],
    destinationName: "目的地名称"
  },

  onLoad: function (options) {
    console.log("参数", options.latitude, options.longitude);
    if (options.latitude && options.longitude) {
      const lat = parseFloat(options.latitude);
      const lng = parseFloat(options.longitude);
      if (this.isValidLatitude(lat) && this.isValidLongitude(lng)) {
        this.setMapMarker(lng, lat);
      } else {
        console.error("Invalid latitude or longitude");
        // 使用默认值
        this.setMapMarker(this.data.longitude, this.data.latitude);
      }
    } else {
      // 如果没有传入参数，使用默认值
      this.setMapMarker(this.data.longitude, this.data.latitude);
    }
    // 假设我们从options中获取目的地名称，如果没有则使用默认值
    this.setData({
      destinationName: options.name || "目的地名称"
    });
  },

  setMapMarker(lng, lat) {
    const marker = {
      id: 1,
      latitude: lat,
      longitude: lng,
      iconPath: "../../assets/images/食物&器皿－披萨.png",
      width: 30,
      height: 30,
    };

    this.setData({
      latitude: lat,
      longitude: lng,
      markers: [marker],
    });
  },

  nav: function () {  
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: this.data.destinationName,
      scale: 15,
      address: `${this.data.latitude},${this.data.longitude}`
    })
  },

  isValidLatitude: function(lat) {
    return lat >= -90 && lat <= 90;
  },

  isValidLongitude: function(lng) {
    return lng >= -180 && lng <= 180;
  }
});
