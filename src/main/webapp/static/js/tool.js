/**
 * Created by njwangxi@jd.com on 2015/7/13.
 */

/**
 * Modal
 */
+function ($){
    'use strict';

    var defaults = {
        title:'Modal',
        template: [
            '<div class="modal">',
                '<div class="modal-dialog">',
                '<div class="modal-content">',
                    '<div class="modal-header">',
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                            '<h4 class="modal-title">{{TITLE}}</h4>',
                        '</div>',
                        '<div class="modal-body"></div>',
                        '<div class="modal-footer">',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join(''),
        onClose: function() {}
    } ;
    
    var large = {
            title:'Modal',
            template: [
                '<div class="modal">',
                    '<div class="modal-dialog">',
                    '<div class="modal-content" style="width:1000px">',
                        '<div class="modal-header">',
                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                                '<h4 class="modal-title">{{TITLE}}</h4>',
                            '</div>',
                            '<div class="modal-body"></div>',
                            '<div class="modal-footer">',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''),
            onClose: function() {}
        } ;

    var Modal = function(elem, options) {
        this.$elem = elem;
        this.options = options;
        this.init();
    };

    Modal.prototype = {

        constructor: Modal,

        init: function() {

            var $elem = this.$elem;
            var opts = this.options;

            this.$modal = $(opts.template.replace('{{TITLE}}', opts.title))
                .find('.modal-body')
                .html($elem)
                .end()
                .modal()
                .on('hidden.bs.modal',function(){
                    $(this).remove();
                });
        },

        close: function(e) {
            if (e) {
                e.preventDefault();
            }
            this.options.onClose();
            this.$modal.modal('hide');
        }
    };

    $.fn.jd_modal = function(option) {
        return this.each(function() {
            var $this = $(this);
            var options = $.extend({}, defaults, option);
            $this.data('modal', new Modal($this, options));
        });
    };
    
    $.fn.jd_modal_large = function(option) {
        return this.each(function() {
            var $this = $(this);
            var options = $.extend({}, large, option);
            $this.data('modal', new Modal($this, options));
        });
    };
}(jQuery);

/**
 * Confirm
 */
+function($){
    var Confirm = function(options){
        this.initialize(options);
    };

    Confirm.prototype = {
        defaults: {
            'type': 'info',
            'ok': function() {},
            'cancel': function() {},
            'text_ok': '确定',
            'text_cancel': '取消'
        },
        initialize: function(options) {
            this.message = options.message;
            this.fields = options.fields;
            this.type = options.type || this.defaults.type;
            this.ok = options.ok || this.defaults.ok;
            this.text_ok = options.text_ok || this.defaults.text_ok;
            this.text_cancel = options.text_cancel || this.defaults.text_cancel;
            this.cancel = options.cancel || this.defaults.cancel;
            this.width = options.width || 300;
            this.init();
        },
        init: function() {

            this.$elem = $('<div></div>');

            var icon_type = this.type;
            if(this.type == "error"){
                icon_type = "ban";
            }else if(this.type == "success"){
                icon_type = "check"
            }else if(this.type == "info"){
                icon_type = "info"
            }

            var $msg = $('<div><span class="icon fa fa-' + icon_type + '"></span>' + this.message + '</div>');

            $msg.addClass('alert alert-' + this.type);

            this.$elem.append($msg);

            if (this.fields) {
                var $fields = $('<form>' + this.fields + '</form>');
                this.$elem
                    .append($fields)
                    .on('submit', 'form', $.proxy(this.submit, this));
            } else {
                this.addOkBtn();
                this.addCancelBtn();
            }
            this.$elem.on('click', 'a.close', $.proxy(this.close, this));

            this.$elem.jd_modal({
                title: '提示',
                width: this.width
            });

            return this;
        },

        addOkBtn: function() {
            var $ok = $('<div class="col-sm-2 col-sm-offset-4"><a href="#" class="btn btn-primary btn-ok">' + this.text_ok + '</a></div>');
            this.$elem.append($ok)
                .on('click', '.btn-ok', $.proxy(this.confirm, this))
                .on('keydown', '', $.proxy(this.confirm, this));
        },

        addCancelBtn: function() {
            var $cancel = $('<div class="col-sm-6"><a href="#" class="btn btn-default btn-cancel" autofocus>' + this.text_cancel + '</a></div>');
            this.$elem.append($cancel)
                .on('click', '.btn-cancel', $.proxy(this.dismiss, this))
                .on('keydown', '', $.proxy(this.dismiss, this));
        },

        submit: function(e) {
            e.preventDefault();
            var value = this.$elem.find('input').val();
            this.ok(value);
            this.close(e);
        },

        confirm: function(e) {
            this.close(e);
            var ok = this.ok;
            ok();
        },

        close: function(e) {
            this.$elem.data('modal').close(e);
        },

        dismiss: function(e) {
            this.close(e);
            var cancel = this.cancel;
            cancel();
        }
    }

    $.extend({
        jd_confirm:function(options){
            return new Confirm(options);
        }
    });
}(jQuery);

/**
 * jd extend
 */
+function($){
    $.extend({
        jd_ajax:function(options){

            $.ajax({
                url:options.url,
                type:options.type,
                data:options.data
            }).done(function(data){
                if(data.code){
                    $.jd_confirm({type:"error",message:data.message});
                }else{
                    if(options.ok){
                        options.ok();
                    }
                    if(data.message){
                        $.jd_confirm({type:"success",message:data.message});
                    }else{
                        $.jd_confirm({type:"success",message:"操作成功！"});
                    }
                }
            }).fail(function(data){
                $.jd_confirm({type:"error",message:"访问服务器失败请稍后重试！"})
            });
        }
    });
}(jQuery);

/**
 * ajax fileupload
 */
+function($) {
    $.fn.ajaxfileupload = function(options) {
        var settings = {
            params: {},
            action: '',
            onStart: function() { },
            onComplete: function(response) { },
            onCancel: function() { },
            validate_extensions : true,
            valid_extensions : ['gif','png','jpg','jpeg'],
            submit_button : null
        };

        var uploading_file = false;

        if ( options ) {
            $.extend( settings, options );
        }


        // 'this' is a jQuery collection of one or more (hopefully)
        //  file elements, but doesn't check for this yet
        return this.each(function() {
            var $element = $(this);

            // Skip elements that are already setup. May replace this
            //  with uninit() later, to allow updating that settings
            if($element.data('ajaxUploader-setup') === true) return;

            $element.change(function()
            {
                // since a new image was selected, reset the marker
                uploading_file = false;

                // only update the file from here if we haven't assigned a submit button
                if (settings.submit_button == null)
                {
                    upload_file();
                }
            });

            if (settings.submit_button == null)
            {
                // do nothing
            } else
            {
                settings.submit_button.click(function(e)
                {
                    // Prevent non-AJAXy submit
                    e.preventDefault();

                    // only attempt to upload file if we're not uploading
                    if (!uploading_file)
                    {
                        upload_file();
                    }
                });
            }

            var upload_file = function()
            {
                if($element.val() == '') return settings.onCancel.apply($element, [settings.params]);

                // make sure extension is valid
                var ext = $element.val().split('.').pop().toLowerCase();
                if(true === settings.validate_extensions && $.inArray(ext, settings.valid_extensions) == -1)
                {
                    // Pass back to the user
                    settings.onComplete.apply($element, [{status: false, message: 'The select file type is invalid. File must be ' + settings.valid_extensions.join(', ') + '.'}, settings.params]);
                } else
                {
                    uploading_file = true;

                    // Creates the form, extra inputs and iframe used to
                    //  submit / upload the file
                    wrapElement($element);

                    // Call user-supplied (or default) onStart(), setting
                    //  it's this context to the file DOM element
                    var ret = settings.onStart.apply($element, [settings.params]);

                    // let onStart have the option to cancel the upload
                    if(ret !== false)
                    {
                        $element.parent('form').submit(function(e) { e.stopPropagation(); }).submit();
                    }
                }
            };

            // Mark this element as setup
            $element.data('ajaxUploader-setup', true);

            /*
             // Internal handler that tries to parse the response
             //  and clean up after ourselves.
             */
            var handleResponse = function(loadedFrame, element) {
                var response, responseStr = $(loadedFrame).contents().text();
                try {
                    //response = $.parseJSON($.trim(responseStr));
                    response = JSON.parse(responseStr);
                } catch(e) {
                    response = responseStr;
                }

                // Tear-down the wrapper form
                element.siblings().remove();
                element.unwrap();

                uploading_file = false;

                // Pass back to the user
                settings.onComplete.apply(element, [response, settings.params]);
            };

            /*
             // Wraps element in a <form> tag, and inserts hidden inputs for each
             //  key:value pair in settings.params so they can be sent along with
             //  the upload. Then, creates an iframe that the whole thing is
             //  uploaded through.
             */
            var wrapElement = function(element) {
                // Create an iframe to submit through, using a semi-unique ID
                var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
                $('body').after('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
                $('#'+frame_id).get(0).onload = function() {
                    handleResponse(this, element);
                };

                // Wrap it in a form
                element.wrap(function() {
                    return '<form action="' + settings.action + '" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
                })
                    // Insert <input type='hidden'>'s for each param
                    .before(function() {
                        var key, html = '';
                        for(key in settings.params) {
                            var paramVal = settings.params[key];
                            if (typeof paramVal === 'function') {
                                paramVal = paramVal();
                            }
                            html += '<input type="hidden" name="' + key + '" value="' + paramVal + '" />';
                        }
                        return html;
                    });
            }



        });
    }
}( jQuery );