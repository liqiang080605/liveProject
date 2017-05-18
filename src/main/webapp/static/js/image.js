$(function () {
    // 添加toolbar
    $("div.toolbar")
    .append('<button class="btn btn-flat bg-blue margin" id="upload">图片上传</button>')
    // toolbar绑定事件
    $('#upload').click(function(){

        var create_tmpl = [
            '<form class="form-horizontal" method="post" action="/machine/batch">',
            '<div class="form-group"><label class="col-sm-2 control-label">图片</label><div class="col-sm-10"><input type="file" class="form-control" name="file"></div></div>',
            '<div class="form-group"><div class="col-sm-2 col-sm-offset-4"><button type="button" class="btn btn-primary">确认</button></div><div class="col-sm-6"><button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"创建"});
        var $form = $modal ;

        $form.find('input[type="file"]').ajaxfileupload({
            'action': '/liver/console/image/upload',
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
                    url:"/machine/batch",
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

});