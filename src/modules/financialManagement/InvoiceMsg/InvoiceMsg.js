$(function () {
    var colFrame = [
        {
            field: 'no',
            title: '申请编号',
            width: '100'
        }, {
            field: 'typeName',
            title: '发票类型',
            width: '100'
        }, {
            field: 'name',
            title: '付款方名称',
            width: '150'
        }, {
            field: 'idNumber',
            title: '纳税人识别号',
            width: '100'
        }, {
            field: 'statusName',
            title: '申请状态',
            width: '100'
        }, {
            field: 'companyName',
            title: '创建单位',
            width: '100',
            'class': 'companyName'
        }, {
            field: 'createName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间 ',
            width: '150',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            'class': '',
            width: '100',
            formatter: function (a, b) {
                if (b.status == 3 || b.status == 5) return '<a data_power="Edit-Invoice-application-operation" class="noEdit" title= "">编辑</a><a data_power="Delete-Invoice-application-operation" class="noEdit " title= "">删除</a>'
                else if (b.status == 4) return '<a data_power="Edit-Invoice-application-operation" class="editnvoiceNo" title= "">编辑</a><a data_power="Delete-Invoice-application-operation" class="delnvoiceNo m_red" title= "">删除</a>'
            }
        }
    ]
    var colFrame1 = [
        {
            field: 'no',
            title: '申请编号',
            width: '100'
        }, {
            field: 'typeName',
            title: '发票类型',
            width: '100'
        }, {
            field: 'name',
            title: '付款方名称',
            width: '150'
        }, {
            field: 'idNumber',
            title: '纳税人识别号',
            width: '100'
        }, {
            field: 'companyName',
            title: '创建单位',
            width: '100',
            'class': 'companyName'
        }, {
            field: 'createName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间 ',
            width: '150',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }
    ]
    function getInvoiceNoPage() {
        $http({
            url: '/gct-web/invoice/getInvoiceNoPage',
            data: {
                name: $('.searchVal').val() || $(".searchListInvoiceApplication").find('.name').val(),
                idNumber: $(".searchListInvoiceApplication").find('.idNumber').val(),
                type: $(".searchListInvoiceApplication").find('.invoicetype').attr('index'),
                status: $(".searchListInvoiceApplication").find('.applytype').attr('index'),
                companyName: $(".searchListInvoiceApplication").find('.companyName').val()
            },
            success: function (r) {
                initTable("InvoiceApplicationTable", r.data, colFrame)
                if (!r.dataOthers) $(".companyName").parents(".querytr").hide()
            }
        })
    }
    // tab页面切换函数
    switchTab()
    function switchTab() {
        if (nav_idx == 0) getInvoiceNoPage()
        else getInvoiceYesPage()
    }
    function getInvoiceYesPage() {
        $http({
            url: '/gct-web/invoice/getInvoiceYesPage',
            data: {
                name: $('.searchVal').val() || $(".searchListInvoiceList").find('.name').val(),
                idNumber: $(".searchListInvoiceList").find('.idNumber').val(),
                type: $(".searchListInvoiceList").find('.invoicetype').attr('index'),
                companyName: $(".searchListInvoiceList").find('.companyName').val()
            },
            success: function (r) {
                initTable("InvoiceListTable", r.data, colFrame1)
                if (!r.dataOthers) $(".companyName").parents(".querytr").hide()
            }
        })
    }
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { switchTab() })
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    $('body').on('click', '.addInvoice', function () {
        isYesProcess(6002, function () {
            goNewPage("./InvoiceMsg/InvoiceApplication/addInvoiceApplication.html")
        })
    })
    $('body').on('click', '.editnvoiceNo', function () {
        isYesProcess(6002, function () {
            storage('InvoiceId', tab_rowData.id, 'editInvoiceApplication')   // 开票id    编辑开票申请
            goNewPage("./InvoiceMsg/InvoiceApplication/editInvoiceApplication.html")
        })
    })
    $('body').on('click', '.delnvoiceNo', function () {
        $.popConfirm({
            'content': '确认删除吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/invoice/getInvoiceDel',
                    data: {
                        id: tab_rowData.id
                    },
                    success: function (r) {
                        switchTab()
                    }
                })
            }
        })
    })
    $('body').on('click', 'table tbody tr', function () {
        storage('InvoiceId', tab_rowData.id, 'detailsInvoiceApplication')   // 开票id    开票申请详情
        goNewPage("./InvoiceMsg/InvoiceApplication/detailsInvoiceApplication.html")
    })
})