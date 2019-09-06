//pages/login/login.js
const app = getApp();
const db=wx.cloud.database({
  env: 'hxl-1wbvh'
});
const User = db.collection('User');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */

  /**
   *从云端获取资料
   *如果没有获取到则尝试新建用户资料
   */


  onLoad: function (options) {
    if (!wx.cloud) {
      wx.switchTab({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    let _this = this;
    //查看是否授权
    wx.getSetting({
      success:function(res){
        if(res.authSetting['scope.userInfo']){
          //将授权结果写入app.js全局变量
          console.log("已经授权")
          app.globalData.auth['scope.userInfo']=true //已经授权
          //从云端获取用户资料
          wx.cloud.callFunction({
            name: 'get_setUserInfo',
            data:{
              getSelf:true
            },
            success:res=>{
              if(res.errMsg=="cloud.callFunction:ok"&&res.result.data.length){
                //如果成功获取到
                //将获取到的用户资料写入app.js全局变量
                console.log(res)
                app.globalData.openId = res.result.data[0].openid
                app.globalData.userId = res.result.data[0]._id
                app.globalData.avatarUrl=res.result.data[0].userData.avatarUrl
                app.globalData.nickName=res.result.data[0].userData.nickName
                wx.switchTab({
                  url: '../index/index',
                })
              }else{
                console.log("未注册1")
              }
            },
            fail: err=>{
              wx.showToast({
                title: '请检查网络您的状态',
                duration: 800,
                icon: 'none'
              })
              console.error("get_setUserInfo调用失败", err.errMsg)
            }
          })
        }else{
          //未获得授权
          console.log("未授权")
        }
      },
      fail(err){
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        console.error("wx.getSetting调用失败", err.errMsg)
      }
    })
  },

  /**
  *从云端获取资料
  *如果没有获取到则尝试新建用户资料
  */
  getUserInfo: function (e) {
    var _this = this;
    if (e.detail.errMsg==="getUserInfo:ok") {
      //用户按了允许授权按钮
      // 将授权结果写入app.js全局变量
      app.globalData.auth['scope.userInfo']=true
      //尝试获取云端用户信息
      wx.cloud.callFunction({
        name: 'get_setUserInfo',
        data:{
          getSelf: true
        },
        success: res=>{
          if(res.errMsg==="cloud.callFunction:ok")
          {
            if(res.result.data.length){
              //如果成功获取到
              //将获取到的用户资料写入app.js全局变量
              //console.log(res)
              app.globalData.openId = res.result.data[0].openid
              app.globalData.userId = res.result.data[0]._id
              app.globalData.userInfo=res.result.data[0].userData
              app.globalData.avatarUrl = res.result.data[0].userData.avatarUrl
              app.globalData.nickName = res.result.data[0].userData.nickName
              wx.switchTab({
                url: '../index/index',
              })
            }else{
              //未成功获取到用户信息
              //调用注册方法
              console.log("未注册2")
              _this.register({
                nickName:e.detail.userInfo.nickName,
                gender:e.detail.userInfo.gender,
                avatarUrl:e.detail.userInfo.avatarUrl,
                region:['none','none','none'],
                campus:"none",
                studentNumber:'none',
              })
            }
          }
        },
        fail:err=>{
          wx.showToast({
            title: '请检查你的网络状态',
            duration:800,
            icon:'none',
          })
          console.error("get_setUserInfo调用失败",err.errMsg)
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      })
    }
  },

  //注册用户信息
  register:function(e){
    let _this=this
    wx.cloud.callFunction({
      name: 'get_setUserInfo',
      data:{
        setSelf: true,
        userData:e
      },
      success: res=>{
        if(res.errMsg=="cloud.callFunction:ok"&&res.result){
          app.globalData.userInfo=e
          app.globalData.userId=res.result._id
          //console.log(res)
          console.log("注册成功")
          wx.switchTab({
            url: '../index/index',
          })
        }else{
          console.log("注册失败",res)
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 800,
            icon: 'none'
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 800,
          icon: 'none'
        })
        console.error("get_setUserInfo调用失败", err.errMsg)
      }
    })
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
  onShareAppMessage: function () {

  }
})