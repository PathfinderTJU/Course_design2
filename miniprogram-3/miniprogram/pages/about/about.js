// miniprogram/pages/about/about.js
var app = getApp();

Page({
  data: {
    avatarUrl: "",
    nickName: ""
  },

  onLoad: function (options) {
    this.setData({
      avatarUrl: app.globalData.avatarUrl,
      nickName: app.globalData.nickName
    })
  },

  hxl: function(){ //彩蛋页面入口
    wx.navigateTo({
      url: '/pages/egg/egg',
    })
  },

  toAbout: function(){
    wx.navigateTo({
      url: '/pages/about/about_us/about_us',
    })
  },

  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '欢迎使用怡问卷',
      path: '/page/login/login',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: "none",
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: "none",
          duration: 1500
        })
      }
    }
  }
})
