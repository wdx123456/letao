$(function(){
    var currentId;
    var isDelete;
    var currentPage = 1;
    var pageSize = 5;
    render();
    function render(){
        $.ajax({
            type:'get',
            url:"/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            dataType : "json",
            success:function(e){
                console.log(e);
                var htmlStr = template('tpl',e);
                $('tbody').html(htmlStr);
    
                // 分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:e.page,
                    totalPages: Math.ceil(e.total/e.size),
                    onPageClicked:function(a,d,s,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

// 2按钮事,件 ,事件委托
$('tbody').on('click','.btn',function(){
    $('#userModal').modal('show');
    // 获取当前用户的id
    currentId = $(this).parent().data('id');
    isDelete = $(this).hasClass('btn-danger') ? 0 :1;
});

// 3点击模态框确认按钮,发送请求,修改状态
$('#submitBtn').click(function(){
    $.ajax({
        type:"post",
        url:"/user/updateUser",
        data:{
            id:currentId,
            isDelete: isDelete
        },
        dataType:'json',
        success:function(e){
            console.log(e);
            if(e.success){
                $('#userModal').modal('hide');
                render();
            }
        }
    })
})

    
})