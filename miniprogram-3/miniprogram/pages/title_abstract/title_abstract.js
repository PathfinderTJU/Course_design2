// miniprogram/pages/blank/blank.js
//wx.cloud.init()
const app = getApp();
const db = wx.cloud.database({
  env: 'hxl-1wbvh'
});
const questionnaire = db.collection('questionnaire');

Page({

  data: {
    "navigateType": 0,
    "title": "",
    "abstract": "欢迎使用怡问卷报名系统，感谢您能抽出几分钟时间来参加本次答题，现在就让我们就马上开始吧！",
    "id":""
  },

  //此页面无法被返回，onshow方法不会被调用
  onLoad: function (options) {
    //console.log(options)
    let index = parseInt(options.index);

    this.setData({
      'navigateType': index
    })
    if(index===1){
      this.setData({
        id:options.questionnaireId
      })
    }

    if (index === 1) {//重编辑
      this.setData({
        title: app.globalData.questionnaireTitle,
        abstract: app.globalData.briefIntroduction
      })
    }
  },

  formSubmit: function(e){
    var that =this;
    let details = e.detail.value; //表单数据
    //检测空白题目
    if (details.title === "") {
      wx.showToast({
        title: '标题不能为空',
        icon: "none",
        duration: 1500
      })
      return;
    }
    //检测空白简介，并设置为默认简介
    if (details.abstract === "") {
      this.setData({
        abstract: "欢迎使用怡问卷报名系统，感谢您能抽出几分钟时间来参加本次答题，现在就让我们就马上开始吧！"
      })
      app.globalData.briefIntroduction = this.data.abstract;
    }else{
      this.setData({
        abstract: details.abstract
      })
    }

    this.setData({
      title: details.title
    })


    if (this.data.navigateType === 1){//重编辑进入
      app.globalData.questionnaireTitle = that.data.title;
      app.globalData.briefIntroduction=that.data.abstract;
      wx.cloud.callFunction({
        name: 'update_questionnaire',
        data: {
          title_abstract: true,
          questionnaireId:that.data.id,
          title:that.data.title,
          abstract:that.data.abstract
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            //console.log(res)
          } else {
            wx.showToast({
              title: '请检查网络您的状态',
              duration: 800,
              icon: 'none'
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
            icon: 'none'
          })
          console.error("get_questionnaireId调用失败", err.errMsg)
        }
      })
      wx.navigateBack({
        delta: 1
      })
    }else if (this.data.navigateType === -1){//创建进入
      //在云平台增加新的问卷记录，并将此时全局变量中的title、abstract上传
      //console.log(this.data.navigateType)
    //重定向至编辑页面
      var newDate = new Date();
      var year = newDate.getFullYear(),
        mont = newDate.getMonth() + 1,
        date = newDate.getDate(),
        hour = newDate.getHours(),
        minu = newDate.getMinutes();
      app.globalData.questionnaireTitle = this.data.title;
      app.globalData.briefIntroduction = this.data.abstract;
      app.globalData.createTime = [year, mont, date, hour, minu];
      wx.cloud.callFunction({
        name: 'add_questionnaire',
        data: {
          openId: app.globalData.openId,
          questionnaireTitle: app.globalData.questionnaireTitle,
          briefIntroduction: app.globalData.briefIntroduction,
          createTime: app.globalData.createTime,
          endTime: [],
          questions: [],
          maxNumber: "",
          number: 0,
          state: "0"
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {

          } else {
            wx.showToast({
              title: '请检查网络您的状态',
              duration: 800,
              icon: 'none'
            })
          }
          wx.redirectTo({
            url: '/pages/editor/editor?index=' + this.data.navigateType,
          })
        },
        fail: err => {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
            icon: 'none'
          })
          console.error("add_questionnaire调用失败", err.errMsg)
        }
      })
    }
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