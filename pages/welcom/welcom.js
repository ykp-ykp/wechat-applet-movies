Page({
  onTap:function(){
    //navigateTo执行的是onHide只是把之前的页面隐藏了，所以可以返回
    // wx.navigateTo({
    //   url: '../posts/posts'
    // })

    //redirectTo执行的是onUnload，把之前的页面卸载掉了，所以不会再有返回按钮
    wx.redirectTo({
      url: '../posts/posts',
    })
  },


})