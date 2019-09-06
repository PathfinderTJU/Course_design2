// miniprogram/pages/add/addt.js
const app = getApp()
Page({
  data: {
    routers: [
      {
        name: '单选题',
        url: '/pages/add/add_radio/add_radio?index=-1',
        icon: '/images/check-circle.png',
        code: '10'
      },
      {
        name: '多选题',
        url: '/pages/add/add_checkbox/add_checkbox?index=-1',
        icon: '/images/check-square.png',
        code: '11'
      },
      {
        name: '电话',
        url: '/pages/add/add_phone/add_phone?index=-1',
        icon: '/images/phone.png',
        code: '10'
      },
      {
        name: '填空题',
        url: '/pages/add/add_blank/add_blank?index=-1',
        icon: '/images/edit.png',
        code: '11'
      },
      {
        name: '打分题',
        url: '/pages/add/add_star/add_star?index=-1',
        icon: '/images/star.png',
        code: '10'
      },
      {
        name: '下拉题',
        url: '/pages/add/add_list/add_list?index=-1',
        icon: '/images/detail.png',
        code: '11'
      },
      {
        name: '身份证号',
        url: '/pages/add/add_id/add_id?index=-1',
        icon: '/images/id-card.png',
        code: '10'
      },
      {
        name: '日期',
        url: '/pages/add/add_date/add_date?index=-1',
        icon: '/images/calendar.png',
        code: '11'
      },
      {
        name: '邮箱',
        url: '/pages/add/add_mail/add_mail?index=-1',
        icon: '/images/calendar.png',
        code: '10'
      }
    ]
  },

})
