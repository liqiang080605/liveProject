$(function () {

	
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": false,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/gresource/list/" + $("#gid").val(),
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<input type="checkbox" id="'+data+'"></input>';
                        }
                    },
                    { "data": "ip" ,
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
                            	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a>';
                        	}
                        	return '<a href="javascript:;" onclick="javascript:setAlias(\'' + data + '\',\'' + alias + '\')">' +data+'('+alias+')</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a>';
                            //return '<a href="#" class="detail_a">'+data+'</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a>';
                        }
                    },
                    { "data": "ext_info.idc" },
                    {
                        "data": "metrics.cpu",
                        "render": function ( data, type, full, meta ) {
                        	var val = "N/A";
                            if(null!= data){
                            	val = data;
                            }
                            return '<span class="badge bg-light-blue">' + val + '</span> '
                        }
                    },
                    {
                        "data": "metrics",
                        "render": function (data, type, full, meta) {
                            var msgStr = '';
                            var metrics = data;
                            if(null == metrics) {
                            	metrics = {};
                            	metrics["memory"] = null;
                            	metrics["swap"] = null;
                            }
                            msgStr +='<span class="badge bg-navy">RAM:</span>'
                            var val = "N/A";
                            if(null!= metrics.memory){
                            	val = metrics.memory;
                            }
                            msgStr +='<span class="badge bg-light-blue">' + val + '</span> '
                            msgStr +='<span class="badge bg-navy">SWAP:</span>'
                            val = "N/A";
                            if(null!= metrics.swap){
                            	val = metrics.swap;
                            }
                            msgStr +='<span class="badge bg-light-blue">' + val + '</span> '
                            
                            return msgStr;
                        }
                    },
                    {
                        "data": "metrics",
                        "render": function (data, type, full, meta) {
                            var msgStr = '';
                            var metrics = data;
                            if(null == metrics) {
                            	metrics = {};
                            	metrics["netIN"] = null;
                            	metrics["netOut"] = null;
                            }                            
                            msgStr +='<span class="badge bg-navy">IN:</span>'
                            var val = "N/A";
                            if(null!= metrics.netIN){
                            	val = metrics.netIN;
                            }
                            msgStr +='<span class="badge bg-light-blue">' + val + '</span> '
                            msgStr +='<span class="badge bg-navy">OUT:</span>'
                            val = "N/A";
                            if(null!= metrics.netOut){
                            	val = metrics.netOut;
                            }
                            msgStr +='<span class="badge bg-light-blue">' + val + '</span> '
                            return msgStr;
                        }
                    },
                    {
                        "data": "metrics",
                        "render": function (data, type, full, meta) {
                            var msgStr = '';
                            var metrics = data;
                            if(null == metrics) {
                            	metrics = {};
                            	metrics["load"] = null;
                            }                                
                            if(null!= metrics.load){
                                var load = metrics.load
                                var array = load.split(",")
                                for(var i=0;i<array.length;i++){
                                    var minute = array[i].split(":")
                                    if(minute[0]=="1"){
                                        msgStr +='<span class="badge bg-navy">1min:</span>'
                                    }else if(minute[0]=="5"){
                                        msgStr +='<span class="badge bg-navy">5min:</span>'
                                    }else if(minute[0]=="15"){
                                        msgStr +='<span class="badge bg-navy">15min:</span>'
                                    }
                                    var val = "N/A";
                                    if(null!= minute[1]){
                                    	val = minute[1];
                                    }
                                    msgStr +='<span class="badge bg-light-blue">' + val + '</span> '
                                }
                            } else {
                                msgStr +='<span class="badge bg-navy">1min:</span>';
                                msgStr +='<span class="badge bg-light-blue">N/A</span> ';
                                msgStr +='<span class="badge bg-navy">5min:</span>';
                                msgStr +='<span class="badge bg-light-blue">N/A</span> ';
                                msgStr +='<span class="badge bg-navy">15min:</span>';
                                msgStr +='<span class="badge bg-light-blue">N/A</span> ';
                            	
                            }
                            return msgStr;
                        }
                    },
                    {
                        "data": "metrics.tcp",
                        "render": function ( data, type, full, meta ) {
                        	var val = "N/A";
                            if(null!= data){
                            	val = data;
                            }
                            return '<span class="badge bg-light-blue">' + val + '</span> '
                        }
                    },
                    {
                        "data": "metrics",
                        "render": function (data, type, full, meta) {
                            var msgStr = '';
                            var title = '';
                            var metrics = data;
                            if(null == metrics) {
                            	metrics = {};
                            	metrics["ping"] = null;
                            }    
                            if(null!= metrics.ping){
                                //maxrtt:0.085,mdev:0.016,minrtt:0.049,avgrtt:0.060,pl:0
                                var ping = metrics.ping
                                var array = ping.split(",");
                                var isOK = true;
                                for(var i=0;i<array.length;i++){
                                    var unit = array[i].split(":")
                                    if(unit[0]=="pl"){
                                        title ='Packet loss = ' + unit[1] + '%,';
                                    	if(unit[1] == 100) {
                                        	msgStr ='<span class="badge bg-light-blue">PING Loss</span>'
                                            isOK = false;
                                            break;
                                    	}
                                    }
                                }
                                if(isOK) {
                                    msgStr ='<span class="badge bg-light-blue">PING OK</span>'
                                    title = 'PING OK-';
                                    for(var i=0;i<array.length;i++){
                                        var unit = array[i].split(":")
                                        if(unit[0]=="avgrtt"){
                                            title +='RTA = '+ unit[1] +' ms'
                                        }else if(unit[0]=="maxrtt"){
                                            title +='RTA_max = '+ unit[1] +' ms'
                                        }else if(unit[0]=="mdev"){
                                            title +='RTA_mdev = '+ unit[1] +' ms'
                                        }else if(unit[0]=="minrtt"){
                                            title +='RTA_min = '+ unit[1] +' ms '
                                        }
                                        if(i<array.length-2){
                                            title += ','
                                        }
                                    }
                                }
                                msgStr += '<a title="' + title + '" href="#"> more</a> '
                            } else {
                            	msgStr +='<span class="badge bg-light-blue">N/A</span>'
                            }
                            return msgStr;
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
    //if($("#s").val() == null || $("#s").val() == "") {
	    $("div.toolbar")
	    	/*.append('<button class="btn btn-flat bg-blue margin" id="goback">返回分组列表</button>')*/
	        .append('<button class="btn btn-flat bg-blue margin" id="create">添加资源</button>')
	        //.append('<button class="btn btn-flat bg-blue margin" id="batch">批量导入</button>')
	        .append('<div class="btn-group margin"><button type="button" class="btn btn-flat bg-blue" name="delete">删除资源</button><button type="button" class="btn btn-flat bg-blue dropdown-toggle" style="height: 34px" data-toggle="dropdown" aria-expanded="false"> <span class="caret"></span> <span class="sr-only">Toggle Dropdown</span> </button> <ul class="dropdown-menu" role="menu"> <li><a name="batch_delete_toggle" _gid="' + $("#gid").val() + '">批量删除资源</a></li></ul> </div>')	        
	        //.append('<button class="btn btn-flat bg-blue margin" id="delete">删除资源</button>')
	        ;
    //}

    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><input type="hidden" name="gid" value="' + $("#gid").val() + '" /><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"添加资源"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/gresource/add",
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


    $("[name='delete']").click(function(){
        var checked_trs = $("#table tbody").find("input:checkbox:checked") ;
        if(checked_trs == undefined || checked_trs.size() == 0){
            $.jd_confirm({type:"error",message:"请选择要删除的记录"});
            return false ;
        }

        var gid = $("#gid").val();
        var ids = [] ;
        for(var i=0; i<checked_trs.size(); i++){
            ids.push(checked_trs.get(i).id) ;
        }

        $.jd_confirm({type:"info",message:"确认要删除ID为"+ids.join(",")+"的记录吗？",ok:function(){
            $.jd_ajax({url:"/gresource/del",type:"post",data:{ids:ids,gid:gid},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
        }});
    });
    

    $("[name='batch_delete_toggle']").click(function(){
        var _gid = $(this).attr("_gid");
        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '<input name="gid" type="hidden" value="'+_gid+'">',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"删除资源"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/gresource/batch_delete_toggle",
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
        
    
    
   /* $("#goback").click(function(){
    	window.location = "/group";
    	
    });*/

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