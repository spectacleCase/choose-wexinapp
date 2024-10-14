Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    message: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'success'
    },
    duration: {
      type: Number,
      value: 2000
    }
  },

  data: {
    animationData: {}
  },

  observers: {
    'show': function(show) {
      if (show) {
        this.showToast();
      }
    }
  },

  methods: {
    showToast() {
      const animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease',
      });
      
      animation.right('20rpx').opacity(1).step();
      this.setData({
        animationData: animation.export()
      });

      setTimeout(() => {
        animation.right('-300rpx').opacity(0).step();
        this.setData({
          animationData: animation.export()
        });
        setTimeout(() => {
          this.setData({
            show: false
          });
        }, 300);
      }, this.data.duration);
    }
  }
});
