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
    return answers.where({
      questionnaireId: event.questionnaireId,
    }).get()
  } catch (e) {
    console.error(e)
  }
}