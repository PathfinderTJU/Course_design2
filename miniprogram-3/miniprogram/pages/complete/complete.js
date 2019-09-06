// miniprogram/pages/success/success.js
var app = getApp();
Page({

  data: {
    "hasQR": false,
    "QRURL": "",
    "id": "",
    "navigateType": 0
  },

  onUnload:function(){
    wx.navigateBack({
      delta:1
    })
  },

  onLoad: function (options) {
    let index = parseInt(options.index);
    let questionnaireId = options.questionnaireId;//获取已发布的问卷的ID
    this.setData({
      navigateType: index,
      id : questionnaireId
    })
  },

  getQR: function(){
    let that=this
    if (this.data.navigateType === -2){//重新获取链接，少做一次访问
      let questionnaire = {};
      //从数据库拉取问卷数据，存入questionnaire
      wx.cloud.callFunction({
        name: 'get_questionnaireId',
        data: {
          id:true,
          questionnaireId:this.data.id
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            console.log(res)
            questionnaire=res.result.data
          } else {
            wx.showToast({
              title: '请检查网络您的状态',
              duration: 800,
              icon: 'none'
            })
          }
          this.setData({
            QRURL: questionnaire.QRURL,
            hasQR: true
          })
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
    }else{
      let access = "";
      let appId = app.globalData.appId;
      let appSecret = app.globalData.appSecret;

      //从数据库拉取access_token，存到access中
      wx.cloud.callFunction({
        name: 'get_setAccessToken',
        data: {
          gets:true
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            console.log(res)
            access=res.result.data[0]
          } else {
            wx.showToast({
              title: '请检查网络您的状态',
              duration: 800,
              icon: 'none'
            })
          }
         
          //进行过期判断
          let time = access.createTime;//当前access_token的获取时间
          console.log(time)
          //获取当前系统时间
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          let hour = date.getHours();
          let minute = date.getMinutes();
          //存放结果
          let canUse = null;
          //判断，注意当前时间不可能早于time
          if (year > time[0]) { //年份不同，无效
            canUse = false;
          } else {
            if (month > time[1]) { //年份相同，月份不同，无效
              canUse = false;
            } else {
              if (day > time[2]) {//年份、月份相同，日期不同，无效
                canUse = false
              } else {
                if (hour - 1 > time[3]) {//年份、月份、日期相同，小时相差超过1，无效
                  canUse = false;
                } else if (hour - 1 === time[3]) {//年份、月份、日期相同，小时相差1，可能有效，继续判断
                  if (minute - 30 > time[4]) {//年份、月份、日期相同，小时相差1，分钟相差超过30，即总共相差90分钟，无效
                    canUse = false;
                  } else {////年份、月份、日期相同，小时相差1，分钟相差小于等于30，即总共相差[60, 90]分钟，有效
                    canUse = true;
                  }
                } else {//年份、月份、日期相同，小时相差小于1，即总共相差[0,60)分钟，有效
                  canUse = true
                }
              }
            }
          }

          if (canUse) {//可以使用,请求接口
            requestQR(access)
            wx.cloud.callFunction({
              name: 'get_url',
              data: {

              },
              success: res => {
                if (res.errMsg == "cloud.callFunction:ok") {
                  console.log(res)
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
          } else {
            wx.cloud.callFunction({
              name: 'get_accessToken',
              data: {
              },
              success: res => {
                if (res.errMsg == "cloud.callFunction:ok") {
                  console.log(res)
                  let newJson = {};
                  newJson["access_token"] = res.result;
                  let newDate = new Date();
                  let newYear = newDate.getFullYear();
                  let newMonth = newDate.getMonth() + 1;
                  let newDay = newDate.getDate();
                  let newHour = newDate.getHours();
                  let newMinute = newDate.getMinutes();
                  newJson.time = [newYear, newMonth, newDay, newHour, newMinute];
                  console.log(newJson)
                  console.log(newJson.time)
                  console.log(newJson["access_token"])
                  wx.cloud.callFunction({
                    name: 'get_setAccessToken',
                    data: {
                      updates: true,
                      time: newJson.time,
                      access_token: newJson["access_token"]
                    },
                    success: res => {
                      if (res.errMsg == "cloud.callFunction:ok") {
                        console.log(res)
                        //access = res.result.data
                      } else {
                        wx.showToast({
                          title: '请检查网络您的状态',
                          duration: 800,
                          icon: 'none'
                        })
                      }
                      //requestQR(newJson)
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
                console.error(err.errMsg)
              }
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

    }
  },

  requestQR: function (access) {
    wx.request({
      url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + access[access_token],
      data: {
        page: "pages/write/write",
        scene: this.data.id,
        width: 400
      },
      header: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        this.setData({
          QRURL: res.data,
          hasQR: true
        })
        //将QRURL属性更新到对应id的问卷中
      },
      fail: function () {
        wx.showToast({
          title: '网络繁忙，请稍后再试',
        })
      },
      complete: options.complete || function () {
        console.log("请求完成")
      }
    })
  }
})