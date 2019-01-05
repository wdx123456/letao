$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
});
$(document).ajaxStop(function() {
  // 模拟网络延迟
  setTimeout(function() {
    // 结束进度条
    NProgress.done();
  }, 500);
});




$(function() {
  // 公共的功能
  // 1. 左侧二级菜单切换功能
  $('.lt_aside .category').click(function() {
    // 切换 下一个兄弟元素 显示隐藏
    $(this).next().stop().slideToggle();
  })


  // 2. 左边侧边栏切换功能
  $('.icon_menu').click(function() {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  })


  // 3. 退出功能
  // (1) 显示模态框
  $('.icon_logout').click(function() {
    // 让模态框显示show 隐藏 hide
    $('#logoutModal').modal("show");
  });

  // (2) 点击退出按钮, 发送退出请求, 实现退出
  $('#logoutBtn').click(function() {
    // 发送 ajax 请求
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 退出成功, 跳到登陆页
          location.href = "login.html";
        }
      }
    })

  })

})
