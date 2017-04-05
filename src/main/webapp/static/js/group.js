$(function () {
	var meterMap = getMeters();	
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
        "ajax":"/group/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '"></input><input type="hidden" id="' + data +
                    '_gname" value="' + full.groupname + '"></input><input type="hidden" id="'+data+
                    '_userErp" value="'+full.userErp+'"></input><input type="hidden" id="'+data+
                    '_firstContact" value="'+full.first_contact+'"></input><input type="hidden" id="'+data+
                    '_secondContact" value="'+full.second_contact+'"></input><input type="hidden" id="'+data+
                    '_thirdContact" value="'+full.third_contact+'"></input>';
                }
            },
            {"data": "groupname"},
            {"data": "share_group_id",
                "render": function (data, type, full, meta) {
                    if(data == 0){
                        return "";
                    }else{
                        return $("<select></select>").append($("#tmpl_level").html()).find("option[value='"+data+"']").text()
                    }

                }
            },
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
    .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
    .append('<button class="btn btn-flat bg-blue margin" id="update">修改</button>')
        //.append('<button class="btn btn-flat bg-blue margin" id="batch">批量导入</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="pauseAlarm" name="pauseAlarm">暂停告警监控</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="resumeAlarm" name="resumeAlarm">恢复告警监控</button>')
        /*.append('<button class="btn btn-flat bg-blue margin" id="resource">分组资源管理</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="alarm">分组告警管理</button>');*/

    $("[name='pauseAlarm']").click(function(){
    	
    	//tmpl_detail
		var create_tmpl = $("#pause_alarm").text();

        var $modal = $(create_tmpl).jd_modal({title:"暂停告警变更"});
        var $form = $modal ;
        
        
        $("#pause_alarm_meters").empty();
        $("#pause_alarm_meters").append('<p><input type="checkbox" name="selectAllAlarm" id="selectAllAlarm" onclick="selectAlarm()"/><label for="selectAllAlarm">&nbsp;全选</label></p>');
        
        
        var idx = 0;
		for(var prop in meterMap){
			if(idx == 0) {
				$("#pause_alarm_meters").append('<p>');
			} 
			idx ++;
		    if(meterMap.hasOwnProperty(prop)){
		    	var meter_name_val = meterMap[prop]["meter_name"];
		    	$("#pause_alarm_meters").append('<input type="checkbox" id="'+prop+'" name="alarmName" value="'+prop+'" />&nbsp;<label for="'+prop+'">'+meter_name_val + '</label>&nbsp;&nbsp;&nbsp;&nbsp;');
		    }
			if(idx == 3) {
				$("#pause_alarm_meters").append('</p>');
				idx = 0;
			} 
		}
		$("#pause_alarm_meters").append('</p>');
        
        
        window.selectAlarm = function selectAlarm()
    	{
    		var checklist = document.getElementsByName ("alarmName");
    	    if(document.getElementById("selectAllAlarm").checked)
    	    {
    		    for(var i=0;i<checklist.length;i++)
    		    {
    		        checklist[i].checked = 1;
    		    } 
    		}else{
    		    for(var j=0;j<checklist.length;j++)
    		    {
    		       checklist[j].checked = 0;
    		    }
    	    }
    	}
        
        $modal.on("click",".btn.btn-primary",function(){
        	if($("#resumeTime").val() == "") {
        		alert("请填写结束时间。");
        		return false;
        	}
        	
            // 判断是否有错误
            $.jd_ajax({
                url:"/group/pausealarm",
                type:"post",
                data:$form.serialize(),
                ok:function(){
                    $modal.data("modal").close();
                    $table.ajax.reload();
                }
            });
            
        });
    });
    
    $("[name='resumeAlarm']").click(function(){
    	
    	//tmpl_detail
		var create_tmpl = $("#resume_alarm").text();

        var $modal = $(create_tmpl).jd_modal({title:"恢复告警监控"});
        var $form = $modal ;
        
        $("#resume_alarm_meters").empty();
        $("#resume_alarm_meters").append('<p><input type="checkbox" name="resumeSelectAllAlarm" checked="true" id="resumeSelectAllAlarm" onclick="resumeSelectAlarm()"/><label for="resumeSelectAllAlarm">&nbsp;全选</label></p>');        
        
        var idx = 0;
		for(var prop in meterMap){
			if(idx == 0) {
				$("#resume_alarm_meters").append('<p>');
			} 
			idx ++;
		    if(meterMap.hasOwnProperty(prop)){
		    	var meter_name_val = meterMap[prop]["meter_name"];
		    	$("#resume_alarm_meters").append('<input type="checkbox" id="'+prop+'" name="resumeAlarmName" checked="true" value="'+prop+'" />&nbsp;<label for="'+prop+'">'+meter_name_val + '</label>&nbsp;&nbsp;&nbsp;&nbsp;');
		    }
			if(idx == 3) {
				$("#resume_alarm_meters").append('</p>');
				idx = 0;
			} 
		}
		$("#resume_alarm_meters").append('</p>');        
        
        
        window.resumeSelectAlarm = function resumeSelectAlarm()
    	{
    		var checklist = document.getElementsByName ("resumeAlarmName");
    	    if(document.getElementById("resumeSelectAllAlarm").checked)
    	    {
    		    for(var i=0;i<checklist.length;i++)
    		    {
    		        checklist[i].checked = 1;
    		    } 
    		}else{
    		    for(var j=0;j<checklist.length;j++)
    		    {
    		       checklist[j].checked = 0;
    		    }
    	    }
    	}
        
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            $.jd_ajax({
                url:"/group/resumealarm",
                type:"post",
                data:$form.serialize(),
                ok:function(){
                    $modal.data("modal").close();
                    $table.ajax.reload();
                }
            });
            
        });
    });
        
    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">分组名</label><div class="col-sm-10"><input type="text" class="form-control" name="groupname" placeholder="分组名(不能包含,={}特殊符号)" onkeyup="validate(this)" value=""></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">共享给</label><div class="col-sm-10"><select class="form-control" name="share_group_id" id="share_group_id" placeholder="联系人分组"></select></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">第一联系人</label><div class="col-sm-10"><select class="form-control" name="first_contact" id="first_contact" placeholder="第一联系人"></select></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">第二联系人</label><div class="col-sm-10"><select class="form-control" name="second_contact" id="second_contact" placeholder="第二联系人"></select></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">第三联系人</label><div class="col-sm-10"><select class="form-control" name="third_contact" id="third_contact" placeholder="第三联系人"></select></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");
        
        var $tmpl = $(create_tmpl).find("select[name='share_group_id']").append($("#tmpl_level").html()).end();
        var $modal = $tmpl.jd_modal({title:"创建分组"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form_group($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/group/create",
                    type:"post",
                    data:$form.serialize(),
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
            }
        });
        
        $modal.find("#first_contact option").remove();
    	$modal.find("#second_contact option").remove();
    	$modal.find("#third_contact option").remove();
    	$modal.find("#first_contact").append("<option value=''>请选择</option>");
    	$modal.find("#second_contact").append("<option value=''>请选择</option>");
		$modal.find("#third_contact").append("<option value=''>请选择</option>");
        
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
            	dutyUser = data.dutyData;
            	
            	if(ulist.length == 0) {
            		$modal.find("#first_contact").append("<option value='"+selfUser.id+"'>"+ selfUser.name + "</option>");
            	} else {
            		for (var i=0;i<ulist.length;i++) {
    					$modal.find("#first_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#second_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    					$modal.find("#third_contact").append("<option value='"+ulist[i].id+"'>"+ ulist[i].name + "</option>");
    				}
            		
            		if(dutyUser != null) {
            			$modal.find("#first_contact").val(dutyUser.id).end();
            		} else {
            			for (var i=0; i< ulist.length; i++) {
            				
            				
            				if(ulist[i].id == selfUser.id) {
            					$modal.find("#first_contact").val(selfUser.id).end();
            				}
            			}
            		}
            	}
            	
            }).fail(function(data){
            });
        	
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
        var shareGroupId = $("#table").dataTable().api().row(".selected").data().share_group_id;
        var gname = $("#" + id + "_gname").val();
        var userErp = $("#" + id + "_userErp").val();
        var firstContact = $("#" + id + "_firstContact").val();
        var secondContact = $("#" + id + "_secondContact").val();
        var thirdContact = $("#" + id + "_thirdContact").val();
        var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组名</label><div class="col-sm-10"><input type="hidden" id="gid" name="gid" value="'+id+'" /><input type="text" class="form-control" onkeyup="validate(this)" name="groupname" placeholder="分组名" value="'+gname+'"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">分组所属人ERP</label><div class="col-sm-10"><input type="text" class="form-control" name="userErp" id="userErp" placeholder="分组所属人ERP" value="'+userErp+'" onkeyup="userGroupSearch()"></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">共享给</label><div class="col-sm-10"><select class="form-control" name="share_group_id" id="share_group_id" placeholder="联系人分组"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第一联系人</label><div class="col-sm-10"><select class="form-control" name="first_contact" id="first_contact" placeholder="第一联系人"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第二联系人</label><div class="col-sm-10"><select class="form-control" name="second_contact" id="second_contact" placeholder="第二联系人"></select></div></div>',
                           '<div class="form-group"><label class="col-sm-2 control-label">第三联系人</label><div class="col-sm-10"><select class="form-control" name="third_contact" id="third_contact" placeholder="第三联系人"></select></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");

        var $tmpl = $(modify_tmpl).find("select[name='share_group_id']").append($("#tmpl_level").html()).val(shareGroupId).end();
        var $modal = $tmpl.jd_modal({title:"修改分组"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form_group($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/group/update",
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
            $.jd_ajax({url:"/group/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
    });
    
    $("input[type=search]").attr("placeholder", "依据分组名或IP查询"); 

    /*$("#resource").click(function(){
        $("#table tbody").find("input:checkbox:checked")
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        window.location = "/gresource/"+ checked_trs.get(0).id

    });
    

    $("#alarm").click(function(){
        $("#table tbody").find("input:checkbox:checked")
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        window.location = "/galarm/"+ checked_trs.get(0).id
    });*/

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