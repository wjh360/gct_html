var DeviceLocationCol = [
    {
        field: 'installPosition',
        title: '设备安装位置',
        width: 600
    },
    {
        field: 'createTime',
        title: '创建时间',
        width: 400,
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]

//工单列表
getTaskInstallPage()
function getTaskInstallPage() {
    var taskId = storage("taskId")
    $http({
        url: '/gct-web/taskInstall/getTaskInstallPage',
        data: {
            taskId: taskId
        },
        success: function (r) {
            initTable("DeviceLocationTable", r.data, DeviceLocationCol)
        }
    })
}