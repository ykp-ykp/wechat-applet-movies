App({
  globalData:{
    g_isPlayingMusic: false,  //音乐播放全局变量
    g_currentMusicId: null,
    inTheatersUrl: 'http://39.105.38.10:8081/movie/playing',  //正在热映
    comingSoonUrl: 'http://39.105.38.10:8081/movie/showing',  //即将上映
    top250Url: 'http://39.105.38.10:8081/movie/top250?page=0'  //top250
  }
})