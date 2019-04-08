var operationRecordId = storage("operationRecordId")
var applyName = storage("applyName")
var applyTime = storage("applyTime")
$(function () {
    $(".applyName").html(applyName)
    $(".applyTime").html(initDate(applyTime, 's'))
    recordInfo()
})
//项目详情
function recordInfo() {
    $http({
        url: '/gct-web/audit/recordInfo',
        data: { id: operationRecordId },
        success: function (r) {
            initTable('operationTable', r.data, operationCol)
        }
    })
}
var operationCol = [
    {
        field: 'auditName',
        title: '审核人',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class=" overf_Ec" style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'auditTime',
        title: '审核时间',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '审核结果',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return projectStatus[a - 3]
        }
    }, {
        field: 'auditRemark',
        title: '审核意见',
        width: '350',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class=" overf_Ec" style="display:inline-block; max-width:350px;">' + a + '</span>'
        }
    }
]
var projectStatus = ['审核中', '未通过', '完成']