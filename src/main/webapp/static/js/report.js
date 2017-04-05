$(function () {

    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/report/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
                    { "data": "ext_info.idc" },
                    {
                        "data": "ip",
                        "render": function ( data, type, full, meta ) {
                            return '<a href="#" class="detail_a">'+data+'</a>&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                        }
                    },    
                    {
                        "data": "ext_info.distribute_time"
                    }, 

                    {
                        "data": "ext_info.operator"
                    }, 
                    {
                        "data": "ext_info.rdmanager"
                    }, 
                    {
                        "data": "ext_info.dept"
                    }, 
                    {
                        "data": "ext_info.dept_director"
                    }, 
                    {
                        "data": "ext_info.project_name"
                    }, 
                    {
                        "data": "ext_info.ip_type"
                    }, 
                    {
                        "data": "ext_info.sys_type"
                    }, 
                    {
                        "data": "metrics.netIN"
                    }, 
                    {
                        "data": "metrics.netOut"
                    }, 
                    {
                        "data": "metrics.cpu"
                    }, 
                    {
                        "data": "metrics.load"
                    }, 
                    {
                        "data": "metrics.memory"
                    }, 
                    {
                        "data": "metrics.tcp"
                    }
                ],
    });

    // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="reportExport">使用率报表导出</button>')

    // toolbar绑定事件
    $('#reportExport').click(function(){

    	//<input class="Wdate" type="text" onclick="WdatePicker()">
        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group"><label class="col-sm-2 control-label">开始时间</label><div class="col-sm-10"><input id="stime" name="stime" class="Wdate form-control" value="" type="text" onclick="WdatePicker()" /></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">结束时间</label><div class="col-sm-10"><input id="etime" name="etime" class="Wdate form-control" value="" type="text" onclick="WdatePicker()" /></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">接收报表邮箱</label><div class="col-sm-10"><textarea name="mails" class="form-control" rows="8" placeholder="多个邮箱地址使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"使用率报表导出"});
        var $form = $modal ;
        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(validate_create_form($form)){
                return false;
            }else{
                $.jd_ajax({
                    url:"/report/exportTopFile",
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