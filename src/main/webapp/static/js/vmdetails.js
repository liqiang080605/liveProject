$(function () {
	$("#cpu").blur(function(){
	    if(isNaN(parseInt($("#cpu").val()))) {
	    	alert("该项必填且只能为数字");
	    }
	});
	
	$("#memory").blur(function(){
	    if(isNaN(parseInt($("#memory").val()))) {
	    	alert("该项必填且只能为数字");
	    }
	});
	
	$("#disk").blur(function(){
	    if(isNaN(parseInt($("#disk").val()))) {
	    	alert("该项必填且只能为数字");
	    }
	});
	
	
    // 初始化表格
	var $table = $("#table").DataTable({
        "processing": true,
    	"paging": false,
        "serverSide": true,
        "searching": true,
        "ajax":"/vmdetails/query/",
        "ordering": false,
        "dom": '<"toolbar">frtip',
        "columnDefs": [
                       {                              
                         "defaultContent": "",
                         "targets": "_all"
                       }
                     ],          
        "columns": [
                    { "data": "idc" ,
                        "render": function ( data, type, full, meta ) {
                        	return '<span class="badge bg-green-gradient">' + data + '</span> ';
                        }
                    }, 
                    { "data": "cpu",
                    	"render": function ( data, type, full, meta ) {
                    		var returnStr = "";
		                    var total = full.totalCpu;
		                    var used = full.usedCpu;
		                    var left = full.unusedCpu;
		                    
		                    if(full.idc == '廊坊二区') {
		                    	left = left - 288*8 - 149*8;
		                    }
		                    if(full.idc == '马驹桥二区') {
		                    	left = left - 29*8 - 29*8;
		                    }
		                    
		                    returnStr += '<span class="badge bg-blue-gradient">' + "总共:" + total + '</span> ';
		                    returnStr += '<span class="badge bg-green-gradient">' + "已用:" + used + '</span> ';
		                    returnStr += '<span class="badge bg-red-gradient">' + "剩余:" + left + '</span> ';
		                    
		                    return returnStr;
		                }
                    },
		            { "data": "memory",
                    	"render": function (data, type, full, meta) {
                    		var returnStr = "";
                    		
                    		var total = full.totalMemory;
		                    var used = full.usedMemory;
		                    var left = full.unusedMemory;
		                    
		                    returnStr += '<span class="badge bg-blue-gradient">' + "总共:" + total + '</span> ';
		                    returnStr += '<span class="badge bg-green-gradient">' + "已用:" + used + '</span> ';
		                    returnStr += '<span class="badge bg-red-gradient">' + "剩余:" + left + '</span> ';
		                    
		                    return returnStr;
                    	}
                    }, 
		            {
		                "data": "disk",
		                "render": function ( data, type, full, meta ) {
		                	var returnStr = "";
		                	
		                	var total = full.totalDisk;
		                    var used = full.usedDisk;
		                    var left = full.unusedDisk;
		                    
		                    returnStr += '<span class="badge bg-blue-gradient">' + "总共:" + total + '</span> ';
		                    returnStr += '<span class="badge bg-green-gradient">' + "已用:" + used + '</span> ';
		                    returnStr += '<span class="badge bg-red-gradient">' + "剩余:" + left + '</span> ';
		                    
		                    return returnStr;
		                }
		            },   
		            {"data": "containerNum",
		            	"render": function(data,type,full,meta) {
		            		return '<span class="badge bg-green-gradient">' + data + '</span> ';
		            	}
		            }
        ]
    });
	
	window.selectIdc = function selectIdc()
	{
		var checklist = document.getElementsByName("idc");
	    if(document.getElementById("selectAllIdc").checked)
	    {
		    for(var i=0;i<checklist.length;i++)
		    {
		        checklist[i].checked = 1;
		    } 
		}else{
		    for(var j=0;j<checklist.length;j++)
		    {
		       checklist[j].checked = 0;
		    }
	    }
	}
	
	
	$('#query').click(function(){
		queryObj = new Object();
		
		var idcs = new Array();
		
		var checklist = document.getElementsByName("idc");
		
		 for(var i=0;i<checklist.length;i++)
	    {
	        if(checklist[i].checked == 1) {
	        	idcs.push(checklist[i].value);
	        }
	    } 
		
		queryObj.idcs = idcs;
		queryObj.memory=$("#memory").val();
		queryObj.cpu=$("#cpu").val();
		queryObj.disk=$("#disk").val();
		
		if(isNaN(parseInt(queryObj.memory)) || isNaN(parseInt(queryObj.cpu)) || isNaN(parseInt(queryObj.disk))) {
			alert("cpu、memory和disk只能为数字且不能为空");
			return;
		}
		
		var condition = JSON.stringify(queryObj);
		$table.search(condition).draw();
    });
	
	$('#table_filter').hide();
});
