
$(function () {
    orderId = storage('orderId')
    initPurchaseOrder()
    function initPurchaseOrder() {
        $http({
            url: '/gct-web/order/purchaseOrderInfo',
            data: {
                orderId: orderId
            },
            success: function (r) {
                if (r.data) {
                    var frameContract = r.data.frameContract || {}
                    var purchaseOrder = r.data.purchaseOrder || {}
                    // $(".serveAmount").html(purchaseOrder.serveAmount ? purchaseOrder.serveAmount + "元" : "0.00 元") //服务费
                    // $(".sateAmount").html(purchaseOrder.sateAmoun ? purchaseOrder.sateAmount + "元" : "0.00 元") // 安全
                    // $(".guiAmount").html(purchaseOrder.guiAmount ? purchaseOrder.guiAmount + "元" : "0.00 元") //规费
                    $(".purchaseOrder_orderNo").val(purchaseOrder.orderNo) //采购订单编号
                    $(".goodsUnit").val(purchaseOrder.goodsUnit) //采购单位
                    $(".propertyName").html(r.data.property ? r.data.property.propertyName : "") //订单属性
                    $(".startDate").val(initDate(purchaseOrder.startDate))
                    $(".finishDate").val(initDate(purchaseOrder.finishDate))
                    $(".testStart").val(initDate(purchaseOrder.testStart))
                    $(".testEnd").val(initDate(purchaseOrder.testEnd))
                    $(".centerUnitName").html(r.data.centerUnitName)
                    $(".orderName").html(r.data.order ? r.data.order.orderName : "")
                    $(".orderNo").html(r.data.order ? r.data.order.orderNo : "")
                    if (r.data.isEdit == 2) {
                        $(".contractName").html(frameContract.contractName).addClass('overf_Ec') //合同名称
                        $(".projectName").html(r.data.project.projectName).addClass('overf_Ec')
                    } else {
                        panduanIsEdit = 1
                        downSelectEcho({
                            el: 'contractId',                //元素id
                            data: r.data['contractList'],            //数据
                            ratioName: 'id',   // 需要比值的 键名
                            ratio: r.data.project['contractId'],           // 需要比值的 基准值
                            idx: 'id',               // 需要区分的键名 唯一标识
                            txt: 'contractName',               // 中文名字 所在的键名
                            type: '=='
                        })
                        $http({
                            url: "/gct-web/project/loadByContractId",
                            data: {
                                constractId: r.data.project['contractId']
                            },
                            success: function (v) {
                                if (v.data) {
                                    // getDownSelect("", '请选择项目', r.data, 'id', 'projectName', [])
                                    downSelectEcho({
                                        el: 'projectId',                //元素id
                                        data: v.data,            //数据
                                        ratioName: 'id',   // 需要比值的 键名
                                        ratio: r.data.project['id'],           // 需要比值的 基准值
                                        idx: 'id',               // 需要区分的键名 唯一标识
                                        txt: 'projectName',               // 中文名字 所在的键名
                                        type: '==',
                                        more: ['projectCode']
                                    })
                                }
                            }
                        })
                    }
                    contractId = r.data.project['contractId']
                    projectId = r.data.project['id']
                    $(".projectCode").html(r.data.project.projectCode)
                    downSelectEcho({
                        el: 'propertyId',                //元素id
                        data: r.data['orderProperties'],            //数据
                        ratioName: 'id',   // 需要比值的 键名
                        ratio: purchaseOrder['propertyId'],           // 需要比值的 基准值
                        idx: 'id',               // 需要区分的键名 唯一标识
                        txt: 'propertyName',               // 中文名字 所在的键名
                        type: '=='
                    })
                    // //订单费用明细
                    orderList = r.data.fees
                    $.each(orderList, function (index, eleVal) {
                        if (eleVal['type'] == 1) ServiceFeeLen++;
                        else if (eleVal['type'] == 2) SafetyFeeLen++;
                    })

                    showTableFees()
                    detailedList = r.data.constructs || []
                    // log(detailedList)
                    initDataSort(r.data.fields)
                    // //    回显附件
                    //    附件
                    orFileData['postFileBtnEcho'] = r.data.list
                    fileUploader({
                        btn: 'postFileBtn',
                        data: r.data.list,
                        tabId: 'fileListTable',
                        col: fileCol,
                        other: {
                            fileType: {
                                title: 'fileType',
                                extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                                mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                            }
                        }
                    })
                }
            }
        })
    }
})
