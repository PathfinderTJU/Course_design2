// miniprogram/pages/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPage: "firstPage",
    nowIndex: 0,
    tabBar: [
      {
        "iconClass": "iconfont icon-shouye",
        "text": "管理",
        "tapFunction": "toFirst",
        "active": "active"
      },
      {
        "iconClass": "iconfont icon-wode",
        "text": "创建",
        "tapFunction": "toSecond",
        "active": ""
      },
      {
        "iconClass": "iconfont icon-wode",
        "text": "关于",
        "tapFunction": "toSecond",
        "active": ""
      },
    ]

  },

  toFirst() {
    this.setData({
      nowPage: "firstPage",
      nowIndex: 0
    })
  },
  toSecond() {
    this.setData({
      nowPage: "secondPage",
      nowIndex: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '欢迎使用怡问卷',
      path: '/pages/login/login',
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
  },


  goToBlank: function(){
    wx.navigateTo({
      url: '../blank/blank',
    })
  }
  
})
// ,

//   Component({
//     pageLifetimes: {
//       show() {
//         if (typeof this.getTabBar === 'function' &&
//           this.getTabBar()) {
//           this.getTabBar().setData({
//             selected: 1
//           })
//         }
//       }
//     }
//   })