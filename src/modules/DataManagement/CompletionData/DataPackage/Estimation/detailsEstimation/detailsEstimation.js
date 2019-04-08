$(function () {
    // 回显数据
    var taskId = storage("taskId")
    finalValueInfo()
    function finalValueInfo() {
        $http({
            url: '/gct-web/order/finalValueInfo',
            data: {
                taskId: taskId //投标申请id
            },
            success: function (r) {
                if( !r.data) return false
                $(".finalValue").html(r.data.finalValue + "元")
                //    回显附件
                getFileList(r.data.files)
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
})
