$(function () {
    // toolbar绑定事件
    $('#hostip').blur(function(){
        var ip = $('#hostip').val()
        var $table = $('#table');
        //var $loading = '<tr><td><div class="overlay"><i class="fa fa-refresh fa-spin"></i></div></td></tr>';
        var $loading = '<tr><td><i class="fa fa-refresh fa-spin"></i></td></tr>';
        $table.empty();
        $table.append($loading);

        $.ajax({
            url:"/life/query",
            type:"post",
            data:{ip:ip},
            success : function(result) {

                $("#table tr").empty();

                var $icon_map = {
                    "create": "fa-plus",
                    "delete": "fa-remove",
                    "stop": "fa-stop",
                    "start": "fa-play",
                    "resize": "fa-gear",
                    "reboot": "fa-repeat",
                    "evacuate": "fa-paper-plane",
                    "lock": "fa-lock",
                    "pause": "fa-pause",
                    "rename": "fa-edit",
                    "resume": "fa-link",
                    "unlock": "fa-unlock",
                    "unpause": "fa-youtube-play",
                    "suspend": "fa-unlink"
                };

                var $tmp = $('<ul class="timeline"></ul>');
                if(result["message"] == null) {
                    $table.empty();
                    var tr = '<tr><td>无结果</td></tr>';
                    $table.append(tr);
                } else {
                    $table.empty();
                    var $datepre = "";
                    $.each(result["message"], function(idx, obj) {
                        var $template = null;

                        if($datepre == "" || obj['date'] != $datepre) {
                            $template = $('<li class="time-label"> <span class="bg-blue" id="timelabel"></span> </li><li><i class="fa" id="actionicon"></i> <div class="timeline-item"> <span class="time"><i class="fa fa-clock-o" id="actiontime"></i></span> <h3 class="timeline-header"><span style="font-weight:bold;color: #316ad1" id="actionname"></span><span> by </span><span style="font-weight:bold" id="actor"></span></h3><div class="timeline-body"><span id="uuid"></span><br/><span id="message"></span></div> <div class="timeline-footer"></div> </div> </li>');
                            $template.find("#timelabel").text(obj.date);
                        } else {
                            $template = $('<li><i class="fa" id="actionicon"></i> <div class="timeline-item"> <span class="time"><i class="fa fa-clock-o" id="actiontime"></i></span> <h3 class="timeline-header"><span style="font-weight:bold;color: #316ad1" id="actionname"></span><span> by </span><span style="font-weight:bold" id="actor"></span></h3> <div class="timeline-body"><span id="uuid"></span><br/><span id="message"></span></div> <div class="timeline-footer"></div> </div> </li>');
                        }
                        $datepre = obj.date;

                        if(obj.result == "ERROR") {
                            $template.find("#actionicon").addClass("bg-red");
                        } else {
                            $template.find("#actionicon").addClass("bg-green");
                        }

                        if($icon_map[obj.action] == null) {
                            $template.find("#actionicon").addClass("fa-tags");
                        } else {
                            $template.find("#actionicon").addClass($icon_map[obj.action]);
                        }

                        $template.find("#actiontime").text(" " + obj.time);
                        $template.find("#message").text("Details: "+ obj.message);
                        $template.find("#actionname").text(obj.action);
                        $template.find("#actor").text(obj.actor);
                        $template.find("#uuid").text("UUID: "+obj.uuid);

                        $tmp.append($template);
                    });
                    $table.append($tmp);
                }
            }
        });

    });
});