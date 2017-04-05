
function getMeterName(meterMap, meter_name) {
	var n = meterMap[meter_name]["meter_name"];
	if(null == n) {
		return meter_name;
	}
	return n;
}

function getThreshold(meterMap, meter_name, threshold, comparison_operator) {
	var unit_str = "";
	if(null == threshold) {
		threshold = 0;
	}
	if (meter_name == 'network.incoming.bytes.rate'
		|| meter_name == 'network.outgoing.bytes.rate'
			|| meter_name == 'nginx.traffic.read.rate'
				|| meter_name == 'nginx.traffic.write.rate'
					|| meter_name == 'jvm.memory.heap'
						|| meter_name == 'jvm.memory.pspermgen'
							|| meter_name == 'jvm.memory.psedenspace'
								|| meter_name == 'jvm.memory.psoldgen'
									|| meter_name == 'jvm.memory.nonheap'
										|| meter_name == 'jvm.memory.codecache'
											|| meter_name == 'tomcat.request.bytes.sent'
												|| meter_name == 'tomcat.request.bytes.received') {
		threshold = threshold/1024/1024;
	}
	if(meter_name == 'disk.io.read.bytes.rate' || meter_name == 'disk.io.write.bytes.rate') {
		threshold = threshold/1024;
	}
	unit_str = meterMap[meter_name]["meter_unit"];
	var operator_str = "";
	if(comparison_operator == 'gt') {
		operator_str = "大于";
	} else if(comparison_operator == 'lt') {
		operator_str = "小于";
	} else if(comparison_operator == 'eq') {
		operator_str = "等于";
	}
	
    return "<B>" + operator_str + "</B>&nbsp;" + threshold + "&nbsp;<B>" + unit_str + "</B>";
}


function getNotifyType(notifyType) {
	//0
	var msg = "短信+邮件";
	if(notifyType == 1) {
		msg = "邮件";
	} else if(notifyType == 2) {
		msg = "短信";
	} else if(notifyType == 3) {
		msg = "HTTP";
	}
    return msg;
}


function getIsOKMsg(ok_msg) {
	//0
	var msg = "否";
	if(ok_msg == 1) {
		msg = "是";
	}
    return msg;
}

function oKUrlTextOper(isCheck) {
	if(isCheck) {
		//http
		$("#http_ok_url").attr("disabled",false); 
		
	} else {
		$("#http_ok_url").attr("disabled",true); 
	}
}

function urlDivOper(notifyType) {
	if(notifyType == 3) {
		//http
		$("#div_http_alarm_url").show();
		$("#div_http_ok_url").show();
		
	} else {
		$("#div_http_alarm_url").hide();
		$("#div_http_ok_url").hide();
	}
}
