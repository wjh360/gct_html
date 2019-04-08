$(function () {
    var detailsRevenueCol = [
        {
            field: 'applyAmount',
            title: '申请金额（元）',
            width: '100'
        }, {
            field: 'invoiceNo',
            title: '发票号',
            width: '100'
        }, {
            field: 'receiveUserName',
            title: '收款人',
            width: '100'
        }, {
            field: 'receiveTime',
            title: '收款时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            field: 'companyName',
            title: '创建单位',
            width: '200'
        }, {
            field: 'trueName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }
    ]
    var orderId = storage("orderId")
    initgetPayApplyPage()
    function initgetPayApplyPage() {
        $http({
            url: '/gct-web/statistics/getPayApplyPage',
            data: {
                id: orderId
            },
            success: function (r) {
                initTable("detailsRevenueListTable", r.data, detailsRevenueCol, {
                    total: r.data,
                })
            },
        })
    }
})
