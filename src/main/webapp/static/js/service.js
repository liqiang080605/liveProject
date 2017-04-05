$(function () {
    // 初始化表格
    var $table = $("#table").DataTable({
        /*"processing": true,*/
        "serverSide": true,
        "searching": true,
        "select": true,
        "pageLength": 15,
        "lengthMenu": [ 15, 30, 50, 75, 100 ],
        "ajax":"/service/list",
        "ordering": false,
        "dom": '<"toolbar"><"col-sm-6"l><"col-sm-6"<"type">f>rt<"col-sm-6"i><"col-sm-6"p>',
        /*"language": {
            "url": "static/js/i18n/Chinese.json"
        },*/
        // id, ip, idc, model, power_u, power_p, update_time, create_time
        "columns": [
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
            { "data":"app_types" },
            { "data": "update_time" }
        ],
        initComplete: function () {
            var that = this;
            var column = this.api().column(2);
            var select = $('<select id="selectpicker_id" class="selectpicker bla bla bli" multiple title="service"><option value="">service</option><option value="tomcat">tomcat</option><option value="jvm">jvm</option><option value="nginx">nginx</option></select>')
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

 // 添加toolbar
    $("div.toolbar")
        .append('<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
        .append('<button class="btn btn-flat bg-blue margin" id="batch">批量导入</button>')
        ;

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
                $.jd_ajax({
                    url:"/service/create",
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
    
    $('#batch').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal" method="post" action="/service/batch">',
            '<div class="form-group"><label class="col-sm-2 control-label">导入模板</label><div class="col-sm-10"><a href="/static/serviceTemplate.xls">template.xls</a></div></div>',
            '<div class="form-group"><label class="col-sm-2 control-label">XLS文件</label><div class="col-sm-10"><input type="file" class="form-control" name="file"></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"创建"});
        var $form = $modal ;

        $form.find('input[type="file"]').ajaxfileupload({
            'action': '/file/upload',
            'valid_extensions':['xls'],
            'onComplete': function(data) {
                if(data.code){
                    $.jd_confirm({type:"error",message:data.message});
                }else{
                    $(this).parent().append('<label class="control-label">' + data.path + '</label>')
                        .append('<input type="hidden" name="filename" value="'+data.path+'">');
                    $(this).remove();
                }
            }
        });

        $modal.on("click",".btn.btn-primary",function(){
            // 判断是否有错误
            if(!$form.find("input[name='filename']").val()){
                $.jd_confirm({type:"error",message:"请上传文件"});
                return false;
            }else{
                $.jd_ajax({
                    url:"/service/batch",
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
    
    $('#table tbody').on( 'click', '.detail_a', function () {
        var ip = $(this).text();
        
        $.ajax({
            url:"/machine/extendInfos?ip=" + ip,
            type:"get",
            //data:options.data
        }).done(function(data){
        	var create_tmpl = [];
        	create_tmpl.push('<form class="form-horizontal">');
        	extendInfosMap = data.data;
        	for (var prop in extendInfosMap) {
                var mapVal = extendInfosMap[prop];
                create_tmpl.push('<div class="form-group"><label class="col-sm-2 control-label">' + prop + '</label><div class="col-sm-10"><textarea readonly name="ips" class="form-control" rows="8">' + JSON.stringify(mapVal) + '</textarea></div></div>');
            }
        	create_tmpl.push('</form>');
        	create_tmpl = create_tmpl.join("");
        	var $modal = $(create_tmpl).jd_modal({title:"基本信息"});
        	
        	/*var create_tmpl = [
        	                   '<form class="form-horizontal">',
        	                   '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
        	                   '<div class="form-group"><label class="col-sm-2 control-label">资源IP</label><div class="col-sm-10"><textarea name="ips" class="form-control" rows="8" placeholder="多个IP使用分隔符(支持空格,逗号,换行)"></textarea></div></div>',
        	                   '</form>',
        	               ].join("");

            var $modal = $(create_tmpl).jd_modal({title:"批量删除"});*/
        }).fail(function(data){
        });   
        
    }); 

});