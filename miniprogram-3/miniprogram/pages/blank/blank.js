// miniprogram/pages/blank/blank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // $(".titleView,inputView").mCustomScrollbar();

    // $(".titleView,inputView").click(function () {
    //   $("#titleView,inputView").focus();
    // });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  /*
  
  * 取得对应类和标签的HTML元素
  
  * clsName:给定类名
  
  * tagName：给定的HTML元素，如果为任意 tagName='*'
  
  * 
  
  */

  getElementsByClassName:function(clsName, tagName) {
    var ClassElements = [];
    selElements = document.getElementsByTagName(tagName);
    for(var i = 0; i<selElements.length; i++) {
  if (selElements[i].className == clsName) {
    ClassElements[ClassElements.length] = selElements[i];
  }
}
return ClassElements;
},

//通过改变元素class名达到间接改变背景样式
 onFirstMenuChangeBg: function(e) {
  //先清除已经改变的元素背景样式
   var getElements = getElementsByClassName('inputTextHover', 'input');
  for (var i = 0; i < getElements.length; i++) {
    getElements[i].className = "inputText";
  }
  //设置鼠标点击元素背景样式
   e.className = "inputTextHover";
},

})