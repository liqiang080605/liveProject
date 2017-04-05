$(function () {
	var map={
		'cpu.usage':'CPU使用率(%)',
		'memory.usage':'内存使用率(%)',
		'ip.ping':'系统存活(0-存活 1-不存活)',
		'cpu.load':'负载',
		'swap.usage':'SWAP使用率(%)',
		'network.incoming.bytes.rate':'网络流入量(MB/s)',
		'network.outgoing.bytes.rate':'网络流出量(MB/s)',
		'network.incoming.packets.rate':'网络流入包个数',
		'network.outgoing.packets.rate':'网络流出包个数',
		'tcp.connections':'TCP连接数',
		'tcp.active.open':'TCP Active Opens',
		'ip.pkgs.received':'接收IP包',
		'ip.pkgs.discards':'丢弃IP包',
		'tcp.in.segs':'TCP接收包数',
		'tcp.out.segs':'TCP发送包数',
		'tcp.in.err':'TCP包传输错误数',
		'tcp.retrans':'TCP重传数',
		'disk.usage':'DISK使用率(%)',
		'disk.io.utils':'磁盘繁忙(%)',
		'disk.io.read.bytes.rate':'磁盘读速度(KB/s)',
		'disk.io.write.bytes.rate':'磁盘写速度(KB/s)',
		'disk.io.read.requests.rate':'磁盘读次数',
		'disk.io.write.requests.rate':'磁盘写次数',
		'cpu.temp':'CPU温度',
		'power.consumption':'服务器功率(瓦)',
		'fan.load':'CPU风扇',
		'vm.thread.numbers':'线程数',
		'vm.proc.numbers':'进程数',
		'memory.failcnt':'内存分配失败次数',
		'vm.proc.numbers':'句柄数',
		'memory.swap':'memory_swap使用率(%)'
	};
	
	var idcList;
	var metricsKeyList;
	getIdcs();
	getMetricsKeys();
	
	function getIdcs() {
		$.ajax({
            url:"/top100/getIdcs",
            async:false,
            type:"get",
            //data:options.data
        }).done(function(data){
        	idcList = data.data;
        }).fail(function(data){
        }); 
	}
	
	function getMetricsKeys() {
		$.ajax({
            url:"/top100/getMetricsKeys",
            async:false,
            type:"get",
            //data:options.data
        }).done(function(data){
        	metricsKeyList = data.data;
        }).fail(function(data){
        	return null;
        }); 
	}
	
    // 初始化表格
    var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "serverSide": true,
        "searching": true,
        "ajax":"/top100/list",
        "ordering": false,
        "dom": '<"toolbar">frtip',
        "columnDefs": [
                       {                              
                         "defaultContent": "",
                         "targets": "_all"
                       }
                     ],      
        "columns": [
                    { "data": "ip" ,
                    	"render": function ( data, type, full, meta ) {
                    		var extObj = full.rExt;
                    		var idcStr = "";
                    		if(null != extObj) {
                    			idcStr = extObj.idc;
                    		}
                    		return data+'&nbsp;'+idcStr+'&nbsp;<a href="/monitor/chart?ip='+data+'" target="_blank"><img alt="监控图" title="监控图" src="static/dist/img/icon-chart.png"></a>';
                    	}
                    }, 
                    { "data": "idc" }, 
                    { "data": "type",
                    	"render": function ( data, type, full, meta ) {
		                    var msgStr = "" ;
		                    if(data == "0") {
		                    	msgStr = "物理机";
		                    }
		                    if(data == "1") {
		                    	msgStr = "容器";
		                    }
		                    return msgStr;
		                }
                    },
                    { "data": "metricsKey",
                    	"render": function(data,type,full,meta) {
                    		return map[data];
                    	}
                    },
                    { "data": "metricsValue"}
		            
        ],
        initComplete: function () {
        	
        	/*var idcColumn = this.api().column(1);
        	var idcStr = '<select  style="width: 120px;"><option value="">机房</option>';
        	for (var i=0;i<idcList.length;i++) {
        		var idc = escape(idcList[i]).replace(/%/g,"\\").toLowerCase();
        		idcStr = idcStr + '<option value="' + idc + '">' + idcList[i] + '</option>'; 
    		}
        	idcStr = idcStr + '</select>';
        	
            var idcSelect = $(idcStr)
                .appendTo( $(idcColumn.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    idcColumn
                        .search(val)
                        .draw();
                } );*/
        	
        	var typeColumn = this.api().column(2);
            var typeSelect = $('<select  style="width: 120px;"><option value="">机器类型</option><option value="0">物理机</option><option value="1">容器</option></select>')
                .appendTo( $(typeColumn.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    typeColumn
                        .search(val)
                        .draw();
                } );
            
            var metricsKeyColumn = this.api().column(3);
            var metricsKeyStr = '<select  style="width: 120px;"><option value="">指标类型</option>';
        	for (var i=0;i<metricsKeyList.length;i++) {
        		metricsKeyStr = metricsKeyStr + '<option value="' + metricsKeyList[i] + '">' + map[metricsKeyList[i]] + '</option>'; 
    		}
        	metricsKeyStr = metricsKeyStr + '</select>';
            var metricsKeySelect = $(metricsKeyStr)
                .appendTo( $(metricsKeyColumn.header()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    metricsKeyColumn
                        .search(val)
                        .draw();
                } );           
            
        }
    });	
    
    $('#table_filter').hide();
    
    setInterval(function(){$table.ajax.reload()},30000);
});
