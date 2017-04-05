$(function () {

    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": false,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/ugroup/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<input type="checkbox" id="'+data+'"></input><input type="hidden" id="'+data+'_gname" value="'+full.usergroupname+'"></input><input type="hidden" id="'+data+'_userErp" value="'+full.userErp+'"></input><input type="hidden" id="'+data+'_userId" value="'+full.user_id+'"></input>';
                        }
                    },
                    { "data": "usergroupname" },
		            { "data": "create_time" },        
		            { "data": "update_time" },
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<a class="margin" href="/ugr/'+ data +'">联系人管理</a>';
                        }
                    }
        ]
    });

    $table.on('select',function(e, dt, type, indexes){
        $table.rows( indexes).nodes().to$().find("input:checkbox").prop("checked",true);
    }).on('deselect',function(e, dt, type, indexes){
        $table.rows( indexes).nodes().to$().find("input:checkbox").prop("checked",false);
    })

    $("#table").on('click', '#all' ,function(event){
        $table.rows().select($(this).prop("checked"));
    }).on('click','tbody input:checkbox',function(){
        $table.row($(this).parents("tr")).select($(this).prop("checked"));
    });

    // 添加toolbar
    $("div.toolbar")
    .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
    .append('<button class="btn btn-flat bg-blue margin" id="update">修改</button>')
        //.append('<button class="btn btn-flat bg-blue margin" id="batch">批量导入</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>')
        /*.append('<button class="btn btn-flat bg-blue margin" id="users">分组联系人管理</button>');*/

    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">分组名</label><div class="col-sm-10"><input type="text" class="form-control" name="usergroupname" placeholder="分组名" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label"></label><div class="col-sm-10"><p><input type="checkbox" checked="true" name="hasUserSelf" value="true" />包含自身（如您自己不想收到报警，请不要勾选）</p></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"创建用户分组"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/ugroup/create",
                    type:"post",
                    data:$form.serialize(),
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
            }
        });
    });

    $("#update").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked");
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要修改的记录"});
            return false ;
        }
        
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行修改"});
            return false ;
        }

        var id = checked_trs.get(0).id ;
        var ugname = $("#" + id + "_gname").val()
        var userErp = $("#" + id + "_userErp").val()
        var userId = $("#" + id + "_userId").val()
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组名</label><div class="col-sm-10"><input type="hidden" id="userid" name="userid" value="'+id+'" /><input type="text" class="form-control" name="usergroupname" placeholder="分组名" value="'+ugname+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组所属人ERP</label><div class="col-sm-10"><input type="hidden" id="user_id" name="user_id" value="'+userId+'" /><input type="text" class="form-control" name="userErp" placeholder="分组所属人ERP" value="'+userErp+'"></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");     

        var $modal = $(modify_tmpl).jd_modal({title:"修改用户分组"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/ugroup/update",
                    type:"post",
                    data:$form.serialize(),
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
            }
        });
    });
    

    $("#delete").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要删除的记录"});
            return false ;
        }

        var ids = [] ;
        for(var i=0; i<checked_trs.size(); i++){
            ids.push(checked_trs.get(i).id) ;
        }

        $.jd_confirm({type:"info",message:"确认要删除ID为"+ids.join(",")+"的记录吗？",ok:function(){
            $.jd_ajax({url:"/ugroup/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
    });

    $("#users").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        window.location = "/ugr/"+ checked_trs.get(0).id

    });
    

    function validate_create_form($form){
        var has_error = false ;
        $form.find("input").each(function(){
            if($(this).val() == ""){
                $(this).parent().addClass("has-error");
                has_error = true ;
            }
        });
        return has_error;
    }

    
    
});