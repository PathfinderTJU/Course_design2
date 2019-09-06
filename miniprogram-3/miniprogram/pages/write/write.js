// pages/write/write.js
var app = getApp();
Page({

  data: {
    "isView": false,
    "title": "",
    "abstract": "",
    "question": [],
    "answers": [],
    "endTime":[],
    "maxNumber":"",
    "questionnaireId":"",
    "number":"",
    "state":""
  },

  onLoad: function(options) {
    let index = parseInt(options.index);
    let questionnaireId=options.questionnaireId;
    let first = parseInt(options.first)
    console.log(options)
    if (first !==-1){
      this.setData({
        questionnaireId: questionnaireId
      })
    }
 
    //index=1,预览
    if (index === 1) {
      this.setData({
        isView: true
      })
    } else if (index === -1) { //index=-1，回答
      this.setData({
        isView: false
      })
    }
    //根据连接中的标识符，从云平台拉取问卷信息
    //questionnaireId
    //判断日期和人数是否合法
    console.log(this.data.isView)
    if(this.data.isView)
    {
      if(first===-1)
      {
        //第一次编辑
        this.setData({
          abstract: app.globalData.briefIntroduction,
          title: app.globalData.questionnaireTitle,
          question: app.globalData.question
        })
        //预览界面不判断
        //设定答案数组格式
        let temp = this.data.question;
        let temp_answers = new Array(app.globalData.question.length);
        for (let i = 0; i < temp.length; i++) {
          let newjson = {
            "order": temp[i].order
          };
          if (temp[i].type === "radio" || temp[i].type === "checkbox" || temp[i].type === "list") {
            temp[i].result = 0;
            newjson.answer = "0";
          } else if (temp[i].type === "star") {
            temp[i].result = new Array(5);
            for (let j = 0; j < 5; j++) {
              temp[i].result[j] = false;
            }
            newjson.answer = "0";
          } else if (temp[i].type === "date") {
            let timestamp = Date.parse(new Date());
            let date = new Date(timestamp);
            let Y = date.getFullYear();
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            let total = Y + "-" + M + "-" + D;

            temp[i].result = total;
            newjson.answer = total;
          } else {
            temp[i].result = "";
            newjson.answer = "";
          }

          temp_answers[i] = newjson;
        }

        this.setData({
          answers: temp_answers,
          question: temp
        })
      }else{
        //重编辑
        wx.cloud.callFunction({
          name: 'get_questionnaire',
          data: {
            id: true,
            questionnaireId: questionnaireId,
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              console.log(res)
              this.setData({
                title: res.result.data[0].questionnaireTitle,
                abstract: res.result.data[0].briefIntroduction,
                question: res.result.data[0].questions,
                endTime: res.result.data[0].endTime,
                maxNumber: res.result.data[0].maxNumber,
                state: res.result.data[0].state
              }, function () {
                //设定答案数组格式
                let temp = this.data.question;
                let temp_answers = new Array(app.globalData.question.length);
                for (let i = 0; i < temp.length; i++) {
                  let newjson = {
                    "order": temp[i].order
                  };
                  if (temp[i].type === "radio" || temp[i].type === "checkbox" || temp[i].type === "list") {
                    temp[i].result = 0;
                    newjson.answer = "0";
                  } else if (temp[i].type === "star") {
                    temp[i].result = new Array(5);
                    for (let j = 0; j < 5; j++) {
                      temp[i].result[j] = false;
                    }
                    newjson.answer = "0";
                  } else if (temp[i].type === "date") {
                    let timestamp = Date.parse(new Date());
                    let date = new Date(timestamp);
                    let Y = date.getFullYear();
                    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    let total = Y + "-" + M + "-" + D;

                    temp[i].result = total;
                    newjson.answer = total;
                  } else {
                    temp[i].result = "";
                    newjson.answer = "";
                  }

                  temp_answers[i] = newjson;
                }

                this.setData({
                  answers: temp_answers,
                  question: temp
                })
              })

              // wx.navigateTo({
              //   url: '../main/main',
              // })
            } else {
              //console.log("未注册1")
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
 
    }else{
      wx.cloud.callFunction({
        name: 'get_questionnaire',
        data: {
          id: true,
          questionnaireId: questionnaireId,
        },
        success: res => {
          if (res.errMsg == "cloud.callFunction:ok") {
            console.log(res)
            this.setData({
              title: res.result.data[0].questionnaireTitle,
              abstract: res.result.data[0].briefIntroduction,
              question: res.result.data[0].questions,
              endTime: res.result.data[0].endTime,
              maxNumber: res.result.data[0].maxNumber,
              state: res.result.data[0].state
            }, function () {
              var newDate = new Date();
              var year = newDate.getFullYear(),
                mont = newDate.getMonth() + 1,
                date = newDate.getDate(),
                hour = newDate.getHours(),
                minu = newDate.getMinutes();
              if (this.data.endTime[0] + 2019 > year || (this.data.endTime[0] + 2019 == year && this.data.endTime[1] + 1 > mont) ||
                (this.data.endTime[0] + 2019 == year && this.data.endTime[1] + 1 === mont && this.data.endTime[2] + 1 > date) ||
                (this.data.endTime[0] + 2019 == year && this.data.endTime[1] + 1 === mont && this.data.endTime[2] + 1 === date && this.data.endTime[3] > hour) ||
                (this.data.endTime[0] + 2019 == year && this.data.endTime[1] + 1 === mont && this.data.endTime[2] + 1 === date && this.data.endTime[3] == hour && this.data.endTime[4] > minu)) {

              } else if (this.data.state !== "1") {
                wx.redirectTo({
                  url: '../failed/failed?index=3',
                })
              }
              else {
                wx.redirectTo({
                  url: '../failed/failed?index=2',
                })
              }
              //设定答案数组格式
              let temp = this.data.question;
              let temp_answers = new Array(app.globalData.question.length);
              for (let i = 0; i < temp.length; i++) {
                let newjson = {
                  "order": temp[i].order
                };
                if (temp[i].type === "radio" || temp[i].type === "checkbox" || temp[i].type === "list") {
                  temp[i].result = 0;
                  newjson.answer = "0";
                } else if (temp[i].type === "star") {
                  temp[i].result = new Array(5);
                  for (let j = 0; j < 5; j++) {
                    temp[i].result[j] = false;
                  }
                  newjson.answer = "0";
                } else if (temp[i].type === "date") {
                  let timestamp = Date.parse(new Date());
                  let date = new Date(timestamp);
                  let Y = date.getFullYear();
                  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
                  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                  let total = Y + "-" + M + "-" + D;

                  temp[i].result = total;
                  newjson.answer = total;
                } else {
                  temp[i].result = "";
                  newjson.answer = "";
                }

                temp_answers[i] = newjson;
              }

              this.setData({
                answers: temp_answers,
                question: temp
              })
            })

            // wx.navigateTo({
            //   url: '../main/main',
            // })
          } else {
            //console.log("未注册1")
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

    //判断日期人数是否合法
  },

  //改变list题目picker显示内容
  change_list: function(options) {
    let index = parseInt(options.currentTarget.id.substring(11));
    let newAns = parseInt(options.detail.value);
    let oldAnswers = this.data.answers;
    let oldQuestion = this.data.question;
    oldAnswers[index - 1].answer = newAns;
    oldQuestion[index - 1].result = newAns;
    this.setData({
      question: oldQuestion,
      answers: oldAnswers
    })
  },

  //改变date题目picker显示内容
  change_date: function(options) {
    let index = parseInt(options.currentTarget.id.substring(11));
    let newYear = options.detail.value;
    let oldAnswers = this.data.answers;
    let oldQuestion = this.data.question;
    oldAnswers[index - 1].answer = newYear;
    oldQuestion[index - 1].result = newYear;
    this.setData({
      question: oldQuestion,
      answers: oldAnswers
    })
  },

  //改变星星
  change_star: function(options) {
    let index = parseInt(options.currentTarget.id.substring(2)); //题号
    let star_num = parseInt(options.currentTarget.id); //点击的星星序号（从0开始）
    let oldAnswers = this.data.answers;
    let oldQuestion = this.data.question;
    oldAnswers[index - 1].answer = star_num.toString();

    if (oldQuestion[index - 1].result[star_num] === false) { //未点亮，<=均点亮
      for (let i = 0; i <= star_num; i++) {
        oldQuestion[index - 1].result[i] = true;
      }
    } else { //已点亮，再次点击>均熄灭
      for (let i = star_num + 1; i < 5; i++) {
        oldQuestion[index - 1].result[i] = false;
      }
    }
    this.setData({
      question: oldQuestion,
      answers: oldAnswers
    })
  },

  formSubmit: function(e) {

    let user_answer = e.detail.value; //用户填写的数据
    //遍历，将其添加至answers数组的对应位置
    for (var a in user_answer) {
      let indexOfQuestion = parseInt(a.substring(1));
      //必填检查
      if (this.data.question[indexOfQuestion - 1].setting === true) {
        if (this.data.question[indexOfQuestion - 1].type === "checkbox") {
          if (user_answer[a].length === 0) {
            wx.showToast({
              title: '您有必答题未完成, 错误题目编号：' + indexOfQuestion,
              icon: "none"
            })
            return;
          }
        } else if (this.data.question[indexOfQuestion - 1].type !== "date" && this.data.question[indexOfQuestion - 1].type !== "list" && this.data.question[indexOfQuestion - 1].type !== "star") { //下拉和日期有默认值，不必检查
          if (user_answer[a] === "") {
            wx.showToast({
              title: '您有必答题未完成, 错误题目编号：' + indexOfQuestion,
              icon: "none"
            })
            return;
          }
        }
      }

      // 进行非法填写处理
      if (this.data.question[indexOfQuestion - 1].type === "checkbox") {
        let numberOfChoices = user_answer[a].length;
        let maxChoice = this.data.question[indexOfQuestion - 1].maxChoice;
        let minChoice = this.data.question[indexOfQuestion - 1].minChoice;
        if (numberOfChoices > maxChoice) {
          wx.showToast({
            title: '多选题选择个数大于上限, 错误题目编号：' + indexOfQuestion,
            icon: "none"
          })
          return;
        } else if (numberOfChoices < minChoice) {
          wx.showToast({
            title: '多选题选择个数小于下限, 错误题目编号：' + indexOfQuestion,
            icon: "none"
          })
          return;
        }
      } else if (this.data.question[indexOfQuestion - 1].type === "phone") {
        if (user_answer[a] !== "" && user_answer[a].length !== 11) {
          wx.showToast({
            title: '请输入合法11位手机号, 错误题目编号：' + indexOfQuestion,
            icon: "none"
          })
          return;
        }
      } else if (this.data.question[indexOfQuestion - 1].type === "mail") {
        if (user_answer[a] !== "" && user_answer[a].indexOf("@") === -1) {
          wx.showToast({
            title: '请输入合法邮箱号, 错误题目编号：' + indexOfQuestion,
            icon: "none"
          })
          return;
        }
      } else if (this.data.question[indexOfQuestion - 1].type === "id") {
        if (user_answer[a] !== "" && user_answer[a].length !== 18) {
          wx.showToast({
            title: '请输入合法18位中华人民共和国居民身份证号码, 错误题目编号：' + indexOfQuestion,
            icon: "none"
          })
          return;
        }
      }

      //默认值替补
      if (this.data.question[indexOfQuestion - 1].type === "date") {
        if (user_answer[a] === "") {
          user_answer[a] = this.data.question[indexOfQuestion - 1].result;
        }
      }

      if (this.data.question[indexOfQuestion - 1].type === "list") {
        if (user_answer[a] === "") {
          user_answer[a] = this.data.question[indexOfQuestion - 1].answers[this.data.question[indexOfQuestion - 1].result];
        }
      }

      //无误，添加数据
      let answer_json = {};
      answer_json.order = indexOfQuestion; //答案的题目序号
      answer_json.answer = user_answer[a]; //答案内容

      let oldAns = this.data.answers;
      oldAns[indexOfQuestion - 1] = answer_json;
      this.setData({
        answers: oldAns
      })
    }
    console.log(this.data.answers);
    if (this.data.isView) {
      wx.redirectTo({
        url: '../success_thanks/success_thanks',
      })
      return;
    }
    
    //获取问卷填写人数
    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        questionnaireId: this.data.questionnaireId,
      },
      success: res => {
        if (res.errMsg === "cloud.callFunction:ok") {
          this.setData({
            number: res.result.data[0].number
          }, function () {
            if (parseInt(this.data.number) >= parseInt(this.data.maxNumber) && this.data.number!="") {
              wx.redirectTo({
                url: '../failed/failed?index=1',
              })
            } else {
              wx.cloud.callFunction({
                name: 'add_answersNumber',
                data: {
                  questionnaireId: this.data.questionnaireId,
                  number: (parseInt(this.data.number) + 1).toString()
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
            }
          })
        }
        //将答卷数据上传至云平台
        wx.cloud.callFunction({
          name: 'set_Useranswers',
          data: {
            answers: this.data.answers,
            questionnaireId: this.data.questionnaireId
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              console.log(res)
            } else {
              wx.showToast({
                title: '请检查网络您的状态',
                duration: 1500,
                icon: 'none'
              })
            }
            //跳转至感谢页面
            wx.redirectTo({
              url: '../success_thanks/success_thanks',
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
  },

  //转发
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