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

var hostUri = 'https://v4.21tb.com';

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
  getCoursesData: getCourseListData,
  getCourseDetail: getCourseDetail 
}
