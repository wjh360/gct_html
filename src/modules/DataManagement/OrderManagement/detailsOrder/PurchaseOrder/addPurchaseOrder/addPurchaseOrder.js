
$(function () {
    orderId = storage('orderId')
    purchaseOrderAddEcho()
    function purchaseOrderAddEcho() {
        $http({
            url: '/gct-web/order/purchaseOrderAddEcho',
            data: {
                orderId: orderId
            },
            success: function (r) {
                if (!r.data) return false
                var data = r.data
                if (data.project) {
                    contractId = data['project']['contractId']
                    projectId = data['project']['id']
                    if (data.list && data.list[0]) $("#contractId").html(data.list[0].contractName).addClass('overf_Ec')
                    if (data.project) {
                        $(".projectName").html(data.project.projectName).addClass('overf_Ec')
                        $(".projectCode").html(data.project.projectCode)
                    }
                } else {
                    panduanIsEdit = 1
                    getDownSelect("contractId", '请选择框架合同', data.list, 'id', 'contractName')
                }
                getDownSelect("propertyId", '请选择订单属性', data.orderProperties, 'id', 'propertyName')
                $(".centerUnitName").html(data.centerUnitName)
                if (data.order) {
                    $(".orderName").html(data.order.orderName)
                    $(".orderNo").html(data.order.orderNo)
                }
                if (data.fields) initDataSort(data.fields)
                showTableFees()
            }
        })
    }
    //    附件
    fileUploader({
        btn: 'postFileBtn',
        data: [],
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
})
