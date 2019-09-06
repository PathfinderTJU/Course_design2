// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  traceUser:true,
  env:'hxl-1wbvh'
})
const db = cloud.database({
  env: 'hxl-1wbvh'
});
const usersTable=db.collection("User")
const _=db.command


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext()

  //更新当前信息
  if(event.update==true){
    try{
      return await usersTable.doc(wxContext.OPENID).update({
        data:{
          userData: _.set(event.userData)
        },
      })
    }catch(e){
      console.error(e)
    }
  }else if(event.getSelf==true){
    //获取当前用户信息
    try{
      return await usersTable.where({
        openid: wxContext.OPENID // 填入当前用户 openid
      }).get()
    }catch(e){
      console.error(e)
    }
  }else if(event.setSelf==true){
    //console.log("123454a6d")
    //添加当前用户信息
    try{
      usersTable.add({
        data:{
          id: wxContext.OPENID,
          openid: wxContext.OPENID,
          userData: event.userData,
          boughtList: [],
          messageList: [],
          ontransList: []
        }
      })
      return await usersTable.where({
        openid: wxContext.OPENID // 填入当前用户 openid
      }).get()
    }catch(e){
      console.error(e)
    }
  }else if(event.getOthers===true){
    //获取指定用户信息
    try{
      return await usersTable.doc(event.userId).field({
        userData:true
      }).get()
    }catch(e){
      console.error(e)
    }
  }
}