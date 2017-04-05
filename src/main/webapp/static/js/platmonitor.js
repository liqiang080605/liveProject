function refreshPlatformCount() {
	$.ajax({
        url:"/platmonitor/count",
        type:"get",
        //data:options.data
    }).done(function(data){
    	count = data.data;
    	if(null != count) {
        	document.getElementById("vm_warning").innerHTML = count.vmInfo.warnCount;
        	document.getElementById("vm_critical").innerHTML = count.vmInfo.criticalCount;
        	document.getElementById("vm_handled").innerHTML = count.vmInfo.handledCount;
        	document.getElementById("vm_paused").innerHTML = count.vmInfo.pausedCount;
        	document.getElementById("vm_ok").innerHTML = count.vmInfo.okCount;
        	document.getElementById("vm_unmonitor").innerHTML = count.vmInfo.unmonitorCount;
        	document.getElementById("vm_ungroup").innerHTML = count.vmInfo.ungroupCount;
        	document.getElementById("vm_all").innerHTML = count.vmInfo.allCount;
        	
        	document.getElementById("container_warning").innerHTML = count.containerInfo.warnCount;
        	document.getElementById("container_critical").innerHTML = count.containerInfo.criticalCount;
        	document.getElementById("container_handled").innerHTML = count.containerInfo.handledCount;
        	document.getElementById("container_paused").innerHTML = count.containerInfo.pausedCount;
        	document.getElementById("container_ok").innerHTML = count.containerInfo.okCount;
        	document.getElementById("container_unmonitor").innerHTML = count.containerInfo.unmonitorCount;
        	document.getElementById("container_ungroup").innerHTML = count.containerInfo.ungroupCount;
        	document.getElementById("container_all").innerHTML = count.containerInfo.allCount;
    	}
    	
    }).fail(function(data){
    });  
}

$(function () {

	var meterMap = getMeters();	
	refreshPlatformCount();
	
	window.setAlias = function setAlias(ip, alias) {
    	
    	var modify_tmpl = [
                           '<form class="form-horizontal">',
                           '<div class="form-group"><label class="col-sm-2 control-label">别名</label><div class="col-sm-10"><input type="hidden" name="ip" value="'+ip+'" /><input type="text" class="form-control" name="alias" id="alias" placeholder="IP的别名" value="'+alias+'"></div></div>',
                           '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
                           '</form>',
                       ].join("");

        var $tmpl = $(modify_tmpl);
        var $modal = $tmpl.jd_modal({title:"IP别名修改"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/realtime/ipalias",
                    type:"post",
                    data:$form.serialize(),
                    ok:function(){
                        $modal.data("modal").close();
                    }
                });
            }
        });
    }
	
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

	window.warningList = function warningList(type){
    	//tmpl_detail
		var create_tmpl = $("#warning_alarm").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"warn告警"});
        var $form = $modal ;
        
        var $table = $("#table_warn").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 10,
            "lengthMenu": [ 10, 30, 50, 75, 100 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/warning_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"type":type},
				    "success": fnCallback
				} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.rExt;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },    
                        { "data": "rExt",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
    		            {
    		                "data": "currentAlarmDsc",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	var currentAlarmDsc = data;
                            	if(null != currentAlarmDsc) {
                            		var randomNum = Math.random();
                            		var flagStr = "f" + randomNum;
                            		flagStr = flagStr.replace(".","_");
                            		
                            		
                            		var counter_name = currentAlarmDsc.counter_name;
                            		var spanClass = "badge bg-yellow"
                            		if(counter_name == '连通状态') {
                            			spanClass = "badge bg-red";
                            			msgStr += '<style type="text/css">.ping100 {background-color:#d9534f;}</style><script>$("#' + flagStr + '").parent().parent().addClass("ping100");</script>';
                            		}
                            		var timestamp = currentAlarmDsc.timestamp;
                            		var threshold = currentAlarmDsc.threshold;
                            		var counter_volume = currentAlarmDsc.counter_volume;
                            		var alarm_source = currentAlarmDsc.alarm_source;
                            		var alarm_id =currentAlarmDsc.alarmId;
                            		var meter_key = currentAlarmDsc.meter_key;
                            		
                            		msgStr += '<span title="告警项" class="' + spanClass + '" style="font-size: 20px;font-family: "黑体";">' + counter_name + '</span> '
                            		//msgStr += '<span class="' + spanClass + '">' + counter_name + '</span> '
                            		msgStr += '<span title="告警值" class="badge bg-navy">' + counter_volume + '</span> '
                            		msgStr += '<span title="告警规则" class="badge bg-purple">' + threshold + '</span> '
                            		msgStr += '<span title="发生时间" class="badge bg-light-blue">' + timestamp + '</span> '
                            		msgStr += '<span title="采集点" class="badge bg-navy">' + alarm_source + '</span> ';
                            		msgStr += '<input id="' + flagStr + '" type="hidden" value="" />';
                            		
                            		msgStr += '<a href="javascript:;" onclick="javascript:handleWarningClick(\'' 
                            			       + currentAlarmDsc.ip + '\',\'' + meter_key + '\',\'' + threshold + '\',\'' + alarm_source + '\',\'' + alarm_id
                            		           + '\')"><input name="imgbtn" title="取消handle" type="image" src="static/dist/img/handle.png" border="0"></a>';
                            		msgStr += '<br />';

                            	}
                                return msgStr;
    		                }
    		            }, 
    		            
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },     
                        { "data": "rExt" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        }
            ]
        });
        
        window.handleWarningClick = function handleWarningClick(ip,meter_key,threshold,alarm_source,alarmId) {
    		$.jd_confirm({type:"info",message:"确认要handle该条告警吗？",ok:function(){
                $.jd_ajax({
                    url:"/realtime/handlealarm",
                    type:"post",
                    data:{"ip":ip,"meter_key":meter_key,"threshold":threshold,"alarmSource":alarm_source,"alarmId":alarmId},
                    ok:function(){
                        setTimeout(function(){$table.ajax.reload()},1000);
                        //$table.ajax.reload();
                    }
                });
            }});
    	}
    };
    
	window.criticalList = function criticalList(type){
    	//tmpl_detail
		var create_tmpl = $("#warning_alarm").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"critical告警"});
        var $form = $modal ;
        
        var $table = $("#table_warn").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 10,
            "lengthMenu": [ 10, 30, 50, 75, 100 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/critical_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"type":type},
				    "success": fnCallback
				} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.rExt;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },    
                        { "data": "rExt",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
    		            {
    		                "data": "currentAlarmDsc",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	var currentAlarmDsc = data;
                            	if(null != currentAlarmDsc) {
                            		var randomNum = Math.random();
                            		var flagStr = "f" + randomNum;
                            		flagStr = flagStr.replace(".","_");
                            		
                            		
                            		var counter_name = currentAlarmDsc.counter_name;
                            		var spanClass = "badge bg-yellow"
                            		if(counter_name == '连通状态') {
                            			spanClass = "badge bg-red";
                            			msgStr += '<style type="text/css">.ping100 {background-color:#d9534f;}</style><script>$("#' + flagStr + '").parent().parent().addClass("ping100");</script>';
                            		}
                            		var timestamp = currentAlarmDsc.timestamp;
                            		var threshold = currentAlarmDsc.threshold;
                            		var counter_volume = currentAlarmDsc.counter_volume;
                            		var alarm_source = currentAlarmDsc.alarm_source;
                            		var alarm_id =currentAlarmDsc.alarmId;
                            		var meter_key = currentAlarmDsc.meter_key;
                            		
                            		msgStr += '<span title="告警项" class="' + spanClass + '" style="font-size: 20px;font-family: "黑体";">' + counter_name + '</span> '
                            		//msgStr += '<span class="' + spanClass + '">' + counter_name + '</span> '
                            		msgStr += '<span title="告警值" class="badge bg-navy">' + counter_volume + '</span> '
                            		msgStr += '<span title="告警规则" class="badge bg-purple">' + threshold + '</span> '
                            		msgStr += '<span title="发生时间" class="badge bg-light-blue">' + timestamp + '</span> '
                            		msgStr += '<span title="采集点" class="badge bg-navy">' + alarm_source + '</span> ';
                            		msgStr += '<input id="' + flagStr + '" type="hidden" value="" />';
                            		
                            		msgStr += '<a href="javascript:;" onclick="javascript:handleCriticalClick(\'' 
                            			       + currentAlarmDsc.ip + '\',\'' + meter_key + '\',\'' + threshold + '\',\'' + alarm_source + '\',\'' + alarm_id
                            		           + '\')"><input name="imgbtn" title="handle" type="image" src="static/dist/img/handle.png" border="0"></a>';
                            		msgStr += '<br />';

                            	}
                                return msgStr;
    		                }
    		            }, 
    		            
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },     
                        { "data": "rExt" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        }
            ]
        });
        
        window.handleCriticalClick = function handleCriticalClick(ip,counter_name,threshold,alarm_source,alarmId) {
    		$.jd_confirm({type:"info",message:"确认要handle该条告警吗？",ok:function(){
                $.jd_ajax({
                    url:"/realtime/handlealarm",
                    type:"post",
                    data:{"ip":ip,"meter_key":meter_key,"threshold":threshold,"alarmSource":alarm_source,"alarmId":alarmId},
                    ok:function(){
                        setTimeout(function(){$table.ajax.reload()},1000);
                        //$table.ajax.reload();
                    }
                });
            }});
    	}
    };
    
    window.handledList = function handledList(type){
    	
    	//tmpl_detail
		var create_tmpl = $("#handled_alarm").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"handled告警"});
        var $form = $modal ;
        
        var $table = $("#table_handled").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 10,
            "lengthMenu": [ 10, 30, 50, 75, 100 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/handle_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"type":type},
				    "success": fnCallback
				} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.rExt;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },    
                        { "data": "rExt",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
    		            {
    		                "data": "currentAlarmDsc",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	var currentAlarmDsc = data;
                            	if(null != currentAlarmDsc) {
                            		var randomNum = Math.random();
                            		var flagStr = "f" + randomNum;
                            		flagStr = flagStr.replace(".","_");
                            		
                            		
                            		var counter_name = currentAlarmDsc.counter_name;
                            		var spanClass = "badge bg-yellow"
                            		if(counter_name == '连通状态') {
                            			spanClass = "badge bg-red";
                            			msgStr += '<style type="text/css">.ping100 {background-color:#d9534f;}</style><script>$("#' + flagStr + '").parent().parent().addClass("ping100");</script>';
                            		}
                            		var timestamp = currentAlarmDsc.timestamp;
                            		var threshold = currentAlarmDsc.threshold;
                            		var counter_volume = currentAlarmDsc.counter_volume;
                            		var alarm_source = currentAlarmDsc.alarm_source;
                            		var alarm_id =currentAlarmDsc.alarmId;
                            		var meter_key = currentAlarmDsc.meter_key;
                            		
                            		msgStr += '<span title="告警项" class="' + spanClass + '">' + counter_name + '</span> '
                            		//msgStr += '<span class="' + spanClass + '">' + counter_name + '</span> '
                            		msgStr += '<span title="发生时间" class="badge bg-light-blue">' + timestamp + '</span> '
                            		msgStr += '<span title="告警规则" class="badge bg-purple">' + threshold + '</span> '
                            		msgStr += '<span title="告警值" class="badge bg-navy">' + counter_volume + '</span> '
                            		msgStr += '<span title="采集点" class="badge bg-navy">' + alarm_source + '</span> ';
                            		msgStr += '<input id="' + flagStr + '" type="hidden" value="" />';
                            		msgStr += '<a href="javascript:;" onclick="javascript:cancelHandled(\'' 
                     			       + currentAlarmDsc.ip + '\',\'' + meter_key + '\',\'' + threshold + '\',\'' + alarm_source + '\',\'' + alarm_id
                     		           + '\')"><input name="imgbtn" title="取消handle" type="image" src="static/dist/img/handle.png" border="0"></a>'
                            		
                            		msgStr += '<br />';

                            	}
                                return msgStr;
    		                }
    		            }, 
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },     
                        { "data": "rExt" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        },
    		            {  
                        	"data": "currentAlarmDsc",
                            "defaultContent": "",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">' + data.handleTime + '</span> '
                                    msgStr += '<span class="badge bg-green">'+ data.userErp +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
    		            } 
                        
                        
            ]
        });
        
        window.cancelHandled = function cancelHandled(ip,meter_key,threshold,alarm_source,alarmId) {
    		$.jd_confirm({type:"info",message:"确认要取消handle该条告警吗？",ok:function(){
                $.jd_ajax({
                    url:"/realtime/cancelhandled",
                    type:"post",
                    data:{"ip":ip,"meter_key":meter_key,"threshold":threshold,"alarmSource":alarm_source,"alarmId":alarmId},
                    ok:function(){
                        setTimeout(function(){$table.ajax.reload()},1000);
                        //$table.ajax.reload();
                    }
                });
            }});
    	}
    };
    
    window.pausedList = function pausedList(type){
    	
    	//tmpl_detail
		var create_tmpl = $("#paused_alarm").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"paused告警"});
        var $form = $modal ;
        
        $("#table_paused").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 10,
            "lengthMenu": [ 10, 25, 50, 100 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/pause_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"type":type},
				    "success": fnCallback
				} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.ext_info;
                            	var alias = "";
                            	var idcStr = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },   
                        { "data": "ext_info",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
                        {  
                        	"data": "alarmName",
                        	"render": function ( data, type, full, meta ) {
                            	return getMeterName(meterMap, data);
                            }
    		            },
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },
    		            { "data": "ext_info" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        },
    		            {
    		                "data": "startTime",
    		                "defaultContent": "",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            }, 
    		            {  
                        	"data": "endTime",
                        	"defaultContent": "",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            },
    		            {  
                        	"data": "reason",
                        	"defaultContent": "",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-navy">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            },
    		            {  
                        	"data": "userErp",
                            "defaultContent": "",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-yellow">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            } 
            ]
        });
    };

    window.allList = function allList(type){
		
		//tmpl_detail
		var create_tmpl = $("#all_resource").text();
	
	    var $modal = $(create_tmpl).jd_modal_large({title:"所有资源"});
	    var $form = $modal ;
	    
	    $("#table_all").DataTable({
	    	"serverSide": true,
	        "searching": true,
	        "select": true,
	        "pageLength": 1,
	        "lengthMenu": [ 1, 10, 15, 20, 25 ],
	        //"ajax":"/platmonitor/warning_list/",
	        "sAjaxSource": "/platmonitor/all_list/",
	        "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"type":type},
				    "success": fnCallback
				} );
	        },
	        "ordering": false,
	        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
	        "columns": [
	                    { "data": "ip" ,
	                        "render": function ( data, type, full, meta ) {
	                        	var extObj = full.ext_info;
	                        	var alias = "";
	                        	var idcStr = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
	                            //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
	                        }
	                    },    
	                    { "data": "ext_info",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
	                    {  
	                    	"data": "meterName",
	                    	"render": function ( data, type, full, meta ) {
	                    		var alarmName = getMeterName(meterMap, data);
                        		var msgStr = '<span class="badge bg-yellow">' + alarmName + '</span> '
                            	return msgStr;
	                        }
			            },
			            {
			                "data": "status",
			                "render": function ( data, type, full, meta ) {
			                	if(data != "OK") {
			                		var msgStr = "" ;
			                		msgStr += '<span title="状态" class="badge bg-red">' + data + '</span> ';
			                		msgStr += "<br/>";
			                		return msgStr;
			                	}
			                	
			                	return data;
	                        }
			            }, 
			            {  
	                    	"data": "time",
	                    	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-blue">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
			            },
			            {
			                "data": "details",
			                "defaultContent": "",
			                "render": function ( data, type, full, meta ) {
			                    var msgStr = "" ;
			                    if(null != data) {
				                    for(var i=0;i<data.length;i++){
				                    	if(i==0) {
				                    		msgStr += '<span class="badge bg-green-gradient">' + data[i] + '</span> '
				                    	} else {
				                    		msgStr += '<span class="badge bg-red">' + "用户配置的阈值： " + data[i] + '</span> '
				                    	}
				                        if(i != data.length - 1){
				                            msgStr += "<br/>"
				                        }
				                    }
			                    }
			                    return msgStr;
			                }
			            },
			            {
			                "data": "ip_info_list",
			                "defaultContent": "",
			                "render": function ( data, type, full, meta ) {
			                    var msgStr = "" ;
			                    if(null != data) {
				                    for(var i=0;i<data.length;i++){
				                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
				                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
				                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
				                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
				                        if(i != data.length - 1){
				                            msgStr += "<br/>"
				                        }
				                    }
			                    }
			                    return msgStr;
			                }
			            },   
			            {
			                "data": "group_info_list",
			                "defaultContent": "",
			                "render": function ( data, type, full, meta ) {
			                	var alarm_type=full.meterName;
			                    var msgStr = "" ;
			                    if(null != data) {
				                    for(var i=0;i<data.length;i++){
				                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
				                        
				                        if(data[i].firstName != null && data[i].firstName != "") {
				                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
				                        } else {
				                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
				                        }
				                        
				                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
				                        
				                        if(data[i].secondName != null && data[i].secondName != "") {
				                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
				                        }
				                        
				                        if(data[i].thirdName != null && data[i].thirdName != "") {
				                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
				                        }
				                        
				                        var cond;
				                        var threshold = data[i].meterThresholdMap[alarm_type];
				                        
				                        if(threshold != null && threshold != "") {
				                        	strs=threshold.split("_");
				                        	if(strs[0] == "lt") {
				                        		cond="小于";
				                        	} else if (strs[0] == "eq"){
				                        		cond="等于";
				                        	} else {
				                        		cond="大于";
				                        	}
				                        	msgStr += '<span title="阈值" class="badge bg-red">' + cond + " " + strs[1] + '</span> '
				                        }
				                        
				                        if(i != data.length - 1){
				                            msgStr += "<br/>"
				                        }
				                    }
			                    }
			                    return msgStr;
			                }
			            },
			            { "data": "ext_info" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        }
			        ]
	    	});
	    };
    
    window.unmonitorList = function unmonitorList(type){
    	
    	//tmpl_detail
    	var create_tmpl = $("#unmonitor_resource").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"未监控资源"});
        var $form = $modal ;
        
        $("#table_all").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 15,
            "lengthMenu": [ 15, 30, 50, 75, 100 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/unmonitor_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
    			$.ajax( {
    			    "dataType": 'json',
    				"type": "POST",
    				"url": sSource,
    				"data": {"aodata":aoData,"type":type},
    			    "success": fnCallback
    			} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.ext_info;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },    
                        { "data": "ext_info",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },
    		            { "data": "ext_info" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        }
            ]
        });
    };
    
    window.ungroupList = function ungroupList(type){
    	
    	//tmpl_detail
    	var create_tmpl = $("#ungroup_resource").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"未分组监控资源"});
        var $form = $modal ;
        
        $("#table_all").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 1,
            "lengthMenu": [ 1, 10, 15, 20, 25 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/ungroup_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
    			$.ajax( {
    			    "dataType": 'json',
    				"type": "POST",
    				"url": sSource,
    				"data": {"aodata":aoData,"type":type},
    			    "success": fnCallback
    			} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.ext_info;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },    
                        { "data": "ext_info",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
                        {  
                        	"data": "meterName",
                        	"render": function ( data, type, full, meta ) {
	                    		var alarmName = getMeterName(meterMap, data);
                        		var msgStr = '<span class="badge bg-yellow">' + alarmName + '</span> '
                            	return msgStr;
                            }
    		            },
    		            {
    		                "data": "status",
    		                "render": function ( data, type, full, meta ) {
    		                	if(data != "OK") {
    		                		var msgStr = "" ;
    		                		msgStr += '<span title="状态" class="badge bg-red">' + data + '</span> ';
    		                		msgStr += "<br/>";
    		                		return msgStr;
    		                	}
    		                	
    		                	return data;
                            }
    		            }, 
    		            {  
                        	"data": "time",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-blue">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            },
    		            {
			                "data": "details",
			                "defaultContent": "",
			                "render": function ( data, type, full, meta ) {
			                    var msgStr = "" ;
			                    if(null != data) {
				                    for(var i=0;i<data.length;i++){
				                    	if(i==0) {
				                    		msgStr += '<span class="badge bg-green-gradient">' + data[i] + '</span> '
				                    	} else {
				                    		msgStr += '<span class="badge bg-red">' + "用户配置的阈值： " + data[i] + '</span> '
				                    	}
				                        if(i != data.length - 1){
				                            msgStr += "<br/>"
				                        }
				                    }
			                    }
			                    return msgStr;
			                }
			            },
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },
    		            { "data": "ext_info" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        },
            ]
        });
    };
    
    window.okList = function okList(type){
    	
    	//tmpl_detail
    	var create_tmpl = $("#ok_resource").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"OK资源"});
        var $form = $modal ;
        
        $("#table_all").DataTable({
        	"serverSide": true,
            "searching": true,
            "select": true,
            "pageLength": 1,
            "lengthMenu": [ 1, 10, 15, 20, 25 ],
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/platmonitor/ok_list/",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
    			$.ajax( {
    			    "dataType": 'json',
    				"type": "POST",
    				"url": sSource,
    				"data": {"aodata":aoData,"type":type},
    			    "success": fnCallback
    			} );
            },
            "ordering": false,
            "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
            "columns": [
                        { "data": "ip" ,
                            "render": function ( data, type, full, meta ) {
                            	var extObj = full.ext_info;
                            	var idcStr = "";
                            	var alias = "";
                            	if(null != extObj) {
                            		idcStr = extObj.idc;
                            		alias = extObj.alias;
                            	}
                            	if(alias == null) {
                            		alias = "";
                            	}
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                                //return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                            }
                        },   
                        { "data": "ext_info",
                        	"render": function ( data, type, full, meta ) {
                            	var extObj = data;
                            	if(null != extObj) {
                            		return extObj.service_type
                            	}
                                return "";
                            }
    		            },
                        {  
                        	"data": "meterName",
                        	"render": function ( data, type, full, meta ) {
	                    		var alarmName = getMeterName(meterMap, data);
                        		var msgStr = '<span class="badge bg-yellow">' + alarmName + '</span> '
                            	return msgStr;
                            }
    		            },
    		            {
    		                "data": "status",
    		                "render": function ( data, type, full, meta ) {
    		                	if(data != "OK") {
    		                		var msgStr = "" ;
    		                		msgStr += '<span title="状态" class="badge bg-red">' + data + '</span> ';
    		                		msgStr += "<br/>";
    		                		return msgStr;
    		                	}
    		                	
    		                	return data;
                            }
    		            }, 
    		            {  
                        	"data": "time",
                        	"render": function ( data, type, full, meta ) {
                        		var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-blue">' + data + '</span> '
                            	}	
                            	return msgStr;
                            }
    		            },
    		            {
			                "data": "details",
			                "defaultContent": "",
			                "render": function ( data, type, full, meta ) {
			                    var msgStr = "" ;
			                    if(null != data) {
				                    for(var i=0;i<data.length;i++){
				                    	if(i==0) {
				                    		msgStr += '<span class="badge bg-green-gradient">' + data[i] + '</span> '
				                    	} else {
				                    		msgStr += '<span class="badge bg-red">' + "用户配置的阈值： " + data[i] + '</span> '
				                    	}
				                        if(i != data.length - 1){
				                            msgStr += "<br/>"
				                        }
				                    }
			                    }
			                    return msgStr;
			                }
			            },
    		            {
    		                "data": "ip_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
    			                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
    			                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
    			                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },   
    		            {
    		                "data": "group_info_list",
    		                "defaultContent": "",
    		                "render": function ( data, type, full, meta ) {
    		                    var msgStr = "" ;
    		                    if(null != data) {
    			                    for(var i=0;i<data.length;i++){
    			                    	msgStr += '<span title="分组名" class="badge bg-blue-gradient">' + data[i].groupname + '</span> '
    			                        
    			                        if(data[i].firstName != null && data[i].firstName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].firstName == null?"":data[i].firstName) + (data[i].firstErp == null?"":'（' + data[i].firstErp + '）') + ' ' + (data[i].firstMobile == null?"":data[i].firstMobile) + '</span> '
    			                        } else {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + ' ' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        }
    			                        
    			                        //msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
    			                        
    			                        if(data[i].secondName != null && data[i].secondName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].secondName == null?"":data[i].secondName) + (data[i].secondErp == null?"":'（' + data[i].secondErp + '）') + ' ' + (data[i].secondMobile == null?"":data[i].secondMobile) + '</span> '
    			                        }
    			                        
    			                        if(data[i].thirdName != null && data[i].thirdName != "") {
    			                        	msgStr += '<span title="姓名+ERP+电话" class="badge bg-navy">' + (data[i].thirdName == null?"":data[i].thirdName) + (data[i].thirdErp == null?"":'（' + data[i].thirdErp + '）') + ' ' + (data[i].thirdMobile == null?"":data[i].thirdMobile) + '</span> '
    			                        }
    			                        //msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
    			                        //msgStr += '<span title="邮箱" class="badge bg-purple-gradient">' + (data[i].email == null?"":data[i].email) + '</span> '
    			                        if(i != data.length - 1){
    			                            msgStr += "<br/>"
    			                        }
    			                    }
    		                    }
    		                    return msgStr;
    		                }
    		            },
    		            { "data": "ext_info" ,
                            "render": function ( data, type, full, meta ) {
                            	var msgStr = '';
                            	if(null != data) {
                                	msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                    msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
                            		msgStr += '</span>'
                            	}	
                            	return msgStr;
                            }
                        },
	            ]
	    });
	};
    
	setInterval(function(){refreshPlatformCount()},30000);
	
});
