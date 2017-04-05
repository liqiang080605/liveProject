$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/docker/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        /*"language": {
            "url": "static/js/i18n/Chinese.json"
        },*/
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function ( data, type, full, meta ) {
                    return '<input type="checkbox" id="'+data+'" value="'+data+'"></input>';
                }
            },
            { "data": "ext_info.idc" },
            {
                "data": "ip",
                "render": function ( data, type, full, meta ) {
                	var extObj = full.ext_info;
                	var alias = "";
                	if(null != extObj) {
                		alias = extObj.alias;
                	}
                	if(alias == null) {
                		alias = "";
                	}
                	if(alias == "") {
                        return '<input type="hidden" id="ip_'+full.id+'" value="' +data+ '" /><a href="#" class="detail_a">'+data+'</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                	}
                    return '<input type="hidden" id="ip_'+full.id+'" value="' +data+ '" /><a href="#" class="detail_a">'+data+'('+alias+')'+'</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                }
            },    
            { "data":"uuid" },
            {
                "data": "status",
                "render": function ( data, type, full, meta ) {
                	var msgStr = '';
            		var spanClass = "badge bg-green"
            		var spanText = "正常";
            		var status_dsc = ""
            		if(data == 0) {
            			spanClass = "badge bg-yellow"
            			spanText = "初始化中"
            		}
            		if(data == 2) {
            			spanClass = "badge bg-red"
            			spanText = "错误"
            			status_dsc = full.remark
            		}
            		if(data == 3) {
            			spanClass = "badge bg-red"
            			spanText = "停止监控"
            		}
            		msgStr += '<span title="当前状态:'+status_dsc+'" class="' + spanClass + '">' + spanText + '</span> '
            		
            		//hidden detail start
            		var extInfo = full.ext_info;
            		if(null != extInfo) {
            			msgStr += '<input type="hidden" id="detail_idc_'+ full.id +'" value="' + extInfo.idc + '"  />'
            			msgStr += '<input type="hidden" id="detail_operator_'+ full.id +'" value="' + extInfo.operator + '"  />'
            			msgStr += '<input type="hidden" id="detail_rdmanager_'+ full.id +'" value="' + extInfo.rdmanager + '"  />'
            			msgStr += '<input type="hidden" id="detail_dept_'+ full.id +'" value="' + extInfo.dept + '"  />'
            			msgStr += '<input type="hidden" id="detail_dept_director_'+ full.id +'" value="' + extInfo.dept_director + '"  />'
            			msgStr += '<input type="hidden" id="detail_project_name_'+ full.id +'" value="' + extInfo.project_name + '"  />'
            			msgStr += '<input type="hidden" id="detail_project_desc_'+ full.id +'" value="' + extInfo.project_desc + '"  />'
            			msgStr += '<input type="hidden" id="detail_ip_type_'+ full.id +'" value="' + extInfo.ip_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_service_type_'+ full.id +'" value="' + extInfo.service_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_cfg_type_'+ full.id +'" value="' + extInfo.cfg_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_shelve_count_'+ full.id +'" value="' + extInfo.shelve_count + '"  />'
            			msgStr += '<input type="hidden" id="detail_distribute_status_'+ full.id +'" value="' + extInfo.distribute_status + '"  />'
            			msgStr += '<input type="hidden" id="detail_asset_number_'+ full.id +'" value="' + extInfo.asset_number + '"  />'
            			msgStr += '<input type="hidden" id="detail_cabinet_position_'+ full.id +'" value="' + extInfo.cabinet_position + '"  />'
            			msgStr += '<input type="hidden" id="detail_sn_number_'+ full.id +'" value="' + extInfo.sn_number + '"  />'
            			msgStr += '<input type="hidden" id="detail_cpu_'+ full.id +'" value="' + extInfo.cpu + '"  />'
            			msgStr += '<input type="hidden" id="detail_men_'+ full.id +'" value="' + extInfo.men + '"  />'
            			msgStr += '<input type="hidden" id="detail_disk_'+ full.id +'" value="' + extInfo.disk + '"  />'
            			msgStr += '<input type="hidden" id="detail_r_usr_'+ full.id +'" value="' + extInfo.r_usr + '"  />'
            			msgStr += '<input type="hidden" id="detail_mobile_'+ full.id +'" value="' + extInfo.mobile + '"  />'
            			msgStr += '<input type="hidden" id="detail_sys_type_'+ full.id +'" value="' + extInfo.sys_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_app_eniv_'+ full.id +'" value="' + extInfo.app_eniv + '"  />'
            			msgStr += '<input type="hidden" id="detail_distribute_time_'+ full.id +'" value="' + extInfo.distribute_time + '"  />'
            			msgStr += '<input type="hidden" id="detail_eniv_type_'+ full.id +'" value="' + extInfo.eniv_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_server_type_'+ full.id +'" value="' + extInfo.server_type + '"  />'
            			msgStr += '<input type="hidden" id="detail_is_need_monitor_'+ full.id +'" value="' + extInfo.is_need_monitor + '"  />'
            			msgStr += '<input type="hidden" id="detail_is_monitor_'+ full.id +'" value="' + extInfo.is_monitor + '"  />'
            			msgStr += '<input type="hidden" id="detail_remark_'+ full.id +'" value="' + extInfo.remark + '"  />'
            			msgStr += '<input type="hidden" id="detail_detail_remark_'+ full.id +'" value="' + extInfo.detail_remark + '"  />'
            		}
            		//hidden detail end
                    return msgStr;
                }
            },
            {
                "data": "ext_info.host_ip"
            }, 
            {
                "data": "ip_info_list",
                "defaultContent": "",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    for(var i=0;i<data.length;i++){

                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> '
                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> '
                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> '
                        msgStr += '<span title="部门" class="badge bg-purple-gradient">' + (data[i].dept_path == null?"":data[i].dept_path) + '</span> '
                        if(i != data.length - 1){
                            msgStr += "<br/>"
                        }
                    }
                    return msgStr;
                }
            }, 
            { "data": "update_time" }
        ],
        initComplete: function () {
            var that = this;
            var column = this.api().column(4);
            var select = $('<select id="selectpicker_id" class="selectpicker bla bla bli" multiple title="状态"><option value="1">正常</option><option value="0">初始化中</option><option value="2">错误</option><option value="3">停止监控</option></select>')
                .appendTo( $(column.header()).empty() );
            $('#selectpicker_id').selectpicker({});    
            $('#selectpicker_id').on('change',function () {
            	var s_val = $('#selectpicker_id').selectpicker('val');
            	if(s_val == null) {
            		s_val ='';
            	}
                column.search(s_val).draw();
            });       
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

    // 绑定详情事件
    $('#table tbody').on( 'click', '.detail_a', function () {
    	//tmpl_detail
    	var tmpl_detail = $("#tmpl_detail").text();
        var $modal = $(tmpl_detail).jd_modal({title:"详情"});
        var ip = $(this).text();
        var id = $(this).parents("tr").find("input:checkbox:first").val()
        $('#detail_ip').text(ip);
        $('#detail_idc').text($(this).parents("tr").find("#detail_idc_" + id).val());
        $('#detail_operator').text($(this).parents("tr").find("#detail_operator_" + id).val());
        $('#detail_rdmanager').text($(this).parents("tr").find("#detail_rdmanager_" + id).val());
        $('#detail_dept').text($(this).parents("tr").find("#detail_dept_" + id).val());
        $('#detail_dept_director').text($(this).parents("tr").find("#detail_dept_director_" + id).val());
        $('#detail_project_name').text($(this).parents("tr").find("#detail_project_name_" + id).val());
        $('#detail_project_desc').text($(this).parents("tr").find("#detail_project_desc_" + id).val());
        $('#detail_ip_type').text($(this).parents("tr").find("#detail_ip_type_" + id).val());
        $('#detail_service_type').text($(this).parents("tr").find("#detail_service_type_" + id).val());
        $('#detail_cfg_type').text($(this).parents("tr").find("#detail_cfg_type_" + id).val());
        $('#detail_shelve_count').text($(this).parents("tr").find("#detail_shelve_count_" + id).val());
        $('#detail_distribute_status').text($(this).parents("tr").find("#detail_distribute_status_" + id).val());
        $('#detail_asset_number').text($(this).parents("tr").find("#detail_asset_number_" + id).val());
        $('#detail_cabinet_position').text($(this).parents("tr").find("#detail_cabinet_position_" + id).val());
        $('#detail_sn_number').text($(this).parents("tr").find("#detail_sn_number_" + id).val());
        $('#detail_cpu').text($(this).parents("tr").find("#detail_cpu_" + id).val());
        $('#detail_men').text($(this).parents("tr").find("#detail_men_" + id).val());
        $('#detail_disk').text($(this).parents("tr").find("#detail_disk_" + id).val());
        $('#detail_r_usr').text($(this).parents("tr").find("#detail_r_usr_" + id).val());
        $('#detail_mobile').text($(this).parents("tr").find("#detail_mobile_" + id).val());
        $('#detail_sys_type').text($(this).parents("tr").find("#detail_sys_type_" + id).val());
        $('#detail_app_eniv').text($(this).parents("tr").find("#detail_app_eniv_" + id).val());
        $('#detail_distribute_time').text($(this).parents("tr").find("#detail_distribute_time_" + id).val());
        $('#detail_eniv_type').text($(this).parents("tr").find("#detail_eniv_type_" + id).val());
        $('#detail_server_type').text($(this).parents("tr").find("#detail_server_type_" + id).val());
        $('#detail_is_need_monitor').text($(this).parents("tr").find("#detail_is_need_monitor_" + id).val());
        $('#detail_is_monitor').text($(this).parents("tr").find("#detail_is_monitor_" + id).val());
        $('#detail_remark').text($(this).parents("tr").find("#detail_remark_" + id).val());
        $('#detail_detail_remark').text($(this).parents("tr").find("#detail_detail_remark_" + id).val());
    });    

    // 添加toolbar     .append('<button class="btn btn-flat bg-blue margin" id="sync">同步</button>')
    $("div.toolbar")
        .append('<div class="btn-group margin"><button type="button" class="btn btn-flat bg-blue" name="pause">暂停监控</button><button type="button" class="btn btn-flat bg-blue dropdown-toggle" style="height: 34px" data-toggle="dropdown" aria-expanded="false"> <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span> </button> <ul class="dropdown-menu" role="menu"> <li><a name="pause">暂停监控</a></li> <li><a name="batch_monitor_toggle" _type="stop">批量暂停监控</a></li></ul> </div>')
        .append('<div class="btn-group margin"><button type="button" class="btn btn-flat bg-blue" name="restore">恢复监控</button><button type="button" class="btn btn-flat bg-blue dropdown-toggle" style="height: 34px" data-toggle="dropdown" aria-expanded="false"> <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span> </button> <ul class="dropdown-menu" role="menu"> <li><a name="restore">恢复监控</a></li> <li><a name="batch_monitor_toggle" _type="start">批量恢复监控</a></li></ul> </div>')
        ;

    // toolbar绑定事件
    $('#sync').click(function(){
        $.jd_ajax({
            url:"/docker/sync",
            type:"get",
            ok:function(){
                $table.ajax.reload();
            }
        });
    });
    
    $("[name='pause']").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        
        var ips = [] ;
        for(var i=0; i<checked_trs.size(); i++){
        	var tempIp = $("#ip_" + checked_trs.get(i).id).val();
        	ips.push(tempIp);
        }          
        $.jd_confirm({type:"info",message:"确认要暂停IP为"+ips.join(",")+"的记录吗？",ok:function(){
            $.jd_ajax({
            	url:"/docker/stop",
            	type:"post",
            	data:{ips:ips},
            	ok:function(result){
            			setTimeout(function(){$table.ajax.reload()},1000);
            		}
            	});
        }});
        
    });

    $("[name='batch_monitor_toggle']").click(function(){
        var type = $(this).attr("_type");
        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '<input name="type" type="hidden" value="'+type+'">',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"批量暂停"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/docker/batch_monitor_toggle",
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
    
    $("[name='restore']").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要管理的记录"});
            return false ;
        }
        var ips = [] ;
        for(var i=0; i<checked_trs.size(); i++){
        	var tempIp = $("#ip_" + checked_trs.get(i).id).val();
        	ips.push(tempIp);
        }    
        $.jd_confirm({type:"info",message:"确认要恢复IP为"+ips.join(",")+"的记录吗？",ok:function(){
	        $.jd_ajax({
	        	url:"/docker/start",
	        	type:"post",
	        	data:{ips:ips},
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