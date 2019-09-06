// pages/add_blank/add_blank.js
var app = getApp();

Page({

  data: {
    "navigateType": 0,
    "formData":{
      "type": "blank",
      "title": "",
      "setting": true
    }
  },

  onLoad: function (options) {
    this.setData({
      'navigateType': parseInt(options.index),

    });
    
    if (this.data.navigateType !== -1) {
      this.setData({
        formData: app.globalData.question[this.data.navigateType - 1]
      })
    }

  },

  //删除题目，返回编辑页面，不做任何操作，只需填写url
  cancel: function () {

    if (this.data.navigateType !== -1) {
      app.globalData.question.splice(this.data.navigateType - 1, 1)
    }

    wx.navigateBack({
      delta: 2
    });
  },

  formSubmit: function (e) {
    var details = e.detail.value; //表单数据
    var origin = this.data.formData; //formData中原有的数据

    //检测空白题目
    if (details.title === "") {
      wx.showToast({
        title: '标题不能为空',
        icon: "none",
        duration: 1500
      })
      return;
    }

    //向formData中添加表单数据
    origin.title = details.title;
    origin.setting = details.setting;

    this.setData({
      formData: origin
    })

    if (this.data.navigateType === -1) {
      //新建题目，更新全局变量
      app.globalData.question.push(this.data.formData);
    } else {
      //重编辑题目，更新全局变量
      app.globalData.question[this.data.navigateType - 1] = this.data.formData;
    }

    //重定向页面
    wx.navigateBack({
      delta: 2
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