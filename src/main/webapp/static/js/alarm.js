$(function() {
	var meterMap = getMeters();
	// 初始化表格
	var $table = $("#table")
			.DataTable(
					{
						/* "processing": true, */
						"serverSide" : true,
						"searching" : true,
						"select" : true,
						"pageLength" : 15,
						"lengthMenu" : [ 15, 30, 50, 75, 100 ],
						"ajax" : "/alarm/syslist",
						"ordering" : false,
						"dom" : '<"toolbar"><"col-sm-6"l>rt<"col-sm-6"i><"col-sm-6"p>',
						// id, resource_id, user_id, meter_name, threshold,
						// periods, notify_type, comparison_operator, deleted,
						// synced, create_time, update_time
						"columns" : [
								{
									"data" : "id",
									"render" : function(data, type, full, meta) {
										return '<input type="checkbox" id="'
												+ data + '"></input>';
									}
								},
								{
									"data" : "meter_name",
									"render" : function(data, type, full, meta) {
										return getMeterName(meterMap, data);
									}
								},
								{
									"data" : "threshold",
									"render" : function(data, type, full, meta) {
										return getThreshold(meterMap,
												full.meter_name, data,
												full.comparison_operator);
									}
								},
								{
									"data" : "alarm_level",
									"render" : function(data, type, full, meta) {
										var str = "";
										if (data == "Warning") {
											str = "警告";
										} else if (data == "Critical") {
											str = "严重";
										}
										return str;
									}
								},
								{
									"data" : "periods"
								},
								{
									"data" : "notify_type",
									"render" : function(data, type, full, meta) {
										return getNotifyType(data);
									}
								},
								{
									"data" : "ok_msg",
									"render" : function(data, type, full, meta) {
										return getIsOKMsg(data);
									}
								}, {
									"data" : "update_time"
								} ],
						initComplete : function() {
							var that = this;
							var column = this.api().column(3);
							var select = $(
									'<select><option value="">级别</option><option value="Critical">严重</option><option value="Warning">警告</option></select>')
									.appendTo($(column.header()).empty()).on(
											'change',
											function() {
												var val = $.fn.dataTable.util
														.escapeRegex($(this)
																.val());

												column.search(val).draw();
											});
						}
					});

	$table.on(
			'select',
			function(e, dt, type, indexes) {
				$table.rows(indexes).nodes().to$().find("input:checkbox").prop(
						"checked", true);
			}).on(
			'deselect',
			function(e, dt, type, indexes) {
				$table.rows(indexes).nodes().to$().find("input:checkbox").prop(
						"checked", false);
			})

	$("#table").on('click', '#all', function(event) {
		$table.rows().select($(this).prop("checked"));
	}).on('click', 'tbody input:checkbox', function() {
		$table.row($(this).parents("tr")).select($(this).prop("checked"));
	});

	// 添加toolbar
	$("div.toolbar")
			.append(
					'<button class="btn btn-flat bg-blue margin" id="create">创建</button>')
			.append(
					'<button class="btn btn-flat bg-blue margin" id="modify">修改</button>')
			.append(
					'<button class="btn btn-flat bg-blue margin" id="delete">删除</button>');

	// toolbar绑定事件
	$('#create')
			.click(
					function() {

						var create_tmpl = $("#tmpl_create").text();

						var $modal = $(create_tmpl).jd_modal({
							title : "创建"
						});
						var $form = $modal;

						for ( var prop in meterMap) {
							if (meterMap.hasOwnProperty(prop)) {
								var meter_full_name_val = meterMap[prop]["meter_full_name"];

								$("#meter_name").append(
										"<option value='" + prop + "'>"
												+ meter_full_name_val
												+ "</option>");
							}
						}
						$(".select2").select2();

						$(
								'input[type="checkbox"].flat-red, input[type="radio"].flat-red')
								.iCheck({
									checkboxClass : 'icheckbox_flat-green',
									radioClass : 'iradio_flat-green'
								});

						$modal.on("change", "#meter_name", function() {
							var p1 = $(this).children('option:selected').val();
							var d_val = meterMap[p1]["meter_default_value"];
							if (d_val != null) {
								$("#threshold").val(d_val);
							}
							var unit_str = meterMap[p1]["meter_unit"];
							if (unit_str != null) {
								$("#unit_str").text(unit_str);
							}
						});

						$('#ok_msg').on('ifChanged', function(event) {
							var isCheck = $("#ok_msg").prop('checked');
							oKUrlTextOper(isCheck);
						});

						$modal.on("change", "#notify_type", function() {
							var p1 = $(this).children('option:selected').val();
							urlDivOper(p1);
						});

						oKUrlTextOper($("#ok_msg").is(":checked"));
						urlDivOper($("#notify_type").val());

						$modal.on("click", ".btn.btn-primary", function() {
							var periods = $("#periods").val();
							if (!(periods >= 2)) {
								alert("连续匹配次数至少为2次");
								return false;
							}
							var n_type = $("#notify_type").val();
							if (n_type == 3) {
								var alarm_url = $("#http_alarm_url").val();
								if (null == alarm_url || "" == alarm_url) {
									alert("告警URL不能为空!");
									return false;
								}

								if ($("#ok_msg").is(":checked")) {
									var ok_url = $("#http_ok_url").val();
									if (null == ok_url || "" == ok_url) {
										alert("恢复URL不能为空!");
										return false;
									}

								}

							}

							$.jd_ajax({
								url : "/alarm/create",
								type : "post",
								data : $form.serialize(),
								ok : function() {
									$modal.data("modal").close();
									$table.ajax.reload();
								}
							});
						});
					});

	$("#modify")
			.click(
					function() {
						var checked_trs = $("#table tbody").find(
								"input:checkbox:checked");
						if (checked_trs == undefined || checked_trs.size() == 0) {
							$.jd_confirm({
								type : "error",
								message : "请选择要修改的记录"
							});
							return false;
						}

						if (checked_trs.size() != 1) {
							$.jd_confirm({
								type : "error",
								message : "请选择单条记录进行修改"
							});
							return false;
						}

						var id = $("#table").dataTable().api().row(".selected")
								.data().id;
						var meter_name = $("#table").dataTable().api().row(
								".selected").data().meter_name;
						var alarm_level = $("#table").dataTable().api().row(
								".selected").data().alarm_level;
						var comparison_operator = $("#table").dataTable().api()
								.row(".selected").data().comparison_operator;
						var threshold = $("#table").dataTable().api().row(
								".selected").data().threshold;
						var periods = $("#table").dataTable().api().row(
								".selected").data().periods;
						var notify_type = $("#table").dataTable().api().row(
								".selected").data().notify_type;

						var ok_msg = $("#table").dataTable().api().row(
								".selected").data().ok_msg;
						var http_alarm_url = $("#table").dataTable().api().row(
								".selected").data().http_alarm_url;
						var http_ok_url = $("#table").dataTable().api().row(
								".selected").data().http_ok_url;						

						var modify_tmpl = [

								'   <form class="form form-horizontal">                                                                                                                  ',
								'       <fieldset>                                                                                                                                       ',
								'           <div class="form-group">                                                                                                                     ',
								'               <label class="col-sm-2 control-label">监控项</label>                                                                                     ',
								'               <div class="col-sm-10">                                                                                                                  ',
								'                   <label id="u_meter_name"></label>                                                                                   ',
								'               </div>                                                                                                                                   ',
								'           </div>                                                                                                                                       ',
								'           <div class="form-group">                                                                                                                     ',
								'               <label class="col-sm-2 control-label">规则设置</label>                                                                                   ',
								'				<div class="col-xs-3">                                                                                                                    ',
								'                   <select class="form-control" id="comparison_operator" name="comparison_operator">                                                                             ',
								'                       <option value="gt">大于</option>                                                                                                 ',
								'                       <option value="lt">小于</option>                                                                                                 ',
								'                       <option value="eq">等于</option>                                                                                                 ',
								'                   </select>                                                                                                                            ',
								'               </div>                                                                                                                                   ',
								'               <div class="col-xs-7">                                                                                                                   ',
								'                   <div class="input-group">                                                                                                            ',
								'                   <input class="form-control" type="text" id="threshold" name="threshold" value="" placeholder="告警阈值,须为数值">                  ',
								'                   	<span id="unit_str" class="input-group-addon">%</span>                                                                            ',
								'           		</div>                                                                                                                                ',
								'               </div>                                                                                                                                   ',
								'           </div>                                                                                                                                       ',
								'           <div class="form-group">                                                                                                                            ',
								'               <label class="col-sm-2 control-label">匹配次数</label>                                                                                          ',
								'               <div class="col-sm-10">                                                                                                                         ',
								'                   <input class="form-control" type="text" id="periods" name="periods" maxlength="3" placeholder="连续匹配次数,须为数值">            ',
								'               </div>                                                                                                                                          ',
								'           </div>                                                                                                                                              ',
								'           <div class="form-group">                                                                                                                     ',
								'               <label class="col-sm-2 control-label">告警级别</label>                                                                                   ',
								'               <div class="col-sm-10">                                                                                                                  ',
								'                   <select class="form-control" id="alarm_level" name="alarm_level">                                                                                     ',
								'                       <option value="Critical">严重</option>                                                                                           ',
								'                       <option value="Warning">警告</option>                                                                                            ',
								'                   </select>                                                                                                                            ',
								'               </div>                                                                                                                                   ',
								'           </div>                                                                                                                                       ',
								'           <div class="form-group">                                                                                                                     ',
								'               <label class="col-sm-2 control-label">通知方式</label>                                                                                   ',
								'               <div class="col-sm-10">                                                                                                                  ',
								'                   <select class="form-control" id="notify_type" name="notify_type">                                                                                     ',
								'                       <option value="1">邮件</option>                                                                                                  ',
								'                       <option value="2">短信</option>                                                                                                  ',
								'                       <option value="0">邮件+短信</option><option value="3">HTTP(POST)</option>                                                                                             ',
								'                   </select>                                                                                                                            ',
								'               </div>                                                                                                                                   ',
								'           </div>                                                                                                                                       ',
								'<div class="form-group">                                                        ',
								'    <label class="col-sm-2 control-label">恢复通知</label>                      ',
								'    <div class="col-sm-10">                                                     ',
								'    <label>                                                                     ',
								'      <input type="checkbox" id="ok_msg" name="ok_msg" class="flat-red" >       ',
								'      	勾选接收恢复消息                                                         ',
								'    </label>                                                                    ',
								'    </div>                                                                      ',
								' </div>                                                                         ',

								'<div class="form-group" id="div_http_alarm_url">                                                                                                   ',
								'    <label class="col-sm-2 control-label">告警URL</label>                                                                                          ',
								'    <div class="col-sm-10">                                                                                                                        ',
								'        <input class="form-control" type="text" id="http_alarm_url" name="http_alarm_url" maxlength="200" placeholder="告警发生时需要触发的接口">  ',
								'        <span class="text-yellow">接口需支持POST请求,预期收到的消息内容为:<a href="/help/monitor_http_msg.html" target="_blank">HTTP Message.</a></span>',
								'    </div>                                                                                                                                         ',
								'</div>                                                                                                                                             ',
								'<div class="form-group" id="div_http_ok_url">                                                                                                      ',
								'    <label class="col-sm-2 control-label">恢复URL</label>                                                                                          ',
								'    <div class="col-sm-10">                                                                                                                        ',
								'        <input class="form-control" type="text" id="http_ok_url" name="http_ok_url" maxlength="200" placeholder="告警恢复时需要触发的接口">        ',
								'        <span class="text-yellow">接口需支持POST请求,预期收到的消息内容为:<a href="/help/monitor_http_msg.html" target="_blank">HTTP Message.</a></span>',
								'    </div>                                                                                                                                         ',
								'</div>                                                                                                                                             ',
								'                                                                                                                                                        ',
								'           <div class="form-group">                                                                                                                     ',
								'               <div class="col-sm-2 col-sm-offset-4">                                                                                                   ',
								'                   <input type="hidden" id="meter_name" name="meter_name" value="" />   <input type="hidden" id="alarmid" name="alarmid" value="" />                                                                               ',
								'                   <button type="button" class="btn btn-primary">确认</button>                         ',
								'               </div>                                                                                                                                   ',
								'               <div class="col-sm-6">                                                                                                                   ',
								'                   <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>                                                     ',
								'               </div>                                                                                                                                   ',
								'           </div>                                                                                                                                       ',
								'       </fieldset>                                                                                                                                      ',
								'   </form>                                                                                                                                              ', ]
								.join("");

						var $tmpl = $(modify_tmpl).find("#comparison_operator")
								.val(comparison_operator).end();
						$tmpl = $tmpl.find("#u_meter_name").text(
								getMeterName(meterMap, meter_name)).end();

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
							threshold = threshold / 1024 / 1024;
						}

						$tmpl = $tmpl.find("#meter_name").val(meter_name).end();
						$tmpl = $tmpl.find("#threshold").val(threshold).end();

						var unit_str = meterMap[meter_name]["meter_unit"];
						if (unit_str != null) {
							$tmpl.find("#unit_str").text(unit_str).end();
						}

						$tmpl = $tmpl.find("#periods").val(periods).end();

						$tmpl = $tmpl.find("#notify_type").val(notify_type)
								.end();
						$tmpl = $tmpl.find("#alarm_level").val(alarm_level)
								.end();
						$tmpl = $tmpl.find("#alarmid").val(id).end();

						if (ok_msg == 1) {
							$tmpl = $tmpl.find("#ok_msg").attr("checked", true)
									.end();
						}
						$tmpl = $tmpl.find("#http_alarm_url").val(
								http_alarm_url).end();
						$tmpl = $tmpl.find("#http_ok_url").val(http_ok_url)
								.end();						

						var $modal = $tmpl.jd_modal({
							title : "修改告警"
						});
						var $form = $modal;

						$(
								'input[type="checkbox"].flat-red, input[type="radio"].flat-red')
								.iCheck({
									checkboxClass : 'icheckbox_flat-green',
									radioClass : 'iradio_flat-green'
								});

						$('#ok_msg').on('ifChanged', function(event) {
							var isCheck = $("#ok_msg").prop('checked');
							oKUrlTextOper(isCheck);
						});

						$modal.on("change", "#notify_type", function() {
							var p1 = $(this).children('option:selected').val();
							urlDivOper(p1);
						});

						oKUrlTextOper($("#ok_msg").is(":checked"));
						urlDivOper($("#notify_type").val());

						$modal.on("click", ".btn.btn-primary", function() {
							var periods = $("#periods").val();
							if (!(periods >= 2)) {
								// 连续匹配次数必须大于2次
								alert("连续匹配次数必须大于2次");
								return false;
							}
							

							var n_type = $("#notify_type").val();
							if (n_type == 3) {
								var alarm_url = $("#http_alarm_url").val();
								if (null == alarm_url || "" == alarm_url) {
									alert("告警URL不能为空!");
									return false;
								}

								if ($("#ok_msg").is(":checked")) {
									var ok_url = $("#http_ok_url").val();
									if (null == ok_url || "" == ok_url) {
										alert("恢复URL不能为空!");
										return false;
									}

								}

							}

							$.jd_ajax({
								url : "/alarm/update",
								type : "post",
								data : $form.serialize(),
								ok : function() {
									$modal.data("modal").close();
									$table.ajax.reload();
								}
							});
						});
					});

	$("#delete").click(function() {
		var checked_trs = $("#table tbody").find("input:checkbox:checked");
		if (checked_trs == undefined || checked_trs.size() == 0) {
			$.jd_confirm({
				type : "error",
				message : "请选择要删除的记录"
			});
			return false;
		}

		var ids = [];
		for (var i = 0; i < checked_trs.size(); i++) {
			ids.push(checked_trs.get(i).id);
		}

		$.jd_confirm({
			type : "info",
			message : "确认要删除ID为" + ids.join(",") + "的记录吗？",
			ok : function() {
				$.jd_ajax({
					url : "/alarm/delete",
					type : "post",
					data : {
						alarms : ids
					},
					ok : function() {
						setTimeout(function() {
							$table.ajax.reload()
						}, 1000);
					}
				});
			}
		});
	});

	function validate_create_form($form) {
		var has_error = false;
		$form.find("input").each(function() {
			if ($(this).val() == "") {
				$(this).parent().addClass("has-error");
				has_error = true;
			}
		});
		return has_error;
	}

});