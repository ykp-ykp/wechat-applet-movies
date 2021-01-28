// pages/movies/movies.js
var app = getApp() //获取全局的数据
var util = require("../../utils/utils")
Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchMovie: {},
    containerShow: true, //电影页面
    searchPanelShow: false, //搜索结果页面
    searchResult: {}, //搜索结果
    page: 0,
    s_url: "",//搜索电影的url
    movieText: "",
  },

  onLoad: function (event) {
    var inTheatersUrl = app.globalData.inTheatersUrl; //正在上映
    var comingSoonUrl = app.globalData.comingSoonUrl; //即将上映
    var top250Url = app.globalData.top250Url; //top250
    this.getMovieList(inTheatersUrl, "inTheaters");
    this.getMovieList(comingSoonUrl, "comingSoon");
    this.getMovieList(top250Url, "top250");
  },

  getMovieList: function (url, settedKey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      // header: {
      //   "content-Type": "application/xml"
      // },
      success: function (res) {
        //console.log(res)
        // console.log(res.data.data.subject[0])//输出每次获取的数据的第一个电影信息
        that.processDoubanData(res, settedKey);
      },

      fail: function () {
        console.log("失败");
      },
      complete: function () {}
    })
  },

  processDoubanData: function (res, settedKey) {
    var movies = [];
    // for (var idx = 0; idx < 3; idx++) {
    for (var idx in res.data.data.subject) {
      if (idx == 3 && settedKey != "searchMovie")//如果不是搜索函数调用的，就只取三个电影数据
        break;
      //js中的循环和java一样
      var subject = res.data.data.subject[idx];
      var title = subject.title;
      if (title == null)
        title = subject.name;
      if (title.length >= 6)
        title = title.substring(0, 6) + "...";
      var score = subject.score
      //因为每个api返回的数据关键字不一样，所以需要多次获取比如评分这几个api的关键字为：score、stat、rating。
      if (score == null)
        score = subject.star
      if (score == null)
        score = subject.rating;
      if (score == null)
        score = 0
      var movieId = subject.id;
      var coverageUrl = subject.img;
      var star = score;
      star = parseInt((star) / 2);
      var temp = {
        title,
        coverageUrl,
        score,
        movieId,
        star
      }
      movies.push(temp);
    }
    var previous_movies = this.data.searchMovie;
    //console.log(movies); 成功取出电影数据
    //动态绑定数据
    var readyData = {};
    readyData[settedKey] = movies;
    this.setData(readyData);

    //处理搜索函数的下拉刷新后接数据
    if(this.data.page!=0){
      var print_movies = previous_movies.concat(movies);
      this.setData({
        searchMovie: print_movies
      })
    }
    wx.hideNavigationBarLoading()//隐藏旋转加载动画
  },

  onMoreTap: function (event) {
    //注意这里获取标签下的数据是不区分大小写的
    var movieTheme = event.currentTarget.dataset.movietheme;
    wx.navigateTo({
      url: 'more-movie/more-movie?movieTheme=' + movieTheme,
    })
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function (event) {
    //失去焦点，获取数据
    var previous_movieText = this.data.movieText;  //上一次搜索的电影名

    
    var movieText = event.detail.value;
    this.data.movieText = movieText
    console.log("现在的搜索"+movieText)
    if(previous_movieText!=null&&previous_movieText!=movieText){
      //如果搜索名字变了，则先清空之前的搜索记录,并置page为0
      this.data.searchMovie = {};
      this.data.page = 0;
    }
    this.searchMovies(this.data.movieText);
  },

  onCancelImgTap: function (event) {
    // 取消搜索，隐藏搜索结果页面
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {} //搜索结果置空
    })
  },

  searchMovies: function (movieText) {
    var s_url = "http://39.105.38.10:8081/movie/search?q=" + movieText + "&page=";
    //s_url:搜索的url
    this.setData({
      s_url: s_url,
    })
    this.getMovieList(s_url+""+this.data.page, "searchMovie");
  },

  onScrollLower: function(event){
    console.log("划到底了");
    this.data.page++;
    var url = this.data.s_url+""+this.data.page;
    console.log(url);
    util.http(url, this.processDoubanData)
    wx.showNavigationBarLoading()//旋转加载动画
  },

})