$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page : currentPage,
                pageSize: pageSize
            },
            dataType : "json",

            success : function(e){
                console.log(e);
                var htmlStr = template("firstTpl",e);
                $('tbody').html(htmlStr);
                // 分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion : 3,
                    currentPage: e.page,
                    totalPages : Math.ceil(e.total/e.size),
                    onPageClicked : function(a,s,d,page){
                        currentPage = page;
                        render();
                    }
                })

            }
        })
    }

    // 2点击添加按钮,显示模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');
    })

    // 3校验配置
    $('#form').bootstrapValidator({
        // 配置图标
        feedbackIcons : {
            valid: 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验字段
        fields : {
            categoryName :{
                validators:{
                    notEmpty:{
                        message: "请输入一级分类名称"
                    }
                }
            }
        }

    })

    // 4 表单校验成功事件
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$('#form').serialize(),
            dataType:'json',
            success:function(e){
                console.log(e);
                if(e.success){
                    $('#addModal').modal('hide');
                    currentPage=1;
                    render();
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })

})