$(function () {
    var sysMsgId = storage("sysMsgId")  //消息id
    //title       //标题
    //content       //内容
    //displayDate   //发布时间
    $http({
        url: '/gct-web/sysUser/getNewsInfo',
        data: {
            id: sysMsgId
        },
        success: function (r) {
            $(".HeaderTitle").html(r.data.obj.title)
            $(".displayDate").html(r.data.obj.displayDate)
            var str = $(".HeaderBottom").html(r.data.obj.content).text()
            // log(str)
            $(".HeaderBottom").html(str)
            // log(str)
        }
    })
})