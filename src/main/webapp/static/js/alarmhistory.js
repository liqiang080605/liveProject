$(function () {
	var meterMap = getMeters();	
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "serverSide": true,
        "searching": true,
        "ajax":"/alarmhistory/history/",
        "ordering": false,
        "dom": '<"toolbar">frtip',
        "columnDefs": [
                       {                              
                         "defaultContent": "",
                         "targets": "_all"
                       }
                     ],          
        "columns": [
                    { "data": "ip" ,
                        "render": function ( data, type, full, meta ) {
                        	var extObj = full.rExt;
                        	var idcStr = "";
                        	if(null != extObj) {
                        		idcStr = extObj.idc;
                        	}
                            return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                        }
                    }, 
                    { "data": "type",
                    	"render": function ( data, type, full, meta ) {
		                    var msgStr = "" ;
		                    if(data == "0") {
		                    	msgStr = "物理机";
		                    }
		                    if(data == "1") {
		                    	msgStr = "容器";
		                    }
		                    return msgStr;
		                }
                    },
		            { "data": "rExt.service_type" }, 
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
                        		}
                        		var timestamp = currentAlarmDsc.timestamp;
                        		var threshold = currentAlarmDsc.threshold;
                        		var counter_volume = currentAlarmDsc.counter_volume;
                        		var alarm_source = currentAlarmDsc.alarm_source;
                        		var level = currentAlarmDsc.level;
                        		var alarm_agent_name = currentAlarmDsc.alarmAgentName;
                        		
                        		msgStr += '<span title="告警项" class="' + spanClass + '">' + counter_name + '</span> '
                        		//msgStr += '<span class="' + spanClass + '">' + counter_name + '</span> '
                        		msgStr += '<span title="发生时间" class="badge bg-light-blue">' + timestamp + '</span> '
                        		msgStr += '<span title="告警规则" class="badge bg-purple">' + threshold + '</span> '
                        		msgStr += '<span title="告警值" class="badge bg-navy">' + counter_volume + '</span> '
                        		
                        		if(alarm_agent_name != null) {
                        			msgStr += '<span title="采集点" class="badge bg-green">' + alarm_agent_name + '</span> ';
                        		}
                        		msgStr += '<span title="采集点" class="badge bg-navy">' + alarm_source + '</span> ';
                        		msgStr += '<input id="' + flagStr + '" type="hidden" value="" />';
                        		if(level.indexOf("Warning") > -1) {
                        			msgStr += '<span title="告警级别" class="badge bg-navy">' + '警告 '+ '</span> ';
                        		} else {
                        			msgStr += '<span title="告警级别" class="badge bg-navy">' + '严重' + '</span> ';
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
			                        msgStr += '<span title="姓名+ERP" class="badge bg-navy">' + (data[i].username == null?"":data[i].username) + (data[i].erp == null?"":'（' + data[i].erp + '）') + '</span> '
			                        msgStr += '<span title="电话" class="badge bg-purple-gradient">' + (data[i].mobile == null?"":data[i].mobile) + '</span> '
			                        if(i != data.length - 1){
			                            msgStr += "<br/>"
			                        }
			                    }
		                    }
		                    return msgStr;
		                }
		            },     
//                    { "data": "rExt" ,
//                        "render": function ( data, type, full, meta ) {
//                        	var msgStr = '';
//                        	if(null != data) {
////                            	msgStr += '<span class="badge bg-light-blue">使用人</span> '
////                                msgStr += '<span class="badge bg-green">'+ (null!=data.r_usr?data.r_usr:"暂无") +'</span> '
////                        		msgStr += "<br />"
////                                msgStr += '<span class="badge bg-light-blue">联系方式</span> '
////                                msgStr += '<span class="badge bg-red">'+ (null!=data.mobile?data.mobile:"暂无") +'</span> <a href="#" id="a_'+full.id+'" class="detail_a">更多...</a>'
////                        		msgStr += "<br />"
//                        		
////                        		msgStr += '<span class="more_detail_span" id="span_a_'+full.id+'" style="display:none">'	
//                            	msgStr += '<span class="badge bg-light-blue">运维人</span> '
//                                msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
////                        		msgStr += "<br />"
////                            	msgStr += '<span class="badge bg-light-blue">研发经理</span> '
////                                msgStr += '<span class="badge bg-green">'+ (null!=data.rdmanager?data.rdmanager:"暂无") +'</span> '
////                        		msgStr += "<br />"
////                                msgStr += '<span class="badge bg-light-blue">部门总监</span> '
////                                msgStr += '<span class="badge bg-green">'+ (null!=data.dept_director?data.dept_director:"暂无") +'</span> '
//                        		msgStr += '</span>'
//                        	}	
//                        	return msgStr;
//                        }
//                    }, 
        ],
        initComplete: function () {
        	var column1 = this.api().column(1);
            var select1 = $('<select style="width: 120px;"><option value="">机器类型</option><option value="0">物理机</option><option value="1">容器</option></select>')
                .appendTo( $(column1.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column1
                        .search( val)
                        .draw();
                } );
        	
            var column2 = this.api().column(2);
            var select2 = $('<select style="width: 120px;"><option value="">服务器类型</option><option value="1">Linux</option><option value="2">Hadoop</option><option value="3">Mysql</option><option value="4">Windows</option><option value="5">Mongodb</option><option value="6">SQL</option><option value="7">Hbase</option><option value="8">Oracle</option><option value="9">.Net</option><option value="10">其他</option><option value="11">Sql Server-库房</option></select>')
                .appendTo( $(column2.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column2
                        .search( val)
                        .draw();
                } );
            
            var column3 = this.api().column(3);
            var selectStr  = '<select style="width: 205px;">';
	    	selectStr += '<option value="">指标类型</option>';
			for(var prop in meterMap){
			    if(meterMap.hasOwnProperty(prop)){
			    	var meter_name_val = meterMap[prop]["meter_name"];
			    	selectStr += '<option value="'+prop+'">'+meter_name_val+'</option>';
			    }
			}
			selectStr += '</select>&nbsp;&nbsp;&nbsp;<label>告警摘要</label>';
            
            var select3 = $(selectStr)
                .appendTo( $(column3.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column3
                        .search( val)
                        .draw();
                } );  
            $(".select2").select2();
            
        }
    });	
	
    var ulist;
    $.ajax({
        url:"/group/listAll",
        type:"get",
        //data:options.data
    }).done(function(data){
    	ulist = data.data;
    	if(null != ulist) {
    		//user_group
    		$("#group_user option").remove();
    		$("#group_user").append("<option value=''>请选择分组</option>");
    		for (var i=0;i<ulist.length;i++) {
    			$("#group_user").append("<option value='"+ulist[i].id+"'>"+ (ulist[i].groupname+"_" + ulist[i].userErp) +"</option>");
    		}
    	}
    }).fail(function(data){
    });   
    
    //<label>Show <select name="table_length" aria-controls="table" class="form-control input-sm"><option value="15">15</option><option value="30">30</option><option value="50">50</option><option value="75">75</option><option value="100">100</option></select> entries</label>
    // 添加toolbar
//    $("div.toolbar");
    // toolbar绑定事件
    $('#query').click(function(){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var ip = $('#qip').val();
    	var groupId = $('#group_user').val();
    	
    	if( (groupId == null || groupId == "") && (ip == null || ip == "") ) {
    		alert("分组和IP必须填写一项");
    		return false;
    	}
    	
    	if(stime==null || stime=='' || etime==null|| etime=='') {
    		alert("起止时间和结束时间不能为空");
    		return false;
    	}
    	var condition = groupId + "_" + ip + "_" + stime + "_" + etime + "_n";
    	$table.search(condition).draw();
    });  
    $('#export').click(function(){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var ip = $('#qip').val();
    	var groupId = $('#group_user').val();
    	
    	if(stime==null || stime=='' || etime==null|| etime=='') {
    		alert("起止时间和结束时间不能为空");
    		return false;
    	}
    	
    	if( (groupId == null || groupId == "") && (ip == null || ip == "") ) {
    		var tmp_stime = stime.replace(/-/g,"/");
    		var sDate = new Date(stime);
    		
    		var tmp_etime = etime.replace(/-/g,"/");
    		var eDate = new Date(etime);
    		
    		var iDays = parseInt(Math.abs(Date.parse(eDate) - Date.parse(tmp_stime))/1000/60/60/24);
    		
    		if(iDays > 7) {
    			alert("如果不填写分组信息或某个具体的IP，最多只能导出七天的数据。")
    			return false;
    		}
    	}
    	
    	var condition = groupId + "_" + ip + "_" + stime + "_" + etime + "_y";
    	alert("导出请求发送成功,请留意查收mjdos@jd.com发送的邮件!");
    	$table.search(condition).draw();
    }); 
    
    
    $('#table_filter').hide();
    
});
