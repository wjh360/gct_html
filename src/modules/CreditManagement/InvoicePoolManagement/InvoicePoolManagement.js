$(function () {
    // tab页面切换函数
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx) + 1
        initData()
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initData()
    })
    //    点击项目添加
    $("body").on("click", '.invoicePoolAdd', function () {
        goNewPage("./InvoicePoolManagement/InvoicePoolAdd.html")
    })
    //   点击发票池名称，进入发票池详情列表页面
    $("body").on("click", 'tbody td', function () {
        if (!tab_rowData.id) return false;
        if (!$(this).hasClass('proListOper')) {
            storage("invoicePoolId", tab_rowData.id, 'InvoicePoolList')//发票池Id;
            //可用发票到期发票判断
            storage("usePoolflag", nav_idx, 'InvoicePoolList')//判断是1---正常发票还是2---已关闭发
            goNewPage("./InvoicePoolManagement/InvoicePoolList.html")
        }
    })
    //点击编辑
    $("body").on("click", '.invoicePoolUpdate', function () {
        if (!tab_rowData.id) return false;
        storage("invoicePoolId", tab_rowData.id, 'InvoicePoolUpdate')//发票池Id
        goNewPage("./InvoicePoolManagement/InvoicePoolUpdate.html")
    })
    //  点击关闭
    $("body").on("click", '.invoicePoolClose', function () {
        if (!tab_rowData.id) return false;
        $.popConfirm({
            'content': '发票池关闭后不可再开启，确定要关闭发票池吗?',
            confirm: function () {
                closeInvoicePool(tab_rowData.id)
            }
        })
    })
})
// //初始数据
function initData() {
    var appListData = {
        status: nav_idx,
        companyName: '',     //项目名称
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.companyName = $(".searchVal").val()
    }
    $http({
        url: '/gct-web/invoicePond/listByPage',
        data: appListData,
        success: function (r) {
            if (nav_idx == 1) { initTable('normalPoolTable', r.data, col); }
            else if (nav_idx == 2) { initTable('notPoolTable', r.data, col2); }
            //   公司类型===工程公司===没有工程那一列，搜搜条件不要，金融机构登陆，不要金融机构一列
            //公司类型：2-工程公司；3-金融机构；其他
            if (r.dataOthers && r.dataOthers.typeId == 2) {
                $(".conComTr,.searchBox").remove()
            } else if (r.dataOthers && r.dataOthers.typeId == 3) {
                $(".finComTr").remove()
            }
        }
    })
}
var col = [
    {
        field: 'pondName',
        title: '发票池名称',
        width: '200'
    }, {
        field: 'financeCompanyName',
        title: '金融机构',
        width: '200',
        "class": 'finComTr'
    }, {
        field: 'constructCompanyName',
        title: '工程公司',
        width: '200',
        "class": 'conComTr'
    }, {
        field: 'pondAmount',
        title: '发票池金额(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'createrName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a, 's')
        }
    }, {
        title: '操作', "class": 'proListOper', width: "100",
        formatter: function (a, row) {
            var str = "";
            str += '<span data_power="Edit-invoice-pool-operation" class = "invoicePoolUpdate m_col" >编辑</span>'
            str += '<span data_power="Closing-invoice-pool-operation" class = "invoicePoolClose m_red">关闭</span>'
            return str
        }
    }
]
var col2 = [
    {
        field: 'pondName',
        title: '发票池名称',
        width: '200'
    }, {
        field: 'financeCompanyName',
        title: '金融机构',
        width: '200',
        "class": 'finComTr'
    }, {
        field: 'constructCompanyName',
        title: '工程公司',
        width: '200',
        "class": 'conComTr'
    }, {
        field: 'pondAmount',
        title: '发票池金额(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'createrName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a, 's')
        }
    }
]
//关闭角色
function closeInvoicePool(poolId) {
    $http({
        url: '/gct-web/invoicePond/close',
        data: {
            id: poolId
        },
        success: function (r) {
            submitSuccess("", function () {
                initData()
            })
        }
    })
}
