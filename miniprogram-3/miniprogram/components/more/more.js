// utils/component/modal.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    "modalHidden": false,
    "numberOfMore": 0,
    "canUp": true,
    "canDown": true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    modal_click_Hidden: function () {
      this.setData({
        modalHidden: false,
        numberOfMore: 0
      })/*点击其外的地方隐藏该组件*/
    },

    modal_click_show: function (e) {
      if (app.globalData.question.length === 1){
        this.setData({
          canUp: false,
          canDown: false
        })
      }else{
        if (e === 1){
          this.setData({
            canUp: false,
            canDown: true
          })
        }else if (e === app.globalData.question.length){
          this.setData({
            canUp: true,
            canDown: false
          })
        }else{
          this.setData({
            canUp: true,
            canDown: true
          })
        }
      }

      this.setData({
        modalHidden: true,
        numberOfMore: e
      })
    },

    toUp: function(){
      this.triggerEvent("upMove", this.data.numberOfMore);
    },

    toDown: function () {
      this.triggerEvent("downMove", this.data.numberOfMore);
    },

    toDelete: function () {
      this.triggerEvent("deleteMove", this.data.numberOfMore);
    }
  }, 

})
