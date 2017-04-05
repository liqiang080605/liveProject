$(function () {
    // toolbar绑定事件
    $('#hostip').blur(
        function () {
            var ip = $('#hostip').val()
            $.ajax({
                url: "/alonegraph/query",
                type: "post",
                data: {
                    ip: ip
                },
                success: function (result) {
                    var $table = $('#table');

                    var nodata_p = $("#nodata_p");
                    var monitor_pic_tr = $("#monitor_pic_tr");
                    var monitor_pic_td = $("#monitor_pic_td");
                    var idc_tr = $("#idc_tr");
                    var idc_td = $("#idc_td");
                    var host_ip_tr = $("#host_ip_tr");
                    var host_ip_td = $("#host_ip_td");
                    var container_list_tr = $("#container_list_tr");
                    var container_list_td = $("#container_list_td");

                    nodata_p.hide();
                    monitor_pic_tr.hide();
                    idc_tr.hide();
                    host_ip_tr.hide();
                    container_list_tr.hide();

                    var containerList = result["containerList"];
                    var hostInfo = result["hostInfo"];

                    if (result["machineCount"] == 0) {
                        nodata_p.show();
                    } else {
                        monitor_pic_tr.show();

                        var ip_info = result["ip_info"];
                        var alias = "";
                        var idc = "";
                        if(null != ip_info) {
                            alias = null != ip_info.alias ? "("+ip_info.alias+")" : "";
                            idc = null != ip_info.idc ? ip_info.idc : "";
                        }

                        monitor_pic_td.html('<a target="_blank" href="/monitor/chart?ip='
                            + ip + '">' + ip + alias + '&nbsp;<img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a>');
                        if (containerList != null) {
                            idc_tr.show();
                            idc_td.html(null!=idc?idc:containerList[0].idc);
                            container_list_tr.show();
                            var tdhtml = "";
                            for (var i = 0; i < containerList.length; i++) {
                                tdhtml += '<a target="_blank" href="/monitor/chart?ip='
                                    + containerList[i].ip + '">'
                                    + containerList[i].ip
                                    + '&nbsp;<img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a><br />';
                            }

                            container_list_td.html(tdhtml);
                        }

                        if (hostInfo != null) {
                            idc_tr.show();
                            idc_td.html(null != hostInfo.idc ? hostInfo.idc : hostInfo.resIdc);

                            if (hostInfo.ip == null) {
                                container_list_tr.show();
                                var tdhtml = "null";
                                container_list_td.html(tdhtml);
                            } else {
                                host_ip_tr.show();
                                alias = null != hostInfo.alias ? "("+hostInfo.alias+")" : "";
                                host_ip_td.html('<a target="_blank" href="/monitor/chart?ip='
                                    + hostInfo.ip + '">'
                                    + hostInfo.ip + alias + '&nbsp;<img alt="监控图" title="监控图" src="../static/dist/img/icon-chart.png"></a>');
                            }
                        }
                    }
                    // $table.append(tr + "</tbody>");
                }
            });

        });

});