$(function () {
	
	var metricsList = ['network.incoming.bytes.rate','network.outgoing.bytes.rate',
	                   'disk.io.read.bytes.rate','disk.io.write.bytes.rate','cpu.usage','memory.usage',
	                   'cpu.load','tcp.connections','network.incoming.packets.rate','network.outgoing.packets.rate'];
	
    var grouplist;
    $.ajax({
        url:"/groupPmonitor/list",
        type:"get",
        //data:options.data
    }).done(function(data){
    	grouplist = data.data;
    	if(null != grouplist) {
    		//user_group
    		$("#group_user option").remove();
    		$("#group_user").append("<option value=''>请选择分组</option>");
    		for (var i=0;i<grouplist.length;i++) {
    			$("#group_user").append("<option value='"+grouplist[i].id+"'>"+ grouplist[i].groupname +"</option>");
    		}
    	}
    }).fail(function(data){
    }); 
    
    var meterMap = getMeters();		
	$("#sample option").remove();
	$("#sample").append("<option value=''>请选择指标</option>");
	for(var prop in meterMap){
	    if(meterMap.hasOwnProperty(prop)){
	    	if(metricsList.indexOf(prop)==-1){
			    continue
			}
	    	var meter_name_val = meterMap[prop]["meter_name"];
	    	$("#sample").append("<option value='"+prop+"'>"+ meter_name_val +"</option>");
	    }
	}
    
	
    $('#query').click(function(){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var sample = $('#sample').val();
    	var groupId = $('#group_user').val();
    	
    	if(groupId == null || groupId == "" || sample == null || sample == "") {
			alert("分组和指标必须填写");
    		return false;
    	}
    	
    	var reqUrl = "/groupPmonitor/query?groupId=" + groupId + "&sample=" + sample + "&stime=" + stime + "&etime=" + etime;
    	$.ajax({
            url:reqUrl,
            type:"get",
            dataType: "json"
        }).done(function(data){
        	var result = data.result;
        	if(result != "success") {
        		alert(data.message);
        		return;
        	}
        	
        	$('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: meterMap[sample]['meter_full_name']
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{point.y:.1f}'
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                	window.open("/monitor/chart?ip=" + this.name);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Data',
                    data: [],
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: 'black',
                        align: 'left',
                        format: '{point.y:.1f}', // one decimal
                        y: 0, // 10 pixels down from the top
                        style: {
                            //fontWeight: 'bold',
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        	
        	var resultMap = data.data;
        	var valueList = resultMap[sample];
        	
        	var l = [];
        	for (var index in valueList) { 
        		var tmpl = [valueList[index].ip, parseFloat(valueList[index].value)];
        		l.push(tmpl);
            } 
        	
            var chart = $('#container').highcharts();
            chart.series[0].setData(l);
        	
        }).fail(function(data){
        }); 
    
    });
    function query(flag){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var sample = $('#sample').val();
    	var groupId = $('#group_user').val();
    	
    	if(groupId == null || groupId == "" || sample == null || sample == "") {
    		if(flag == false) {
    			alert("分组和指标必须填写");
    		}
    		return false;
    	}
    	
    	var reqUrl = "/groupPmonitor/query?groupId=" + groupId + "&sample=" + sample + "&stime=" + stime + "&etime=" + etime;
    	$.ajax({
            url:reqUrl,
            type:"get",
            dataType: "json"
        }).done(function(data){
        	var result = data.result;
        	if(result != "success") {
        		alert(data.message);
        		return;
        	}
        	
        	$('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: meterMap[sample]['meter_full_name']
                },
                xAxis: {
                    type: 'category',
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{point.y:.1f}'
                },
                plotOptions: {
                    column: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function() {
                                	window.open("/monitor/chart?ip=" + this.name);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Data',
                    data: [],
                    dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: 'black',
                        align: 'left',
                        format: '{point.y:.1f}', // one decimal
                        y: 0, // 10 pixels down from the top
                        style: {
                            //fontWeight: 'bold',
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                }]
            });
        	
        	var resultMap = data.data;
        	var valueList = resultMap[sample];
        	
        	var l = [];
        	for (var index in valueList) { 
        		var tmpl = [valueList[index].ip, parseFloat(valueList[index].value)];
        		l.push(tmpl);
            } 
        	
            var chart = $('#container').highcharts();
            chart.series[0].setData(l);
        	
        }).fail(function(data){
        }); 
    }
    
    $('#download').click(function(){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var sample = $('#sample').val();
    	var groupId = $('#group_user').val();
    	
    	if(groupId == null || groupId == "" || sample == null || sample == "") {
			alert("分组和指标必须填写");
    		return false;
    	}
    	
    	var reqUrl = "/downloadFile/download?groupId=" + groupId + "&sample=" + sample + "&stime=" + stime + "&etime=" + etime;
    	window.open(reqUrl);
    });
    
    setInterval(refresh,60000);
    
    function refresh() {
    	query(true);
    }
    $('#table_filter').hide();
});
