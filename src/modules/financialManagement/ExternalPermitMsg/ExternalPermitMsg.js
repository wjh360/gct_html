$(function () {
    var colFrame = [
        {
            field: 'no',
            title: '申请编号',
            width: '200'
        }, {
            field: 'applyStatus',
            title: '申请状态',
            width: '200'
        }, {
            field: 'createCompany',
            title: '创建单位',
            width: '200',
            'class': 'companyName'
        }, {
            field: 'createName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间 ',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            'class': '',
            width: '100',
            formatter: function (a, rows) {
                if (rows.status == '3') { return '<a data_power="Edit--External-permit-application-operation" class=" noEdit" title= "">编辑</a><a data_power="Remove-External-permit-application-operation" class=" noEdit" title= "">删除</a>' }
                if (rows.status == '4') { return '<a data_power="Edit--External-permit-application-operation" class="editnvoiceNo " title= "">编辑</a><a data_power="Remove-External-permit-application-operation" class="delnvoiceNo m_red " title= "">删除</a>' }
                // return '<a data_power="Edit--External-permit-application-operation" class="editnvoiceNo" title= "">编辑</a><a data_power="Remove-External-permit-application-operation" class="delnvoiceNo m_red" title= "">删除</a>'
            }
        }
    ]
    var colFrame1 = [
        {
            field: 'no',
            title: '申请编号',
            width: '200'
        }, {
            field: 'createCompany',
            title: '创建单位',
            width: '200'
        }, {
            field: 'createName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间 ',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }
    ]
    function getInvoiceNoPage() {
        $http({
            url: '/gct-web/external/getOutNoPage',
            success: function (r) {
                initTable("InvoiceApplicationTable", r.data, colFrame)
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
            url: '/gct-web/external/getOutYesPage',
            success: function (r) {
                initTable("InvoiceListTable", r.data, colFrame1)
            }
        })
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    $('body').on('click', '.addInvoice', function () {
        isYesProcess(6001, function () {
            goNewPage("./ExternalPermitMsg/ExternalApplication/addExternalApplication.html")
        })
    })
    $('body').on('click', '.editnvoiceNo', function () {
        isYesProcess(6001, function () {
            storage('ExternalPermitMsgId', tab_rowData.id, 'editExternalApplication')   // 外观表id  编辑
            goNewPage('./ExternalPermitMsg/ExternalApplication/editExternalApplication.html')
        })
    })
    $('body').on('click', '.delnvoiceNo', function () {
        $.popConfirm({
            'content': '确认删除吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/external/getExternalDel',
                    data: {
                        id: tab_rowData.id
                    },
                    success: function (r) {
                        submitSuccess('',function () {
                            getInvoiceNoPage()
                        })
                    }
                })
            }
        })
    })
    $('body').on('click', 'table tbody tr', function () {
        storage('ExternalPermitMsgId', tab_rowData.id, 'detailsExternalApplication')   // 外观表id    详情
        goNewPage('./ExternalPermitMsg/ExternalApplication/detailsExternalApplication.html')
    })
})