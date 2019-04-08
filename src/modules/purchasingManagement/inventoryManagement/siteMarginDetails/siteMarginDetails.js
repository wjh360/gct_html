var matterId = storage('matterId')
var storageId = storage('storageId')
$(function () {
    initData()
    $("body").on("click", '.searchBtn.serActive', function () { initData() })
})
function initData() {
    var appListData = {
        storageId: storageId,
        matterId: matterId,
        constructionUserName: '',     //单位名称
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.constructionUserName = $(".searchVal").val()
    }
    $http({
        url: '/gct-web/inventory/taskMatterNumByPage',
        data: appListData,
        success: function (r) {
            initTable('LowListTable', r.data, matterCol)
        }
    })
}
var matterCol = [
    {
        field: 'trueName',
        title: '施工队长',
        width: '250'
    }, {
        field: 'depName',
        title: '所属部门',
        width: '250'
    }, {
        field: 'taskMatterNum',
        title: '现场余量',
        width: '250'
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '100'
    }
]