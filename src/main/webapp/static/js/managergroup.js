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
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/managergroup/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '"></input><input type="hidden" id="' + data + 
                    '_gname" value="' + full.groupname + '"></input><input type="hidden" id="'+data+
                    '_userErp" value="'+full.userErp+'"></input><input type="hidden" id="' + data +
                    '_userId" value="'+full.user_id+'"></input><input type="hidden" id="' + data + 
                    '_shareUserGroupName" value="'+full.shareUserGroupName+'"></input><input type="hidden" id="'+data+
                    '_firstContact" value="'+full.first_contact+'"></input><input type="hidden" id="'+data+
                    '_secondContact" value="'+full.second_contact+'"></input><input type="hidden" id="'+data+
                    '_thirdContact" value="'+full.third_contact+'"></input>';
                }
            },
            {"data": "groupname"},
            {
            	"data": "userErp"
            },
            {"data": "shareUserGroupName"},
            {"data": "create_time"},
            {"data": "update_time"},
            {
                "data": "id",
                "render": function ( data, type, full, meta ) {
                    return '<a class="margin" href="/gresource/'+ data +'">资源管理</a><a class="margin" href="/galarm/'+ data +'">告警管理</a>';
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
    //.append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
    .append('<button class="btn btn-flat bg-blue margin" id="update">分组修改</button>')
        //.append('<button class="btn btn-flat bg-blue margin" id="modify">分组联系人修改</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">分组删除</button>')
        /*.append('<button class="btn btn-flat bg-blue margin" id="resource">分组资源管理</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="alarm">分组告警管理</button>');*/

    $("#update").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked");
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要转让的记录"});
            return false ;
        }
        
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行转让"});
            return false ;
        }

        var id = checked_trs.get(0).id ;
        var shareGroupId = $("#table").dataTable().api().row(".selected").data().share_group_id;
        var gname = $("#" + id + "_gname").val();
        var userErp = $("#" + id + "_userErp").val()
        var userId = $("#" + id + "_userId").val()
        var shareUserGroupName = $("#" + id + "_shareUserGroupName").val()
        var firstContact = $("#" + id + "_firstContact").val();
        var secondContact = $("#" + id + "_secondContact").val();
        var thirdContact = $("#" + id + "_thirdContact").val();
        
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组名</label><div class="col-sm-10"><input type="hidden" id="gid" name="gid" value="'+id+'" /><input type="text" class="form-control" name="groupname"  placeholder="分组名" onkeyup="validate(this)" value="'+gname+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组所属人ERP</label><div class="col-sm-10"><input type="hidden" id="user_id" name="user_id" value="'+userId+'" /><input type="text" class="form-control" name="userErp" id="userErp" placeholder="分组所属人ERP" value="'+userErp+'" onkeyup="userGroupSearch()"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">共享给</label><div class="col-sm-10"><select class="form-control" name="share_group_id" id="share_group_id" placeholder="联系人分组"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第一联系人</label><div class="col-sm-10"><select class="form-control" name="first_contact" id="first_contact" placeholder="第一联系人"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第二联系人</label><div class="col-sm-10"><select class="form-control" name="second_contact" id="second_contact" placeholder="第二联系人"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第三联系人</label><div class="col-sm-10"><select class="form-control" name="third_contact" id="third_contact" placeholder="第三联系人"></select></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");     
        //var $tmpl = $(modify_tmpl).find("select[name='share_group_id']").append($("#tmpl_level").html()).val(shareGroupId).end();
        var $modal = $(modify_tmpl).jd_modal({title:"转让分组"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form_group($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/managergroup/update",
                    type:"post",
                    data:$form.serialize(),
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
            }
        });
        
        window.loadContact = function loadContact(){
        	var userGroupId = $(this).children('option:selected').val();
        	
        	if(userGroupId == null) {
        		userGroupId = shareGroupId;
        	}
        	
        	$.ajax({
                url:"/group/share_contacts",
                type:"post",
                data:{"userGroupId":userGroupId},
            }).done(function(data){
            	
            	$modal.find("#first_contact option").remove();
            	$modal.find("#second_contact option").remove();
            	$modal.find("#third_contact option").remove();
            	$modal.find("#first_contact").append("<option value=''>请选择</option>");
            	$modal.find("#second_contact").append("<option value=''>请选择</option>");
				$modal.find("#third_contact").append("<option value=''>请选择</option>");
				
            	ulist = data.data;
            	selfUser = data.selfData;
            	if(ulist.length == 0) {
            		$modal.find("#first_contact").append("<option value='"+selfUser.id+"'>"+ selfUser.name + "</option>");
            	} else {
            		for (var i=0;i<ulist.length;i++) {
    					$modal.find("#first_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#second_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#third_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    				}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == firstContact){
            				$modal.find("#first_contact").val(firstContact).end();
            				break;
            			}
            			
            			if(ulist[i].id == selfUser.id) {
            				$modal.find("#first_contact").val(selfUser.id).end();
            			}
            		}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == secondContact){
            				$modal.find("#second_contact").val(secondContact).end();
            				break;
            			}
            		}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == thirdContact){
            				$modal.find("#third_contact").val(thirdContact).end();
            				break;
            			}
            		}
            	}
            	
            }).fail(function(data){
            });
		};
        
        $.ajax({
            url:"/managergroup/ugroup",
            type:"post",
            data:{"erp":userErp}
        }).done(function(data){
            var groupList = data.data;
            $modal.find("#share_group_id option").remove();
            $modal.find("#share_group_id").append("<option value=''>请选择</option>");
            if(null != groupList) {
        		//user_group
        		$modal.find("#share_group_id option").remove();
        		$modal.find("#share_group_id").append("<option value=''>请选择</option>");
        		for (var i=0;i<groupList.length;i++) {
        			$modal.find("#share_group_id").append("<option value='"+groupList[i].id+"'>"+ groupList[i].usergroupname + "</option>");
        		}
        		if(shareGroupId != 0) {
        			$modal.find("#share_group_id").val(shareGroupId).end();
        		}
        	}
            
        }).fail(function(data){
        });  
        
        loadContact();
		$modal.on("change", "#share_group_id", function() {

        	var userGroupId = $(this).children('option:selected').val();
        	
        	$.ajax({
                url:"/group/share_contacts",
                type:"post",
                data:{"userGroupId":userGroupId},
            }).done(function(data){
            	
            	$modal.find("#first_contact option").remove();
            	$modal.find("#second_contact option").remove();
            	$modal.find("#third_contact option").remove();
            	$modal.find("#first_contact").append("<option value=''>请选择</option>");
            	$modal.find("#second_contact").append("<option value=''>请选择</option>");
				$modal.find("#third_contact").append("<option value=''>请选择</option>");
				
            	ulist = data.data;
            	selfUser = data.selfData;
            	if(ulist.length == 0) {
            		$modal.find("#first_contact").append("<option value='"+selfUser.id+"'>"+ selfUser.name + "</option>");
            	} else {
            		for (var i=0;i<ulist.length;i++) {
    					$modal.find("#first_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#second_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#third_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    				}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == firstContact){
            				$modal.find("#first_contact").val(firstContact).end();
            				break;
            			}
            			
            			if(ulist[i].id == selfUser.id) {
            				$modal.find("#first_contact").val(selfUser.id).end();
            			}
            		}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == secondContact){
            				$modal.find("#second_contact").val(secondContact).end();
            				break;
            			}
            		}
            		
            		for (var i=0; i< ulist.length; i++) {
            			if(ulist[i].id == thirdContact){
            				$modal.find("#third_contact").val(thirdContact).end();
            				break;
            			}
            		}
            	}
            	
            }).fail(function(data){
            });
		});
        
        window.userGroupSearch = function userGroupSearch() {
			var v = $modal.find("#userErp").val();
			$modal.find("#share_group_id option").remove();
			
			if(v == userErp) {
				$.ajax({
					url:"/managergroup/ugroup",
					type:"post",
					data:{"erp":v}
				}).done(function(data){
					var groupList = data.data;
					$modal.find("#share_group_id option").remove();
					$modal.find("#share_group_id").append("<option value=''>请选择</option>");
					if(null != groupList) {
						//user_group
						$modal.find("#share_group_id option").remove();
						$modal.find("#share_group_id").append("<option value=''>请选择</option>");
						for (var i=0;i<groupList.length;i++) {
							$modal.find("#share_group_id").append("<option value='"+groupList[i].id+"'>"+ groupList[i].usergroupname + "</option>");
						}
					}
					
				}).fail(function(data){
				});  
			} else {
				$modal.find("#share_group_id").append("<option value=''>请选择</option>");
				$modal.find("#first_contact option").remove();
            	$modal.find("#second_contact option").remove();
            	$modal.find("#third_contact option").remove();
            	$modal.find("#first_contact").append("<option value=''>请选择</option>");
            	$modal.find("#second_contact").append("<option value=''>请选择</option>");
				$modal.find("#third_contact").append("<option value=''>请选择</option>");
			}
		}
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
            $.jd_ajax({url:"/managergroup/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
    });
    
    $("input[type=search]").attr("placeholder", "依据分组名或IP查询"); 

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