// pages/data_detail/data_detail.js
Page({

  data: {
    "title": "天津大学青年文化促进会",
    "questionnaire": [],
    "answers": [],
    "navigateType":0
  },

  onLoad: function(options) {
    let index = parseInt(options.index);

    let id = options.id;
    let number = 0;
    if (index === -1) { //某题数据
      number = parseInt(options.number)
    }
    let questionnaire = {};
    let answers = [];

    //数据库拉取问卷信息questionnaire属性存在questionnaire数组中

    //数据库拉取全部答卷存在answers数组中

    wx.cloud.callFunction({
      name: 'get_questionnaire',
      data: {
        id: true,
        questionnaireId: id
      },
      success: res => {
        if (res.errMsg == "cloud.callFunction:ok") {
          console.log(res)
          questionnaire = res.result.data[0]
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
            questionnaireId:id
          },
          success: res => {
            if (res.errMsg == "cloud.callFunction:ok") {
              console.log(res)
              answers = res.result.data
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
            console.error("get_answers调用失败", err.errMsg)
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


    //回调函数中：根据跳转类型准备数据
    if (index === -1) { //某题数据
      let temp = []; //将该题答案存入这个数组

      //遍历answers数组
      for (let i = 0; i < answers.length; i++) {
        //对于每个份答卷，遍历它的answers属性中的每个json对象
        for (let j = 0; j < answers[i].answers.length; j++) {
          //寻找题目编号与number相同的题目答案，添加进temp数组
          if (parseInt(answers[i].answers[j].order) === number + 1) {
            temp.push(answers[i].answers[j].answer);
          }
        }
      }

      this.setData({
        questionnaire: questionnaire,
        answers: temp,
        title: questionnaire.questions[number].title,
        navigateType: index
      })
    }else if(index === 1){ //全部数据
      //处理多选题
      for (let i = 0 ; i < questionnaire.questions.length ; i++){
        if (questionnaire.questions[i].type === "checkbox"){
          for (let j = 0 ; j < answers.length ; j++){//所有多选题答案数组替换为实际值
            for (let k = 0 ; k < answers[j].answers.length ; k++){
              if (answers[j].answers[k].order === questionnaire.questions[i].order){
                for (let v = 0; v < answers[j].answers[k].answer.length ; v++){
                  answers[j].answers[k].answer[v] = questionnaire.questions[i].answers[v];
                }
              }
            }
          }
        }
      }


      this.setData({
        questionnaire: questionnaire,
        answers: answers,
        title: questionnaire.questionnaireTitle,
        navigateType: index
      })
    }
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