
$(function () {
    var contractId = storage("contractId")
    var auditId = storage('auditId')
    $http({
        url: '/gct-web/finance/appropriateInfo',
        data: {
            id: contractId
        },
        success: function (r) {
            // log(r)
            formAuditList(auditId)
            if (!r.data || !r.data.constructContract) return false
            $(".contractList").html(r.data.constructContract.contractName)
            $(".secondParty").html(r.data.constructContract.secondParty)
            initTable('selectedFileListTable', r.data.list, col)
            // var count = 0
            // $.each(r.data.list, function (index, eleVal) {
            //     if(eleVal.sumCost){
            //         count += parseFloat(eleVal.sumCost)
            //     }else{
            //         count += parseFloat(eleVal.finalValue)
            //     }
            // })
            // $(".unpaid").html(count || '0.00')
            if (!r.data.appropriate) return false
            $(".unpaid").html(r.data.appropriate.toPay)
            $(".money").html(r.data.appropriate.amount)
            $(".moneyBil").html(r.data.appropriate.ratio)
        }
    })
})
//所有工单
var col = [
    {
        field: 'taskName',
        title: '工单名称',
        width: 200
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 200
    }, {
        field: 'constructionUserName',
        title: '施工队长',
        width: 200
    }, {
        field: 'orderName',
        title: '订单名称',
        width: 200
    }, {
        field: 'typeName',
        title: '竣工技术文件名称',
        width: 200
    }, {
        field: 'constructEstimate',
        title: '预估值(元)',
        width: 200
    }, {
        field: 'finalValue',
        title: '决算值(元)',
        width: 200
    }, {
        field: 'sumCost',
        title: '审定值(元)',
        width: 200,
        formatter: function (a) {
            return a || '暂无'
        }
    }
]
