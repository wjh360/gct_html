$(function () {
    // 初始化列表
    var AppropriationCol = [
        {
            field: 'contractName',
            title: '合同名称',
            width: '80'
        }, {
            field: 'secondParty',
            title: '合同乙方',
            width: '80'
        }, {
            field: 'constructEstimate',
            title: '预估值（元）',
            width: '80',
            'class': 'companyName'
        }, {
            field: 'finalValue',
            title: '决算值（元）',
            width: '80'
        }, {
            field: 'checkDecide',
            title: '审定值（元）',
            width: '80'
        }, {
            field: 'ratio',
            title: '支付比例',
            width: '80'
        }, {
            field: 'amount',
            title: '支付总金额（元）',
            width: '80'
        }, {
            field: 'status',
            title: '状态',
            width: '80',
            //3待审核  4不通过 5通过
            formatter: function (a, b) {
                if (b.status == '3') { return '审核中' }
                if (b.status == '4') { return '未过审' }
                else { return '已过审' }
            }
        }, {
            field: 'companyName',
            title: '创建单位',
            width: '80'
        }, {
            field: 'trueName',
            title: '创建人',
            width: '80'
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
            width: '160',
            formatter: function (a, b) {
                if (b.status == '4' && b.num == '1') {//不通过 可编辑
                    return '<a  class="noEdit " title= "">拨付记录</a><a class="editPropriation" title= "" data_power="Edit-project-payment-application-operation">编辑</a><a class="delAppropriation m_red" data_power="Delete-project-payment-application-operation"  title= "">删除</a>'
                }
                else {
                    return '<a  class="RecordAppropriation" title= "">拨付记录</a><a class="noEdit" title= "" data_power="Edit-project-payment-application-operation">编辑</a><a class="noEdit"  data_power="Delete-project-payment-application-operation" title= "">删除</a>'
                }
            }
        }
    ]
    appropriatePage()
    $('.searchVal').attr("maxLength", 50)
    function appropriatePage() {
        $http({
            url: '/gct-web/finance/appropriatePage',
            data: {
                contractName: $(".contractName").val(), //名称，
                secondParty: $(".secondParty").val() //乙方
            },
            success: function (r) {
                initTable("AppropriationTable", r.data, AppropriationCol)
            }
        })
    }
    // 删除
    $("body").on("click", '.delAppropriation', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定删除当前操作的内容吗？</div>",
            confirm: function () {
                appropriateDel()
            }
        })
    })
    function appropriateDel() {
        $http({
            url: '/gct-web/finance/appropriateDel',
            data: {
                id: tab_rowData.id //工程款支付id
            },
            success: function (r) {
                submitSuccess('', function () {
                    appropriatePage()
                })
            }
        })
    }
    // 搜索
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        appropriatePage()
    })
    //编辑
    $('body').on('click', '.editPropriation', function () {
        isYesProcess(6003, function () {
            storage("contractId", tab_rowData.id, 'editAppropriation') // 工程款支付ID 编辑
            goNewPage("./Appropriation/editAppropriation.html")
        })
    })
    // 拨付记录
    $('body').on('click', '.RecordAppropriation', function () {
        // alert(tab_rowData.id)
        storage("contractId", tab_rowData.id, 'RecordAppropriation') // 工程款支付ID 编辑
        storage("sts_addHide", tab_rowData.status, 'RecordAppropriation') //状态
        storage("num_addHide", tab_rowData.num, 'RecordAppropriation') //状态
        goNewPage("./Appropriation/RecordAppropriation.html")
    })
    $("body").on("click", ".addAppropriation", function () {
        isYesProcess(6003, function () {
            goNewPage('./Appropriation/addAppropriation.html')
        })
    })
})