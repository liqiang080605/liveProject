$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "select": true,
        "ajax":"/apipin/list",
        "ordering": true,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        "columns": [
                    { "data": "pin" },   
                    {
                        "data": "apurList",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var list = data;
                        	if(null != list) {
                            	
                            	for(var i=0;i<list.length;i++) {
                            		
                            		var user = list[i].user;
                            		
                            		if(null != user) {
                            			var erp = user.erp;
                            			var name = user.name;
                            			msgStr += '<span title="erp" class="badge bg-purple">' + user.name + '</span> '
                            			msgStr += '<span title="erp" class="badge bg-navy">' + user.erp + '</span> '
                                		msgStr += "<br />"
                            		}
                            	}
                        		
                        	}
                            return msgStr;
                        }
                    },
		            { "data": "create_time" },
		            { "data": "update_time" }
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
    .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>');

    // toolbar绑定事件
    $('#create').click(function(){
        $.jd_ajax({
            url:"/apipin/create",
            type:"post",
            ok:function(){
                $table.ajax.reload();
            }
        });
    });

    
    
});