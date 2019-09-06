// pages/choose/choose.js

var app = getApp();

Page({

  data: {
    "questionaires": []
  },

  onLoad: function (options) { //本页面无法被返回
    //拉取10个全部数据，放到questionaires中
    //根据全局变量，获取10个用户问卷信息（时间升序），添加到questionaires数组中
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        open_id: true,
        openid: app.globalData.openId,
        skips: 0,
        limits: 100,
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          this.setData({
            questionaires: res.result.data
          })
        } else {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
            icon: 'none'
          })
        }
        let old = this.data.questionaires;
        for (let i = 0; i < old.length; i++) {
          if (old[i].createTime[4] < 10) {
            old[i].timeOut = true;
          } else {
            old[i].timeOut = false;
          }
        }

        this.setData({
          questionaires: old
        })
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 1500,
          icon: 'none'
        })
        console.error("get_questionnaire调用失败", err.errMsg)
      }
    })
    
  },

  onReachBottom: function () {
    //增加10个数据
    var that = this;
    //在请求10个用户问卷信息，更新questionaires数组，每次增加10个（使用数组长度
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        open_id: true,
        openid: app.globalData.openId,
        skips: that.data.questionaires.length,
        limits: 10
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          //console.log(res)
          that.setData({
            questionaires: that.data.questionaires.concat(res.result.data)
          })
        } else {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
            icon: 'none'
          })
        }
        wx.stopPullDownRefresh()
      },
      fail: err => {
        wx.showToast({
          title: '请检查网络您的状态',
          duration: 1500,
          icon: 'none'
        })
        console.error("get_questionnaire调用失败", err.errMsg)
      }
    })

  },

  copy: function(options){
    let numberOfMore = parseInt(options.currentTarget.id.substring(6));
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据

    wx.redirectTo({
      url: '/pages/editor/editor?index=2&questionnaireId=' + questionaire["_id"],
    })

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