$(function () {

    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/subscribe/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
            {
                "data": "id",
                "render": function ( data, type, full, meta ) {
                    return '<input type="checkbox" id="'+data+'"></input>';
                }
            },
            {
                "data": "name"
            },
            { "data": "erp" },
            { "data": "department" },
            { "data": "mobile" },
            { "data": "email" }
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

    // 绑定选择事件
    $('#table tbody').on( 'click', 'input:checkbox', function () {
        $(this).parents("tr").toggleClass('selected');
    });


    // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="create">订阅</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="delete">删除</button>');

    // toolbar绑定事件
    $('#create').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">用户ERP</label><div class="col-sm-10"><textarea name="erps" class="form-control" rows="8" placeholder="多个ERP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"添加ERP账号"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/subscribe/add",
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


    $("#delete").click(function(){
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
            $.jd_ajax({url:"/subscribe/del",type:"post",data:{ids:ids},ok:function(){
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