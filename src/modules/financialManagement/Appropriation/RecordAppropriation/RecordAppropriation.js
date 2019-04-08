$(function () {
    var sts_addHide = storage("sts_addHide")
    var num_addHide = storage("num_addHide")
    if (sts_addHide == '3'&& num_addHide == '1') {
        $(".toggle_con").hide()
    }else{
        $(".toggle_con").show()
    }
    // RecordAppropriationTable
    // 初始化列表
    var RecordAppropriationCol = [{
        field: 'no',
        title: '编号',
        width: '200',
        'class': 'companyName'
    }, {
        field: 'amount',
        title: '本次支付金额（元）',
        width: '200'
    }, {
        field: 'status',
        title: '状态',
        width: '200',
        // 3待审核  4不通过 5通过
        formatter: function (a, b) {
            if (b.status == '3') {
                return '待审核'
            }
            if (b.status == '4') {
                return '不通过'
            } else {
                return '通过'
            }
        }
    }, {
        field: 'trueName',
        title: '创建人',
        width: '200'
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200'
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
        formatter: function (a, b) {
            if (b.status == '4') {
                return '<a class="editRecordAppropriation" title= "" data_power="Edit-payment-record-operation">编辑</a><a class="delRecordAppropriation" title= "" data_power="Delete-payment-record-operation">删除</a>'
            } else {
                return '<a class="noEdit " title= "" data_power="Edit-payment-record-operation">编辑</a><a class="noEdit title= "" data_power="Delete-payment-record-operation">删除</a>'
            }
        }
    }]
    var contractId = storage("contractId")
    appropriateLogPage()

    function appropriateLogPage() {
        $http({
            url: '/gct-web/finance/appropriateLogPage',
            data: {
                appropriateId: contractId //工程款支付ID
            },
            success: function (r) {
                initTable("RecordAppropriationTable", r.data, RecordAppropriationCol)
            }
        })
    }
    // 删除
    function appropriateLogDel() {
        $http({
            url: '/gct-web/finance/appropriateLogDel',
            data: {
                id: tab_rowData.id //工程款支付ID
            },
            success: function (r) {
                submitSuccess('', function () {
                    goBack()
                })
            }
        })
    }
    // 点击添加拨付记录判断是否有流程
    $("body").on("click", '.addRecordAppropriation', function () {
        // alert(123)
        isYesProcess(6004, function () {
            // alert(contractId)
            storage("auditItem", 6004, 'addRecordAppropriation') //事项编码  业务申请页面
            storage("contractId", contractId, 'addRecordAppropriation') // 工程款支付ID 添加 
            goNewPage("././RecordAppropriation/addRecordAppropriation.html")
        })
    })
    // 点击编辑
    $("body").on("click", '.editRecordAppropriation', function () {
        // alert(123)
        isYesProcess(6004, function () {
            storage("contractRecordId", tab_rowData.id, 'editRecordAppropriation') // 工程款支付ID 编辑 
            goNewPage("././RecordAppropriation/editRecordAppropriation.html")
        })
    })
    // 点击删除
    $("body").on("click", '.delRecordAppropriation', function () {
        // alert(123)
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定删除当前操作的内容吗？</div>",
            confirm: function () {
                appropriateLogDel()
            }
        })
    })
    //点击详情
    $("body").on("click", '#RecordAppropriationTable tbody tr', function () {
        // log(tab_rowData)
        storage("contractRecordId", tab_rowData.id, 'detailsRecordAppropriation') // 工程款支付ID 编辑 
        goNewPage("././RecordAppropriation/detailsRecordAppropriation.html")
    })
})