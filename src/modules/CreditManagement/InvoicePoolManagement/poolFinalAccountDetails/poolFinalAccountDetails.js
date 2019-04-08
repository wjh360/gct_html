
var taskId = storage('taskId')
$(function () {
    initData()
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/finalValueInfo',
        data: {
            taskId: taskId
        },
        success: function (r) {
            if(r.data.finalValue)$(".finalValue").html(r.data.finalValue + ' 元')
            if(r.data.fileList)initTable('projectTableContruct', r.data.fileList, fileColDetail)
        }
    })
}
