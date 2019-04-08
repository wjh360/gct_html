var matterId = storage('matterId')
var storageId = storage('storageId')
$(function () {
    initData()
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () { initData() })
})
function initData() {
    var appListData = {
        storageId: storageId,
        matterId: matterId,
        taskName: '',     //单位名称
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.taskName = $(".searchVal").val()
    }
    $http({
        url: '/gct-web/inventory/useNumByPage',
        data: appListData,
        success: function (r) {
            initTable('LowListTable', r.data, matterCol)
        }
    })
}
var matterCol = [
    {
        field: 'taskName',
        title: '工单名称',
        width: '250'
    }, {
        field: 'projectName',
        title: '所属项目',
        width: '250'
    }, {
        field: 'userNum',
        title: '使用量',
        width: '250'
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '100'
    }
]