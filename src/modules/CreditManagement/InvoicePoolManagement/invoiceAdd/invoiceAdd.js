var invoicePoolId = storage("invoicePoolId")//发票池I
var appilObj = {};//提交数据
var applyFalg = true;
$(function () {
    //   页面数据返显
    initData()
    //点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "确定提交当前操作的内容吗？",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    addInvoice()
                }
            }
        })
    })
    $('body').on("click", '.all_Select_Private', function () {
        checkAllFun('invoiceTable')
        var useMoney = 0;
        $.each(iList, function (k, v) {
            useMoney = money_Add(useMoney, v.amount ? v.amount : 0)
        })
        $(".userMoney").html(useMoney)
    })
    $('body').on("click", '.all_Cancel_Private', function () {
        removecheckAllFun('invoiceTable')
        $(".userMoney").html(0)
    })
    $("body").on("click", '.checkBox,.checkBoxTrue', function () {
        var userMoney = $(".userMoney").html()
        if ($(this).hasClass("checkBoxTrue")) {
            // 选中
            $(".userMoney").html(money_Add(userMoney, tab_rowData.amount ? tab_rowData.amount : 0))
        } else {
            //取消
            $(".userMoney").html(money_Jian(userMoney, tab_rowData.amount ? tab_rowData.amount : 0))
        }
    })
})
//所有数据
var iList = []
function initData() {
    $http({
        url: '/gct-web/invoicePond/beforeAddInvoice',
        data: {
            invoicePondId: invoicePoolId
        },
        success: function (r) {
            if(!r.data.iList) return false;
            iList = r.data.iList
            initTable("invoiceTable", r.data.iList, col, {
                total: r.data,
            })
        }
    })
}
var col = [
    {
        width: '30',
        formatter: function () {
            return '<span class="checkBox"></span>'
        }
    },
    {
        field: 'invoiceNo',
        title: ' 发票号',
        width: '200'
    }, {
        field: 'invoiceAmount',
        title: '发票金额（元）',
        width: '200',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'amount',
        title: '可用金额（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'order.orderName',
        title: '订单名称',
        width: '200'
    }, {
        field: 'construction.companyName',
        title: '创建单位',
        width: '200'
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
//校验
function applyVerify() {
    appilObj = {}
    applyFalg = true;
    appilObj.invoicePondId = invoicePoolId;//名称
    appilObj.invoiceIds = tabObj['invoiceTable'].tab_select_ids.join(',')
    appilObj.canUserAmount = $(".userMoney").html()
    if (tabObj['invoiceTable'].tab_select_ids.length == 0) {
        applyFalg = false;
        $.popInfo("请至少选择一个发票");
        return false
    }
}
//提交数据
function addInvoice() {
    $http({
        url: '/gct-web/invoicePond/addInvoice',
        data: appilObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}