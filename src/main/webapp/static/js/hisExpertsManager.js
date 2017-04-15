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
        "ajax":"/liver/console/hisExpertsManager/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
        	{
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '"></input><input type="hidden" id="' + data +
                    '_name" value="' + full.name + '"></input><input type="hidden" id="'+data+
                    '_title" value="'+full.title+'"></input><input type="hidden" id="'+data+
                    '_level" value="'+full.level+'"></input><input type="hidden" id="'+data+
                    '_detail" value="'+full.detail+'"></input>';
                }
            },
            {"data": "name"},
            {"data": "title"},
            {"data": "level"},
            {"data": "detail"},
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
    .append('<button class="btn btn-flat bg-blue margin" id="update">转为当前库</button>')
    
    $("#update").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked")
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要转到当前库的记录"});
            return false ;
        }

        var ids = [] ;
        for(var i=0; i<checked_trs.size(); i++){
            ids.push(checked_trs.get(i).id) ;
        }

        $.jd_confirm({type:"info",message:"确认要将ID为"+ids.join(",")+"转到当前库吗？",ok:function(){
            $.jd_ajax({url:"/liver/console/hisExpertsManager/update_current",type:"post",data:{ids:ids},ok:function(){
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