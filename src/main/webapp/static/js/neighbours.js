$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
        "serverSide": true,
        "searching": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "select": true,
        "ajax":"/neighbours/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        "columns": [
            {"data": "host_ip"},
            {
                "data": "ip_infos",
                "defaultContent": "",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    var query_sys_name = full.query_sys_name;
                    for(var i=0;i<data.length;i++){
                    	//
                    	if(null != query_sys_name) {
                    		var needStar = false;
                        	if(query_sys_name.indexOf(data[i].sys_name) != -1) {
                        		needStar=true;
                        	} else if(query_sys_name.indexOf("," + data[i].sys_name) != -1) {
                        		needStar=true;
                            } else if(query_sys_name.indexOf(data[i].sys_name + ",") != -1) {
                        		needStar=true;
                            }
                        	if(needStar) {
                                msgStr += '<i title="当前查询的容器或者应用" class="fa fa-star text-yellow"></i>';
                        	}
                    	}
                        msgStr += '<span title="应用名称" class="badge bg-blue-gradient">' + data[i].sys_name + '</span> ';
                        msgStr += '<span title="系统级别" class="badge bg-navy">' + data[i].sys_level_desc + '</span> ';
                        msgStr += '<span title="开发者" class="badge bg-green-gradient">' + data[i].sys_leader_nm + '（' + data[i].sys_leader + '）' + '</span> ';
                        if(i != data.length - 1){
                            msgStr += "<br/>"
                        }
                    }
                    return msgStr;
                }
            }
            ]
        });


    $("input[type=search]").attr("placeholder", "容器IP、宿主机IP、应用名"); 
    $("input[type=search]").attr("title", "可依据容器IP、宿主机IP、应用名查询"); 


    
    
    
});