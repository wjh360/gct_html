var matterId = storage('matterId')
var storageId = storage('storageId')
$(function () {
    // tab页面切换函数
    matterInfo()

})
//项目详情
function matterInfo() {
    var appListData = {
        storageId: storageId,
        matterId: matterId
    }
    $http({
        url: '/gct-web/inventory/matterDetails',
        data: appListData,
        success: function (r) {
            operationRecord()
            if(!r.data.matter||!r.data.storageMatter) return false;
            dataShow(r.data.matter, r.data.storageMatter)
        }
    })
}
function dataShow(matter, storageMatter) {
    var $DetaObj = $(".details_Text")
    $DetaObj.eq(0).html(matter.matterCode)
    $DetaObj.eq(1).html(matter.matterName)
    matter.matterSpec ? $DetaObj.eq(2).html(matter.matterSpec) : $DetaObj.eq(2).parent().hide()
    matter.matterUnit ? $DetaObj.eq(3).html(matter.matterUnit) : $DetaObj.eq(3).parent().hide()
    matter.matterPrice ? $DetaObj.eq(4).html(matter.matterPrice + '元') : $DetaObj.eq(4).parent().hide()
    matter.matterType ? $DetaObj.eq(5).html(matter.matterType) : $DetaObj.eq(5).parent().hide()
    matter.matterSource ? $DetaObj.eq(6).html(matter.matterSource) : $DetaObj.eq(6).parent().hide()
    matter.matterSupplier ? $DetaObj.eq(7).html(matter.matterSupplier) : $DetaObj.eq(7).parent().hide()
    storageMatter.inNum ? $DetaObj.eq(8).html(storageMatter.inNum) : $DetaObj.eq(8).parent().hide()
    storageMatter.allotNum ? $DetaObj.eq(9).html(storageMatter.allotNum) : $DetaObj.eq(9).parent().hide()
    storageMatter.outNum ? $DetaObj.eq(10).html(storageMatter.outNum) : $DetaObj.eq(10).parent().hide()
    storageMatter.matterNum ? $DetaObj.eq(11).html(storageMatter.matterNum) : $DetaObj.eq(11).parent().hide()
    storageMatter.taskUserNum ? $DetaObj.eq(12).html(storageMatter.taskUserNum) : $DetaObj.eq(12).parent().hide()
}
//操作记录
//项目工作量
function operationRecord() {
    $http({
        url: '/gct-web/inventory/recordByPage',
        data: {
            storageId: storageId,
            matterId: matterId
        },
        success: function (r) {
            initTable('operatorTable', r.data, workOperatorCol)
        }
    })
}
var workOperatorCol = [
    {
        field: 'recordName',
        title: '操作事项',
        width: '200'
    }, {
        field: 'recordMatterNum',
        title: '数量',
        width: '200'
    }, {
        field: 'createrName',
        title: '操作人',
        width: '100'
    }, {
        field: 'createTime',
        title: '操作时间',
        width: '200',
        formatter: function (a) {
            if (!a) return ''
            return initDate(a, 's')
        }
    }
]
