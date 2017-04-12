$(function () {
	window.validate = function validate(obj) {
		if(event.keyCode==188 || event.keyCode==187 || event.keyCode == 219 || event.keyCode == 221){
			obj.value=obj.value.substring(0,obj.value.length-1);
		}
    }
	
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": false,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/liver/console/hospitalManager/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
        	{
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '"></input><input type="hidden" id="' + data +
                    '_name" value="' + full.name + '"></input><input type="hidden" id="'+data+
                    '_province" value="'+full.province+'"></input><input type="hidden" id="'+data+
                    '_city" value="'+full.city+'"></input><input type="hidden" id="'+data+
                    '_county" value="'+full.county+'"></input><input type="hidden" id="'+data+
                    '_address" value="'+full.address+'"></input>';
                }
            },
            {"data": "name"},
            {"data": "doctor_num"},
            {"data": "province"},
            {"data": "city"},
            {"data": "county"},
            {"data": "address"},
            {"data": "create_date"},
            {"data": "update_date"}
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
    .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>')
    
    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">名称</label><div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="名称(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">省</label><div class="col-sm-10"><input type="text" class="form-control" name="province" placeholder="名称(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">市</label><div class="col-sm-10"><input type="text" class="form-control" name="city" placeholder="名称(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">县/区</label><div class="col-sm-10"><input type="text" class="form-control" name="county" placeholder="名称(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">地址</label><div class="col-sm-10"><input type="text" class="form-control" name="address" placeholder="名称(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");
        
        var $modal = $(create_tmpl).jd_modal({title:"添加医院"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form_group($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/liver/console/hospitalManager/create",
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
        var name = $("#" + id + "_name").val();
        var province = $("#" + id + "_province").val();
        var city = $("#" + id + "_city").val();
        var county = $("#" + id + "_county").val();
        var address = $("#" + id + "_address").val();
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">名称</label><div class="col-sm-10"><input type="hidden" id="hid" name="id" value="'+id+'" /><input type="text" class="form-control" onkeyup="validate(this)" name="name" placeholder="名称" value="'+name+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">省</label><div class="col-sm-10"><input type="text" class="form-control" onkeyup="validate(this)" name="province" placeholder="省" value="'+province+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">市</label><div class="col-sm-10"><input type="text" class="form-control" onkeyup="validate(this)" name="city" placeholder="市" value="'+city+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">县/区</label><div class="col-sm-10"><input type="text" class="form-control" onkeyup="validate(this)" name="county" placeholder="县/区" value="'+county+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">地址</label><div class="col-sm-10"><input type="text" class="form-control" onkeyup="validate(this)" name="address" placeholder="地址" value="'+address+'"></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");

        var $modal = $(modify_tmpl).jd_modal({title:"修改医院"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form_group($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/liver/console/hospitalManager/update",
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
        var checked_trs = $("#table tbody").find("input:checkbox:checked")
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要删除的记录"});
            return false ;
        }

        var ids = [] ;
        for(var i=0; i<checked_trs.size(); i++){
            ids.push(checked_trs.get(i).id) ;
        }

        $.jd_confirm({type:"info",message:"确认要删除ID为"+ids.join(",")+"的记录吗？",ok:function(){
            $.jd_ajax({url:"/liver/console/hospitalManager/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
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
    
    function validate_create_form_group($form){
        var has_error = false ;
        $form.find("input").each(function(){
        	var val = $(this).val();
            if(val == "" || val.indexOf(",") > -1 || val.indexOf("=") > -1 || val.indexOf("{") > -1 || val.indexOf("}") > -1){
                $(this).parent().addClass("has-error");
                has_error = true ;
            }
        });
        return has_error;
    }
});