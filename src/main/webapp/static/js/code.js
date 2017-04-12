$(function () {
	
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": false,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/liver/console/code/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {"data": "uid"},
            {"data": "code_value"},
            {"data": "create_time"},
            {
                "data": "expired",
                "render": function ( data, type, full, meta ) {
                	if(data == 0) {
                		return "未过期";
                	} else {
                		return "已过期";
                	}
                }
            }
            ]
        });

    // 添加toolbar
    $("div.toolbar")
    .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
    // toolbar绑定事件
    $('#create').click(function(){
    	
    	$.ajax({
            url:"/liver/console/code/create",
            type:"GET",
        }).done(function(data){
        	$table.ajax.reload();
        }).fail(function(data){
        });
    });

});