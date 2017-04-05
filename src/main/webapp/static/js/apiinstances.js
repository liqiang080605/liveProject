$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "select": true,
        "ajax":"/apiinstances/list",
        "ordering": true,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        "columns": [
                    {
                        "data": "id",
                        "render": function ( data, type, full, meta ) {
                            return '<input type="checkbox" id="'+data+'" value="'+full.name+'"></input>';
                        }
                    },
                    {
                        "data": "aPIInfo",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var aPIInfo = data;
                        	if(null != aPIInfo) {
                        		msgStr += aPIInfo.name;
                        	}
                            return msgStr;
                        }
                    },
                    {
                        "data": "aPIPinInfo",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var aPIPinInfo = data;
                        	if(null != aPIPinInfo) {
                        		msgStr += aPIPinInfo.pin;
                        	}
                            return msgStr;
                        }
                    },
                    {
                        "data": "aPIPinInfo",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                        	var list = data.apurList;
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
                    {
                        "data": "status",
                        "render": function ( data, type, full, meta ) {
                        	var msgStr = '';
                    		var spanClass = "badge bg-green"
                    		var spanText = "正常";
                    		if(data == 0) {
                    			spanClass = "badge bg-green"
                    			spanText = "正常"
                    		}
                    		if(data == 1) {
                    			spanClass = "badge bg-red"
                    			spanText = "禁用"
                    		}
                    		msgStr += '<span class="' + spanClass + '">' + spanText + '</span> '
                            return msgStr;
                        }
                    },               
                    { "data": "call_total_times" },
                    {
                        "data": "call_per_total_times",
                        "render": function ( data, type, full, meta ) {
                        	var call_per_total_times = data;
                        	var current_total = full.call_total_times;
                        	var rate = 0;
                        	if(null != call_per_total_times && null != current_total) {
                        		rate = current_total - call_per_total_times;
                        	}
                            return rate;
                        }
                    }
        ],
        initComplete: function () {
            var that = this;
            var column = this.api().column(4);
            var select = $('<select><option value="">状态</option><option value="0">正常</option><option value="1">禁用</option></select>')
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
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>');

    // toolbar绑定事件
    $('#create').click(function(){
        var create_tmpl = $("#tmpl_create").text();
        var $modal = $(create_tmpl).jd_modal({title:"创建"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
    			var id_api_name=$("#id_api_name").val();
    			var id_pin=$("#id_pin").val();
    			var id_erp=$("#id_erp").val();
                $.jd_ajax({
                    url:"/apiinstances/createNewAuth",
                    type:"post",
                    data:{"apiname":id_api_name,"pin":id_pin,"erps":id_erp},
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
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
            $.jd_ajax({url:"/apiinstances/delete",type:"post",data:{ids:ids},ok:function(){
                setTimeout(function(){$table.ajax.reload()},1000);
            }});
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