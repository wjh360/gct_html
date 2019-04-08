var detailedList;
var detailsColBaseObj = {}
var colbaseData = []
$(function () {
    // 初始化竣工技术文件列表
    var TechnicalMsgCol = [{
        field: 'datumName',
        title: '竣工技术文件名称',
        width: '200'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'reportTrial',
        title: '报审值（元）',
        width: '200',
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200',
    }, {
        field: 'trueName',
        title: '创建人',
        width: '200',
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        title: '操作',
        'class': '',
        width: '150',
        formatter: function (a) {
            return '<a data_power="Upload-Acceptance-Certificate-Operation" class="addAcceptance" title= "">上传验收证书</ a>'
        }
    }]
    // 审计信息
    var AuditInformationCol = [{
        field: 'datumName',
        title: '竣工技术文件名称',
        width: '200'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'reportTrial',
        title: '报审值（元）',
        width: '200',
    }, {
        field: 'checkDecide',
        title: '审定值（元）',
        width: '200',
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200',
    }, {
        field: 'trueName',
        title: '创建人',
        width: '200',
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'createTime',
        title: '操作',
        width: '200',
        formatter: function (a, b) {
            if (b.checkDecide == '' || b.checkDecide == null || b.checkDecide == '0') return '<a data_power="Add-validation-value-operation" class="addAuditInformation" title= "">添加审定值</a>'
            else return '<a data_power="Edit-validation-value-operation" class="editAuditInformation" title= "">编辑审定值</a>'
        }
    }]
    // 发票申请
    var InvoiceCol = [{
        field: 'invoiceNo',
        title: '发票号',
        width: '150'
    }, {
        field: 'invoiceAmount',
        title: '发票金额',
        width: '150'
    }, {
        field: 'nowAmount',
        title: '可付款金额（元）',
        width: '150',
    }, {
        field: 'yesReceive',
        title: '已付款金额（元）',
        width: '150',
    }, {
        field: 'invoiceDate',
        title: '开票日期',
        width: '150',
        formatter: function (a) {
            return initDate(a)
        }
    }, {
        field: 'construction.companyName',
        title: '创建单位',
        width: '200',
    }, {
        field: 'trueName',
        title: '创建人',
        width: '200',
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: '',
        title: '操作',
        width: '200',
        formatter: function (a, b) {
            return '<a data_power="Edit-invoice-operation" class="editInvoice" title= "">编辑</a>'
        }
    }]
    // 付款
    var PaymentApplicationCol = [{
        field: 'applyAmount',
        title: '申请金额（元）',
        width: '150'
    }, {
        field: 'invoiceNo',
        title: '发票号',
        width: '150'
    }, {
        field: 'isBack',
        title: '收款状态',
        width: '150',
        formatter: function (a, b) {
            ///1未收款2已收款
            if (b.isReceive == '1') {
                return '未收款'
            }
            if (b.isReceive == '2') {
                return '已收款'
            }
        }
    }, {
        field: 'receiveUserName',
        title: '收款人',
        width: '150',
    }, {
        field: 'receiveTime',
        title: '收款时间',
        width: '150',
        formatter: function (a) {
            return initDate(a)
        }
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200',
    }, {
        field: 'trueName',
        title: '创建人',
        width: '150',
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: '',
        title: '操作',
        width: '200',
        formatter: function (a, b) {
            if (b.isReceive == '1') return '<a data_power="Edit-payment-request-operation" class="editBidding" title= "">编辑</a><a data_power="Collection-operation" class="ReceivablesBtn" title= "">收款</a>' //未收款
            else return '<a data_power="Edit-payment-request-operation" class="noEdit" title= "">编辑</a><a data_power="Collection-operation" class="noEdit" title= "">收款</a>'
        }
    }]
    var orderId = storage("orderId")
    //  tab页面切换函数
    switchTab()

    function switchTab() {
        if (nav_idx == 0) initTechnicalMsgList() //竣工技术文件
        else if (nav_idx == 1) initPurchaseOrder() //采购订单
        else if (nav_idx == 2) initAuditInformation() //审计信息
        else if (nav_idx == 3) initInvoice() //发票申请
        else initPaymentApplication() //付款
    }
    // //   tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //竣工技术文件
    function initTechnicalMsgList() {
        $http({
            url: ' /gct-web/order/finshDatumByOrderIdPage',
            data: {
                orderId: orderId
            },
            success: function (r) {
                initTable("TechnicalMsgTable", r.data, TechnicalMsgCol, {
                    total: r.total,
                })
            }
        })
    }
    // 采购订单
    function initPurchaseOrder() {
        $http({
            url: '/gct-web/order/purchaseOrderInfo',
            data: {
                orderId: orderId
            },
            success: function (r) {
                if (r.data) {
                    // 详情页面
                    $(".detailsPurchaseOrder").show()
                    $(".addPurchaseOrder").hide()
                    var frameContract = r.data.frameContract || {}
                    var purchaseOrder = r.data.purchaseOrder || {}
                    $(".serveAmount").html(purchaseOrder.serveAmount ? purchaseOrder.serveAmount + "元" : "0.00 元") //服务费
                    $(".sateAmount").html(purchaseOrder.sateAmount ? purchaseOrder.sateAmount + "元" : "0.00 元") // 安全
                    $(".guiAmount").html(purchaseOrder.guiAmount ? purchaseOrder.guiAmount + "元" : "0.00 元") //规费
                    $(".contractName").html(frameContract.contractName) //合同名称

                    $(".projectName").html(r.data.project.projectName)
                    $(".projectCode").html(r.data.project.projectCode)
                    $(".purchaseOrder_orderNo").html(purchaseOrder.orderNo) //采购订单编号
                    $(".goodsUnit").html(purchaseOrder.goodsUnit) //采购单位

                    $(".propertyName").html(r.data.property ? r.data.property.propertyName : "") //订单属性

                    $(".startDate").html(initDate(purchaseOrder.startDate))
                    $(".finishDate").html(initDate(purchaseOrder.finishDate))
                    $(".testStart").html(initDate(purchaseOrder.testStart))
                    $(".testEnd").html(initDate(purchaseOrder.testEnd))

                    $(".centerUnitName").html(r.data.centerUnitName)

                    $(".orderName").html(r.data.order ? r.data.order.orderName : "")
                    $(".orderNo").html(r.data.order ? r.data.order.orderNo : "")


                    //订单费用明细
                    initTable('FeeTable', r.data.fees, FeeCol)

                    detailedList = r.data.constructs || []
                    initDataSort(r.data.fields)

                    //    回显附件
                    getFileList(r.data.list)
                } else {
                    $(".addPurchaseOrder").show()
                    $(".detailsPurchaseOrder").hide()
                }
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
    // 审计信息
    function initAuditInformation() {
        $http({
            url: '/gct-web/order/finshDatumByOrderIdPage',
            data: {
                orderId: orderId
            },
            success: function (r) {
                initTable("AuditInformationTable", r.data, AuditInformationCol, {
                    total: r.total,
                })
            }
        })
    }
    //发票 InvoiceTable
    function initInvoice() {
        $http({
            url: '/gct-web/order/invoiceByOrderIdPage',
            data: {
                orderId: orderId
            },
            success: function (r) {
                initTable("InvoiceTable", r.data, InvoiceCol, {
                    total: r.total,
                })
            }
        })
    }
    // 付款
    function initPaymentApplication() {
        $http({
            url: '/gct-web/order/payApplyByOrderIdPage',
            data: {
                orderId: orderId
            },
            success: function (r) {
                initTable("PaymentApplicationTable", r.data, PaymentApplicationCol, {
                    total: r.total,
                })
            }
        })
    }
    // 收款
    $("body").on("click", '.ReceivablesBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定收款吗？</div>",
            confirm: function () {
                receive()
            }
        })
    })

    function receive() {
        $http({
            url: '/gct-web/order/receive',
            data: {
                id: tab_rowData.id //付款id
            },
            success: function (r) {
                submitSuccess('', function () {
                    initPaymentApplication()
                })
            }
        })
    }
    $('body').on('click', '#TechnicalMsgTable tbody tr', function () {
        storage("datumId", tab_rowData.id, 'details_DataTechnical') //竣工id  审定值详情页面
        goNewPage("./detailsOrder/DataTechnical/details_DataTechnical.html")
    })
    // 上传验收证书
    $("body").on("click", '.addAcceptance', function () {
        // alert(orderId)
        storage("datumId", tab_rowData.id, 'addAcceptance') //竣工验收id
        goNewPage("./detailsOrder/DataTechnical/addAcceptance.html")
    })
    // 添加采购订单
    $("body").on("click", '.addPurchaseOrder', function () {
        // alert(orderId)
        storage("orderId", orderId, 'addPurchaseOrder') //订单id 添加采购订单页面
        goNewPage("./detailsOrder/PurchaseOrder/addPurchaseOrder.html")
    })
    // 编辑采购订单   editPurchaseOrder
    $("body").on("click", '.editPurchaseOrder', function () {
        // alert(orderId)
        storage("orderId", orderId, 'editPurchaseOrder') //订单id 编辑采购订单页面
        goNewPage("./detailsOrder/PurchaseOrder/editPurchaseOrder.html")
    })
    // 添加审定值
    $("body").on("click", '.addAuditInformation', function () {
        // alert(orderId)
        storage("datumId", tab_rowData.id, 'addAuditInformation') //竣工id  添加审定值页面
        goNewPage("./detailsOrder/AuditInformation/addAuditInformation.html")
    })
    // 编辑审定值
    $("body").on("click", '.editAuditInformation', function () {
        // alert(orderId)
        storage("datumId", tab_rowData.id, 'editAuditInformation') //竣工id  编辑审定值页面
        goNewPage("./detailsOrder/AuditInformation/editAuditInformation.html")
    })
    // 审定值详情
    $('body').on('click', '#AuditInformationTable tbody tr', function () {
        storage("datumId", tab_rowData.id, 'detailsAuditInformation') //竣工id  审定值详情页面
        goNewPage("./detailsOrder/AuditInformation/detailsAuditInformation.html")
    })
    // 添加发票
    $("body").on("click", '.addInvoice', function () {
        // 判断是否可以添加发票
        invoiceAddCheck()
        function invoiceAddCheck() {
            $http({
                url: '/gct-web/order/invoiceAddCheck',
                data: {
                    orderId: orderId
                },
                success: function (r) {
                    if (r.code == 0) {
                        storage("orderId", orderId, 'addInvoice') //订单id
                        goNewPage("./detailsOrder/Invoice/addInvoice.html")
                    }
                    else if (r.code == 1) {

                        $.popInfo("请先添加采购订单");
                    }
                }
            })
        }
    })
    // 编辑发票
    $("body").on("click", '.editInvoice', function () {
        // alert(orderId)
        storage("invoiceId", tab_rowData.id, 'editInvoice') //发票id
        goNewPage("./detailsOrder/Invoice/editInvoice.html")
    })
    // 发票详情
    $("body").on('click', '#InvoiceTable tbody tr', function () {
        // alert(orderId)
        storage("invoiceId", tab_rowData.id, 'detailsInvoice') //发票id
        goNewPage("./detailsOrder/Invoice/detailsInvoice.html")
    })
    //添加付款申请
    $('body').on('click', '.addBidding', function () {
        storage("orderId", orderId, 'addPaymentApplication') //订单id
        goNewPage("./detailsOrder/PaymentApplication/addPaymentApplication.html")
    })
    //编辑付款申请
    $('body').on('click', '.editBidding', function () {
        storage("payApplyId", tab_rowData.id, 'editPaymentApplication') //付款申请id 编辑
        storage("orderId", orderId, 'editPaymentApplication') //订单id
        goNewPage("./detailsOrder/PaymentApplication/editPaymentApplication.html")
    })
    //付款申请详情
    $('body').on('click', '#PaymentApplicationTable tbody tr', function () {
        storage("payApplyId", tab_rowData.id, 'detailsPaymentApplication') //付款申请id 编辑
        goNewPage("./detailsOrder/PaymentApplication/detailsPaymentApplication.html")
    })


})

//订单费用明细
var FeeCol = [
    {
        title: '序号',
        width: '50',
        align: 'center',
        formatter: function (a, b, c) {
            return c + 1
        }
    }, {
        field: "orderGoods",
        title: '订单产品',
        width: '250',
        formatter: function (a) {
            return a
        }
    }, {
        field: "orderUnit",
        title: '单位',
        width: '100',
        formatter: function (a) {
            return a
        }
    }, {
        field: "preTax",
        title: '税前金额（元）',
        width: '100',
        formatter: function (a) {
            return a
        }
    }, {
        field: "taxRate",
        title: '税率（％）',
        width: '100',
        formatter: function (a) {
            return a
        }
    }, {
        field: "taxAmount",
        title: '税额（元）',
        width: '100',
        formatter: function (a) {
            return a
        }
    }, {
        field: "afterTax",
        title: '税后金额（元）',
        width: '100',
        formatter: function (a) {
            return a
        }
    }, {
        field: "misAddr",
        title: 'MIS分配地点',
        width: '250',
        formatter: function (a) {
            return a
        }
    }
]



function initDataSort(data) {
    var colArr = []
    var detailedCol = []
    if (data) {

        detailedCol = [
            {
                title: '序号',
                width: '50',
                align: 'center',
                formatter: function (a, b, c) {
                    return c + 1
                }
            }
        ]
        $.each(data, function (index, eleVal) {
            var attrObj = eleVal['fieldType'], colObj = {}
            colObj = {
                field: eleVal['dataName'],
                title: eleVal['propertyName'],
                type: attrObj['property'],
                length: attrObj['length'],
                intact: attrObj['intact'],
                small: attrObj['small'],

                formatter: function (a, b, c) {
                    //1文本 2数值 3日期 4时间
                    a = a || ""
                    return a
                }
            }
            if (detailsColBaseObj[eleVal['dataName']] == undefined) {
                detailsColBaseObj[eleVal['dataName']] = ""
                detailsColBaseObj[eleVal['dataName'] + '_isNeed'] = eleVal['isNeed']
                detailsColBaseObj[eleVal['dataName'] + '_Name'] = eleVal['propertyName']
            }
            if (eleVal['isView'] == 1) {
                if (colArr.length < 10) colArr.push(colObj)
            }
        })
        $.each(colArr, function (index, val) {
            if (val) detailedCol.push(val)
        });
    }
    initTable('ConlistTable', detailedList, detailedCol)//施工清单明细表
    $("#ConlistTable input").not('.jeinput').blur(function () {
        var idx = tab_rowData_s['trIdx']
        detailedList[idx][tab_rowData_s['field']] = $(this).val()
    })
}
