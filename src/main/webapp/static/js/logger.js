$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/logger/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        /*"language": {
            "url": "static/js/i18n/Chinese.json"
        },*/
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "userName",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    msgStr += '<span title="操作用户ERP" class="badge bg-light-blue">' + data + '</span> '
                    return msgStr;
                }
                	
            },
            {
            	"data": "level",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    msgStr += '<span title="日志级别" class="badge bg-purple">' + data + '</span> '
                    return msgStr;
                }
            },
            {
            	"data": "module",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    msgStr += '<span title="模块类型" class="badge bg-green">' + data + '</span> '
                    return msgStr;
                }
            },  
            { 
            	"data": "context",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    msgStr += '<span title="日志内容" style="word-wrap:break-word">' + data + '</span> '
                    return msgStr;
                }
            },
            {
            	"data": "type",
                "render": function ( data, type, full, meta ) {
                	if(data == "operator_log") {
                		data = "操作日志";
                	}
                	
                    var msgStr = "" ;
                    msgStr += '<span title="日志级别" class="badge bg-green-gradient">' + data + '</span> '
                    return msgStr;
                }
            }, 
            {
            	"data": "time",
                "render": function ( data, type, full, meta ) {
                    var msgStr = "" ;
                    msgStr += '<span title="日志级别" class="badge bg-green-gradient">' + data + '</span> '
                    return msgStr;
                }
            }
            
        ],
        initComplete: function () {
        	var column1 = this.api().column(1);
            var select1 = $('<select  style="width: 120px;"><option value="">日志级别</option><option value="DEBUG">DEBUG</option><option value="INFO">INFO</option><option value="ERROR">ERROR</option></select>')
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
            var select2 = $('<select  style="width: 120px;"><option value="">模块类型</option><option value="resource_log">资源管理</option><option value="monitor_log">监控管理</option><option value="group_log">分组管理</option><option value="user_log">用户管理</option><option value="api_log">API管理</option></select>')
                .appendTo( $(column2.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column2
                        .search( val)
                        .draw();
                } );
        }
    });
    
    var oList = document.getElementsByTagName("td");

});