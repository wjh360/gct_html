var formId = storage("formId")  //工单id
$(function () {
    //申请详情
    function applyInfo() {
        $http({
            url: '/gct-web/applyRecord/getDesginInfo',
            data: {
                formId: formId
            },
            success: function (r) {
                if (!r.data) return false
                var getData = r.data.taskDesginChange
                $("#applyData .after").html(getData.after)
                $("#applyData .brfor").html(getData.befor)
                $("#applyData .remark").html(getData.remark)
                $("#applyData .applyTime").html(initDate(getData.createTime, 's'))
                $("#applyData .applyName").html(r.data.trueName)
                var str = ""
                if (!r.data.taskFiles) return false
                $.each(r.data.taskFiles, function (i, val) {
                    str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
                })
                // log(str)
                $(".taskFileList .taskFileListLog").html(str)
                auditNoPassRemark(taskId, '3002')
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
        }
    }
})