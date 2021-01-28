// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/utils")
Page({

  data: {
    page: 0,
    movies: [],
    url: "",
    totalMovies: []
  },

  onLoad: function (options) {
    var movieTheme = options.movieTheme;
    this.setData({
      movieTheme: movieTheme
    })
    
    switch (movieTheme) {
      case "正在热映": 
        var dataUrl = "http://39.105.38.10:8081/movie/playing?page="; //正在上映
        this.data.url = dataUrl;
        break;
      case "即将上映": 
        var dataUrl = "http://39.105.38.10:8081/movie/showing?page="; //即将上映
        this.data.url = dataUrl;
        break;
      case "top250": 
        var dataUrl = "http://39.105.38.10:8081/movie/top250?page="; //top250
        this.data.url = dataUrl;
        break;
    }
    this.data.requestUrl = dataUrl;
    //回调函数
    util.http(this.data.url, this.processDoubanData)

  },

  processDoubanData: function (res) {
    console.log(this.data.url+this.data.page)
    var movies = [];
    for (var idx in res.data.data.subject) {
      //idx是数字0,1,2...
      //js中的循环和java一样
      var subject = res.data.data.subject[idx];
      //console.log(subject)
      var title = subject.title;
      if (title == null)
        title = subject.name;
      if (title.length >= 6)
        title = title.substring(0, 6) + "...";
      var score = subject.score
      if (score == null)
        score = subject.star
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
      //movies每次都是新页面的电影数据
    }
    var totalMovies = [];
    totalMovies = this.data.movies.concat(movies);
    this.setData({
      movies: totalMovies
    })
    wx.hideNavigationBarLoading();//隐藏旋转加载动画
    console.log(totalMovies);
    this.data.page++;
  },

  onScrollLower: function(event){
    console.log("划到底了");
    //this.data.page++;
    util.http(this.data.url+this.data.page, this.processDoubanData)
    wx.showNavigationBarLoading()//旋转加载动画
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.movieTheme
    })
  },

})