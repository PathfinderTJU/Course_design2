// miniprogram/pages/date/date.js
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp();
const db = wx.cloud.database({
  env: 'hxl-1wbvh'
});
const questionnaire = db.collection('questionnaire');

Page({
  data: {
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    id:"",
    navigateType:""
  },
  onLoad(options) {
    //console.log(options)
    if(options.index==="1"){
      this.setData({
        id:options.questionnaireId,
        navigateType:options.index
      })
    }
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime, //日期精确到秒 [0,7,28,19,48,15]
      dateTimeArray: obj.dateTimeArray, // 所有时间
      dateTimeArray1: obj1.dateTimeArray,//去除秒
      dateTime1: obj1.dateTime //去除秒的当前日
    })
  },
  
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    this.setData({ dateTime: e.detail.value });
  },
  changeDateTime1(e) {
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    }); //改变picker中的数
  },
// {{dateTimeArray1[0][dateTime1[0]]}}-{{dateTimeArray1[1][dateTime1[1]]}}-{{dateTimeArray1[2][dateTime1[2]]}} {{dateTimeArray1[3][dateTime1[3]]}}:{{dateTimeArray1[4][dateTime1[4]]}}
  goPublish:function(e){
    var that=this
    var maxNumber = e.detail.value.max_number;
    //console.log(typeof(maxNumber))
    var newDate = new Date();
    var year = newDate.getFullYear(),
      mont = newDate.getMonth() + 1,
      date = newDate.getDate(),
      hour = newDate.getHours(),
      minu = newDate.getMinutes();
      //console.log(this.data.dateTime1)
    if (this.data.dateTime1[0]>0||this.data.dateTime1[1] + 1 > mont || (this.data.dateTime1[1] + 1 === mont && this.data.dateTime1[2]+1>date)||
      (this.data.dateTime1[1] + 1 === mont && this.data.dateTime1[2]+1 === date && this.data.dateTime1[3] > hour)||
      (this.data.dateTime1[1] + 1 === mont && this.data.dateTime1[2]+1 === date && this.data.dateTime1[3] === hour && this.data.dateTime1[4]>minu)){
      wx.showModal({
        title: '发布问卷',
        content: '问卷一旦发布将不可修改，是否确认？',
        success: function (res) {
          if (res.confirm) {
            if (that.data.navigateType === "1") {
              //二次编辑，局部变量id为问卷id.
              //模板编辑，局部变量id为问卷id
              wx.cloud.callFunction({
                name: 'update_questionnaire',
                data: {
                  id: true,
                  questionnaireId: that.data.id,
                  openId: app.globalData.openId,
                  questionnaireTitle: app.globalData.questionnaireTitle,
                  createTime: app.globalData.createTime,
                  dateTime1: null,
                  questions: that.data.question,
                  maxNumber: null,
                  state: "1"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    console.log(res)
                  } else {

                  }
                  wx.redirectTo({
                    url: '/pages/complete/complete?index=' + that.data.navigateType + '&questionnaireId=' + that.data.id
                  })
                },
                fail: err => {
                  wx.showToast({
                    title: '请检查网络您的状态',
                    duration: 1500,
                    icon: 'none'
                  })
                  console.error("update_questionnaire调用失败", err.errMsg)
                }
              })
            } else {
              wx.cloud.callFunction({
                name: 'update_questionnaire',
                data: {
                  id: false,
                  openId: app.globalData.openId,
                  questionnaireTitle: app.globalData.questionnaireTitle,
                  createTime: app.globalData.createTime,
                  dateTime1: that.data.dateTime1,
                  questions: app.globalData.question,
                  maxNumber: maxNumber,
                  state: "1"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    wx.redirectTo({
                      url: '/pages/complete/complete?index=' + that.data.navigateType + '&questionnaireId=' + that.data.id
                    })
                  } else {
                  }
                },
                fail: err => {
                  wx.showToast({
                    title: '请检查网络您的状态',
                    duration: 1500,
                    icon: 'none'
                  })
                  console.error("update_questionnaire调用失败", err.errMsg)
                }
              })
            }
          } else if (res.cancel) {
            console.log("取消发布")
            return;
          }
        }
      })
    }else{
      wx.showToast({
        title: '截止时间早于或等于当前时间',
        duration: 1500,
        icon: 'none',
      })
    }
  }
})
