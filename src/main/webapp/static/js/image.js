$(function () {

    $("[name='time'] .btn").click(function () {

        var create_tmpl = [
            '<form class="form-horizontal" method="post" action="/machine/batch">',
            '<div class="form-group"><label class="col-sm-2 control-label">图片</label><div class="col-sm-10"><input type="file" class="form-control" name="file"></div></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title:"上传"});
        var $form = $modal ;

        $form.find('input[type="file"]').ajaxfileupload({
            'action': '/liver/console/image/upload',
            'valid_extensions':['bmp','jpg','jpeg','png','gif'],
            'onComplete': function(data) {
                if(data.code){
                    $.jd_confirm({type:"error",message:data.message});
                }else{
                	alert(data.message)
                	$modal.data("modal").close();
                	//$.jd_confirm({type:"success",message:data.message});
                }
            }
        });
    });

});