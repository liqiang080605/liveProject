$(function () {
	var meterMap = getMeters();	
	musicFlag = false;
	
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "serverSide": true,
        "searching": true,
        "ajax":"/realtime/query/",
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
                        	var alias = "";
                        	if(null != extObj) {
                        		idcStr = extObj.idc;
                        		alias = extObj.alias;
                        	}
                        	if(alias == null) {
                        		alias = "";
                        	}
                        	var msgStr = "";
                        	 msgStr += '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                        	 msgStr += '<a href="javascript:;" onclick="javascript:showPausedHisInfos(\'' + full.ip
                        	 + '\')"><img name="imgbtn" title="暂停告警记录" type="image" src="static/dist/img/history.png" border="0"></a>';
                        	 return msgStr;
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
		                "data": "alarmDscList",
		                "defaultContent": "",
		                "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var alarmDscList = data;
                        	if(null != alarmDscList) {
                            	for(var i=0;i<alarmDscList.length;i++) {
                            		var randomNum = Math.random();
                            		var flagStr = "f" + randomNum;
                            		flagStr = flagStr.replace(".","_");
                            		
                            		
                            		var counter_name = alarmDscList[i].counter_name;
                            		var spanClass = "badge bg-yellow"
                            		if(counter_name == '连通性') {
                            			spanClass = "badge bg-red";
                            			if(musicFlag == false) {
                            				msgStr += '<embed src="static/media/buzz5.wav" height="0" width="0" />';
                            				musicFlag =true;
                            			}
                            			
                            			msgStr += '<style type="text/css">.ping100 {background-color:#d9534f;}</style><script>$("#' + flagStr + '").parent().parent().addClass("ping100");</script>';
                            		}
                            		var timestamp = alarmDscList[i].timestamp;
                            		var threshold = alarmDscList[i].threshold;
                            		var counter_volume = alarmDscList[i].counter_volume;
                            		var alarm_source = alarmDscList[i].alarm_source;
                            		var alarm_id =alarmDscList[i].alarmId;
                            		var meter_key = alarmDscList[i].meter_key;
                            		var alarm_agent_name = alarmDscList[i].alarmAgentName;
                            		
                            		msgStr += '<span title="告警项" class="' + spanClass + '" style="font-size: 20px;font-family: "黑体";">' + counter_name + '</span> '
                            		//msgStr += '<span class="' + spanClass + '">' + counter_name + '</span> '
                            		msgStr += '<span title="告警值" class="badge bg-navy">' + counter_volume + '</span> ';
                            		msgStr += '<span title="告警规则" class="badge bg-purple">' + threshold + '</span> ';
                            		msgStr += '<span title="发生时间" class="badge bg-light-blue">' + timestamp + '</span> ';
                            		if(alarm_agent_name != null) {
                            			msgStr += '<span title="采集点" class="badge bg-green">' + alarm_agent_name + '</span> ';
                            		}
                            		msgStr += '<span title="采集点" class="badge bg-navy">' + alarm_source + '</span> ';
                            		msgStr += '<input id="' + flagStr + '" type="hidden" value="" />';
                            		
                            		msgStr += '<a href="javascript:;" onclick="javascript:handleClick(\'' 
                            			       + alarmDscList[i].ip + '\',\'' + meter_key + '\',\'' + threshold + '\',\'' + alarm_source + '\',\'' + alarm_id
                            		           + '\')"><input name="imgbtn" title="handle" type="image" src="static/dist/img/handle.png" border="0"></a>';
                            		msgStr += '<br />';
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
                    { "data": "rExt" ,
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	if(null != data) {
//                            	msgStr += '<span class="badge bg-light-blue">使用人</span> '
//                                msgStr += '<span class="badge bg-green">'+ (null!=data.r_usr?data.r_usr:"暂无") +'</span> '
//                        		msgStr += "<br />"
//                                msgStr += '<span class="badge bg-light-blue">联系方式</span> '
//                                msgStr += '<span class="badge bg-red">'+ (null!=data.mobile?data.mobile:"暂无") +'</span> <a href="#" id="a_'+full.id+'" class="detail_a">更多...</a>'
//                        		msgStr += "<br />"
                        		
//                        		msgStr += '<span class="more_detail_span" id="span_a_'+full.id+'" style="display:none">'	
                            	//msgStr += '<span class="badge bg-light-blue">运维人</span> '
                                msgStr += '<span class="badge bg-green">'+ (null!=data.operator?data.operator:"暂无") +'</span> '
//                        		msgStr += "<br />"
//                            	msgStr += '<span class="badge bg-light-blue">研发经理</span> '
//                                msgStr += '<span class="badge bg-green">'+ (null!=data.rdmanager?data.rdmanager:"暂无") +'</span> '
//                        		msgStr += "<br />"
//                                msgStr += '<span class="badge bg-light-blue">部门总监</span> '
//                                msgStr += '<span class="badge bg-green">'+ (null!=data.dept_director?data.dept_director:"暂无") +'</span> '
                        		msgStr += '</span>'
                        	}	
                        	return msgStr;
                        }
                    }, 
        ],
        initComplete: function () {
        	var column1 = this.api().column(1);
            var select1 = $('<select  style="width: 120px;"><option value="">机器类型</option><option value="0">物理机</option><option value="1">容器</option></select>')
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
            var select2 = $('<select  style="width: 120px;"><option value="">服务器类型</option><option value="1">Linux</option><option value="2">Hadoop</option><option value="3">Mysql</option><option value="4">Windows</option><option value="5">Mongodb</option><option value="6">SQL</option><option value="7">Hbase</option><option value="8">Oracle</option><option value="9">.Net</option><option value="10">其他</option><option value="11">Sql Server-库房</option></select>')
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
            

//            var select3 = $('<select  style="width: 95px;" id="selectpicker_id" class="selectpicker bla bla bli" multiple title="状态"><option value="1">正常</option><option value="0">初始化中</option><option value="2">错误</option><option value="3">停止监控</option></select>')
//                .appendTo( $(column.header()).empty() );     
            
            
            var selectStr  = '<select  style="width: 95px;" id="selectpicker_id" class="selectpicker bla bla bli" multiple title="指标类型">';
			for(var prop in meterMap){
			    if(meterMap.hasOwnProperty(prop)){
			    	var meter_name_val = meterMap[prop]["meter_name"];
			    	selectStr += '<option value="'+prop+'">'+meter_name_val+'</option>';
			    	if(prop == "disk.usage") {
			    		selectStr += '<option value="'+prop+'_95' + '">'+meter_name_val+ '(>=95%)' + '</option>';
			    	}
			    }
			}
			selectStr += '</select>&nbsp;&nbsp;&nbsp;<label>告警摘要</label>';            
            
            var select3 = $(selectStr)
                .appendTo( $(column3.header()).empty()); 
            $("#selectpicker_id").selectpicker({});    
            $('#selectpicker_id').on('change',function () {
            	var s_val = $('#selectpicker_id').selectpicker('val');
            	if(s_val == null) {
            		s_val ='';
            	}
            	column3.search(s_val).draw();
            });    
            
            
        }
    });	
    
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
                        $table.ajax.reload();
                    }
                });
            }
        });
    }
    
    window.handleClick = function handleClick(ip,meter_key,threshold,alarm_source,alarmId) {
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
	
    //<label>Show <select name="table_length" aria-controls="table" class="form-control input-sm"><option value="15">15</option><option value="30">30</option><option value="50">50</option><option value="75">75</option><option value="100">100</option></select> entries</label>
    // 添加toolbar
    $("div.toolbar")
        .append('<label>展示最近 <select id="time_length" name="time_length" aria-controls="table" class="form-control input-sm"><option value="5">5</option><option value="15">15</option><option value="30">30</option><option value="60">60</option><option value="120">120</option></select> 分钟</label>')
        .append('<button class="btn btn-flat bg-blue margin" id="delResource" name="delResource">批量删除资源</button>')      
        .append('<button class="btn btn-flat bg-blue margin" id="pauseAlarm" name="pauseAlarm">暂停告警监控</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="resumeAlarm" name="resumeAlarm">恢复告警监控</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="setAlarm" name="setAlarm">设置告警</button>')
        ;

    $("[name='delResource']").click(function(){
        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"批量删除"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/machine/batch_delete_resource",
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
                url:"/realtime/pausealarm",
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
                url:"/realtime/resumealarm",
                type:"post",
                data:$form.serialize(),
                ok:function(){
                    $modal.data("modal").close();
                    $table.ajax.reload();
                }
            });
            
        });
    });
    
    $("[name='setAlarm']").click(function(){
    	
    	//tmpl_detail
		var create_tmpl = $("#set_alarm").text();

        var $modal = $(create_tmpl).jd_modal({title:"告警设置"});
        var $form = $modal ;
        
        $("#no_show_alarm_meters").empty();
        $("#no_show_alarm_meters").append('<p><input type="checkbox" name="setAllAlarm" id="setAllAlarm" onclick="selectAlarm()"/><label for="setAllAlarm">&nbsp;全选</label></p>');

        var idx = 0;
        
		for(var prop in meterMap){
			if(idx == 0) {
				$("#no_show_alarm_meters").append('<p>');
			} 
			idx ++;
		    if(meterMap.hasOwnProperty(prop)){
		    	var meter_full_name_val = meterMap[prop]["meter_full_name"];
				$("#meter_name")
				.append(
						"<option value='"
								+ prop
								+ "'>"
								+ meter_full_name_val
								+ "</option>");		
		    	var meter_name_val = meterMap[prop]["meter_name"];
				$("#no_show_alarm_meters").append('<input type="checkbox" id="'+prop+'" name="setAlarmName" value="'+prop+'" />&nbsp;<label for="'+prop+'">'+meter_name_val + '</label>&nbsp;&nbsp;&nbsp;&nbsp;');
		    }
			if(idx == 3) {
				$("#no_show_alarm_meters").append('</p>');
				idx = 0;
			} 
		}	
		$("#pause_alarm_meters").append('</p>');
		$(".select2").select2();	
		
		

        
        
        
        var ulist;
        $.ajax({
            url:"/group/listAll",
            type:"get",
            //data:options.data
        }).done(function(data){
        	ulist = data.data;
        	if(null != ulist) {
        		//user_group
        		$modal.find("#group_user option").remove();
        		$modal.find("#group_user").append("<option value=''>请选择</option>");
        		for (var i=0;i<ulist.length;i++) {
        			$modal.find("#group_user").append("<option value='"+ulist[i].id+"'>"+ (ulist[i].groupname+"_" + ulist[i].userErp) +"</option>");
        		}
        	}
        }).fail(function(data){
        });   
        
        window.selectAlarm = function selectAlarm()
    	{
    		var checklist = document.getElementsByName ("setAlarmName");
    	    if(document.getElementById("setAllAlarm").checked)
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
        
		window.alarmTypeChange = function alarmTypeChange()
		{
			var val=document.getElementById("meter_name").value;
			if(val=="ip.ping"){
				document.getElementById("machineNum").value="1";
				document.getElementById("machineNum").readOnly="true";
			} else {
				document.getElementById("machineNum").value="5";
			}
		}
		
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            $.jd_ajax({
                url:"/realtime/setAlarmRule",
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
    $('#time_length').change(function(){
    	musicFlag = false;
    	$table.search(this.value).draw();
    });  
    
    $('#table_filter').hide();
    
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
    
    window.showPausedHisInfos = function showPausedHisInfos(ip) {

    	//tmpl_detail
		var create_tmpl = $("#history_paused_alarm").text();

        var $modal = $(create_tmpl).jd_modal_large({title:"历史暂停告警监控记录"});
        var $form = $modal ;
        
        $("#history_table_paused").DataTable({
        	"processing": true,
        	"serverSide": true,
        	"paging": false,
            "searching": false,
            "ordering": false,
            "dom": '<"toolbar">frtip',
            //"ajax":"/platmonitor/warning_list/",
            "sAjaxSource": "/realtime/history_paused_alarm",
            "fnServerData": function ( sSource, aoData, fnCallback ) {
				$.ajax( {
				    "dataType": 'json',
					"type": "POST",
					"url": sSource,
					"data": {"aodata":aoData,"ip":ip},
				    "success": fnCallback
				} );
            },
            "columnDefs": [
                           {                              
                             "defaultContent": "",
                             "targets": "_all"
                           }
                         ],  
            "columns": [
                        {   "data": "type",
                        	"render": function ( data, type, full, meta ) {
                        		var content;
                        		if(data == 0) {
                        			content = "物理机";
                        		}
                        		else {
                        			content = "容器";
                        		}
                        		var msgStr = '';
                                msgStr += '<span class="badge bg-green">' + content + '</span> '
                            	return msgStr;
                            }
    		            },
                        {  
                        	"data": "alarmName",
                        	"render": function ( data, type, full, meta ) {
                        		var content = getMeterName(meterMap, data);
                            	var msgStr = '';
                                msgStr += '<span class="badge bg-green">' + content + '</span> '
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
    
    }
    
    // 绑定详情事件
//    $('#table tbody').on( 'click', '.detail_a', function () {
//    	$(this).text("")
//    	var a_id = $(this).attr("id")
//    	$("#span_" + a_id).show();
//    });	
    setInterval(function(){musicFlag = false;$table.ajax.reload()},60000);
});
