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
  if (event.id === true){
    try {
      return await questionnaire.where({
        _id: event.questionnaireId,
      }).update({
        data: {
          endTime: event.dateTime1,
          questions: event.questions,
          maxNumber: event.maxNumber,
          state: event.state
        }
      })
    } catch (e) {
      return
      console.error(e)
    }
  } else if (event.states===true){
    try {
      return await questionnaire.where({
        _id: event.questionnaireId,
      }).update({
        data: {
          state: event.state
        }
      })
    } catch (e) {
      return
      console.error(e)
    }
  }else if(event.deletes===true){
    try {
      return await questionnaire.doc(event.questionnaireId).remove({
        success: console.log,
        fail: console.error
      })
    }catch (e) {
      return
      console.error(e)
    }
  }else if(event.title_abstract===true){
    try {
      return await questionnaire.where({
        _id: event.questionnaireId,
      }).update({
        data: {
         questionnaireTitle:event.title,
         briefIntroduction:event.abstract
        }
      })
    } catch (e) {
      return
      console.error(e)
    }
  }else if(event.Qurl===true){
    try {
      return await questionnaire.where({
        _id: event.questionnaireId,
      }).update({
        data: {
          QRURL:event.QRURL
        }
      })
    } catch (e) {
      return
      console.error(e)
    }
  }
  else{
    try {
      return await questionnaire.where({
        openId: event.openId,
        questionnaireTitle: event.questionnaireTitle,
        createTime: event.createTime
      }).update({
        data: {
          endTime: event.dateTime1,
          questions: event.questions,
          maxNumber: event.maxNumber,
          state: event.state
        }
      })
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