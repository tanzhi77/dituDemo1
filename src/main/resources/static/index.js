layui.use(['layer', 'form', 'laydate'], function(){
	var $ = layui.$, //由于layer弹层依赖jQuery，所以可以直接得到
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;


	//gps转换格式
	function parse_gps(gps){
		var first_number = gps[0]
		var second_number = gps[1]
		var third_number = gps[2]
		return first_number + second_number / 60 + third_number / 3600
	};
	//日期转换格式
	function DateFormat(date, format) {
		if (date == null) return "";
		date = date.replace('T', ' ');
		date = new Date(date);
		var map = {
			"M": date.getMonth() + 1, //月份
			"d": date.getDate(), //日
			"h": date.getHours(), //小时
			"m": date.getMinutes(), //分
			"s": date.getSeconds(), //秒
			"q": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
			var v = map[t];
			if (v !== undefined) {
				if (all.length > 1) {
					v = '0' + v;
					v = v.substr(v.length - 2);
				}
				return v;
			}
			else if (t === 'y') {
				return (date.getFullYear() + '').substr(4 - all.length);
			}
			return all;
		});
		return format;
	};
	//查询全部Marker
	function selectMarker(data) {
		var pois = [];
		var count = 0;
		var mydate = new Date();
		var month = mydate.getMonth()+1
		var today = mydate.getFullYear()+"-"+ month +"-"+mydate.getDate();
		for (var i in data) {
			// 获取坐标(经度、纬度),在地图map上显示
			var px = data[i].longitude
			var py = data[i].latitude
			var point = new BMap.Point(px, py);
			var marker = new BMap.Marker(point);
			var date = DateFormat(data[i].date, 'yyyy-M-dd');
			if (date==today) {
				pois.push(point);
				var label = new BMap.Label(++count,{offset:new BMap.Size(20,-10)});
				marker.setLabel(label);
			};
			map.addOverlay(marker);
			var imgurl = data[i].image=="" ? "" : "/show?image=" + data[i].image;
			var longitude,latitude;
			//查询标记信息窗口内容
			var selectcontent =
				"<div style='width: 500px'>" +
				"	<div class='show-pictures'>\n" +
				"		<img src='"+ imgurl + "' onerror='this.src=\"/img/default.jpg\"'>\n" +
				"	</div>" +
				"	<div class=\"layui-form-item\">\n" +
				"		<div class=\"layui-form-label\" >日\t期：</div>\n" +
				"		<div class=\"layui-input-block\" >\n" +
				"		<div class='item-text'>" + DateFormat(data[i].date, 'yyyy-MM-dd hh:mm:ss') + "</div>   " +
				"	</div>" +
				"	<div class=\"layui-form-item\">\n" +
				"		<div class=\"layui-form-label\" >备\t注：</div>\n" +
				"		<div class=\"layui-input-block\" >\n" +
				"		<div class='item-text'>" + data[i].text + "</div>   " +
				"	</div>" +
				"</div>";
			//修改标记信息窗口内容
			var updatecontent =
				"<form id='UpdateMarker'  lay-filter='UpdateMarker' method='post' class=\"layui-form\" style='width: 500px' >" +
				"<div id=\"upfile\" class=\"upfile upfile-advanced\">\n" +
				"    <label id=\"demo-preview\" for=\"demo-file\" style='background-image:url(" + imgurl + ")' ></label>\n" +
				"    <input type=\"file\" name=\"file\" id=\"demo-file\" accept=\"image/*\" >\n" +
				"</div>" +
				"<div class=\"layui-form-item\">\n" +
				"  <label class=\"layui-form-label\" style='width: 30px;'>标题</label>\n" +
				"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
				"  <input type=\"text\" value='"+ data[i].title +"' required lay-verType='tips' name=\"title\" placeholder=\"请输入标题\" autocomplete=\"off\" class=\"layui-input\">   " +
				"  </div>\n" +
				"</div>" +
				"<div class=\"layui-form-item\">\n" +
				"  <label class=\"layui-form-label\" style='width: 30px;'>日期</label>\n" +
				"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
				"  	 <input type=\"text\" value='"+ DateFormat(data[i].date, 'yyyy-MM-dd hh:mm:ss') +"' name=\"date\" lay-verify='date' autocomplete=\"off\" required lay-verType='tips' placeholder=\"请输入日期\" class=\"layui-input\" id=\"date\">\n" +
				"  </div>\n" +
				"</div>" +
				"<div class=\"layui-form-item\">\n" +
				"  <label class=\"layui-form-label\" style='width: 30px;'>备注</label>\n" +
				"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
				"  <textarea name=\"text\" style=\"resize:none;\" required lay-verType='tips' placeholder=\"请输入备注\" class=\"layui-textarea\">"+ data[i].text +"</textarea>   " +
				"  </div>\n" +
				"</div>" +
				"<div class=\"layui-form-item\">\n" +
				"  <div class=\"layui-input-block\">\n" +
				"    <button type=\"button\" id='markerdelete' class=\"layui-btn layui-btn-sm layui-btn-primary\" style='float: right;margin: 0 30px 0 25px;'>取消</button>\n" +
				"    <button class=\"layui-btn layui-btn-sm\" id='formsubmit' lay-submit lay-filter=\"UpdateMarker\" style='float: right'>保存</button>\n" +
				"  </div>\n" +
				"</div>" +
				"</form>";

			// 捕获标记点击事件，并且显示信息
			// 函数闭包，总是执行
			(function () {
				var markerid = data[i].id;
				var image = data[i].image;
				var selectInfoWindow = new BMap.InfoWindow(selectcontent,{offset:new BMap.Size(20,-10),title : data[i].title});
				marker.addEventListener("click", function () {
					this.openInfoWindow(selectInfoWindow);
				});
				var updateInfoWindow = new BMap.InfoWindow(updatecontent,{offset:new BMap.Size(20,-10),title : '修改足迹'});
				var updateMarker = function(e,ee,marker){
					marker.openInfoWindow(updateInfoWindow)
					//执行一个laydate实例
					laydate.render({
						elem: '#date', //指定元素
						type:'datetime' //指定类型
					});
					if(image!=""){
						document.getElementById('demo-preview').className = "set";
					}else {
						document.getElementById('demo-preview').classList.remove("set");
					}
					//图片上传点击事件
					$("#demo-file").change(function(){
						var reads = new FileReader();
						f = document.getElementById('demo-file').files[0];
						reads.readAsDataURL(f);
						reads.onload = function(e) {
							document.getElementById('demo-preview').style = "background-image:url("+this.result+")";
							document.getElementById('demo-preview').className = "set";
							//获取图片GPS
							EXIF.getData(f, function(){
								if (EXIF.getTag(f, "GPSLongitude")!=undefined){
									longitude = parse_gps(EXIF.getTag(f, "GPSLongitude"));
									latitude = parse_gps(EXIF.getTag(f, "GPSLatitude"));
									var ggPoint = new BMap.Point(longitude,latitude);
									//新建坐标转换实例
									var convertor = new BMap.Convertor();
									var pointArr = [];
									pointArr.push(ggPoint);
									translateCallback = function (data){
										if(data.status === 0) {
											longitude = data.points[0].lng;
											latitude = data.points[0].lat;
										}
									};
									//调用坐标转换实例把pointArr内的坐标转换成百度坐标系
									convertor.translate(pointArr, 1, 5, translateCallback);
								};
							});
						};
					})
					//图片加载完毕重绘infowindow
					document.getElementById('demo-preview').onload = function (){
						infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
					}
					document.getElementById('markerdelete').onclick = function (){
						marker.closeInfoWindow(selectInfoWindow); //关闭信息窗口

					}
					$("#UpdateMarker").submit(function(e){
						var formData = new FormData($("#UpdateMarker")[0]);

						if (longitude != "" && longitude != null){
							formData.append("longitude", longitude);
							formData.append("latitude", latitude);
						}else {
							formData.append("longitude", longitude = marker.getPosition().lng);
							formData.append("latitude", latitude =marker.getPosition().lat);
						}
						formData.append("id", markerid);
						formData.append("image", image);
						$.ajax({
							url:"/UpdateMarkerdata",
							type:"POST",
							dataType:"json",
							data:formData,
							contentType: false,
							processData: false,
							success:function(data) {
								layer.msg("修改成功")
								map.clearOverlays();
								selectMarker(data)

							},
							error:function(response){
								layer.msg("修改失败")
							}
						});
						return false;
					});
				};
				var removeMarker = function(){
					layer.confirm('是否确定删除？', {
						btn: ['删除','取消'] //按钮
					}, function(){
						$.ajax({
							url:"/delMarker",
							type:"POST",
							dataType:"json",
							data:'{"id":"'+ markerid +'","image":"'+ image +'"}',
							contentType: 'application/json; charset=utf-8',
							processData: false,
							success:function(data) {
								layer.msg("删除成功");
								map.clearOverlays();
								selectMarker(data);
							},
							error:function(response){
								layer.msg("删除失败");
							}
						});
					}, function(){

					});

				};
				//创建右键菜单
				var markerMenu=new BMap.ContextMenu();
				markerMenu.addItem(new BMap.MenuItem('修改足迹',updateMarker));
				markerMenu.addItem(new BMap.MenuItem('删除足迹',removeMarker.bind(marker)));
				marker.addContextMenu(markerMenu);


			})()
		};
		var walking = new BMap.WalkingRoute(map);
		for (var i = 0;i < pois.length-1;i++){
			walking.search(pois[i], pois[i+1]);
			walking.setSearchCompleteCallback(function (rs) {
				var pts = walking.getResults().getPlan(0).getRoute(0).getPath();
				map.addOverlay(new BMap.Polyline(pts, { strokeColor: "green", strokeWeight: 4, strokeOpacity: 1 }));

				/*var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
					scale: 0.6,//图标缩放大小
					strokeColor:'#fff',//设置矢量图标的线填充颜色
					strokeWeight: '2',//设置线宽
				});
				var icons = new BMap.IconSequence(sy, '10', '30');
				var polyline =new BMap.Polyline(chartData, {
					enableEditing: false,//是否启用线编辑，默认为false
					enableClicking: true,//是否响应点击事件，默认为true
					icons:[icons],
					strokeWeight:'8',//折线的宽度，以像素为单位
					strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
					//strokeColor:"#18a45b" //折线颜色
				});*/  //增加折线
			});

		};
	};
	//添加Marker
	function addMarker(e){
		var sContent =
			"<form id='addMarker' method='post' class=\"layui-form\" style='width: 500px' >" +
			"<div id=\"upfile\" class=\"upfile upfile-advanced\">\n" +
			"    <label id=\"demo-preview\" for=\"demo-file\" ></label>\n" +
			"    <input type=\"file\" name=\"file\" id=\"demo-file\" accept=\"image/*\" >\n" +
			"</div>" +
			"<div class=\"layui-form-item\">\n" +
			"  <label class=\"layui-form-label\" style='width: 30px;'>标题</label>\n" +
			"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
			"  <input type=\"text\" required lay-verType='tips' name=\"title\" placeholder=\"请输入标题\" autocomplete=\"off\" class=\"layui-input\">   " +
			"  </div>\n" +
			"</div>" +
			"<div class=\"layui-form-item\">\n" +
			"  <label class=\"layui-form-label\" style='width: 30px;'>日期</label>\n" +
			"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
			"  	 <input type=\"text\" name=\"date\" autocomplete=\"off\" required lay-verType='tips' placeholder=\"请输入日期\" class=\"layui-input\" id=\"date\">\n" +
			"  </div>\n" +
			"</div>" +
			"<div class=\"layui-form-item\">\n" +
			"  <label class=\"layui-form-label\" style='width: 30px;'>备注</label>\n" +
			"  <div class=\"layui-input-block\" style='margin-left: 60px;'>\n" +
			"  <textarea name=\"text\" style=\"resize:none;\" required lay-verType='tips' placeholder=\"请输入备注\" class=\"layui-textarea\"></textarea>   " +
			"  </div>\n" +
			"</div>" +
			"<div class=\"layui-form-item\">\n" +
			"  <div class=\"layui-input-block\">\n" +
			"    <button type=\"button\" id='markerdelete' class=\"layui-btn layui-btn-sm layui-btn-primary\" style='float: right;margin: 0 30px 0 25px;'>删除</button>\n" +
			"    <button class=\"layui-btn layui-btn-sm\" id='formsubmit' lay-submit lay-filter=\"formDemo\" style='float: right'>保存</button>\n" +
			"  </div>\n" +
			"</div>" +
			"</form>";

		// 创建标注对象并添加到地图
		var marker = new BMap.Marker(addpoint);
		var longitude,latitude;
		// 创建信息窗口
		var infoWindow = new BMap.InfoWindow(sContent,{offset:new BMap.Size(20,-10),title : "添加足迹"});
		marker.addEventListener("click", function(){
			this.openInfoWindow(infoWindow);
			//图片上传点击事件
			//执行一个laydate实例
			laydate.render({
				elem: '#date', //指定元素
				type:'datetime' //指定类型
			});
			$("#demo-file").change(function(){
				var reads = new FileReader();
				f = document.getElementById('demo-file').files[0];
				reads.readAsDataURL(f);
				reads.onload = function(e) {
					document.getElementById('demo-preview').style = "background-image:url("+this.result+")";
					document.getElementById('demo-preview').className = "set";
					//获取图片GPS
					EXIF.getData(f, function(){
						if (EXIF.getTag(f, "GPSLongitude")!=undefined){
							longitude = parse_gps(EXIF.getTag(f, "GPSLongitude"));
							latitude = parse_gps(EXIF.getTag(f, "GPSLatitude"));
							var ggPoint = new BMap.Point(longitude,latitude);
							//新建坐标转换实例
							var convertor = new BMap.Convertor();
							var pointArr = [];
							pointArr.push(ggPoint);
							translateCallback = function (data){
								if(data.status === 0) {
									longitude = data.points[0].lng;
									latitude = data.points[0].lat;
								}
							}
							//调用坐标转换实例把pointArr内的坐标转换成百度坐标系
							convertor.translate(pointArr, 1, 5, translateCallback);
						};
					});
				};
			})
			//图片加载完毕重绘infowindow
			document.getElementById('demo-preview').onload = function (){
				infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
			}
			document.getElementById('markerdelete').onclick = function (){
				map.removeOverlay(marker); //删除标注
			}
			$("#addMarker").submit(function(e){
				var formData = new FormData($("#addMarker")[0]);
				if (longitude != "" && longitude != null){
					formData.append("longitude", longitude);
					formData.append("latitude", latitude);
				}else {
					formData.append("longitude", longitude = marker.getPosition().lng);
					formData.append("latitude", latitude =marker.getPosition().lat);
				};

				$.ajax({
					url:"/InsertMarkerdata",
					type:"POST",
					dataType:"json",
					data:formData,
					contentType: false,
					processData: false,
					success:function(data) {
						layer.msg("添加成功")
						map.clearOverlays();
						selectMarker(data)

					},
					error:function(response){
						layer.msg("添加失败")
					}
				});
				return false
			});
		});
		map.addOverlay(marker);
	}
	// 百度地图API功能
	var map = new BMap.Map("allmap",{enableMapClick:false});    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
	map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	var addpoint;
	/*缩放控件type有四种类型:
	BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
	map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));
	map.addControl(new BMap.NavigationControl());

	var contextMenu = new BMap.ContextMenu();//添加右键菜单
	contextMenu.addItem(new BMap.MenuItem("添加足迹",  addMarker));
	contextMenu.addEventListener("open", function(e){
		addpoint = new BMap.Point(e.point.lng ,e.point.lat);//点坐标
	});
	map.addContextMenu(contextMenu);
	//查询全部点
	$.ajax({
		url:"/getMarkerAll",
		type:"POST",
		dataType:"json",
		contentType: false,
		processData: false,
		success:function(data) {
			selectMarker(data)
		},
		error:function(response){
		}
	});

});