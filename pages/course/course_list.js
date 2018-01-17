
const util = require('../../utils/util.js')

// pages/course/course_list.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList:[],
    pageNo:1,
    pageSize:10,
    showPullDown:false,
    showPullUp:false,
    firstPage:false,
    lastPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中！'
    })
    let that = this;
    //加载课程列表数据
    util.getCoursesData(this.data.pageNo, this.data.pageSize,app.globalData.session_id,function(res){
      console.log(res.data);
      that.setData({
        courseList: res.data
      });
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      showPullDown: true
    });
    //加载课程列表数据
    setTimeout(function(){
      let newPageNo = 1;
      util.getCoursesData(newPageNo, that.data.pageSize, app.globalData.session_id, function (res) {
        console.log(res.data);
        that.setData({
          courseList: res.data,
          showPullDown: false
        });
      });
    },1000);
  },

  upper:function(e){
    console.log("6666"+e);
    let that = this;
    that.setData({
      showPullDown:true
    });
    setTimeout(function () {
      let newPageNo =  1;
      util.getCoursesData(newPageNo, that.data.pageSize, app.globalData.session_id, function (res) {
        console.log(res.data);
        let resultCourseList = null;
        if (res.data[0].courseId != that.data.courseList[0].courseId){
          resultCourseList = res.data.concat(that.data.courseList);
          that.setData({
            firstPage: false
          });
        }else{
          that.setData({
            firstPage:true
          });
          resultCourseList = that.data.courseList;
        }
        that.setData({
          courseList: resultCourseList,
          showPullDown: false
        });
      });
    }, 1000);
  },

  lower:function(e){
    console.log("5555:"+e);
    let that = this;
    that.setData({
      showPullUp: true
    });
    setTimeout(function () {
      let newPageNo = that.data.pageNo + 1;
      util.getCoursesData(newPageNo, that.data.pageSize, app.globalData.session_id, function (res) {
        console.log(res.data);
        if (res.data.length == 0){
          that.setData({
            lastPage: true
          });
        }else{
          that.setData({
            lastPage: false
          });
        }
        that.setData({
          pageNo: newPageNo,
          courseList: that.data.courseList.concat(res.data),
          showPullUp: false
        });
      });
    }, 1000);
  },
  scroll: function (e) {
    console.log("7777"+e)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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