var Data = require("../../../data/posts-data")
var app = getApp();
Page({

  data: {
    currentpostId: "", //点击的文章对应的编号0,1,2..
    isPlayingMusic: false, //当前音乐是否处于播放状态
    backgroundAudioManager: ""
  },

  onLoad: function (option) {
    var globalData = app.globalData;
    //下面这种单个元素的绑定，访问时可以直接用变量名，而不用detail.变量名
    // this.data.author_name = postData.author_name;
    var postId = option.id;
    //option获取传输路径上的附带值（在posts.js中的函数onpostTap中的url后缀）
    this.data.currentpostId = postId;
    //postList是post-data.js里面的一个数组
    var postData = Data.postList[postId]
    this.setData({
      detail: postData
    })

    //postsCollected是个数组，存储的分别是每一个文章是否已收藏的信息
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      //{}是object，[]是array数组，都可以用下标取数据
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }
    if(app.globalData.g_isPlayingMusic&&app.globalData.g_currentMusicId == this.data.currentpostId){
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setAudioMonitor();
  },

  setAudioMonitor: function () {
    //下面是监听音乐播放和暂停事件
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      console.log("正在播放")
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;  //改变全局变量的状态
      app.globalData.g_currentMusicId = that.data.currentpostId;
    })
    wx.onBackgroundAudioPause(function () {
      console.log("已暂停")
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;  //改变全局变量的状态
      app.globalData.g_currentMusicId = null;
    })
  },

  onMusicTap: function (event, option) {
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      }) //把音乐状态调整为正在暂停
      app.globalData.g_currentMusicId = null;
    } else {
      var currentpostId = this.data.currentpostId;
      var currentData = Data.postList[currentpostId]
      var backgroundAudioManager = wx.getBackgroundAudioManager();
      this.data.backgroundAudioManager = backgroundAudioManager;
      backgroundAudioManager.title = currentData.music.tittle;
      backgroundAudioManager.singer = currentData.music.singer;
      backgroundAudioManager.coverImgUrl = currentData.music.coverImg;
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = currentData.music.url;

      //下面是第二种方法，已停止维护,仍可以使用
      // wx.playBackgroundAudio({
      //   dataUrl: 'dataUrl',
      //   title: "",
      //   coverImg: ""
      // })
      this.setData({
        isPlayingMusic: true
      }); //把音乐状态调整为正在播放
      app.globalData.g_currentMusicId = this.data.currentpostId;
    }
  },

  onCollectionTap: function (event) {
    //set/get/remove/clear(StorageSync)
    var postsCollected = wx.getStorageSync('posts_collected');
    var collected = postsCollected[this.data.currentpostId];
    collected = !collected;
    postsCollected[this.data.currentpostId] = collected;
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: collected
    })
    wx.showToast({
      title: collected ? '收藏成功' : '取消收藏'
    })
  },

  //分享函数功能
  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友", "分享到朋友圈", "分享给QQ好友", "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        // res.cancel  //
        // res.tapIndex  //用户点击的是itemList的第几个元素，0开始
        wx.showModal({
          title: '用户 ' + itemList[res.tapIndex],
          content: "实际上现在还无法分享",
        })
      }
    })
  },

})