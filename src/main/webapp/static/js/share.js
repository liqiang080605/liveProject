$(function () {
	var meterMap = getMeters();	
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/share/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function (data, type, full, meta) {
                    return '<input type="checkbox" id="' + data + '"></input><input type="hidden" id="' + data + '_gname" value="' + full.groupname + '"></input>';
                }
            },
            {"data": "groupname"},
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

 // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="pauseAlarm" name="pauseAlarm">暂停告警监控</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="resumeAlarm" name="resumeAlarm">恢复告警监控</button>')

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
    
});