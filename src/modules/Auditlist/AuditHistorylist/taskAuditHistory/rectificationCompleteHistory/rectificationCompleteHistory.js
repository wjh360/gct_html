var formId = storage("formId")  //工单id
$(function () {
    //申请详情
    function applyInfo() {
        $http({
            url: '/gct-web/applyRecord/getChangeFinishInfo',
            data: {
                formId: formId
            },
            success: function (r) {
                var auditId = storage('auditId')
                formAuditList(auditId)
                if (!r.data) return false
                var getData = r.data.taskFinish
                $("#applyData .createTime").html(initDate(getData.createTime))
                $("#applyData .taskEnd").html(initDate(getData.taskEnd))
                $("#applyData .dateSum").html(getData.dateSum)
                $("#applyData .changeContent").html(getData.content)
                $("#applyData .applyTime").html(initDate(getData.createTime, 's'))
                $("#applyData .applyName").html(r.data.trueName)
                var str = ""
                if (!r.data.taskFiles) return false
                $.each(r.data.taskFiles, function (i, val) {
                    str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
                })
                $(".taskFileListLog.finshImg").html(str)
                // formAuditList (taskId)
            }
        })
    }
    //tab切换点击事件
    $("body").on("click", '.first_nav.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        // 
        if (switchTab) switchTab()
    })
    //二级tab切换点击事件
    $("body").on("click", '.twos_nav.nav-tabs li', function () {
        nav_twos_idx = $(this).attr("data_index")
        storage("nav_twos_idx", nav_twos_idx) //页面 显示
        if (switchTab) switchTab()
    })
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        switch (nav_idx) {
            case 0:
                applyInfo()
                break;
            case 1:
                getTaskDetails()
                break;
            case 2:
                // getTaskDetails ()
                nav_twos_idx = parseFloat(nav_twos_idx)
                switch (nav_twos_idx) {
                    case 0:
                        getBeforEcho()
                        break;
                    case 1:
                        getConstructLogDate()
                        break;
                    case 2:
                        getChangeLogDate()
                        break;
                }
                break;
        }
    }
})