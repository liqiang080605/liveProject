$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "select": true,
        "ajax":"/apiinfo/list",
        "ordering": true,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        "columns": [
                    { "data": "name" },   
                    { "data": "dsc" },   
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
                    },  
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
        var create_tmpl = $("#tmpl_create").text();
        var $modal = $(create_tmpl).jd_modal({title:"创建"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
    			var id_name=$("#id_name").val();
    			var id_dsc=$("#id_dsc").val();
                $.jd_ajax({
                    url:"/apiinfo/create",
                    type:"post",
                    data:{"id_dsc":id_dsc,"id_name":id_name},
                    ok:function(){
                        $modal.data("modal").close();
                        $table.ajax.reload();
                    }
                });
            }
        });
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