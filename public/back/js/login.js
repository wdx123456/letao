$(function(){
  $('#form').bootstrapValidator({
    // 配置校验字段
    fields:{
      username : {
        // 非空校验
        validators:{

          notEmpty :{
            message : "用户名不能为空"
          },
          // 长度校验
          stringLength : {
            min :2,
            max : 6,
            message : "用户名长度必须是 2-6 位"
          },
          callback : {
            message : "用户名不存在"
          }
        }
      },
      // 密码验证
      password : {
        validators : {
          // 非空校验
          notEmpty : {
            message : "密码不能为空"
          },
          stringLength : {
            min: 6,
            max : 12,
            message : "密码长度必须是 6-12 位"
          },
          callback : {
            message: "密码错误"
          }

        }
      }
    }
  })


  // 2表单校验成功事件
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type : "post",
      url : "/employee/employeeLogin",
      data : $('#form').serialize(),
      dataType : 'json',
      success : function(e){
        console.log(e);
        if(e.error === 1000){
          $('#form').data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
          return;
        }
        if(e.error === 1001){
          $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
          return;
        }
        if(e.success){
          location.href = "index.html";
          return;
        }
      }
    })
  })


// 3重置功能
$('[type="reset"]').click(function(){
  $('#form').data('bootstrapValidator').resetForm();
})




})