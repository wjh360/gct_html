$(function () {
    var getData = {};
    getList()
    function getList() {
        $http({
            url: "/gct-web/statistics/getIncomePage",
            data: getData,
            success: function (r) {
                initTable('RevenueListTable', r.data, col)
            }
        })
    }
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        getData = {
            projectName: $(".projectName").val() || $(".searchVal").val(),
            depName: $(".depName").val()
        }
        getList()
    })
    $("body").on("click", ".exportBtn", function () {
        exportTable('/gct-web/statistics/getIncomeExcel', getData, this)
    })
    //点击详情
    $("body").on("click", '#RevenueListTable tbody tr .moneycolor', function () {
        // log(tab_rowData)
        storage("orderId", tab_rowData.id, 'detailsRevenueStatistics') //订单id 回款明细详情
        goNewPage("././RevenueStatistics/detailsRevenueStatistics.html")
    })
})
var col = [
    {
        field: 'orderNo',
        title: '订单编号',
        width: '100'
    }, {
        field: 'orderName',
        title: '订单名称',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'orderAmount',
        title: '订单金额(元)',
        width: '100'
    }, {
        field: 'checkDecide',
        title: '审定值(元)',
        width: '100'
    }, {
        field: 'invoiceTotalAmount',
        title: '开票金额(元)',
        width: '100'
    }, {
        field: 'moneyBack',
        title: '回款金额(元)',
        width: '100',
        'class': 'moneycolor'
    }, {
        field: 'backProportion',
        title: '回款比例(%)',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'depName',
        title: '执行部门',
        width: '100'
    }
]