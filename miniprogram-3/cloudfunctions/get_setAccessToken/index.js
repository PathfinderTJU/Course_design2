// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser: true,
  env: 'hxl-1wbvh'
})
const db = cloud.database({
  env: 'hxl-1wbvh'
});
const accessToken = db.collection('accessToken');
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.gets === true) {
    try {
      return accessToken.where({
        _id:"e205660c-5434-4c9a-a7a0-3a43488696a5",
      }).get()
    } catch (e) {
      console.error(e)
      return;
    }
  } else if (event.updates === true) {
    try {
      return await accessToken.where({
        _id: "e205660c-5434-4c9a-a7a0-3a43488696a5",
      }).update({
        data: {
          accessToken: event.access_token,
          createTime: event.time
        }
      })
      return event
    } catch (e) {
      console.error(e)
      return
    }
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}