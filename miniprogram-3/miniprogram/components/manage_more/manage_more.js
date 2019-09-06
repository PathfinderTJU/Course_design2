// components/manage_more/manage_more.js
Component({

  properties: {

  },

  data: {
    "modalHidden": false,
    "numberOfMore": 0,
  },

  methods: {
    modal_click_Hidden: function () {
      this.setData({
        modalHidden: false,
        numberOfMore: 0
      })/*点击其外的地方隐藏该组件*/
    }, 
    
    modal_click_show: function (e) {
      this.setData({
        modalHidden: true,
        numberOfMore: e
      })
    },
    
    toPublish: function () {
      this.triggerEvent("publish", this.data.numberOfMore);
    },

    toView: function () {
      this.triggerEvent("view", this.data.numberOfMore);
    },

    toDelete: function () {
      this.triggerEvent("deleteMove", this.data.numberOfMore);
    }
  }
})
