// miniprogram/pages/statistics/statistics.js
var chart = require('../../utils/wxcharts.js')

Page({
  data: {
    "hasAnswer": true,
    "questionnaireId": "",
    "questionnaire": {},
    "answers": [] 
    //全部答卷，json数组，包括answers数组，json数组，包括order和answer
  }, 
  onLoad: function(options) {
    let id = options.id;
    let that=this;
    
    this.setData({
      questionnaireId: id
    })

    let questionnaire = {};
    let answers = [];
    //根据问卷id，获取问卷信息，填入questionaire
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        id:true,
        questionnaireId:id
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          console.log(res)
          questionnaire=res.result.data[0]
        } else {
          wx.showToast({
            title: '请检查网络您的状态',
            duration: 800,
            icon: 'none'
          })
        }
        //根据问卷id，获取全部答卷信息，填入answers
        wx.cloud.callFunction({
          name: 'get_answers',
          data: {
            id: true,
            questionnaireId: id
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              answers = res.result.data
            } else {
              wx.showToast({
                title: '请检查网络您的状态',
                duration: 800,
                icon: 'none'
              })
            }
            this.setData({
              answers: answers,
              questionnaire: questionnaire
            }, function () {
              if (answers.length === 0) {
                this.setData({
                  hasAnswer: false
                })
              } else {
                let questions = questionnaire.questions;
                let statistics = new Array(questions.length);
                let pieData = [];

                for (let i = 0; i < questions.length; i++) {
                  if (questions[i].type === "radio") { //单选题统计数目
                    let answersOfQuestion = questions[i].answers; //选项
                    let numberOfAnswers = questions[i].numberOfAnswers; //选项个数
                    pieData = new Array(numberOfAnswers) //饼图数据，json数组，包括选项名和选择选项人数

                    for (let j = 0; j < numberOfAnswers; j++) { //对于每个选项，统计选择人数
                      pieData[j] = {};
                      pieData[j].name = answersOfQuestion[j]; //设定name属性
                      pieData[j].data = 0;
                    }

                    //遍历答卷
                    for (let k = 0; k < answers.length; k++) {
                      for (let v = 0; v < answers[k].answers.length; v++) {
                        if (parseInt(answers[k].answers[v].order) === i + 1) {
                          pieData[parseInt(answers[k].answers[v].answer)].data++;
                        }
                      }
                    }
                    statistics[i] = pieData;
                  } else if (questions[i].type === "list") {
                    let answersOfQuestion = questions[i].answers; //选项
                    let numberOfAnswers = questions[i].numberOfAnswers; //选项个数
                    pieData = new Array(numberOfAnswers) //饼图数据，json数组，包括选项名和选择选项人数

                    for (let j = 0; j < numberOfAnswers; j++) { //对于每个选项，统计选择人数
                      pieData[j] = {};
                      pieData[j].name = answersOfQuestion[j]; //设定name属性
                      pieData[j].data = 0;
                    }

                    //遍历答卷
                    for (let k = 0; k < answers.length; k++) {
                      for (let v = 0; v < answers[k].answers.length; v++) {
                        if (parseInt(answers[k].answers[v].order) === i + 1) {
                          pieData[answers[k].answers[v].answer].data++;
                        }
                      }
                    }
                    statistics[i] = pieData;
                  } else if (questions[i].type === "checkbox") { //多选题
                    let answersOfQuestion = questions[i].answers; //选项
                    let numberOfAnswers = questions[i].numberOfAnswers; //选项个数
                    let pieData = new Array(numberOfAnswers) //饼图数据，json数组，包括选项名和选择选项人数

                    for (let j = 0; j < numberOfAnswers; j++) { //对于每个选项，统计选择人数
                      pieData[j] = {};
                      pieData[j].name = answersOfQuestion[j]; //设定name属性
                      pieData[j].data = 0;
                    }

                    //遍历答卷
                    for (let k = 0; k < answers.length; k++) {
                      for (let v = 0; v < answers[k].answers.length; v++) {
                        if (parseInt(answers[k].answers[v].order) === i + 1) {
                          for (let m = 0; m < answers[k].answers[v].answer.length; m++) {
                            pieData[parseInt(answers[k].answers[v].answer[m])].data++;
                          }
                        }
                      }
                    }

                    statistics[i] = pieData;
                  } else if (questions[i].type === "star") { //打分题
                    let numberOfAnswers = 6; //选项个数
                    let pieData = new Array(6) //饼图数据，json数组，包括选项名和选择选项人数

                    for (let j = 0; j < numberOfAnswers; j++) { //对于每个选项，统计选择人数
                      pieData[j] = {};
                      pieData[j].name = j.toString(); //设定name属性
                      pieData[j].data = 0;
                    }

                    //遍历答卷
                    for (let k = 0; k < answers.length; k++) {
                      for (let v = 0; v < answers[k].answers.length; v++) {
                        if (parseInt(answers[k].answers[v].order) === i + 1) {
                          pieData[parseInt(answers[k].answers[v].answer)].data++;
                        }
                      }
                    }

                    statistics[i] = pieData;
                  } else {
                    statistics[i] = null;
                  }
                }

                let pies = new Array(questions.length); //饼图数据，不能绘制的题目值为null
                for (let i = 0; i < pies.length; i++) {
                  if (statistics[i] !== null) {
                    pies[i] = {
                      canvasId: 'graph' + (i + 1).toString(),
                      type: 'pie',
                      series: statistics[i],
                      width: 300,
                      height: 300,
                      dataLabel: true,
                      animateRotate: true
                    }
                  } else {
                    pies[i] = null;
                  }
                }

                for (let i = 0; i < pies.length; i++) { //绘制图表
                  if (pies[i] !== null) {
                    new chart(pies[i]);
                  } else {
                    continue;
                  }
                }
              }
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

  toAll: function(options) { //index=1，全部数据
    wx.navigateTo({
      url: '/pages/data_detail/data_detail?index=1&id=' + this.data.questionnaireId,
    })
  },

  toDetail: function(options) { //index=-1，某题数据
    let number = parseInt(options.currentTarget.id.substring(6));
    wx.navigateTo({
      url: '/pages/data_detail/data_detail?index=-1&id=' + this.data.questionnaireId + "&number=" + number, //number为题目编号(从0开始)
    })
  },

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '欢迎使用怡问卷',
      path: '/page/login/login',
      success: function(res) {
        wx.showToast({
          title: '转发成功',
          icon: "none",
          duration: 1500
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '转发失败',
          icon: "none",
          duration: 1500
        })
      }
    }
  }
})