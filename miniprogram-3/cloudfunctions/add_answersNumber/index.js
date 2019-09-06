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

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await questionnaire.where({
      _id: event.questionnaireId,
    }).update({
      data: {
       number:event.number
      }
    })
  } catch (e) {
    return
    console.error(e)
  }
}