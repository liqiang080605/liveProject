$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
    	"paging": false,
        "serverSide": true,
        "searching": false,
        "ajax":"/ping/alarmlist",
        "ordering": false,
        "dom": '<"toolbar">frtip',
        "columns": [
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<input type="checkbox" id="'+data+'"></input>';
                        }
                    },
                    { "data": "from_idc"}, 
                    { "data": "dest_idc"},  
                    { "data": "notify_type" ,
                        "render": function ( data, type, full, meta ) {
                            return getNotifyType(data);
                        }
                    },                     
                    { "data": "user_group_info" ,
                        "render": function ( data, type, full, meta ) {
                        	if(null !== data) {
                        		return data.usergroupname;
                        	}
                            return "";
                        }
                    }
        ]
    });

    // 绑定选择事件
    $('#table tbody').on( 'click', 'input:checkbox', function () {
        $(this).parents("tr").toggleClass('selected');
    });

    // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>');

    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = $("#tmpl_create").text();

        var $modal = $(create_tmpl).jd_modal({title:"创建跨机房告警"});
        var $form = $modal ;
        
        $.ajax({
            url:"/ugroup/listAll",
            type:"get",
            //data:options.data
        }).done(function(data){
        	var ulist = data.data;
        	if(null != ulist) {
        		//user_group
        		$modal.find("#user_group_id option").remove();
        		$modal.find("#user_group_id").append("<option value=''>请选择</option>");
        		for (var i=0;i<ulist.length;i++) {
        			$modal.find("#user_group_id").append("<option value='"+ulist[i].id+"'>"+ ulist[i].usergroupname +"</option>");
        		}
        	}
        }).fail(function(data){
        });            
        
        $modal.on("click",".btn.btn-primary",function(){
        	
        	var from_idc = $form.find("#from_idc").val();
        	var dest_idc = $form.find("#dest_idc").val();
        	if(from_idc == dest_idc) {
                $.jd_confirm({type:"error",message:"源机房和目标机房不能相同"});
                return false ;
        	}
        	
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/ping/create",
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
            $.jd_ajax({url:"/ping/delete",type:"post",data:{alarms:ids},ok:function(){
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



});