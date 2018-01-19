
const until = require('../../utils/util.js');
let app = getApp();
// pages/courseDetail/course_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex:0,
    courseItemBarToTop:false,
    courseItemBar: [{ itemName: '简介', selected: true }, { itemName: '目录', selected: false }, { itemName: '评价', selected: false }],
    courseSelected:false,
    chapterShow:false,
    chapterType:'',
    chapterUrl:''
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
  tabBarClick:function(e){
    let that = this;
    console.log(e);
    //设置tabBar点击效果
    var currentEventIndex = e.currentTarget.dataset.itemindex;
    var oldCourseItemBar = that.data.courseItemBar;
    for(var i = 0;i < oldCourseItemBar.length;i++){
       if(i == currentEventIndex){
         oldCourseItemBar[i].selected = true;
       }else{
         oldCourseItemBar[i].selected = false;
       }
    }
    console.log(oldCourseItemBar);
    that.setData({
      courseItemBar: oldCourseItemBar,
      currentIndex:currentEventIndex
    })

  },
  //内容块滑动事件处理
  touchSwiper:function(e){
    console.log(e);
    let that = this;
    //设置tabBar点击效果
    var currentEventIndex = e.detail.current;
    var oldCourseItemBar = that.data.courseItemBar;
    for (var i = 0; i < oldCourseItemBar.length; i++) {
      if (i == currentEventIndex) {
        oldCourseItemBar[i].selected = true;
      } else {
        oldCourseItemBar[i].selected = false;
      }
    }
    console.log(oldCourseItemBar);
    that.setData({
      courseItemBar: oldCourseItemBar
    })
    
  },
  //选择课程
  selectCourse:function(e){
    console.log(e.currentTarget.dataset.courseid);
    let that = this;
    until.selectCourse(e.currentTarget.dataset.courseid, app.globalData.session_id,function(res){
      wx.showToast({
        title: '选课成功',
        icon: 'success',
        duration: 2000,
        success:function(e){
          var oldCourseItemBar = that.data.courseItemBar;
          for (var i = 0; i < oldCourseItemBar.length; i++) {
            if (i == 1) {
              oldCourseItemBar[i].selected = true;
            } else {
              oldCourseItemBar[i].selected = false;
            }
          }
          that.setData({
            courseSelected:true,
            courseItemBar: oldCourseItemBar,
            currentIndex: 1
          })
        }
      })
    });
  },
  chapterShow:function(e){
    let that = this;
    let signedUrl = e.currentTarget.dataset.signedurl;
    let itemType = e.currentTarget.dataset.itemtype;
    if (itemType == 'PDF'){
      
    } else if (itemType == 'AUDIO' || itemType == 'VIDEO') {
      that.setData({
        chapterShow: true,
        chapterType: itemType,
        chapterUrl: signedUrl
      });
    } else if (itemType == 'MICRO_CONTENT') {
      wx.navigateTo({
        url: '../webPage/webPage?url=' + signedUrl
      })
    }

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