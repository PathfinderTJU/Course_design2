
// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {

  const page = event.page
  const scene = "3c4c6d855d6f6b4511558cc5661470b1"

  let appid = 'wxb9b907cc7c3579bb';//微信公众号开发者id
  let secret = 'c995f6559c1774722acb60b00ca53fff';//微信公众号开发者secret_key

  const AccessToken_options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
      appid,
      secret,
      grant_type: 'client_credential'
    },
    json: true
  };

  //获取AccessToken
  const resultValue = await rp(AccessToken_options);
  const token = resultValue.access_token;

  return token;


}