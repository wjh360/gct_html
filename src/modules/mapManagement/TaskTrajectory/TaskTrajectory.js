
var xianPoliy = [];
//从工单跳入的taskId
var contructTaskId = storage('taskId')
//如果
$(function () {

    if ($(".map-container").height() < 460) {
        $(".taskDesMessOne").css({
            'height': ($(".map-container").height()) + 'px'
        })
    }
    //地图初始化
    var map = new AMap.Map('map', {
        resizeEnable: true,//是否监控地图容器尺寸变化
        zoom: 18//设置地图的缩放级别
        // zooms: [4, 19]//显示缩放级别的方位默认3-18
    });
    //地图控件，显示比例尺
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], function () {
        map.addControl(new AMap.Scale());
    });
    //点击工单详情的叉号
    $("body").on("click", '.taskInfoZhan', function () {
        $(this).toggleClass('active')
        $(".taskDesMessOne").slideToggle()
    })
    seeTaskTrack(contructTaskId)
    var markers = []; //province见Demo引用的JS文件
    var marker;
    //点标记的回显
    var createMarker = function (data, pan) {
        // // 点
        var div = document.createElement('div');
        var taskStaHE = 'taskMark' + data.attribute + data.taskStatus;
        div.className = 'taskMark ' + taskStaHE;
        div.innerHTML = data.taskNum == 1 ? '' : data.taskNum;
        var marker = new AMap.Marker({
            content: div,
            position: [data.taskLng, data.taskLat],
            offset: new AMap.Pixel(-11, -30),
            zIndex: data.id,
            clickable: true,
            extData: data
        });
        // marker.setOffset(new AMap.Pixel(-8, -8))
        marker.setMap(map);//在地图中显示标记
        return marker;
    };
    function dataChu(data, flag, mouseFlag) {
        if (!mouseFlag) map.setCenter([data[0].taskLng, data[0].taskLat])
        for (var i = 0; i < data.length; i += 1) {
            marker = createMarker(data[i], flag);
            markers.push(marker);
            if (!flag) {
                marker.on("click", function (e) {
                    taskInfo(e.target.getExtData().idStr)
                })
            }
        }
    }
    //   点击标记，回显工单详情
    function taskInfo(data) {
        if (!data) return
        $http({
            url: '/gct-web/map/taskInfo',
            data: {
                idStr: data
            },
            success: function (r) {
                if (r.code == 0) {
                    taskInfoShowOne(r.data)
                }
            }
        })
    }
    //进入轨迹层的工单详情
    function taskInfoShowOne(data) {
        $(".taskDesMessOne").html("")
        var str = ''
        $.each(data, function (k, v) {
            str += '<div class="taskInfoBox">\n' +
                '                    <div class="taskTopTiTle  " style="min-height: 30px">\n' +
                '                        <div class="taskStatus">\n';
            v.icon == 2 ? str += ' <i class="taskzhuan"></i>' : ''
            v.icon == 3 ? str += ' <i class="taskchao"></i>' : '';
            v.icon == 4 ? str += ' <i class="taskchao"></i><i class="taskzhuan"></i>' : '';
            str += '                        </div>\n';
            if (v.attribute == 1) str += '<a id="exportConstructionTrajectory" indx="' + v.id + '" href="" downLoad="downLoad" >导出施工轨迹</a>';
            str += '                    </div>\n' +
                '                    <div class="tashInfoTr overf_E">项目名称：' + (v.projectName?v.projectName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">项目类型：' + (v.typeName?v.typeName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">施工单位：' + (v.constructCompanyName?v.constructCompanyName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">负责人：' + (v.constructPersonName?v.constructPersonName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">负责人电话：' + (v.constructPersonTel?v.constructPersonTel:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">工单名称：' + (v.taskName?v.taskName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">工单类别：' + (v.categoryName ? v.categoryName : '') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">施工队长：' + (v.constructionUserName?v.constructionUserName:'') + '</div>\n' +
                '                    <div class="tashInfoTr overf_E">队长电话：' + (v.constructionUserTel?v.constructionUserTel:'') + '</div>';
            v.actualHours ? str += ' <div class="tashInfoTr overf_E">执行周期(天)：' + v.actualHours + '天</div>' : ''
            v.actualStartDate ? str += '<div class="tashInfoTr overf_E">实际开工时间：' + initDate(v.actualStartDate) + '</div>' : '';
            v.actualEndDate ? str += '<div class="tashInfoTr overf_E">实际完工时间：' + initDate(v.actualEndDate) + '</div>' : ''
            str += ' </div>'
        })
        $(".taskDesMessOne").html(str).slideDown()
    }
    function seeTaskTrack(taskId) {
        $http({
            url: '/gct-web/map/getTaskTrajectory',
            data: {
                taskId: taskId
            },
            success: function (r) {
                map.clearMap();//清除原点标记
                taskInfo(contructTaskId)
                if (r.code == 0) {
                    map.setZoom(18);
                    // attribute:1            //工单属性：1-线路；2-设备
                    //线路类
                    if (r.data.ttList.length > 0 && r.data.task.attribute == 1) {
                        //    设备类[data.taskLng, data.taskLat],
                        map.setCenter([r.data.ttList[0].trajectoryLng, r.data.ttList[0].trajectoryLat])
                        dataXianChu(r.data.ttList, 1)
                        forXianGuiJi(r.data.ttList)
                    } else if (r.data.ttList.length == 0 && r.data.task.attribute == 1) {
                        $.popInfo("暂无施工轨迹")
                    }
                    // 基站=
                    else if (r.data.task.attribute == 2) {
                        //只有一个点
                        map.setCenter([r.data.task.taskLng, r.data.task.taskLat])
                        dataChu([r.data.task], 2)
                    }
                }
            }
        })
    }
    //线路类的图标的回显
    function dataXianChu(data) {
        for (var i = 0; i < data.length; i += 1) {
            marker = createXianMarker(data[i]);
            markers.push(marker);
            marker.on("click", function (e) {
                var taskTrArr = e.target.getExtData()
                var map1ProMess = "<div class='mapTaskIndoWindow'>";
                $(taskTrArr).each(function (i, item) {
                    map1ProMess += '<div class="tashInfoTr overf_E">' + item.iconName + '</div>'
                })
                map1ProMess = map1ProMess + "</div>"
                infoWindow = new AMap.InfoWindow({
                    isCustom: true,  //使用自定义窗体
                    content: createInfoWindow(map1ProMess),
                    offset: new AMap.Pixel(5, 200)
                });
                infoWindow.open(map, e.target.getPosition());
            })
        }
    }
    //点标记的回显
    var createXianMarker = function (data) {
        // // 点
        var div = document.createElement('img');
        div.className = 'xianIcon';
        if (data.taskIconList[0].iconUrl) div.src = baseFileUrl + data.taskIconList[0].iconUrl
        var marker = new AMap.Marker({
            content: div,
            position: [data.trajectoryLng, data.trajectoryLat],
            offset: new AMap.Pixel(-12, -30),
            zIndex: data.trajectoryLevel,
            clickable: true,
            extData: data.taskIconList
        });
        marker.setMap(map);//在地图中显示标记
        return marker;
    };
    //    轨迹
    //线路的轨迹
    function forXianGuiJi(data) {
        // 轨迹颜色
        for (var i = 0; i < data.length; i++) {
            if (data[i].fatherId) {//有fa字段
                for (var y = 0; y < data.length; y++) {
                    var lineArr30 = []
                    if (data[y].id == data[i].fatherId) {
                        lineArr30.push([data[i].trajectoryLng, data[i].trajectoryLat])
                        lineArr30.push([data[y].trajectoryLng, data[y].trajectoryLat])
                    }
                    var polyline30 = new AMap.Polyline({
                        // map: map,
                        path: lineArr30,
                        strokeColor: '#6590ff',  //线颜色
                        strokeOpacity: 1,     //线透明度
                        strokeWeight: 4,      //线宽
                        strokeStyle: "solid"  //线样式
                    });
                    polyline30.setMap(map);
                    xianPoliy.push(polyline30)
                }
            }
        }
    }
    //  点击导出施工轨迹
    $("body").on("click", '#exportConstructionTrajectory', function () {
        var taskId = $(this).attr("indx")
        if (!taskId) return
        downDatasLen = [1];//导出时，判断
        exportTable('/gct-web/map/downPdf', { taskId: taskId }, this)
    })
    //实例化信息窗体,用于经纬度的定位的弹窗
    function createInfoWindow(content) {
        var info = document.createElement("div");
        info.className = "info clearfix";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        closeX.src = "../../../img/mapImg/closeTask.png";
        closeX.onclick = closeInfoWindow;
        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);
        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);
        // 定义底部内容
        // var bottom = document.createElement("div");
        // bottom.className = "info-bottom";
        // bottom.style.position = 'relative';
        // bottom.style.top = '0px';
        // bottom.style.margin = '0 auto';
        // var sharp = document.createElement("img");
        // // sharp.src = "http://webapi.amap.com/images/sharp.png";
        // bottom.appendChild(sharp);
        // info.appendChild(bottom);
        return info;
    }
    //关闭信息窗体
    function closeInfoWindow() {
        $(".map1ProMess").html("")
        map.clearInfoWindow();
    }
})
