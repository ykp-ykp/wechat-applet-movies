// pages/posts/posts.js
var postData = require('../../data/posts-data.js') //只能用相对路径
//加载外部数据

Page({
  data: {
    text_condition: 'true',
    views: {},
    //单向数据绑定（js变→前端变（自动改变）），不能反向自动改变
  },

  onLoad: function (options,event) {
    this.setData({
      posts_key: postData.postList
    })
    //页面加载时，显示浏览量
    this.glance(event);
  },

  onpostTap: function (event) {
    //跳转到新闻详情页面
    var postid = event.currentTarget.dataset.postid
    this.data.postid = postid;
    this.setData({
      postid: postid
    })
    //event从前端的wxml页面获取属性（postid）的值
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid
    })

    //m每点击一次增加一次浏览量
    this.glance(event);
  },

  glance:function(event){
    //增加浏览量
    var postid = this.data.postid;
    var glance_nums = wx.getStorageSync('glance_nums');
    if (glance_nums) {
      if (!glance_nums[postid]) {
        glance_nums[postid] = 1;
      } else {
        glance_nums[postid]++;
      }
      wx.setStorageSync('glance_nums', glance_nums);
    } else {
      var glance_nums = {};
      glance_nums[postid] = 1;
      wx.setStorageSync('glance_nums', glance_nums);
    }
    this.setData({
      views : glance_nums
    })
    //console.log(this.data.views)
    //问题是如何传递到post-item-template.wxml上面显示出来浏览量
  }
 
})