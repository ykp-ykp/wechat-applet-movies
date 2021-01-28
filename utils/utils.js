
  
function http(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res,"searchMovie");
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

module.exports = {
  http: http
}