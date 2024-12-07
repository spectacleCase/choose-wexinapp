import request_util from "../../../utils/request_util";
import im from "../../../services/api/im";
Page({
  data: {
    // 新朋友数据，按时间分组
    friendGroups: [
      {
        title: "近三天",
        list: [
          {
            id: 1,
            name: "张三",
            avatar: "../../../assets/images/开发者1.jpg",
            remark: "我是张三，想加你为好友",
            time: "今天 14:30",
            status: "pending",
          },
          {
            id: 2,
            name: "李四",
            avatar: "../../../assets/images/开发者1.jpg",
            remark: "我们是校友",
            time: "昨天 18:20",
            status: "pending",
          },
        ],
      },
      {
        title: "三天前",
        list: [
          {
            id: 3,
            name: "王五",
            avatar: "../../../assets/images/开发者1.jpg",
            remark: "我是王五",
            time: "3天前",
            status: "pending",
          },
        ],
      },
      {
        title: "一周前",
        list: [
          {
            id: 4,
            name: "赵六",
            avatar: "../../../assets/images/开发者1.jpg",
            remark: "项目合作",
            time: "1周前",
            status: "agreed",
          },
        ],
      },
    ],
  },

  // 扫描二维码
  scanQRCode() {
    wx.scanCode({
      success(res) {
        console.log("扫描结果：", res);
        // 处理扫描结果
      },
      fail(err) {
        console.error("扫描失败：", err);
      },
    });
  },

  // 同意好友请求
  async agreeFriend(e) {
    const { id } = e.currentTarget.dataset;
    // 这里添加同意好友的逻辑
    im.im.updateFriend.data = { id: id, status: 1 };
    await request_util.request(im.im.updateFriend);
    this.getNewFriendList();
    wx.showToast({
      title: "已同意",
      icon: "success",
    });
  },

  // 搜索用户
  onSearch(e) {
    const searchValue = e.detail.value;
    console.log("搜索：", searchValue);
    // 这里添加搜索逻辑
  },
  async getNewFriendList() {
    const data = await request_util.request(im.im.getNewFriendList);
    this.setData({
      friendGroups: data.data.list,
    });
    console.log(data);

    console.log(this.data.friendGroups);
  },
  async onLoad() {
    this.getNewFriendList();
  },
});
