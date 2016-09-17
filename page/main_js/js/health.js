
window.tcData = [];
var myHeartChart = echarts.init(document.getElementById('heartRate'));
var myTempChart = echarts.init(document.getElementById('temperature'));
var myActivityChart = echarts.init(document.getElementById('activityMount'));
function RequestHearData(){
	var hcData= [];
	$.ajax({
		type:"get",
		url:"http://121.250.222.23/intel/heartRate.php",
		async:true,
		success:function(data){
			data = JSON.parse(data);
			var hdata = [];
			var hdate = [];
			
			for(var i = 0;i<data.length;i++){
				hdata.push(data[i].rate);
				hdate.push(data[i].time);
				var temp = {
					value:[hdate[i],hdata[i]] 
				}
				hcData.push(temp);
			}
			initHeartData(hcData);
//			myHeartChart.setOption({
//		       series: [{
//		            data: window.hcData
//		        }]
//		    });
		}
		
	});
	
}
function initHeartData(hCdata){
    var option = {
    	color: ['#009861'],
	    title: {
	        text: 'Heart Rate'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            animation: false
	        }
	    },
	    xAxis: {
	        type: 'time',
	        splitLine: {
	            show: false
	        }
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, '100%'],
	        splitLine: {
	            show: false
	        }
	    },
	    series: [{
	        name: '脉搏',
	        type: 'line',
	        showSymbol: false,
	        hoverAnimation: false,
	        data:hCdata
	    }]
	};
	myHeartChart.setOption(option);    //载入图表
//	var app = {}; 
//	app.timeTicket = setInterval(function () {
//		window.hcData = [];
//		RequestHearData();	    
//	}, 1000);
}


function RequestTempData(){
	$.ajax({
		type:"get",
		url:"http://121.250.222.23/intel/temperature.php",
		async:true,
		success:function(data){
			data = JSON.parse(data);
			var hdata = [];
			var hdate = [];
			for(var i = 0;i<data.length;i++){
				hdata.push(data[i].temp);
				hdate.push(data[i].time);
				var temp = {
					value:[hdate[i],hdata[i]] 
				}
				window.tcData.push(temp);
			}
			
			myTempChart.setOption({
		       series: [{
		            data: window.tcData
		        }]
		    });
		}
	});
}

function initTempData(){
	var option = {
		color: ['#009861'],
	    title: {
	        text: 'Temperature'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            animation: false
	        }
	    },
	    xAxis: {
	        type: 'time',
	        splitLine: {
	            show: false
	        }
	    },
	    yAxis: {
	        type: 'value',
	        boundaryGap: [0, '100%'],
	        splitLine: {
	            show: false
	        }
	    },
	    series: [{
	        name: '体温',
	        type: 'line',
	        showSymbol: false,
	        hoverAnimation: false,
	        data: window.tcData
	    }]
	};
	myTempChart.setOption(option);    //载入图表
	var app = {}; 
	app.timeTicket = setInterval(function () {
		window.tcData = [];
		RequestTempData();	    
	}, 50000);
}

function RequstActivityData(){
	$.ajax({
		type:"get",
		url:"http://121.250.222.23/intel/step.php",
		async:true,
		success:function(data){
			handlerData(data);
		}
	});
	function handlerData(data){
		data = JSON.parse(data);
		console.log(data);
		var ldate = [],ddata = [];
		for(var i  =0;i<data.length;i++){
			ldate.push(data[i].time);
			ddata.push(data[i].step);
		}
		initActivityData(ldate,ddata);
	}
}
function initActivityData(adate,adata){
	var option = {
		 title: {
	        text: 'Activity Amount'
	    },
	    color: ['#009861'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : adate,
	            axisTick: {
	                alignWithLabel: true
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'活动量',
	            type:'bar',
	            barWidth: '60%',
	            data:adata
	        }
	    ]
	};
	myActivityChart.setOption(option);
	
}
$(document).ready(function(){
	setInterval(function () {
//		window.hcData = [];
		RequestHearData();	    
	}, 1000);
	initTempData()
	RequstActivityData();
	RequestTempData();
});
