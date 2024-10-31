// pages/collect/collect.js
import Collect from "../../services/api/collect";
import RequestUtils from "../../utils/request_util";

Page({
  data: {
    collections: []
  },

  onLoad(options) {
    this.getCollections();
  },

  onShow() {
    this.getCollections();
  },

  // 获取收藏列表
  getCollections() {
    Collect.collect.checkCollection.data = {
      userid: wx.getStorageSync('userId')
    }
    RequestUtils.request(Collect.collect.checkCollection).then(res => {
      this.setData({
        collections: res.data
      });
    }).catch(err => {
      console.error('获取收藏列表失败:', err);
    });
  },


  // 添加收藏
  addCollection() {
    wx.showModal({
      title: '添加收藏',
      editable: true,
      placeholderText: '请输入收藏名称',
      success: (res) => {
        if (res.confirm && res.content) {
          Collect.collect.addCollection.data = {
            name: res.content,
            userid: wx.getStorageSync('userId')
          }
          RequestUtils.request(Collect.collect.addCollection).then(() => {
            wx.showToast({
              title: '添加成功',
              icon: 'success'
            });
            this.getCollections();
          });
        }
      }
    });
  },

  // 修改收藏
  changeCollection(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '修改收藏',
      editable: true,
      placeholderText: '请输入新的收藏名称',
      content: name,
      success: (res) => {
        if (res.confirm && res.content) {
          Collect.collect.changeCollection.data = {
            collectid: id,
            userid: wx.getStorageSync('userId'),
            name: res.content
          }
          RequestUtils.request(Collect.collect.changeCollection).then(() => {
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            });
            this.getCollections();
          });
        }
      }
    });
  },

  // 删除收藏
  deleteCollection(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个收藏吗？',
      success: (res) => {
        if (res.confirm) {
          Collect.collect.deleteCollection.data = {
            collectid: id,
            userid: wx.getStorageSync('userId')
          }
          RequestUtils.request(Collect.collect.deleteCollection).then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
            this.getCollections();
          });
        }
      }
    });
  },

  // 查看收藏详情
  checknchilren(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/collect-detail/collect-detail?id=${id}&name=${name}`
    });
  },

  onPullDownRefresh() {
    this.getCollections();
    wx.stopPullDownRefresh();
  }
})