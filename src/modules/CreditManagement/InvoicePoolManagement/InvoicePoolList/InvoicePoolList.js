var invoicePoolId = storage("invoicePoolId")//发票池Id;
//可用发票到期发票判断
var usePoolflag = storage("usePoolflag")//判断是1===正常发票还是2===已关闭发票
//如果是正常发票，==可以添加发票===已关闭发票，不能添加发票
if (usePoolflag == 1) {
    //    如果是正常发票===添加发票
    $(".invoicePoolAdd").show()
}
$(function () {
    // tab页面切换函数
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        initData()
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //点击编辑
    $("body").on("click", '.invoicePoolDetail', function () {
        if (!invoicePoolId) return false;
        storage("invoicePoolId", invoicePoolId, 'InvoicePoolDetails')
        goNewPage("./InvoicePoolDetails.html")
    })
    //   添加发票
    $("body").on("click", '.invoicePoolAdd', function () {
        if (!invoicePoolId) return false;
        storage("invoicePoolId", invoicePoolId, 'invoiceAdd')
        goNewPage("./invoiceAdd.html")
    })
    //   点击订单，进入订单详情
    $("body").on("click", 'tbody tr', function () {
        if (!tab_rowData.id) return false;
        storage("orderId", tab_rowData.id, 'poolOrderDetails')//发票池Id;
        //可用发票到期发票判断
        storage("invoicePoolId", invoicePoolId, 'poolOrderDetails')
        storage("usePoolflag", usePoolflag, 'poolOrderDetails')
        if (nav_idx == 1) storage("userInvoiceflag", nav_idx, 'poolOrderDetails')//判断是0===可用发票还是1===到期发票
        else storage("userInvoiceflag", '0', 'poolOrderDetails')//判断是0===可用发票还是1===到期发票
        goNewPage("./poolOrderDetails.html")
    })
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/orderListByPage',
        data: {
            isExpire: (nav_idx + 1),           //是否过期：0-未过期；1-过期
            invoicePondId: invoicePoolId
        },
        success: function (r) {
            if (nav_idx == 0) {
                initTable('useInvoiceTable', r.data, col)
                if (r.dataOthers) {
                    $(".pondAmount").html(r.dataOthers.pondAmount ? r.dataOthers.pondAmount : '0')
                    $(".invoiceTotalAmount").html(r.dataOthers.nowAmount ? r.dataOthers.nowAmount : 0)
                    $(".availableTotalAmount").html(r.dataOthers.availableAmount ? r.dataOthers.availableAmount : 0)
                }
            }
            else if (nav_idx == 1) { initTable('expireInvoiceTable', r.data, col) }
        }
    })
}
var col = [
    {
        field: 'orderNo',
        title: '订单编号',
        width: '250'
    }, {
        field: 'orderName',
        title: '订单名称',
        width: '250'
    }, {
        field: 'invoicePercent',
        title: '发票',
        width: '200',
        formatter: function (a) {
            if (!a) return 0
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '%</span>'
        }
    }, {
        field: 'payPercent',
        title: '付款申请',
        width: '100',
        formatter: function (a) {
            if (!a) return 0
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '%</span>'
        }
    }, {
        field: 'incomePercent',
        title: '收款记录',
        width: '100',
        formatter: function (a) {
            if (!a) return 0
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '%</span>'


        }
    },
    {
        field: 'trueName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
