$(document).ready(function(){
	InitMap();
});
//window.centerPoint = "济南市";
window.bradius =500;
var boundCircle;
var overBound = 0;
var carMKs = [];
var mycarMk;
var curve;//路线的覆盖物
var centerPointer;
var hposition = new BMap.Point(117.146144,36.674797);

/***********************初始化地图*****************/
function InitMap(){
	var map = new BMap.Map("mymap");
	
	centerPointer = InitPosition(map,hposition,'./img/position/position_btn.png');
	map.centerAndZoom(hposition, 16); 
	map.enableScrollWheelZoom(true);
	map.enableDragging();
	
	boundCircle = new BMap.Circle(hposition,window.bradius,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
	map.addOverlay(boundCircle);
	$("#lost_btn").on("click",function(){
		InitPop(map);
	});
	var show = false;
	$("#near_btn").on("click",function(){
		if(!show){
			InitNeighbourhood(map);
			show = true;
		}else{
			for(var i = 0;i<carMKs.length;i++){
				map.removeOverlay(carMKs[i]);
			}
			show = false;
		}
	});
	setInterval(function(){
		InitGPS(map,hposition);
	},1500);
	var isSRoot = false;
	$("#root_btn").on("click",function(){
		if(!isSRoot){
			InitRout(map);
			isSRoot = true;
		}else{
			map.removeOverlay(curve);
			isSRoot = false;
		}
		
	});
}



/****************************************显示点，以及某点的各种点击反应*/
function InitPosition(themap,point,imgurl){
	var myIcon1 = new BMap.Icon(imgurl, new BMap.Size(32,32));
	var vectorMarker = new BMap.Marker(point, {
	  icon:myIcon1
	});
	themap.addOverlay(vectorMarker);
	return vectorMarker;
}





function InitNeighbourhood(themap){
//	show = true;
	var data_info = [{"phead":"img/position/p1.png","point":new BMap.Point(117.13,36.6543),"name":"咩咩咩"},
	{"phead":"img/position/p2.png","point":new BMap.Point(117.153,36.65243),"name":"旺旺网"},
	{"phead":"img/position/p3.png","point":new BMap.Point(117.1133,36.5553),"name":"喵喵喵"}];
	handlerData(data_info);
	function handlerData(data_info){
		
		for(var i = 0;i<data_info.length;i++){
			console.log(data_info[i].phead);
			var myIcon = new BMap.Icon(data_info[i].phead, new BMap.Size(40, 40), {    //小车图片
				imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
			});
			var carMk = new BMap.Marker(data_info[i].point,{icon:myIcon});
			var label = new BMap.Label(data_info[i].name,{offset:new BMap.Size(20,-10)});
			themap.addOverlay(carMk);
			carMk.setLabel(label);
			carMKs.push(carMk);
		}
		
	}
}



/****************展示移动路线********************************/
function InitGPS(themap,hposition){
	$.ajax({
		type:"get",
		url:"http://121.250.222.23/intel/position.php",
		async:true,
		success:function(data){
			handlerData(data);
		}
	});
	function handlerData(data){
//		console.log(data);
		data = JSON.parse(data);
		var point = new BMap.Point(data.pos[0],data.pos[1]);
		/************设置头像***********************/
		var myIcon = new BMap.Icon("./img/position/phead.png", new BMap.Size(40, 40), {    //小车图片
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		});
//		console.log(point);
		mycarMk = new BMap.Marker(point,{icon:myIcon});
		themap.addOverlay(mycarMk);
		mycarMk.setZIndex(100);
		
//		themap.centerAndZoom(point,17);
		var bound;
		resetMkPoint();
		function resetMkPoint(){	
//			mycarMk.setPosition(point);
			bound = BMapLib.GeoUtils.isPointInCircle(point,boundCircle);
//			console.log(bound);
			if(!bound){
				InitPosition(themap,point,"img/position/jiao.png");
				boundCircle.setFillColor("orange");
				overBound++;
				if(overBound>1000){
					alert("你的萌宠已经持续一段时间超出安全范围");
					boundCircle.setFillColor("red");
				}
			}else{
				overBound = 0;
				boundCircle.setFillColor("blue");
			}
		}
			
	}
	
}


//弹出框，圈定宠物活动范围，设置中心点，以设定一个圆形区域。

function InitPop(themap){
	var scontent = '<div class="pop"><div class="contain_form"><div class="form-group"><label for="setCpointlng">安全经度</label><input id="setCpointlng" placeholder="输入坐标或者从地图中选取" /></div>'+
	'<div class="form-group"><label for="setCpointlat">安全纬度</label><input id="setCpointlat" placeholder="输入坐标或者从地图中选取" /></div>'+
	'<div class="form-group"><label for="set_bound"></label><select class="select" id="set_bound">'+
				   '<option value="500">500</option><option value="1000">1000</option><option value="1500">1500</option>'+
				   '<option value="2000">2000</option><option value="2500">2500</option></select></div>'+
				   '<div id="submit" class="submit_btn">确定</div></div><div class = "close"><img src="./img/position/close.png"/></div></div>';
	$(".content_wrap").append(scontent);
	$("#submit").on("click",function(){
//		var tlat = parseFloat($("#setCpointlat").val());
//		var tlng = parseFloat($("#setCpointlng").val());
		console.log(tlat+"hhhh"+tlng);
		if(tlat&&tlng){
			hposition = new BMap.Point(tlng,tlat);
			console.log(hposition);
			var cbraduis =$("#set_bound").val();
			window.bradius = cbraduis;
			boundCircle.setCenter(hposition);
//			centerPointer.setPoint(hposition);
//			setPoint
			themap.removeOverlay(centerPointer);
			centerPointer = InitPosition(themap,hposition,'./img/position/position_btn.png');
			boundCircle.setRadius(window.bradius);
			console.log(boundCircle.getCenter());
			console.log(window.bradius);
			$(".pop").remove();
		}else{
			if(confirm("您的信息不完善，是否使用默认地址为安全地址")){
				var cbraduis = parseInt($("#set_bound").val());
				window.bradius = cbraduis;
				boundCircle.setRadius(window.bradius);
				console.log(window.bradius);
				$(".pop").remove();
			}
			
		}
		
	});
	$(".close").on("click",function(event){
		$(".pop").remove();
		event.stopPropagation();
		
	});
	var tlat,tlng;
	themap.addEventListener("click",function(e){
		tlat = e.point.lat;
		tlng = e.point.lng;
		$("#setCpointlat").val(e.point.lat);
		$("#setCpointlng").val(e.point.lng);
	});
}



function InitRout(themap){
	$.ajax({
		type:"get",
		url:"http://121.250.222.23/intel/positions.php",
		async:true,
		success:function(data){
			handlerData(data);
		}
	});
	function handlerData(data){
		data = JSON.parse(data);
		console.log(data);
		var points = [];
		for(var i =0;i<data.length;i++){
			points.push(new BMap.Point(data[i].pos[0],data[i].pos[1]));
		}
		curve = new BMapLib.CurveLine(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5}); //创建弧线对象
		themap.addOverlay(curve); 
	}
}
var curve;
