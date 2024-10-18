Page({
  data: {
    isTabbarOpen: false,
    pageTitle: '设置',
    pageAnimation: {},
    languages: ['简体中文', 'English', '日本語'],
    languageIndex: 0,
    notificationsEnabled: true
  },

  onLoad: function(options) {
    // 根据路由参数设置页面标题和加载相应内容
    if (options.page) {
      this.loadPage(options.page);
    }
  },

  loadPage: function(page) {
    // 这里可以根据不同的页面参数加载不同的内容
    switch(page) {
      case 'account':
        this.setData({ pageTitle: '账户设置' });
        // 加载账户设置内容
        break;
      case 'notification':
        this.setData({ pageTitle: '通知设置' });
        // 加载通知设置内容
        break;
      case 'privacy':
        this.setData({ pageTitle: '隐私设置' });
        // 加载隐私设置内容
        break;
      case 'about':
        this.setData({ pageTitle: '关于我们' });
        // 加载关于我们内容
        break;
      default:
        this.setData({ pageTitle: '设置' });
        // 加载默认设置内容
    }
  },

  toggleTabbar: function() {
    const isOpen = !this.data.isTabbarOpen;
    this.setData({ isTabbarOpen: isOpen });
    this.animatePage(isOpen);
  },

  onTabChange: function(e) {
    const { index, url } = e.detail;
    console.log('切换到标签:', index);
    wx.navigateTo({
      url: url,
      fail: () => {
        wx.switchTab({ url: url });
      }
    });
  },

  closeTabbar: function() {
    this.setData({ isTabbarOpen: false });
    this.animatePage(false);
  },

  animatePage: function(isOpen) {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });

    if (isOpen) {
      animation.translateX(200).translateY(100).rotateZ(-15).step();
    } else {
      animation.translateX(0).translateY(0).rotateZ(0).step();
    }

    this.setData({
      pageAnimation: animation.export()
    });
  },

  onLanguageChange(e) {
    this.setData({
      languageIndex: e.detail.value
    });
    // 这里可以添加切换语言的逻辑
  },

  onNotificationChange(e) {
    this.setData({
      notificationsEnabled: e.detail.value
    });
    // 这里可以添加开启/关闭通知的逻辑
  },

  logout: function() {
    wx.showModal({
      title: '确认退出',
      content: '您确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清理缓存的token和userInfo
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          
          // 使用reLaunch方法跳转到登录页面
          wx.reLaunch({
            url: '/pages/login/login',
            success: () => {
              // 可选：显示退出成功的提示
              wx.showToast({
                title: '已退出登录',
                icon: 'success',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

  // 其他方法...
})
