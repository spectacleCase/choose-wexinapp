// test.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    latitude: 21.682133,
    longitude: 110.923515,
    markers: [],
    id:1
  },

  buttonSearch(e) {
    var _this = this;
    var allMarkers = [];
    //通过wx.request发起HTTPS接口请求
    wx.request({
      //地图WebserviceAPI地点搜索接口请求路径及参数（具体使用方法请参考开发文档）
      url: "https://apis.map.qq.com/ws/place/v1/search?page_index=1&page_size=20&boundary=region(北京市,0)&keyword=美食&key=NHCBZ-Z57K3-5B63O-O5PON-MAZ65-7LFK3",
      success(res) {
        var result = res.data;
        console.log(res.data);
        var pois = result.data;
        for (var i = 0; i < pois.length; i++) {
          var title = pois[i].title;
          var lat = pois[i].location.lat;
          var lng = pois[i].location.lng;
          console.log(title + "," + lat + "," + lng);
          const marker = {
            id: i,
            latitude: lat,
            longitude: lng,
            callout: {
              // 点击marker展示title
              content: title,
            },
          };
          allMarkers.push(marker);
          marker = null;
        }
        console.log(allMarkers);
        _this.setData({
          latitude: allMarkers[0].latitude,
          longitude: allMarkers[0].longitude,
          markers: allMarkers,
        });
      },
    });
  },
  getMap() {
    let allMarkers = this.data.markers;
    let a = this.data.latitude + 0.0001;
    let b = this.data.longitude + 0.0001;
    const marker = {
      id: this.data.id,
      latitude: a,
      longitude: b,
      title:"ces ",
      iconPath:"../../assets/images/食物&器皿－披萨.png",
      width: 20, // 必须指定宽度
      height: 30, // 必须指定高度
      callout: {
        // 点击marker展示title
        content: "title",
      },
    };
    allMarkers.push(marker);
    
    this.setData({
      latitude: a,
      longitude: b,
      markers: allMarkers,
      id:this.data.id += 1
    });
  },
});
