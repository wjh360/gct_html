var storageLogId = storage('storageLogId')
$(function () {
    matterInfo()
})
//项目详情
function matterInfo() {
    $http({
        url: '/gct-web/inventory/details',
        data: {
            storageLogId: storageLogId
        },
        success: function (r) {
            // status==1是未领，2===已领
            if (r.data.status&&r.data.status == 1) {
                $(".status2Request").remove()
            }
            if(!r.data) return false;
            dataShow(r.data)
            initTable('matterTable', r.data.matterList, matterCol)
        }
    })
}
function dataShow(r) {
    r.collerNo ? $(".collerNo").html(r.collerNo) : $(".collerNo").parent().hide()
    r.createrName ? $(".createrName").html(r.createrName) : $(".createrName").parent().hide()
    r.createTime ? $(".createTime").html(initDate(r.createTime, 's')) : $(".createTime").parent().hide()
    r.confirmTime ? $(".confirmTime").html(initDate(r.confirmTime, 's')) : $(".confirmTime").parent().hide()
    r.receiveUserName ? $(".receiveUserName").html(r.receiveUserName) : $(".receiveUserName").parent().hide()
    r.receiveUserTel ? $(".receiveUserTel").html(r.receiveUserTel) : $(".receiveUserTel").parent().hide()
    r.storage.storageName ? $(".storageName").html(r.storage.storageName) : $(".storageName").parent().hide()
    r.storage.storageAddr ? $(".storageAddr").html(r.storage.storageAddr) : $(".storageAddr").parent().hide()
}
var matterCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100'
    }, {
        field: 'matterName',
        title: '物料名称',
        width: '100'
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '100'
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '50'
    }, {
        field: 'matterPrice',
        title: '单价(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '150'
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '100'
    }, {
        field: 'matterSupplier',
        title: '供应商单位',
        width: '100'
    }, {
        field: 'operationNum',
        title: '领料量',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }
]
