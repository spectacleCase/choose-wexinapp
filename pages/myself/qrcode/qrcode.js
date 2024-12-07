import request_util from "../../../utils/request_util";
import user from "../../../services/api/user";
Component({
  data: {
    userInfo: {
      avatar: "",
      nickname: "",
    },
    qrCodeUrl: "", // 这里需要后端提供二维码图片URL
  },

  methods: {
    async getUserQRCode() {
      try {
        const data = await request_util.request(user.user.getUseroR);
        this.setData({
          qrCodeUrl: data.data.value,
        });
      } catch (error) {
        wx.showToast({
          title: "获取二维码失败",
          icon: "none",
        });
      }
    },
  },

  attached: function () {
    const userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo });
    this.getUserQRCode();
  },
});
