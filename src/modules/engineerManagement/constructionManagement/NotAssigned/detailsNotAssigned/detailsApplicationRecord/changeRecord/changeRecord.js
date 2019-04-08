$(function () {
    var taskForm = storage("taskForm")

    $http({
        url: '/gct-web/applyRecord/getMatterInfo',
        data: {
            formId: taskForm.formId
        },
        success: function (r) {
            $(".applyTime").html(initDate(r.data.taskMatterChange.createTime, 's'))
            $(".applyName").html(r.data.trueName)
            $(".bidName").html(r.data.taskMatterChange.reason)
            getAuditList()
        }
    })
    //获取审核记录
    function getAuditList() {
        $http({
            url: '/gct-web/audit/recordInfo',
            data: {
                id: taskForm.id
            },
            success: function (r) {
                initTable('taskFormAudit_listCol', r.data, taskFormAudit_listCol)
            }
        })
    }
})