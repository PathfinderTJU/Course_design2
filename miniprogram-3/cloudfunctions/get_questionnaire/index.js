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

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.open_id===true)
  {
    try {
      return questionnaire.where({
        openId: event.openid,
      }).skip(event.skips).limit(event.limits).get()
    } catch (e) {
      console.error(e)
    }
  }else if (event.id===true)
  {
    try {
      return questionnaire.where({
        _id: event.questionnaireId,
      }).get()
    } catch (e) {
      console.error(e)
    }
  }else{
    try {
      return await questionnaire.where({
        openId: event.openId,
        questionnaireTitle: event.questionnaireTitle,
        createTime: event.createTime
      }).get()
    } catch (e) {
      return
      console.error(e)
    }
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}