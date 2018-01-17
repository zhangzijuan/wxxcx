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


//获取课程列表数据
function getCourseListData(pageNo, pageSize, session_id, callback) {
  let url = 'https://v4.21tb.com/ms/newIndex/loadCompanyCourseList?eln_session_id=' + session_id;
  wx.request({
    url: url,
    method: 'POST',
    data: {
      'pageNo': pageNo,
      'pageSize': pageSize,
      'corpCode': 'harvest_default'
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.statusCode == 200) {
        console.log(res);
        callback(res.data);
      }  
    }
  })
}


//获取课程详情数据
function getCourseDetail(courseId, session_id, callback) {
  let url = 'https://v4.21tb.com/ms/newCourse/loadCourseDetail?eln_session_id=' + session_id;
  wx.request({
    url: url,
    method: 'POST',
    data: {
      "courseId":courseId,
      'corpCode': 'harvest_default'
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}



module.exports = {
  formatTime: formatTime,
  getCoursesData: getCourseListData,
  getCourseDetail: getCourseDetail 
}
