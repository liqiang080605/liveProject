/**
 * Created by njwangxi@jd.com on 2015/7/15.
 */

$(function () {

    var color_list = ["#3c8dbc", "#CD8500", "#B03060", "#666666", "#191970", "#006600", "#FFD700"];
    var percent_config = {
        grid: {
            hoverable: true,
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
        },
        series: {
            shadowSize: 0, // Drawing is faster without shadows
        },
        lines: {
            fill: true, //Converts the line chart to area chart
        },
        yaxis: {
            min: 0,
            max: 100,
            show: true
        },
        xaxis: {
            ticks: 10,
            mode: "time",
            timezone: "browser",
            show: true
        },
        colors: color_list
    };

    var pollster_config = {
        grid: {
            hoverable: true,
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
        },
        series: {
            shadowSize: 0, // Drawing is faster without shadows
        },
        lines: {
            fill: true, //Converts the line chart to area chart
        },
        yaxis: {
            minTickSize: 10,
            autoscaleMargin: 0.2,
            min: 0
        },
        xaxis: {
            ticks: 10,
            mode: "time",
            timezone: "browser",
            show: true
        },
        colors: color_list
    };
    var meterMap = getMeters();

    var monitor_config = {};
    for (var prop in meterMap) {
        if (meterMap.hasOwnProperty(prop)) {
            var mapVal = meterMap[prop];
            var unitVal = mapVal["meter_unit"];
            var idxVal = 0;
            if (unitVal != "%") {
                idxVal = 1;
            }
            monitor_config[prop.replace(/\./g, "_")] = {name: prop, index: idxVal};
        }
    }


    /*
     * Flot Interactive Chart
     * -----------------------
     */
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var data = [];
    var ip = $('#ip').val();
    var time = "0.5";
    var startTime = "";
    var endTime = "";
    var sDate;
    var eDate;

    function refreshData(q_type, app_port) {
        if (null == time && (startTime == "" || endTime == "")) {
            return false;
        }

        var queryHostCondition = "";

        if(null != app_port && app_port != "") {
            queryHostCondition = ip + "_" + app_port;
        } else {
            queryHostCondition = ip;
        }

        var reqUrl = "/monitor/d?ip=" + queryHostCondition + "&period=" + time + "&t=" + h(queryHostCondition + time) + "&type=" + q_type;
        if (startTime != "" && endTime != "") {
            reqUrl = "/monitor/dd?ip=" + queryHostCondition + "&startTime=" + Date.parse(sDate) + "&endTime=" + Date.parse(eDate) + "&t=" + h(queryHostCondition + Date.parse(sDate) + Date.parse(eDate)) + "&type=" + q_type;
        }

        $.ajax({url: reqUrl, type: "get", dataType: "json"})
            .done(function (resp) {
                if (resp.info) {
                    data = resp.info;
                    // cpu memory net_in net_out disk_use tcp
                    $(".chart").each(function () {
                        var id = $(this).attr("id");
                        // console.log(id);
                        var name = monitor_config[id]['name'];
                        var index = monitor_config[id]['index'];
                        var config = {};
                        if (index) {
                            config = pollster_config;
                        } else {
                            config = percent_config;
                        }
                        var monitor_data = getData(name);
                        $.plot("#" + id, monitor_data, config);
                        if (name == "network.incoming.packets.rate" || name == "network.outgoing.packets.rate") {
                            if (null != monitor_data) {
                                for (var i = 0; i < monitor_data.length; i++) {
                                    var labelData = monitor_data[i].data;
                                    var label_val = monitor_data[i].label;
                                    for (var j = 0; j < labelData.length; j++) {
                                        var labelPointData = labelData[j];
                                        if (null != labelPointData) {
                                            var xdata = labelData[j][0];
                                            var ydata = labelData[j][1];
                                            var y_extdata = labelData[j][2];
                                            var data_key = id + label_val + xdata;
                                            var data_body = {};
                                            data_body[data_key] = y_extdata;
                                            $("#" + id + "_data").data(data_body);
                                        }
                                    }
                                }
                            }
                        }


                        $("#" + id).unbind().bind("plothover", function (event, pos, item) {

                            if (item) {
                                var x = item.datapoint[0],
                                    y = item.datapoint[1].toFixed(2);

                                var data_key = id + item.series.label + x;
                                var y_ext = $("#" + id + "_data").data(data_key);
                                if (null == y_ext) {
                                    y_ext = "";
                                }

                                var date = new Date(x);

                                var width = item.pageX;
                                if (width + 200 > window.screen.width) {
                                    width = window.screen.width - 200;
                                }

                                $("#line-chart-tooltip").html(item.series.label + "在" + moment(date).format('YYYY-MM-DD HH:mm:ss') + "的值为" + y + " " + y_ext)
                                    .css({top: item.pageY + 5, left: width + 5})
                                    .fadeIn(200);
                            } else {
                                $("#line-chart-tooltip").hide();
                            }

                        });
                    });
                }
            });
    }

    function getData(name) {
        return data[name] == undefined ? [] : data[name];
    }

    refreshData(1, null);

    //Initialize tooltip on hover
    $('<div class="tooltip-inner" id="line-chart-tooltip"></div>').css({
        position: "absolute",
        display: "none",
        opacity: 0.8
    }).appendTo("body");

    function update() {
        refreshData($("#q_type").val(), $("#current_port").val());
    }

    //REALTIME TOGGLE
    $("[name='realtime'] .btn").click(function () {
        if ($(this).data("toggle") === "on") {
            realtime = "on";
        }
        else {
            realtime = "off";
        }
        update();
    });

    //TIME TOGGLE
    $("[name='time'] .btn").click(function () {
        startTime = "";
        endTime = "";
        time = $(this).data("toggle");

        update();
    });


    $("#query").click(function () {
        startTime = document.getElementById("startTimer").value;
        endTime = document.getElementById("endTimer").value;
        if (startTime == "" || endTime == "") {
            return false;
        } else {
            var tmp_stime = startTime.replace(/-/g, "/");
            sDate = new Date(startTime);

            var tmp_etime = endTime.replace(/-/g, "/");
            eDate = new Date(endTime);

            var iDays = parseInt(Math.abs(Date.parse(eDate) - Date.parse(sDate)) / 1000 / 60 / 60 / 24);

            if (iDays > 30) {
                alert("最多只能查询一个月的数据。")
                return false;
            }
            refreshData($("#q_type").val(), $("#current_port").val());
        }
    });

    var vm_type = $('#ipType').val();
    var vm_userErp = $('#userErp').val();
    if (vm_type == 0) {
        $("#tab_5").hide();
        var list = ["#data_cpu_usage", "#data_mem_usage", "#data_load", "#data_net_in_bytes_rate", "#data_net_out_bytes_rate", '#data_Net_In_Packets_Rate',
            '#data_Net_Out_Packets_Rate', "#data_disk_read_bytes_rate", "#data_disk_write_byte_rate", '#data_Disk_Read_Requests_Rate',
            '#data_Disk_Write_Requests_Rate', '#data_Disk_IO_Util', "#data_tcp_connections", "#data_Threads", "#data_Processes", '#data_Ip_InReceives',
            '#data_Ip_InDiscards', '#data_Tcp_ActiveOpens', '#data_Tcp_InErrs', '#data_Tcp_RetransSegs', '#data_Tcp_InSegs', '#data_Tcp_OutSegs',
            '#data_FD', '#data_MemoryFailcnt', '#data_MemorySwap'];

        for (var i = 0; i < list.length; i++) {
            $(list[i])[0].style.display = "none";
        }
    } else {
        $("#tab_4").hide();
    }

    $("#tab_6").hide();
    $("#tab_7").hide();
    $("#tab_8").hide();
    var app_ports = $('#app_ports').val();
    var appObj = null;
    if(null != app_ports && app_ports != "") {
        appObj = JSON.parse(app_ports);
        if(null != appObj['nginx']) {
            $("#tab_6").show();
        }
        if(null != appObj['tomcat']) {
            $("#tab_7").show();
            $("#tab_8").show();
        }
        if(null != appObj['jvm']) {
            $("#tab_8").show();
        }
    }


    $("#tab_1").click(function () {
        $("#div_show_tab_1").show();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(1);
        refreshData($("#q_type").val(), null);
        $("#div_app_instances").hide();
    });

    $("#tab_2").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").show();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(2);
        refreshData($("#q_type").val());
        $("#div_app_instances").hide();
    });

    $("#tab_3").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").show();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(3);
        refreshData($("#q_type").val(), null);
        $("#div_app_instances").hide();
    });

    $("#tab_4").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").show();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(4);
        refreshData($("#q_type").val(), null);
        $("#div_app_instances").hide();
    });

    $("#tab_5").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").show();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(5);
        refreshData($("#q_type").val(), null);
        $("#div_app_instances").hide();
    });

    $("#tab_6").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").show();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").hide();
        $("#q_type").val(6);
        var app_name = "nginx";

        if(null != appObj) {
            if(null != appObj[app_name]) {
                $("#current_port").val(appObj[app_name][0]);
            }
        }

        refreshData($("#q_type").val(), $("#current_port").val());
        $("#div_app_instances").hide();
    });

    $("#tab_7").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").show();
        $("#div_show_tab_8").hide();
        $("#q_type").val(7);
        var app_name = "tomcat";

        if(null != appObj) {
            if(null != appObj[app_name]) {
                var portsArr = appObj[app_name];
                if(portsArr.length > 1) {
                    $("#div_app_instances").show();

                    $("#app_instances").empty();
                    var selected = "";
                    for (var i = 0, l = portsArr.length; i < l; i++) {
                        if (i == 0) {
                            selected = "selected='"
                                + selected
                                + "'";
                        } else {
                            selected = "";
                        }

                        $("#app_instances")
                            .append(
                                "<option "
                                + selected
                                + " value='"
                                + portsArr[i]
                                + "'>"
                                + portsArr[i]
                                + "</option>");
                    }
                    $("#app_instances").change(function() {
                        $("#current_port").val($("#app_instances").val());
                        refreshData($("#q_type").val(), $("#current_port").val());
                    });
                }
                $("#current_port").val(appObj[app_name][0]);
            }
        }


        refreshData($("#q_type").val(), $("#current_port").val());
    });

    $("#tab_8").click(function () {
        $("#div_show_tab_1").hide();
        $("#div_show_tab_2").hide();
        $("#div_show_tab_3").hide();
        $("#div_show_tab_4").hide();
        $("#div_show_tab_5").hide();
        $("#div_show_tab_6").hide();
        $("#div_show_tab_7").hide();
        $("#div_show_tab_8").show();
        $("#q_type").val(8);
        var app_jvm_name = "jvm";
        var app_tomcat_name = "tomcat";

        if(null != appObj) {
            if(null != appObj[app_jvm_name] || null != appObj[app_tomcat_name]) {
                var jvmPortsArr = appObj[app_jvm_name];
                var tomcatPortsArr = appObj[app_tomcat_name];
                var lenJvm = null != jvmPortsArr ? jvmPortsArr.length : 0;
                var lenTomcat = null != tomcatPortsArr ? tomcatPortsArr.length : 0;

                var totalLen = lenJvm + lenTomcat;

                var default_port = "";
                if(null != tomcatPortsArr) {
                    default_port = appObj[app_tomcat_name][0];
                } else if(null != jvmPortsArr) {
                    default_port = appObj[app_jvm_name][0];
                }

                if(totalLen > 1) {
                    $("#div_app_instances").show();

                    $("#app_instances").empty();
                    var selected = "";
                    for (var i = 0, l = tomcatPortsArr.length; i < l; i++) {
                        if (i == 0) {
                            selected = "selected='"
                                + selected
                                + "'";
                        } else {
                            selected = "";
                        }

                        $("#app_instances")
                            .append(
                                "<option "
                                + selected
                                + " value='"
                                + tomcatPortsArr[i]
                                + "'>"
                                + tomcatPortsArr[i] + "[Tomcat]"
                                + "</option>");
                    }
                    for (var i = 0, l = jvmPortsArr.length; i < l; i++) {
                        $("#app_instances")
                            .append(
                                "<option "
                                + " value='"
                                + jvmPortsArr[i]
                                + "'>"
                                + jvmPortsArr[i] + "[JVM]"
                                + "</option>");
                    }



                    $("#app_instances").change(function() {
                        $("#current_port").val($("#app_instances").val());
                        refreshData($("#q_type").val(), $("#current_port").val());
                    });
                }
                $("#current_port").val(default_port);
            }
        }


        refreshData($("#q_type").val(), $("#current_port").val());
    });




    var count = 0;
    window.queryCurrentMetric = function queryCurrentMetric(metric) {
        count++;
        var chartDivName = "container_metrics" + count;

        var title = null;
        if (metric == "CPU_Usage") {
            title = "cpu使用率";
        }
        if (metric == "MEM_Usage") {
            title = "内存使用率"
        }
        if (metric == "Load") {
            title = "负载"
        }
        if (metric == "Net_In_Bytes_Rate") {
            title = "网络流出量（MB/S）"
        }
        if (metric == "Net_Out_Bytes_Rate") {
            title = "网络流出量（MB/S）"
        }
        if (metric == "Net_In_Packets_Rate") {
            title = "网络流入包个数"
        }
        if (metric == "Net_Out_Packets_Rate") {
            title = "网络流出包个数"
        }
        if (metric == "Disk_Read_Bytes_Rate") {
            title = "磁盘读速度（KB/s）"
        }
        if (metric == "Disk_Write_Bytes_Rate") {
            title = "磁盘写速度（KB/s）"
        }
        if (metric == "Disk_Read_Requests_Rate") {
            title = "磁盘度次数"
        }
        if (metric == "Disk_Write_Requests_Rate") {
            title = "磁盘写次数"
        }
        if (metric == "Disk_IO_Util") {
            title = "磁盘繁忙率（%）"
        }
        if (metric == "Tcp_Connections") {
            title = "TCP连接数"
        }
        if (metric == "Threads") {
            title = "线程数"
        }
        if (metric == "Processes") {
            title = "进程数"
        }
        if (metric == "Ip_InReceives") {
            title = "接收IP包"
        }
        if (metric == "Ip_InDiscards") {
            title = "丢弃IP包"
        }
        if (metric == "Tcp_ActiveOpens") {
            title = "TCP Active Opens"
        }
        if (metric == "Tcp_InErrs") {
            title = "TCP包传输错误数"
        }
        if (metric == "Tcp_RetransSegs") {
            title = "TCP重传数"
        }
        if (metric == "Tcp_InSegs") {
            title = "TCP接收包数"
        }
        if (metric == "Tcp_OutSegs") {
            title = "TCP发送包数"
        }
        if (metric == "FD") {
            title = "句柄数"
        }
        if (metric == "MemoryFailcnt") {
            title = "内存分配失败次数"
        }
        if (metric == "MemorySwap") {
            title = "memory_swap使用量(MB)"
        }

        var create_tmpl = [
            '<form class="form-horizontal">',
            '<div class="form-group" id="' + chartDivName + '" style="min-width:400px;height:400px"></div>',
            '</form>',
        ].join("");

        var $modal = $(create_tmpl).jd_modal({title: title});

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#' + chartDivName).highcharts('StockChart', {
            rangeSelector: {
                buttons: [{
                    count: 1,
                    type: 'minute',
                    text: '1M'
                }, {
                    count: 2,
                    type: 'minute',
                    text: '2M'
                }, {
                    count: 5,
                    type: 'minute',
                    text: '5M'
                }],
                inputEnabled: false,
                selected: 0
            },
            title: {
                text: title
            },
            legend: {
                enabled: true
            },
            tooltip: {
                formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                    return;
                }
            },
            exporting: {
                enabled: false
            }
        });

        function connect() {
            var ws = new WebSocket("ws://mdc.jd.com/websck");
            ws.onopen = function () {
                //alert('open');
            };
            ws.onmessage = function (event) {
                var chart = $('#' + chartDivName).highcharts();

                if (chart == null) {
                    return;
                }

                var obj = JSON.parse(event.data);
                var allValue = obj[metric];
                metricKey = metric;
                cpu_usage = allValue.value;
                if (cpu_usage == null) {
                    return;
                }

                for (var i = 0; i < cpu_usage.length; i++) {
                    var timestamp = parseInt(cpu_usage[0].timestamp);
                    var volume = cpu_usage[0].volume;
                    v = parseFloat(volume);
                    var label = cpu_usage[0].label;

                    series = chart.series[i];
                    if (series == null) {
                        series = {
                            name: label,
                            data: (function () {
                                // generate an array of random data
                                var data = [];
                                var time = (new Date()).getTime();
                                var tmpCount;
                                for (tmpCount = -149; tmpCount <= 0; tmpCount += 1) {
                                    data.push([
                                        parseFloat(time) + 2000 * tmpCount,
                                        null
                                    ]);
                                }
                                return data;
                            }())
                        };
                        chart.addSeries(series);
                    }
                    series = chart.series[i];
                    if (series.data.length <= 150) {
                        series.addPoint([timestamp, v], true, false);
                    } else {
                        series.addPoint([timestamp, v], true, true);
                    }
                }

                //chart.redraw();
            };
            ws.onclose = function (event) {
                //alert(event);
            };

            var timer1 = function sendMetrics() {
                ws.send(vm_userErp + ":" + ip + ":" + metric);
            }
            setTimeout(timer1, 1000);
            clearTimeout(timer1);
        }

        connect();
    }
});