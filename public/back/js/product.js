$(function(){
    var currentPae = 1;
    var pageSize = 2;
    var picArr = [];
    render();
    function render(){
        $.ajax({
            type: 'get',
            url:"/product/queryProductDetailList",
            data:{
                page: currentPae,
                pageSize:pageSize
            },
            dataType: 'json',
            success: function(e){
                var htmlstr = template('productTpl',e);
                $('tbody').html(htmlstr);
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: e.page,
                    totalPages: Math.ceil( e.total / e.size ),
                    // 添加页码点击事件
                    onPageClicked: function( a, b, c, page ) {
                      currentPage = page;
                      render();
                    }
                  })
            }
        })
    }


    // 2.点击添加按钮,显示添加模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page: 1,
                pageSize : 100
            },
            dataType: "json",
            success:function(e){
                console.log(e);
                var htmlStr = template("dropdownTpl",e);
                $('.dropdown-menu').html(htmlStr);
            }
            // success:function(e){
            //     console.log(e);
            //     var htmlStr = template("dropdownTpl",e);
            //     $('.dropdown-menu').html(htmlStr);
            // }
        })
    });

    // // 3.给下拉菜单的所有的a,添加点击事件
    $('.dropdown-menu').on('click','a',function(){
        var txt = $(this).text();
        $('#dropdownText').text( txt );
    
        // 获取 id, 设置给 隐藏域
        var id = $(this).data("id");
        $('[name="brandId"]').val( id );
        // $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");

    });
      

     // 4. 配置多文件上传
    $('#fileupload').fileupload({
        dataType: 'json',
        done:function(e,data){
            // console.log(data.result);
            var picObj = data.result;
            picArr.unshift(picObj);
            var picUrl = picObj.picAddr;
            $('#imgBox').prepend('<img style="width: 100px;" src="'+ picUrl +'" alt="">');

            if(picArr.length >3){
                picArr.pop();
                $('#imgBox img:last-of-type').remove();

            }
            if(picArr.length === 3){
                $('#form').data('bootstrapValidator').updateStatus('picStatus',"VALID");

            }
        }
    });
  

     // 5. 配置表单校验
  $('#form').bootstrapValidator({
    // 配置不校验的类型, 对 hidden 需要进行校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          // 商品库存格式, 必须是非零开头的数字
          // 需要添加正则校验
          // 正则校验
          // 1,  11,  111,  1111, .....
          /*
          *   \d 表示数字 0-9
          *   +     表示出现1次或多次
          *   ?     表示出现0次或1次
          *   *     表示出现0次或多次
          *   {n}   表示出现 n 次
          *   {n,m} 表示出现 n 到 m 次
          * */
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 要求: 必须是 xx-xx 的格式, xx为两位的数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '必须是 xx-xx 的格式, xx为两位的数字, 例如: 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传三张图片"
          }
        }
      }
    }
  });


//   6注册表单校验成功事件,阻止默认的提交
$('#form').on("success.form.bv", function( e ) {
    e.preventDefault();

    var paramsStr = $('#form').serialize();
    // 还要拼接上图片的数据
    // paramsStr += "&key=value";
    paramsStr += "&picArr=" + JSON.stringify( picArr );

    $.ajax({
      type: 'post',
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();

          // 重置内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);

          // 将下拉菜单的按钮文本 和 图片重置
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
        }
      }
    })
  })


   
    











})