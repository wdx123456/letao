
$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();
    // 1渲染数据
    function render(){
        $.ajax({
            type:'get',
            url : '/category/querySecondCategoryPaging',
            data:{
                page: currentPage,
                pageSize:pageSize
            },
            dataType: 'json',
            success:function(e){
                console.log(e);
                var htmlStr = template('secondTpl',e);
                $('tbody').html(htmlStr);
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages: Math.ceil(e.total/e.size),
                    onPageClicked: function(a,d,s,page){
                        currentPage= page;
                        render();
                    }
                })
            }
        })
    }

    // 2点击添加按钮,显示加模态框
    $('#addBtn').click(function(){
        $('#addModal').modal('show');
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page: 1,
                pageSize:100
            },
            dataType:'json',
            success:function(e){
                console.log(e);
                var htmlStr = template('dropdownTpl',e);
                $('.dropdown-menu').html(htmlStr);
            }
        })
    })

    // 3下拉菜单的点击事件,事件委托
    $('.dropdown-menu').on('click','a',function(){
        var txt = $(this).text();
        $('#dropdownText').text(txt);
    })

    // 4配置fileupload进行初始化
    $('#fileupload').fileupload({
        dataType:'json',
        done:function(e,data){
            console.log(data);
            var picUrl = data.result.picAddr;
            $("#imgBox img").attr('src',picUrl);
        }
    })
})