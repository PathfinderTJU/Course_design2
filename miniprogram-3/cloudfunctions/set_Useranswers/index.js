// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'hxl-1wbvh'
})
const db = cloud.database({
  env: 'hxl-1wbvh'
});
const answers = db.collection("answers")
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
   answers.add({
      data: {
        answers:event.answers,
        questionnaireId:event.questionnaireId
      }
    })
    return
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