// pages/editor/editor.js
const app = getApp();


Page({

  data:{
    "navigateType":0,
    "title": "",
    "abstract": "",
    "question": [],
    "showMore": false,
    "id":"",
  },

  onLoad: function(options){
    let index =parseInt(options.index);
    let that =this
    that.setData({
      navigateType: index
    })
    console.log(index)
    if (index === 1) {
      //二次编辑，从数据库向全局变量拉取数据
      this.setData({
        id:options.questionnaireId
      },function(){
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId:this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              //console.log(res)
              app.globalData.questionnaireTitle= res.result.data[0].questionnaireTitle,
              app.globalData.briefIntroduction= res.result.data[0].briefIntroduction,
              app.globalData.question=res.result.data[0].questions
            } else {
              //console.log("未注册1")
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
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
      })
    } else if (index === -1) {
      //首次编辑，清空全局变量question
      app.globalData.question = [];
    } else if (index === 2) {
      //选择模板
      this.setData({
        id: options.questionnaireId
      }, function () {
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              console.log(res)
                app.globalData.questionnaireTitle = res.result.data[0].questionnaireTitle,
                app.globalData.briefIntroduction = res.result.data[0].briefIntroduction,
                app.globalData.question = res.result.data[0].questions
            } else {
              //console.log("未注册1")
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
            },function(){
             // console.log(this.data.question)
              //从模板中复制，需新建问卷
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
                  questionnaireTitle: this.data.title,
                  briefIntroduction: this.data.abstract,
                  createTime: app.globalData.createTime,
                  endTime: [],
                  questions: this.data.question,
                  maxNumber: "",
                  number: 0,
                  state: "0"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    //console.log(res)
                    this.setData({
                      id:res.result._id
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
                  console.error("add_questionnaire调用失败", err.errMsg)
                }
              })
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
      })
    } else if (index === 3) {
      //报名
      this.setData({
        id: "5d262bd45d6f70f0115da1a14f7eb320"
      }, function () {
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              //console.log(res)
              app.globalData.questionnaireTitle = res.result.data[0].questionnaireTitle,
                app.globalData.briefIntroduction = res.result.data[0].briefIntroduction,
                app.globalData.question = res.result.data[0].questions
            } else {
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
            }, function () {
             // console.log(this.data.question)
              //从模板中复制，需新建问卷
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
                  questionnaireTitle: this.data.title,
                  briefIntroduction: this.data.abstract,
                  createTime: app.globalData.createTime,
                  endTime: [],
                  questions: this.data.question,
                  maxNumber: "",
                  number: 0,
                  state: "0"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                   // console.log(res)
                    this.setData({
                      id: res.result._id
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
                  console.error("add_questionnaire调用失败", err.errMsg)
                }
              })
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
      })
    } else if (index === 4) {
      //满意度
      this.setData({
        id: "efdeb2615d6f6f15115ad37d053c5b44"
      }, function () {
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              //console.log(res)
              app.globalData.questionnaireTitle = res.result.data[0].questionnaireTitle,
                app.globalData.briefIntroduction = res.result.data[0].briefIntroduction,
                app.globalData.question = res.result.data[0].questions
            } else {
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
            }, function () {
              //console.log(this.data.question)
              //从模板中复制，需新建问卷
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
                  questionnaireTitle: this.data.title,
                  briefIntroduction: this.data.abstract,
                  createTime: app.globalData.createTime,
                  endTime: [],
                  questions: this.data.question,
                  maxNumber: "",
                  number: 0,
                  state: "0"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                   // console.log(res)
                    this.setData({
                      id: res.result._id
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
                  console.error("add_questionnaire调用失败", err.errMsg)
                }
              })
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
      })
    } else if (index === 5) {
      //投票
      this.setData({
        id: "3c4c6d855d6f6b4511558cc5661470b1"
      }, function () {
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
             // console.log(res)
              app.globalData.questionnaireTitle = res.result.data[0].questionnaireTitle,
                app.globalData.briefIntroduction = res.result.data[0].briefIntroduction,
                app.globalData.question = res.result.data[0].questions
            } else {
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
            }, function () {
              console.log(this.data.question)
              //从模板中复制，需新建问卷
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
                  questionnaireTitle: this.data.title,
                  briefIntroduction: this.data.abstract,
                  createTime: app.globalData.createTime,
                  endTime: [],
                  questions: this.data.question,
                  maxNumber: "",
                  number: 0,
                  state: "0"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    //console.log(res)
                    this.setData({
                      id: res.result._id
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
                  console.error("add_questionnaire调用失败", err.errMsg)
                }
              })
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
      })  
    } else if (index === 6) {
      //考试
      this.setData({
        id: "5d262bd45d6f6b86115a273924fd646f"
      }, function () {
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: this.data.id,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              //console.log(res)
              app.globalData.questionnaireTitle = res.result.data[0].questionnaireTitle,
                app.globalData.briefIntroduction = res.result.data[0].briefIntroduction,
                app.globalData.question = res.result.data[0].questions
            } else {
            }
            //从全局变量拉取问卷数据
            this.setData({
              question: app.globalData.question,
              title: app.globalData.questionnaireTitle,
              abstract: app.globalData.briefIntroduction
            }, function () {
             // console.log(this.data.question)
              //从模板中复制，需新建问卷
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
                  questionnaireTitle: this.data.title,
                  briefIntroduction: this.data.abstract,
                  createTime: app.globalData.createTime,
                  endTime: [],
                  questions: this.data.question,
                  maxNumber: "",
                  number: 0,
                  state: "0"
                },
                success: res => {
                  if (res.errMsg == "cloud.callFunction:ok") {
                    console.log(res)
                    this.setData({
                      id: res.result._id
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
                  console.error("add_questionnaire调用失败", err.errMsg)
                }
              })
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
      }) 
    }

    //从全局变量拉取问卷数据
    this.setData({
      question: app.globalData.question,
      title: app.globalData.questionnaireTitle,
      abstract: app.globalData.briefIntroduction
    })
    //获取组件
    this.myMore = this.selectComponent("#more_component")
  },

  onShow: function(){
    // this.setData({
    //   question: app.globalData.question,
    //   navigateType: 0
    //})

    //更新题目顺序
    for (let i = 0 ; i < app.globalData.question.length ; i++){
      app.globalData.question[i].order = i+1;
    }

    //更新本地数据
    this.setData({
      question: app.globalData.question,
      title: app.globalData.questionnaireTitle,
      abstract: app.globalData.briefIntroduction
    })
  },

  onUnload: function(){
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        id:false,
        openId: app.globalData.openId,
        questionnaireTitle: app.globalData.questionnaireTitle,
        createTime: app.globalData.createTime
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          console.log(res)
          if(res.result.data[0].state==="0"){
            wx.cloud.callFunction({
              name: 'update_questionnaire',
              data: {
                openId: app.globalData.openId,
                questionnaireTitle: app.globalData.questionnaireTitle,
                createTime: app.globalData.createTime,
                dateTime1: null,
                questions: app.globalData.question,
                maxNumber: null,
                state: "0"
              },
              success: res => {
                if (res.errMsg == "cloud.callFunction:ok") {
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
  },

  //重新编辑题目简介
  re_edit: function(){
    wx.navigateTo({
      url: '/pages/title_abstract/title_abstract?index=1&questionnaireId='+this.data.id,
    })
  },

  //三点
  more: function(options){
    let numberOfMore = parseInt(options.currentTarget.id.substring(11, 12));
    this.setData({
      showMore: true
    })
    this.myMore.modal_click_show(numberOfMore);
  },

  hideMore: function () {
    this.setData({
      showMore: false
    })
  },

  //上移
  upMove: function (option){
    let e = option.detail;
    let old = app.globalData.question;

    //互换order
    let temp = old[e-1].order;
    old[e-1].order = old[e-2].order;
    old[e-2].order = temp;

    //互换渲染顺序
    let temp2 = old[e-1];
    old[e-1] = old[e-2];
    old[e-2] = temp2;

    app.globalData.question = old;
    this.setData({
      question: old
    })

    this.myMore.modal_click_Hidden();
  },

  downMove: function (option) {
    let e = option.detail;
    let old = app.globalData.question;
    //互换order
    let temp = old[e - 1].order;
    old[e - 1].order = old[e].order;
    old[e].order = temp;

    //互换渲染顺序
    let temp2 = old[e - 1];
    old[e - 1] = old[e];
    old[e] = temp2;
    app.globalData.question = old;

    this.setData({
      question: old
    })

    this.myMore.modal_click_Hidden();
  },

  deleteMove: function(option){
    let e = option.detail;
    let old = app.globalData.question;
    if (e === old.length){
      old.pop();
    }else{
      for (let i = e-1 ; i < old.length - 1 ; i++){
        old[i] = old[i+1] 
        old[i].order--
      }
      old.pop();
    }
    app.globalData.question = old;
    this.setData({
      question: old
    })

    this.myMore.modal_click_Hidden();
  },

  //新增
  toAdd: function(){
    wx.navigateTo({
      url: '/pages/add_question/add_question'
    })
  },

  //发布
  toPublish: function () {
    var that=this
    if (this.data.question.length === 0) {
      wx.showToast({
        title: '请至少添加一个题目',
        icon: "none"
      })
      return;
    }
    if (this.data.navigateType !== -1) {
      //二次编辑，局部变量id为问卷id.
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
          state: "0"
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
          //  console.log(res)
          } else {

          }
          wx.navigateTo({
            //bug，未传递问卷ID
            url: '/pages/publish/publish?index='+that.data.navigateType+'&questionnaireId='+this.data.id
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
      //console.log(that.data.question)
      //新建问卷,
      wx.cloud.callFunction({
        name: 'update_questionnaire',
        data: {
          openId: app.globalData.openId,
          questionnaireTitle:app.globalData.questionnaireTitle,
          createTime: app.globalData.createTime,
          dateTime1: null,
          questions: that.data.question,
          maxNumber: null,
          state: "0"
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            console.log(res)
          } else {
          }
          wx.navigateTo({
            url: '/pages/publish/publish?index=' + this.data.navigateType
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
    }

  },

  //预览
  toView: function () {
    if (this.data.question.length === 0) {
      wx.showToast({
        title: '请至少添加一个题目',
        icon: "none"
      })
      return;
    }
   // console.log(this.data.question)
   if(this.data.navigateType!==1){
     wx.cloud.callFunction({
       name: 'update_questionnaire',
       data: {
         id: true,
         questionnaireId: this.data.id,
         dateTime1: null,
         //bug,未用本地局部变量保存
         questions: this.data.question,
         maxNumber: null,
         state: "0",
         //bug,未考虑题目
       },
       success: res => {
         if (res.errMsg == "cloud.callFunction:ok") {
           console.log(res)
           if (this.data.navigateType === -1) {
             app.globalData.question = this.data.question,
               app.globalData.questionnaireTitle = this.data.title,
               app.globalData.briefIntroduction = this.data.abstract
           }
         } else {
         }
         wx.navigateTo({
           url: '/pages/write/write?index=1&first=' + this.data.navigateType + '&questionnaireId=' + this.data.id
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
   }
  },

  radio_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_radio/add_radio?index=' + index,
    })
  },

  checkbox_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_checkbox/add_checkbox?index=' + index,
    })
  },

  blank_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_blank/add_blank?index=' + index,
    })
  },

  phone_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_phone/add_phone?index=' + index,
    })
  },

  mail_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_mail/add_mail?index=' + index,
    })
  },

  id_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_id/add_id?index=' + index,
    })
  },

  date_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_date/add_date?index=' + index,
    })
  },

  star_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_star/add_star?index=' + index,
    })
  },

  list_reEdit: function (options) {
    let index = options.currentTarget.id.substring(7);
    wx.navigateTo({
      url: '/pages/add/add_list/add_list?index=' + index,
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