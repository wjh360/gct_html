var FundsgetData = {}
$(function () {
    var projectId = storage("projectId")
    var FundsgetData = {
        id: projectId,
        name: $(".name").val()
    }
    getAppropriateLogPage()
    function getAppropriateLogPage() {
        $http({
            url: '/gct-web/statistics/getAppropriateLogPage',
            data: FundsgetData,
            success: function (r) {
                initTable("detailsProjectFundsListTable", r.data, detailsProjectFundseCol, {
                    total: r.data,
                })
            },
        })
    }
    //    导出
    $("body").on("click", ".Funds_exportBtn", function () {
        exportTable('/gct-web/statistics/getAppropriateLogExcel', FundsgetData, this)
    })
})
var detailsProjectFundseCol = [{
    field: 'secondParty',
    title: '支付对象',
    width: '100'
}, {
    field: 'amount',
    title: '本次支付金额（元）',
    width: '100'
}, {
    field: 'companyName',
    title: '创建单位',
    width: '200',
}, {
    field: 'trueName',
    title: '创建人',
    width: '100',
}, {
    field: 'yesTime',
    title: '审批时间',
    width: '100',
    formatter: function (a) {
        return initDate(a, 's')
    }
}]