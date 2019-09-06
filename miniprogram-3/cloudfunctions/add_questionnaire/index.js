// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'hxl-1wbvh'
})
const db = cloud.database({
  env: 'hxl-1wbvh'
});
const questionnaire = db.collection('questionnaire');
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    return questionnaire.add({
      data: {
        questionnaireTitle:event.questionnaireTitle,
        briefIntroduction: event.briefIntroduction,
        createTime: event.createTime,
        endTime: [],
        questions: event.questions,
        maxNumber: "",
        number: 0,
        state: "0",
        openId: wxContext.OPENID,
        QRURL:""
      }
    })
  } catch (e) {
    console.error(e)
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}