
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
    chapterUrl:'',
    commentPageNo:1,
    commentPageSize:10,
    videoPlayIconFun:'',
    videoPlayIconList: ['/pages/image/voice1.png', '/pages/image/voice2.png','/pages/image/voice3.png'],
    videoPlayIcon:'',
    currentProcess: '--:--',//显示
    currentProcessNum: 0,//赋值
    totalProcess: '--:--',
    totalProcessNum: 1,
    seek: -1,
    imgUrl: '../../images/play.png',
    canSlider: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('555555:'+options.fromShare)
      this.setData({
        courseId:options.courseId,
        fromShare: options.fromShare
      });
      let that = this;
      //获取课程详情信息
      until.getCourseDetail(options.courseId, app.globalData.session_id,function(res){
        console.log(res.data);
        that.setData({
            courseDetail:res.data,
            courseSelected: res.data.selected
        });
        //设置当前界面的标题
        wx.setNavigationBarTitle({
          title: res.data.name
        });
      });
  },
  //页面滚动处理
  mainPageScroll:function(e){
    let that = this;
    if (e.detail.scrollTop == 150){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
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
    });
    if (currentEventIndex == 2){
      //获取课程评价列表
      until.getCourseCommentListData(that.data.courseDetail.courseId, app.globalData.session_id, that.data.commentPageNo, that.data.commentPageSize, that.data.courseDetail.corpCode, function (res) {
        console.log(res.data);
        that.setData({
          courseCommentList:res.data
        });
      })
    }
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
          if (oldCourseItemBar[1].selected){
            that.setData({
              courseSelected: true,
              currentIndex: 1
            })
            return false;
          }
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
  //章节播放
  chapterShow:function(e){
    let that = this;
    if (!that.data.courseSelected){
      wx.showToast({
        title: '请先选择课程！',
        duration: 2000
      });
      return false;
    }
    if (that.data.videoPlayIconFun != ''){
      clearInterval(that.data.videoPlayIconFun);
    }
    let signedUrl = e.currentTarget.dataset.signedurl;
    let itemType = e.currentTarget.dataset.itemtype;
    if (itemType == 'PDF'){
      console.log(signedUrl);
      that.videoContext = wx.createVideoContext('courseVideo');
      that.videoContext.pause();
      wx.pauseBackgroundAudio();
      //pdf 文件的处理
      const downloadTask = wx.downloadFile({
        url: signedUrl,
        success:function(res){
          if (res.statusCode === 200) {
            console.log(res.tempFilePath);
            wx.openDocument({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          }
        }
      });
      downloadTask.onProgressUpdate((res) => {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      })
    }else if (itemType == 'VIDEO') {  
      that.setData({
        chapterShow: true,
        chapterType: itemType,
        chapterUrl: signedUrl
      }); 
    } else if (itemType == 'AUDIO') {
      that.setData({
        chapterShow: true,
        chapterType: itemType,
        chapterUrl: signedUrl
      });

      wx.playBackgroundAudio({
        dataUrl: signedUrl,
        title: '',
        coverImgUrl: ''
      })

      wx.seekBackgroundAudio({
        position: 30
      })
      
      if (itemType == 'AUDIO'){
        var i = 0;
        var videoPlayIconFun = setInterval(()=>{
          if(i >= 2){
            i = 0;
          }
          that.setData({
            videoPlayIcon: that.data.videoPlayIconList[i]
          });
          i++;
        },200);
        that.setData({
          videoPlayIconFun: videoPlayIconFun
        });
      }
    } else if (itemType == 'MICRO_CONTENT') {
      wx.navigateTo({
        url: '../webPage/webPage?url=' + signedUrl
      })
    }

  },
  //分享信息出去后，强制返回课程列表首页
  backCourseList:function(e){
    wx.switchTab({
      url: '/pages/course/course_list',
    })
  },
  //课程详情界面分享转发
  onShareAppMessage: function (res) {
    let that = this;
    return {
      title: that.data.courseDetail.name,
      path: '/pages/courseDetail/course_detail?courseId=' + that.data.courseDetail.courseId + '&fromShare=forwarding&shareTarget=course_detail',
      success: function (res) {
        // 转发成功
        console.log('转发成功！')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败！')
      }
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
  
  }
})