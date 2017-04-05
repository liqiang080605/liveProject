$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/agent/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        "columns": [
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<input type="checkbox" id="'+data+'"></input>';
                        }
                    },
                    { "data": "ip" },          
                    {
                        "data": "instancesList",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var instancesList = data;
                        	//<span class="label label-primary">Approved</span>
                        	//<span class="badge bg-yellow">70%</span>
                        	if(null != instancesList) {
                            	
                            	for(var i=0;i<instancesList.length;i++) {
                            		var spanClass = "badge bg-green"
                            		var spanText = "I";
                            		var spanTitle = "空闲"
                            		if(instancesList[i].status == 1 && instancesList[i].monitor_count != 0) {
                            			spanClass = "badge bg-yellow"
                            			spanText = "W"
                            			spanTitle = "工作中"
                            		}
                            		if(instancesList[i].status == 3) {
                            			spanClass = "badge bg-red"
                            			spanText = "P"
                            			spanTitle = "暂停"
                            		}
                            		
                            		var avg_res_time = instancesList[i].avg_res_time;
                            		var task_type = instancesList[i].task_type;
                            		if(null == task_type || task_type == 'null') {
                            			task_type = '';
                            		}
                            		
                            		var avg_snmp = null;
                            		var avg_ipmi = null;
                            		var avg_ping = null;
                            		var avg_contanier = null;
                            		var call_count = instancesList[i].reg_count;
                            		
                            		if(null != avg_res_time) {
                            			var timeArray = avg_res_time.split("@");
                            			avg_snmp = timeArray[0];
                            			avg_ipmi = timeArray[1];
                            			avg_ping = timeArray[2];
                            			avg_container = timeArray[3];
                            		}
                            		
                            		if(avg_snmp == null) {
                            			avg_snmp = "N/A";
                            		}
                            		
                            		if(avg_ipmi == null) {
                            			avg_ipmi = "N/A";
                            		}
                            		
                            		if(avg_ping == null) {
                            			avg_ping = "N/A";
                            		}
                            		
                            		if(avg_container == null) {
                            			avg_container = "N/A";
                            		}
                            		
                            		if(call_count == null) {
                            			call_count = "N/A";
                            		}
                            		
                            		msgStr += '<span title="pid" class="badge bg-navy">' + instancesList[i].pid + '</span> '
                            		msgStr += '<span title="监控数量" class="badge bg-purple">' + instancesList[i].monitor_count + '</span> '
                            		msgStr += '<span title="当前状态:'+spanTitle+'" class="' + spanClass + '">' + spanText + '</span> '
                            		msgStr += '<span title="最近一次响应时间" class="badge bg-light-blue">' + instancesList[i].last_res_time + '</span> '
                            		
                            		if(task_type == "snmp") {
                            			msgStr += '<span title="snmp平均响应时间" class="badge bg-navy">' + avg_snmp + '</span> '
                            			msgStr += '<span title="ipmi平均响应时间" class="badge bg-navy">' + avg_ipmi + '</span> '
                            		}
                            		
                            		if(task_type == "ping") {
                            			msgStr += '<span title="ping平均响应时间" class="badge bg-navy">' + avg_ping + '</span> '
                            		}
                            		
                            		if(task_type == "container") {
                            			msgStr += '<span title="container平均响应时间" class="badge bg-navy">' + avg_container + '</span> '
                            		}
                            		
                            		msgStr += '<span title="请求计数" class="badge bg-navy">' + call_count + '</span> '
                            		msgStr += '<span title="任务类型" class="badge bg-navy">' + task_type + '</span> '
                            		//msgStr += instancesList[i].avg_res_time+" "
                            		msgStr += "<br />"
                            	}
                        		
                        	}
                            return msgStr;
                        }
                    },
                    { "data": "idc" },   
                    { "data": "hostip" },  
		            { "data": "create_time" },
		            { "data": "update_time" }
        ],
        initComplete: function () {
            var that = this;
            var column = this.api().column(3);
            var select = $('<select><option value="">所在机房</option><option value="yf">永丰</option><option value="lf">廊坊</option><option value="lflt">廊坊联通机房</option><option value="yn">印尼</option><option value="hc">黄村</option><option value="mjq">马驹桥</option><option value="qtjf">其他机房</option><option value="gz">广州</option><option value="hb">华北</option><option value="hd">华东</option></select>')
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

    // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
        //.append('<button class="btn btn-flat bg-blue margin" id="batch">批量导入</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="resource">查看资源</button>')
        .append('<button class="btn btn-flat bg-blue margin" title="调试使用,请勿轻易尝试!!!" id="pause">暂停Agent</button>')
        .append('<button class="btn btn-flat bg-blue margin" title="调试使用,请勿轻易尝试!!!" id="restore">恢复Agent</button>');

    // toolbar绑定事件
    $('#create').click(function(){
        var create_tmpl = $("#tmpl_create").text();
        var $modal = $(create_tmpl).jd_modal({title:"创建"});
        var $form = $modal ;
        $modal.find("[data-mask]").inputmask();

        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/agent/create",
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

    $('#resource').click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        var id = checked_trs.get(0).id ;
        $.jd_ajax({
        	url:"/agent/rlist",
        	type:"post",
        	data:{agent_id:id},
        	ok:function(result){
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
            $.jd_ajax({url:"/agent/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
    });
    
    $("#pause").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        
        var id = checked_trs.get(0).id ;
        $.jd_confirm({type:"info",message:"确认要暂停ID为"+id+"的记录吗？调试使用,请勿轻易尝试!!!",ok:function(){
            $.jd_ajax({
            	url:"/agent/pause",
            	type:"post",
            	data:{agent_id:id},
            	ok:function(result){
            			setTimeout(function(){$table.ajax.reload()},1000);
            		}
            	});
        }});
        

        
    });
    
    $("#restore").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        if (checked_trs.size() != 1){
        	$.jd_confirm({type:"error",message:"请选择单条记录进行处理"});
            return false ;
        }
        
        var id = checked_trs.get(0).id ;
        $.jd_confirm({type:"info",message:"确认要恢复ID为"+id+"的记录吗？调试使用,请勿轻易尝试!!!",ok:function(){
	        $.jd_ajax({
	        	url:"/agent/restore",
	        	type:"post",
	        	data:{agent_id:id},
	        	ok:function(result){
	        			setTimeout(function(){$table.ajax.reload()},1000);
	        		}
	        	});
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