var orderId = storage("orderId")//订单Id;
var invoicePoolId = storage("invoicePoolId")//发票池Id;
var usePoolflag = storage("usePoolflag")//判断是1===正常发票还是2===已关闭发票
//可用发票到期发票判断
var userInvoiceflag = storage("userInvoiceflag")//判断是０====可用发票还是１===到期发票
if (usePoolflag == 1) {
    //只有正常发票才能有按钮
    if (userInvoiceflag == 0) {
        $(".dengjiInvoice").show()
        $(".invoiceListBor").addClass("pad10")
    } else {
        $(".payApplyMoney").show()
        $(".payApplyListBor").addClass("pad10")
    }
}
var detailsColBaseObj = {}
var colbaseData = []
$(function () {
    // tab页面切换函数
    switchTab()
    // 参数配置
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        if (nav_idx == 0) initData()
        else if (nav_idx == 1) purchaseOrderInfo()
        else if (nav_idx == 2) initData()
        else if (nav_idx == 3) invoiceListByOrderId(false)
        else if (nav_idx == 4) payApplyListByPage(false)
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //    点击登记发票
    $("body").on("click", '.dengjiInvoice', function () {
        var selectId = invoiceTableObj['invoiceTableArrId']
        if (selectId.length == 0) {
            $.popInfo("请选择要操作的发票")
        } else {
            $.popConfirm({
                content: "确定要对已勾选的发票操作登记吗？",
                confirm: function () {
                    registrationInvoice(selectId)
                }
            })
        }
    })
    //    点击竣工问津
    $("body").on("click", '#finishDatumTable tbody tr', function () {
        if (!tab_rowData.id) return false;
        storage('datumId', tab_rowData.id, 'poolTaskDetails')
        goNewPage("./poolTaskDetails.html")
    })
    //    点击审定问津
    $("body").on("click", '#finishDatum1Table tbody tr', function () {
        if (!tab_rowData.id) return false;
        storage('checkDecideId', tab_rowData.id, 'poolAuthorValueDetails')
        goNewPage("./poolAuthorValueDetails.html")
    })
    //点击发票
    $("body").on("click", '.invoiceClickTr', function () {
        if (!tab_rowData.id) return false;
        storage('invoiceId', tab_rowData.id, 'poolInvoiceDetails')
        goNewPage("./poolInvoiceDetails.html")
    })
    //    点击付款申请
    $("body").on("click", '.payClickTr', function () {
        if (!tab_rowData.id) return false;
        storage('payApplyId', tab_rowData.id, 'poolPayRequestDetails')
        goNewPage("./poolPayRequestDetails.html")
    })
    //   点击确认回款
    $("body").on("click", '.payApplyMoney', function () {
        var selectId = payTableObj['payTableArrId']
        if (selectId.length == 0) {
            $.popInfo("请选择要操作的付款申请")
        } else {
            var isR = true;
            $.each(payTableObj['payTableArrData'], function (k, v) {
                if (v.isBack == 2) {
                    isR = false;
                    $.popInfo("存在已回款的申请，请重新选择！")
                    return
                }
            })
            if (isR) {
                $.popConfirm({
                    content: " 确认回款成功后，发票池金额将随之减少，确定款项已收回吗？",
                    confirm: function () {
                        receivable(selectId)
                    }
                })
            }
        }
    })
    //  点击
    $("body").on("click", '.checkBox,.checkBoxTrue', function () {
        if (nav_idx == 3) {
            if ($(this).hasClass("checkBoxTrue")) {
                // 选中
                invoiceTableObj['invoiceTableArrId'].push(tab_rowData.id)
                invoiceTableObj['invoiceTableArrData'].push(tab_rowData)
            } else {
                //取消
                $.each(invoiceTableObj['invoiceTableArrId'], function (k, v) {
                    if (v == tab_rowData.id) {
                        invoiceTableObj['invoiceTableArrId'].splice(k, 1)
                        return;
                    }
                })
                $.each(invoiceTableObj['invoiceTableArrData'], function (k, v) {
                    if (v.id == tab_rowData.id) {
                        invoiceTableObj['invoiceTableArrData'].splice(k, 1)
                        return;
                    }
                })
            }
        }
        else if (nav_idx == 4) {
            if ($(this).hasClass("checkBoxTrue")) {
                // 选中
                payTableObj['payTableArrId'].push(tab_rowData.id)
                payTableObj['payTableArrData'].push(tab_rowData)
            } else {
                //取消
                $.each(payTableObj['payTableArrId'], function (k, v) {
                    if (v == tab_rowData.id) {
                        payTableObj['payTableArrId'].splice(k, 1)
                        return;
                    }
                })
                $.each(payTableObj['payTableArrData'], function (k, v) {
                    if (v.id == tab_rowData.id) {
                        payTableObj['payTableArrData'].splice(k, 1)
                        return;
                    }
                })
            }
        }

    })

    //   点击查看验收证书
    $("body").on("click", '.seeAcceptCertificate', function () {
        if (!tab_rowData.id) return
        storage('acceptCerId', tab_rowData.id, 'seeAcceptCertificate');//验收证书Id
        goNewPage("./seeAcceptCertificate.html")
    })
})
//竣工文件
function initData() {
    $http({
        url: '/gct-web/invoicePond/finishDatumByPage',
        data: {
            orderId: orderId,
            flag: userInvoiceflag
        },
        success: function (r) {
            if (nav_idx == 0) initTable('finishDatumTable', r.data, col)
            else if (nav_idx == 2) initTable('finishDatum1Table', r.data, finishDatumcol)
        }
    })
}

// 采购订单
function purchaseOrderInfo() {
    $http({
        url: '/gct-web/order/purchaseOrderInfo',
        data: {
            orderId: orderId
        },
        success: function (r) {
            if (r.data) {
                // 详情页面

                var frameContract = r.data.frameContract || {}
                var purchaseOrder = r.data.purchaseOrder || {}
                $(".serveAmount").html(purchaseOrder.serveAmount ? purchaseOrder.serveAmount + "元" : "0.00 元") //服务费
                $(".sateAmount").html(purchaseOrder.sateAmount ? purchaseOrder.sateAmount + "元" : "0.00 元") // 安全
                $(".guiAmount").html(purchaseOrder.guiAmount ? purchaseOrder.guiAmount + "元" : "0.00 元") //规费
                $(".contractName").html(frameContract.contractName) //合同名称
                if (r.data.project) {
                    $(".projectName").html(r.data.project.projectName)
                    $(".projectCode").html(r.data.project.projectCode)
                }

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
                initTable("fileListTable", r.data.list, fileColDetail)

            }
        }
    })
}
//订单费用明细
var FeeCol = [
    {
        title: '序号',
        width: '50',
        align: 'center',
        formatter: function (a, b, c) {
            return (c + 1)
        },
    }, {
        field: "orderGoods",
        title: '订单产品',
        width: '250',
        formatter: function (a) {
            return a
        },
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
                    return (c + 1)
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
                    // if (attrObj['property'] == 1) {
                    //     return '<input maxlength="' + attrObj['length'] + '" class="inputOrgan" type="text" value="' + a + '">'
                    // } else if (attrObj['property'] == 2) {
                    //     var maxlength = parseFloat(attrObj['intact']) + (attrObj['small'] == 1 ? 3 : 0)
                    //     return '<input data_intact="' + attrObj['intact'] + '"   style="width:90px;" maxlength="' +
                    //         maxlength + '" data_index="' + attrObj['small'] + '" class="inputOrgan inputSTab" type="text" value="' + a + '">'
                    // } else if (attrObj['property'] == 3) {
                    //     return '<div class="jeinpbox f_l" style="width: 230px"><input type = "text" value="' + a + '"  class="jeinput dateS" id = "tabJeiBox' + c + "_" + index + '" placeholder = "请选择日期" />' +
                    //         '<span class="jeinput_icons"></span>' +
                    //         '</div >'
                    // } else if (attrObj['property'] == 4) {
                    //     return '<div class="jeinpbox f_l" style="width: 230px"><input type = "text"  value="' + a + '" format="hh:mm:ss" class="jeinput dateS" id = "tabJeiBox' + c + "_" + index + '" placeholder = "请选择时间" />' +
                    //         '<span class="jeinput_icons"></span>' +
                    //         '</div >'
                    // }
                }
            }
            if (detailsColBaseObj[eleVal['dataName']] == undefined) {
                detailsColBaseObj[eleVal['dataName']] = ""
                detailsColBaseObj[eleVal['dataName'] + '_isNeed'] = eleVal['isNeed']
                detailsColBaseObj[eleVal['dataName'] + '_Name'] = eleVal['propertyName']
                // if (colArr.length < 10) {
                //     detailsColBaseObjBrforeTen[eleVal['dataName']] = ""
                //     detailsColBaseObjBrforeTen[eleVal['dataName'] + '_isNeed'] = eleVal['isNeed']
                //     detailsColBaseObjBrforeTen[eleVal['dataName'] + '_Name'] = eleVal['propertyName']
                // }
            }
            if (eleVal['isView'] == 1) {
                if (colArr.length < 10) colArr.push(colObj)
                colbaseData.push(colObj)
            }

        })

        // colArr.push({
        //     field: "",
        //     title: '操作',
        //     width: '50',
        //     formatter: function (a) {
        //         return '<span class="delete_mater m_col" ></span>'
        //     }
        // })
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

var invoiceTableObj = {
    invoiceTableArrData: [],
    invoiceTableArrId: []
}

//发票
function invoiceListByOrderId(flag) {
    $http({
        url: '/gct-web/invoicePond/invoiceListByOrderId',
        data: {
            orderId: orderId,
            flag: userInvoiceflag         //标识：0-可用发票；1-到期发票
        },
        success: function (r) {
            if (flag == false) {
                invoiceTableObj['invoiceTableArrData'] = []
                invoiceTableObj['invoiceTableArrId'] = []
            }

            if (usePoolflag == 2 || userInvoiceflag == 1 || !curUserPower['Financial-management_Invoice-pool-management']['Register-invoice-operation']) {
                invoicecol.splice(0, 1)
            }
            initTable('invoiceListTable', r.data, invoicecol)
        }
    })
}
//付款申请
var payTableObj = {
    payTableArrData: [],
    payTableArrId: []
}
function payApplyListByPage(flag) {
    $http({
        url: '/gct-web/invoicePond/payApplyListByPage',
        data: {
            orderId: orderId,
            flag: userInvoiceflag         //标识：0-可用发票；1-到期发票
        },
        success: function (r) {
            if (flag == false) {
                payTableObj['payTableArrData'] = []
                payTableObj['payTableArrId'] = []
            }
            if (userInvoiceflag == 0) initTable('payApplyListTable', r.data, payApplyListcol)

            else if (usePoolflag == 2 || userInvoiceflag == 1 || !curUserPower['Financial-management_Invoice-pool-management']['Confirmation-of-return-operation']) {

                // 2==已关闭
                if (usePoolflag == 1) {
                    //没关闭
                    $.each(r.data, function (k, v) {
                        if (payTableObj.payTableArrId.some(function (x) {
                            return v.id == x;
                        })) {
                            //    如果
                            v.selectTrue = true;
                        }
                    })
                } else {
                    payApplyEListcol.splice(0, 1)
                }
                initTable('payApplyListTable', r.data, payApplyEListcol)
            }
        }
    })
}
var col = [
    {
        field: 'datumName',
        title: '竣工文件名称',
        width: '200',
        "class": 'datumNameClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200',
        "class": 'datumNameClickTr',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'reportTrial',
        title: '报审值（元）',
        width: '200',
        formatter: function (a) {
            if (!a) return '0'
            else return a
        }
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            else return a;
        }
    },
    {
        field: 'trueName',
        title: '创建人',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
    , {
        title: '操作',
        width: '100',
        'class': '',
        formatter: function (a, row) {
            return '<a class="seeAcceptCertificate">查看验收证书</a>'
        }
    }
]
var finishDatumcol = [
    {
        field: 'datumName',
        title: '竣工技术文件名称',
        width: '200',
        "class": 'checkClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200',
        "class": 'checkClickTr',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'reportTrial',
        title: '报审值（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            else return a
        }
    }, {
        field: 'checkDecide',
        title: '审定值（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            else return a
        }
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    },
    {
        field: 'trueName',
        title: '创建人',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
    , {
        title: '操作',
        width: '100',
        'class': '',
        formatter: function (a, row) {
            return '<a class="seeAcceptCertificate">查看验收证书</a>'
        }
    }
]
var invoicecol = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function () {
            return '<span class="checkBox"></span>'
        }
    },
    {
        field: 'invoiceNo',
        title: '发票号',
        width: '200',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'invoiceAmount',
        title: '发票金额（元）',
        width: '200',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '0'
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'nowAmount',
        title: '可付款金额（元）',
        width: '200',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '0'
            else return a
        }
    }, {
        field: 'yesReceive',
        title: '已收款金额（元）',
        width: '100',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '0'
            else return a;
        }
    },
    {
        field: 'invoiceDate',
        title: '开票日期',
        width: '150',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a)
        }
    }, {
        field: 'expireDate',
        title: '到期日期',
        width: '150',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a)
        }
    },
    {
        field: 'isRegister',
        title: '登记状态',
        width: '150',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (a == 1) return '未登记'
            else if (a == 2) return '已登记'
        }
    }, {
        field: 'trueName',
        title: '创建人',
        width: '150',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        "class": 'invoiceClickTr',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
//到期的可付款
var payApplyEListcol = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function (a, rows) {
            if (!rows.selectTrue) return '<span class="checkBox"></span>'
            else if (rows.selectTrue) return '<span class="checkBoxTrue"></span>'
        }
    },
    {
        field: 'applyAmount',
        title: '申请金额（元）',
        width: '150',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'invoiceNo',
        title: '发票号',
        width: '150',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'isReceive',
        title: '收款状态',
        width: '100',
        "class": 'payClickTr',
        formatter: function (a) {
            return a == '1' ? '未收款' : '已收款'
        }
    }, {
        field: 'receiveUserName',
        title: '收款人',
        width: '100',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'receiveTime',
        title: '收款时间',
        width: '200',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return '暂无'
            else return initDate(a, 's')
        }
    }, {
        field: 'isBack',
        title: '回款状态',
        width: '100',
        "class": 'payClickTr',
        formatter: function (a) {
            //是否回款1未收款2已收款
            return a == '1' ? '未收款' : '已收款'
        }
    },
    {
        field: 'trueName',
        title: '创建人',
        width: '150',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        "class": 'payClickTr',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
//可用的付款申请
var payApplyListcol = [
    {
        field: 'applyAmount',
        title: '申请金额（元）',
        width: '200',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    }, {
        field: 'invoiceNo',
        title: '发票号',
        width: '200',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec " style="display:inline-block; max-width:200px;">' + a + '</span>'
        }
    },
    {
        field: 'trueName',
        title: '创建人',
        width: '150',
        "class": 'payClickTr',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec " style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        "class": 'payClickTr',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
//登记
function registrationInvoice(data) {
    $http({
        url: '/gct-web/invoicePond/registrationInvoice',
        data: {
            invoiceIds: data.join(",")
        },
        success: function (r) {
            submitSuccess('', function () {
                invoiceListByOrderId(false)
            })
        }
    })
}
//确认回款
function receivable(data) {
    $http({
        url: '/gct-web/invoicePond/receivable',
        data: {
            payApplyIds: data.join(","),
            invoicePondId: invoicePoolId
        },
        success: function (r) {
            submitSuccess('', function () {
                payApplyListByPage(false)
            })
        }
    })
}
