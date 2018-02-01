const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// var hostUri = 'https://v4.21tb.com';
var hostUri = 'http://cloud.21tb.com/';

//用户登陆
function harvestLogin(callback){
  let url = hostUri +'/ms/login/login.do';
  let data = {
    loginName: '13371968386',
    password: '13371968386',
    corpCode: 'harvest_public',
    industryCode: 'harvest_default'
  };
  // let data = {
  //   loginName: '18221343621',
  //   password: '18221343621',
  //   corpCode: 'harvest_public',
  //   industryCode: 'harvest_default'
  // };
  wxRequest(url,data,callback);
}

//获取课程列表数据
function getCourseListData(moduleName,pageNo, pageSize, session_id, callback) {
  let url = '';
  let data = null;
  if (moduleName == 'selectCourse'){
    url = hostUri+'/ms/newIndex/loadCompanyCourseList?eln_session_id=' + session_id;
    data = { 'pageNo': pageNo, 'pageSize': pageSize, 'corpCode': 'harvest_default' };
  } else if (moduleName == 'myCourse'){
    url = hostUri +'/ms/newCourse/loadMyPublicCourseRecord?eln_session_id=' + session_id;
    data = { 'pageNo': pageNo, 'pageSize': pageSize};
  }
  wxRequest(url, data, callback);
}


//获取课程详情数据
function getCourseDetail(courseId, session_id, callback) {
  let url = hostUri +'/ms/newCourse/loadCourseDetail?eln_session_id=' + session_id;
  wxRequest(url, {"courseId": courseId, 'corpCode': 'harvest_default' }, callback);
}

//选择课程
function selectCourse(courseId,session_id,callback){
  let url = hostUri + '/ms/newCourse/selectMyCourse?eln_session_id=' + session_id;
  wxRequest(url, { "courseId": courseId, 'corpCode': 'harvest_public' }, callback);
}

//获取课程评价列表数据
function getCourseCommentListData(courseId, session_id, pageNo, pageSize,corpCode,callback){
  let url = hostUri + '/ms/mobile/listDiscuss?eln_session_id=' + session_id;
  let data = {
    objectId:courseId,
    objectType:'COURSE_COMMENT',
    pageNo:pageNo,
    pageSize:pageSize,
    corpCode:corpCode
  }
  wxRequest(url,data, callback);
}


function wxRequest(url, data, callback){
  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.statusCode == 200) {
        if(typeof (callback) == "function"){
          callback(res.data)
        }
      }
    }
  })
}



module.exports = {
  formatTime: formatTime,
  harvestLogin: harvestLogin,
  getCoursesData: getCourseListData,
  getCourseDetail: getCourseDetail,
  selectCourse: selectCourse,
  getCourseCommentListData: getCourseCommentListData
}
