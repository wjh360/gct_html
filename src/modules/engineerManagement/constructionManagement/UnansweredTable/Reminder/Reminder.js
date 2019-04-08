$(function () {
    getreminderRecordList()
    function getreminderRecordList() {
        var taskId = storage("taskId")
        $http({
            url: '/gct-web/task/getTaskReminderPage',
            data: {
                taskId: taskId
            },
            success: function (r) {
                initTable('reminderRecord_Tab', r.data, reminderRecord_ListCol, {})
            }
        })
    }










})