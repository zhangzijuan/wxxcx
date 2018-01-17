
const until = require('../../utils/util.js');
let app = getApp();
// pages/courseDetail/course_detail.js
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
      this.setData({
        courseId:options.courseId
      });
      let that = this;
      //获取课程详情信息
      until.getCourseDetail(options.courseId, app.globalData.session_id,function(res){
        console.log(res.data);
        that.setData({
            courseDetail:res.data
        });
        //设置当前界面的标题
        wx.setNavigationBarTitle({
          title: res.data.name
        });
      });
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
  
  }
})