$(function () { 
	
    var meterMap = getMeters();		
	$("#sample option").remove();
	$("#sample").append("<option value=''>请选择指标</option>");
	for(var prop in meterMap){
		var meter_name_val = meterMap[prop]["meter_name"];
		$("#sample").append("<option value='"+prop+"'>"+ meter_name_val +"</option>");
	}
    
	var metricsList = ['network.incoming.bytes.rate','network.outgoing.bytes.rate'];
	
    var grouplist;
	
	$("#tagSample option").remove();
	$("#tagSample").append("<option value=''>请选择指标</option>");
	for(var prop in meterMap){
	    if(meterMap.hasOwnProperty(prop)){
	    	if(metricsList.indexOf(prop)==-1){
			    continue;
			}
	    	var meter_name_val = meterMap[prop]["meter_name"];
	    	$("#tagSample").append("<option value='"+prop+"'>"+ meter_name_val +"</option>");
	    }
	}
	
    $('#query').click(function(){
    	var stime = $('#stime').val();
    	var etime = $('#etime').val();
    	var sample = $('#sample').val();
    	var qip = $('#qip').val();
    	
    	if(qip == null || qip == "" || sample == null || sample == "" ||
    			stime==null || stime == "" ||  etime == null || etime == "") {
			alert("ip和开始结束时间必须填写");
    		return false;
    	}
    	
    	var reqUrl = "/metergraph/query?qip=" + qip + "&sample=" + sample + "&stime=" + stime + "&etime=" + etime;
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
        	
        	drawCharts(sample,data);
        	
        }).fail(function(data){
        }); 
    
    });
    
    $('#tagQuery').click(function(){
    	var type = $('#resourceType').val();
    	var stime = $('#tagStime').val();
    	var etime = $('#tagEtime').val();
    	var tagType = $('#tagType').val();
    	var tagDetail = encodeURI(encodeURI($('#tagDetail').val()));
    	var tagSample = $('#tagSample').val();
    	
    	if(type == null || type == "" || stime==null || stime=="" || etime==null || etime=="" || 
    			tagType==null || tagType=="" || tagDetail==null || tagDetail=="" || tagSample==null) {
			alert("所有信息都必须填写！");
    		return false;
    	}
    	
    	var reqUrl = "/metergraph/query?type=" + type + "&tagType=" + tagType + "&stime=" + stime + "&etime=" + etime + "&tagDetail=" + tagDetail + "&sample=" +tagSample;
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
        	drawCharts(tagSample,data);
        }).fail(function(data){
        }); 
    
    });
    
    $('#table_filter').hide();
    
    window.tagTypeChange = function tagTypeChange() {
    	var val=document.getElementById("tagType").value;
    	var reqUrl = "/metergraph/queryTagType?tagType=" + val;
    	$.ajax({
            url:reqUrl,
            type:"get",
            dataType: "json"
        }).done(function(data){
        	var result = data.data;
        	
        	$("#tagDetail option").remove();
        	$("#tagDetail").append("<option value=''>请选择</option>");
        	for(var name in result){
        		$("#tagDetail").append("<option value='"+result[name]+"'>"+ result[name] +"</option>");
        	}
        })
    }
    
    window.drawCharts = function drawCharts(labelName, data) {
    	var name = meterMap[labelName]["meter_name"];
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    	$('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: name
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: name,
                data: (function () {
                	var resultMap = data.data;
                	var l = []
                	for (var index in resultMap) { 
                		l.push({
                            x: parseFloat(resultMap[index].timeStamp),
                            y: parseFloat(resultMap[index].value)
                        });
                    } 
                    return l;
                }())
            }]
        });
    }
});
