$(function () {

    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/user/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function ( data, type, full, meta ) {
                    return '<input type="checkbox" id="'+data+'" value="'+full.erp+'"></input>';
                }
            },
            {
                "data": "name"
            },
            { "data": "erp" },
            {
                "data": "u_type",
                "render": function ( data, type, full, meta ) {
                	var msg = "";
                	if(data == 100000) {
                		msg = "系统管理员";
                	}else if(data == 10000) {
                		msg = "管理员";
                	} else if(data == 1000) {
                		msg = "集群管理员";
                	} else if(data == 100) {
                		msg = "普通用户";
                	} else if(data == 10) {
                		msg = "监控人员";
                	} else if(data == 0) {
                		msg = "值班电话";
                	}
                    return msg;
                }
            },
            { "data": "department" },
            { "data": "email" },
            { "data": "mobile" },
            { "data": "create_time" },
            { "data": "update_time" }
        ],
        initComplete: function () {
            var that = this;
            var column = this.api().column(3);
            var select = $('<select><option value="">权限</option><option value="0">值班电话</option></option><option value="10">监控人员</option><option value="100">普通用户</option><option value="1000">集群管理员</option><option value="10000">管理员</option><option value="100000">系统管理员</option></select>')
                .appendTo( $(column.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column
                        .search( val)
                        .draw();
                } );
        }
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
    
    // 绑定选择事件
    $('#table tbody').on( 'click', 'input:checkbox', function () {
        $(this).parents("tr").toggleClass('selected');
    });

    // 添加toolbar
    $("div.toolbar")
    .append('<button class="btn btn-flat bg-blue margin" id="role">设置权限</button>')
    .append('<button class="btn btn-flat bg-blue margin" id="modify">修改用户</button>')
    .append('<button class="btn btn-flat bg-blue margin" id="create">创建用户</button>')
    .append('<button style="display:none;" class="btn btn-flat bg-blue margin" id="show">查看用户</button>')
    ;
    
    $("#show").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked");
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要查看的记录"});
            return false ;
        }
        
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行查看"});
            return false ;
        }

        var erp = checked_trs.get(0).value ;
        
	    //load user
	    $.ajax({
            url:"/user/userDetail",
			type : "post",
			data : {"erp":erp},
        }).done(function(data){
    		var tmpl = $("#tmpl_userdetails").text();
    		var $modal = $(tmpl).jd_modal({
    			title : "用户详情"
    		});
        	$("#detail").text(data.userDetail);
        }).fail(function(data){
        });

	    //load user end
    }); 

    // toolbar绑定事件
    $("#role").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要修改的记录"});
            return false ;
        }

        if(checked_trs.size() != 1){
            $.jd_confirm({type:"error",message:"一次只能修改一条记录"});
            return false ;
        }

        var $row = $table.row('.selected') ;
        var userData = $row.data() ;

        var tmpl = [
            '<form class="form-horizontal" method="post" action="/user/role">',
            '<input type="hidden" name="modify_id"/>',
            '<div class="form-group"><select id="u_type" name="role" class="form-control"><option value="100">普通用户</option><option value="10">监控人员</option><option value="0">值班电话</option><option value="1000">集群管理员</option><option value="10000">管理员</option></select></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");


        var $modal = $(tmpl).jd_modal({title:"修改权限"});
        var $form = $modal ;

        $form.find('input[name="modify_id"]').val(userData['id']);
        $form.find('#u_type').val(userData['u_type']);

        $modal.on("click",".btn.btn-primary",function(){
            $.jd_ajax({
                url:"/user/role",
                type:"post",
                data:$form.serialize(),
                ok:function(){
                    $modal.data("modal").close();
                    $table.ajax.reload();
                }
            });
        });

        /*$.jd_confirm({type:"info",message:"确认要删除ID为"+ids.join(",")+"的记录吗？",ok:function(){
            $.jd_ajax({url:"/machine/delete",type:"post",data:{machines:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});*/
    });
    
    $("#modify").click(function(){
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
        var usr_name = $("#table").dataTable().api().row(".selected").data().name;
        var mobile = $("#table").dataTable().api().row(".selected").data().mobile;
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">姓名</label><div class="col-sm-10"><input type="hidden" name="modify_id" value="'+id+'" /><label class="col-sm-2 control-label">' + usr_name + '</label></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">电话</label><div class="col-sm-10"><input type="text" class="form-control" name="mobile" placeholder="电话" value="'+mobile+'"></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");

        var $tmpl = $(modify_tmpl);
        var $modal = $tmpl.jd_modal({title:"修改用户"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/user/update",
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
    
    $("#create").click(function(){
        
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">用户名</label><div class="col-sm-10"><input type="text" class="form-control" name="userName" placeholder="系统内部使用"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">ERP</label><div class="col-sm-10"><input type="text" class="form-control" name="userErp" placeholder="erp(与实际erp账号无关，但系统中必须唯一)"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">权限</label><div class="col-sm-10"><input type="hidden" name="userType" value="0" /><label class="col-sm-4 control-label">值班电话</label></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">部门</label><div class="col-sm-10"><input type="text" class="form-control" name="userDepartment" placeholder="用户所在部门"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">电话</label><div class="col-sm-10"><input type="text" class="form-control" name="userMobile" placeholder="电话"></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");

        var $tmpl = $(modify_tmpl);
        var $modal = $tmpl.jd_modal({title:"新增用户"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/user/create",
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