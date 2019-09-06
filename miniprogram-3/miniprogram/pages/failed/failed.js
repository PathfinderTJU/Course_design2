// pages/failed/failed.js
Page({

  data: {
    "content": ""
  },

  onLoad: function (options) {
    let index = parseInt(options.index);
    if (index === 1){ //达到问卷上限
      this.setData({
        content: "该问卷填写人数已经达到上限"
      })
    }else if(index === 2){
      this.setData({
        content: "该问卷已截止"
      })
    } else if (index === 3) {
      this.setData({
        content: "该问卷未发布"
      })
    }
  },


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