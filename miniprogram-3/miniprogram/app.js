//app.js
wx.cloud.init()
// const app = getApp();
// const db = wx.cloud.database({
//   env: 'hxl-1wbvh'
// });



App({
  //全局数据
  globalData: {
    //AppSecret
    appSecret: "c995f6559c1774722acb60b00ca53fff",
    //appId
    appId:"wxb9b907cc7c3579bb",
    //用户ID
    openId: 'or8tH47j_pP40j4RRuJmJM38HagQ',
    //用户信息
    userInfo: null,
    //授权状态
    auth: {
      'scope.userInfo': false
    },
    //登录状态
    logged: false,
    //用户头像
    avatarUrl:'',
    //问卷标题
    questionnaireTitle: '',
    //简介
    briefIntroduction: '',
    //昵称
    nickName:"",
    question: [],
    //问卷状态
    state: '',
    createTime:[],
    //问卷ID
    questionnaireId: ''
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '欢迎使用怡问卷',
      path: '/pages/login/login',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: "none",
          duration: 1500
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: "none",
          duration: 1500
        })
      }
    }
  }
})
