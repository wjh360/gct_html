
$(function () {
    var seePicPositionObj = storage('seePicPositionObj')
    $("#map").css({
        'height': ($("body").height() - 130) + 'px'
    })

    //地图初始化
    var map = new AMap.Map('map', {
        resizeEnable: true,//是否监控地图容器尺寸变化
        zoom: 14,//设置地图的缩放级别
        zooms: [3, 18]//显示缩放级别的方位默认3-18


    });

    //地图控件，显示比例尺
    AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], function () {
        map.addControl(new AMap.Scale());
    });
    var clickEventListener = function (e) {
        map.clearMap()
        if (picArr && picArr.length > 0) dataChu(picArr)
    }
    map.on('dblclick', clickEventListener);
    function mousewheelEventListener(e) {
        // $.popInfo(e)
        if ($(".imgBgDiv").length) return false
        map.clearMap()
        if (picArr && picArr.length > 0) dataChu(picArr)
    }
    var picArr;
    map.on('mousewheel', mousewheelEventListener);
    initData()
    function initData() {
        $http({
            url: '/gct-web/taskInstall/getTaskViewPhotoLocation',
            data: seePicPositionObj,
            success: function (r) {
                picArr = r.data.taskFiles
                dataChu(r.data.taskFiles)
            }
        })
    }
    function dataChu(data) {

        if (data[0].lng && data[0].lat) map.setCenter([data[0].lng, data[0].lat]);//中心点
        for (var i = 0; i < data.length; i += 1) {
            if (!data[i].lng || !data[i].lat) return false;
            marker = createMarker(data[i]);
            markers.push(marker);
            marker.on("click", function (e) {
                viewBigImg(e.target.getExtData().projectFileUrl)
            })


        }
    }

    var markers = [];
    var marker;
    //点标记的回显
    var createMarker = function (data) {
        // // 点
        var div = '<div class="mapPic"><img src="' + baseFileUrl + data.thumbnailUrl + '" alt=""></div>';
        var marker = new AMap.Marker({
            content: div,
            position: [data.lng, data.lat],
            offset: new AMap.Pixel(-44, -110),
            clickable: true,
            zIndex: data.id,
            extData: data
        });

        marker.setMap(map);//在地图中显示标记

        return marker;
    };


})




