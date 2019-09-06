// pages/create/create.js
Page({
  //注意：本页面不能被返回
  data: {

  },
  
  //创建新文件
  createNew: function(){
    wx.redirectTo({
      url: '/pages/title_abstract/title_abstract?index=-1',
    })
  },

  //复制已有模板
  createOld: function(){
    //跳转至模板选择页面
    wx.redirectTo({
      url: '../choose/choose',
    })
  },

  createBaoming: function () {
    wx.redirectTo({
      url: '/pages/editor/editor?index=3',
    })
  },

  createManyi: function () {
    wx.redirectTo({
      url: '/pages/editor/editor?index=4',
    })
  },

  createToupiao: function () {
    wx.redirectTo({
      url: '/pages/editor/editor?index=5',
    })
  },

  createTest: function () {
    wx.redirectTo({
      url: '/pages/editor/editor?index=6',
    })
  },


  //转发
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