// miniprogram/pages/manage/manage.jsz
var app = getApp();
Page({

  data: {
    "questionaires": [],
    "showMore": false,
    "states": ["未发布", "收集中", "已结束"]
  },

  onLoad: function (options) {
    //根据全局变量，获取10个用户问卷信息（时间升序），添加到questionaires数组中
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        open_id: true,
        openid: app.globalData.openId,
        skips:0,
        limits:10
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          console.log(res)
          this.setData({
            questionaires:res.result.data
          })
         } else {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
            icon: 'none'
          })
        }
        console.log(this.data.questionaires)
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
    //获取组件
    this.myMore = this.selectComponent("#more_component");
  },

  onshow: function(options){
    //刷新页面
    var that =this;
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        open_id: true,
        openid: app.globalData.openId,
        skips: 0,
        limits: that.data.questionaires.length
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          //console.log(res)
          that.setData({
            questionaires: res.result.data
          })
        } else {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 1500,
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
        console.error("get_questionnaire调用失败", err.errMsg)
      }
    })
  },

  edit: function(options){
    let numberOfMore = parseInt(options.currentTarget.id.substring(4));
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据

    if (questionaire.state !== "0"){ //已发布和已结束的问卷不可以重新编辑
      wx.showToast({
        title: '已经发布过的问卷不可以再编辑',
        icon: 'none',
      })
      return;
    }else{
      //将对应问卷数据填充进局部变量
      app.globalData.questionnaireTitle = questionaire.questionnaireTitle;
      app.globalData.briefIntroduction = questionaire.briefIntroduction;
      app.globalData.question = questionaire.questions;
      //存问卷id,链接
      wx.navigateTo({
        url: '/pages/editor/editor?index=1&questionnaireId=' + questionaire["_id"],
      })
    }
  },

  share: function(options){
    let numberOfMore = parseInt(options.currentTarget.id.substring(5));
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据
    let questionnaireId = questionaire["_id"];
    if (questionaire.state!=="0"){
      wx.navigateTo({//跳转至发布发布成功页面，携带问卷id
        url: '/pages/complete/complete?index=-2&questionnaireId=' + questionnaireId,
      })
    }else{
      wx.showToast({
        title: '请先发布问卷',
        icon:"none"
      })
      return;
    }
  },

  dataMove: function(options){
    let numberOfMore = parseInt(options.currentTarget.id.substring(4));
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据
    if (questionaire.state !== "0") {
      wx.navigateTo({//跳转至统计页面，携带问卷id
        url: '/pages/statistics/statistics?id=' + questionaire["_id"],
      })
    } else {
      wx.showToast({
        title: '请先发布问卷',
        icon: "none"
      })
      return;
    }
  },

  publish: function(options){
    let numberOfMore = options.detail;
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据
    let that=this
    if (questionaire.state === "0"){
      wx.showModal({
        title: '发布问卷',
        content: '问卷一旦发布将不可修改，是否确认？',
        success: function(res){
          if (res.confirm){
            //修改该问卷的状态为“收集中”
            wx.cloud.callFunction({
              name: 'update_questionnaire',
              data: {
                states:true,
                questionnaireId:questionaire._id,
                state:"1"
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
                //刷新页面
                wx.cloud.callFunction({
                  name: 'get_questionnaire',
                  data: {
                    open_id: true,
                    openid: app.globalData.openId,
                    skips: 0,
                    limits: that.data.questionaires.length
                  },
                  success: res => {
                    if (res.errMsg == "cloud.callFunction:ok") {
                     // console.log(res)
                      that.setData({
                        questionaires: res.result.data
                      })
                    } else {
                      wx.showToast({
                        title: '请检查网络您的状态',
                        duration: 1500,
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
                    console.error("get_questionnaire调用失败", err.errMsg)
                  }
                })
              },
              fail: err => {
                wx.showToast({
                  title: '请检查网络您的状态',
                  duration: 1500,
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel){
            console.log("取消发布")
          }
        }
      })
    }else if (questionaire.state === "1"){
      wx.showModal({
        title: '暂停收集',
        content: '问卷将暂停收集，是否确认？',
        success: function (res) {
          if (res.confirm) {
            //修改该问卷的状态为“已结束”           
            wx.cloud.callFunction({
              name: 'update_questionnaire',
              data: {
                states: true,
                questionnaireId: questionaire._id,
                state: "2"
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
                //刷新页面
                wx.cloud.callFunction({
                  name: 'get_questionnaire',
                  data: {
                    open_id: true,
                    openid: app.globalData.openId,
                    skips: 0,
                    limits: that.data.questionaires.length
                  },
                  success: res => {
                    if (res.errMsg == "cloud.callFunction:ok") {
                     // console.log(res)
                      that.setData({
                        questionaires: res.result.data
                      })
                    } else {
                      wx.showToast({
                        title: '请检查网络您的状态',
                        duration: 1500,
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
                    console.error("get_questionnaire调用失败", err.errMsg)
                  }
                })
              },
              fail: err => {
                wx.showToast({
                  title: '请检查网络您的状态',
                  duration: 1500,
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log("取消暂停")
          }
        }
      })
    }else if (questionaire.state === "2"){
      wx.showModal({
        title: '继续收集',
        content: '问卷将继续收集，是否确认？',
        success: function (res) {
          if (res.confirm) {
            //修改该问卷的状态为“收集中”
            wx.cloud.callFunction({
              name: 'update_questionnaire',
              data: {
                states: true,
                questionnaireId: questionaire._id,
                state: "1"
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
                //刷新页面
                wx.cloud.callFunction({
                  name: 'get_questionnaire',
                  data: {
                    open_id: true,
                    openid: app.globalData.openId,
                    skips: 0,
                    limits: that.data.questionaires.length
                  },
                  success: res => {
                    if (res.errMsg == "cloud.callFunction:ok") {
                      //console.log(res)
                      that.setData({
                        questionaires: res.result.data
                      })
                    } else {
                      wx.showToast({
                        title: '请检查网络您的状态',
                        duration: 1500,
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
                    console.error("get_questionnaire调用失败", err.errMsg)
                  }
                })
              },
              fail: err => {
                wx.showToast({
                  title: '请检查网络您的状态',
                  duration: 1500,
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log("取消发布")
          }
        }
      })
    }
    this.myMore.modal_click_Hidden();
  },

  view: function(options){
    let numberOfMore = options.detail;
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据

    wx.navigateTo({
      url: '/pages/write/write?index=1&questionnaireId=' + questionaire["_id"],
    })

    this.myMore.modal_click_Hidden();
  },

  deleteMove: function(options){
    let numberOfMore = options.detail;
    let questionaire = this.data.questionaires[numberOfMore]; //该问卷数据
    let numbers=this.data.questionaires.length
    var that = this;
    wx.showModal({
      title: '删除问卷',
      content: '问卷删除后不可恢复，是否确认？',
      success: function (res) {
        if (res.confirm) {
          //删除数据库中数据
          wx.cloud.callFunction({
            name: 'update_questionnaire',
            data: {
              deletes: true,
              questionnaireId: questionaire._id,
            },
            success: res => {
              if (res.errMsg == "cloud.callFunction:ok") {
                //console.log(res)
              } else {
                wx.showToast({
                  title: '请检查网络您的状态',
                  duration: 1500,
                  icon: 'none'
                })
              }
              //重新拉取前10个页面，刷新
              wx.cloud.callFunction({
                name: 'get_questionnaire',
                data: {
                  open_id: true,
                  openid: app.globalData.openId,
                  skips: 0,
                  limits: that.data.questionaires.length
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    //console.log(res)
                    that.setData({
                      questionaires: res.result.data
                    })
                  } else {
                    wx.showToast({
                      title: '请检查网络您的状态',
                      duration: 1500,
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
                  console.error("get_questionnaire调用失败", err.errMsg)
                }
              })
            },
            fail: err => {
              wx.showToast({
                title: '请检查网络您的状态qqqqq',
                duration: 1500,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          console.log("取消删除")
        }
      }
    })
    this.myMore.modal_click_Hidden();
  },

  more: function (options) {
    let numberOfMore = parseInt(options.currentTarget.id.substring(4));

    this.setData({
      showMore: true
    })
    this.myMore.modal_click_show(numberOfMore);
  },

  //页面下拉刷新事件
  onPullDownRefresh: function () {
    var that = this;
    //重新请求，获取10个用户问卷信息（时间升序），更新questionaires数组
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        open_id: true,
        openid: app.globalData.openId,
        skips: 0,
        limits:1
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          that.setData({
            questionaires: that.data.questionaires
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

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
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