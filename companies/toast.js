const showToast = function (message, type = "success", duration = 2000) {
  wx.hideLoading();
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  currentPage.setData({
    "customToast.show": true,
    "customToast.message": message,
    "customToast.type": type,
    "customToast.duration": duration,
  });
};

export default {
  showToast,
};
