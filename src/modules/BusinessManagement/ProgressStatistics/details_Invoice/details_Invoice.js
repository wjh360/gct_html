$(function () {
    var projectId = storage("projectId")
    var InvoicegetData = {
        id: projectId,
        name: $(".name ").val() || $(".searchVal").val()
    }
    getProjectInvoiceDetailsPage()
    function getProjectInvoiceDetailsPage() {
        $http({
            url: '/gct-web/statistics/getProjectInvoiceDetailsPage',
            data: InvoicegetData,
            success: function (r) {
                initTable("details_InvoiceTable", r.data, details_InvoiceCol, {
                    total: r.data,
                })
            },
        })
    }
    //    导出
    $("body").on("click", ".Invoice_exportBtn", function () {
        exportTable('/gct-web/statistics/getProjectInvoiceDetailsExcel', InvoicegetData, this)
    })
})
var details_InvoiceCol = [{
    field: 'order.orderNo',
    title: '订单编号',
    width: '100'
}, {
    field: 'order.orderName',
    title: '订单名称',
    width: '100'
}, {
    field: 'invoiceNo',
    title: '发票号',
    width: '100'
}, {
    field: 'invoiceAmount',
    title: '发票金额（元）',
    width: '100',
}, {
    field: 'yesReceive',
    title: '已收款金额（元）',
    width: '100',
}, {
    field: 'invoiceDate',
    title: '开票日期',
    width: '100',
    formatter: function (a) {
        return initDate(a)
    }
}, {
    field: 'construction.companyName',
    title: '创建单位',
    width: '100',
}, {
    field: 'trueName',
    title: '创建人',
    width: '100',
}, {
    field: 'createTime',
    title: '创建时间',
    width: '200',
    formatter: function (a) {
        return initDate(a, 's')
    }
}]