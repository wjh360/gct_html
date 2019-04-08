var formId = storage("formId")  //工单id
$(function () {
    //申请详情
    function applyInfo() {
        $http({
            url: '/gct-web/applyRecord/getMatterInfo',
            data: {
                formId: formId
            },
            success: function (r) {
                var auditId = storage('auditId')
                formAuditList(auditId)
                $(".applyTime").html(initDate(r.data.taskMatterChange.createTime, 's'))
                $(".applyName").html(r.data.trueName)
                $(".bidName").html(r.data.taskMatterChange.reason)
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