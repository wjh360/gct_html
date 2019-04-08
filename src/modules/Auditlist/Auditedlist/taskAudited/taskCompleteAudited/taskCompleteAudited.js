var formId = storage("formId")  //工单id
$(function () {
    //申请详情
    function applyInfo() {
        $http({
            url: '/gct-web/applyRecord/getFinishInfo',
            data: {
                formId: formId //taskForm.formId
            },
            success: function (r) {
                if (!r.data) return false
                var getData = r.data.taskFinish
                $("#applyData .finishContent").html(getData.content)
                $("#applyData .dateSum").html(getData.dateSum)
                $("#applyData .taskEnd").html(initDate(getData.taskEnd))
                $("#applyData .startTime").html(initDate(r.data.startTime))
                $("#applyData .applyTime").html(initDate(getData.createTime, 's'))
                $("#applyData .applyName").html(r.data.trueName)
                var str1 = ""
                if (!r.data.taskFiles1) return false
                $.each(r.data.taskFiles1, function (i, val) {
                    str1 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
                })
                // log(str1)
                $(".taskFileListLog.finshImg").html(str1)
                var str2 = ""
                if (!r.data.taskFiles2) return false
                $.each(r.data.taskFiles2, function (i, val) {
                    str2 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
                })
                // log(str2)
                $(".taskFileListLog.finshSketch").html(str2)
                auditNoPassRemark(formId, '3003')
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