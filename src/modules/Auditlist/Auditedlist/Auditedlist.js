$(function () {
    // 渲染表格
    // 市场审核
    var MarketAuditcol = [
        {
            field: 'no',
            title: '编号',
            width: '200'
        }, {
            field: 'name',
            title: '投标名称',
            width: '200'
        }, {
            field: 'unit',
            title: '发标单位',
            width: '200'
        }, {
            field: 'typeName',
            title: '项目类型',
            width: '200'
        }, {
            field: 'applyTime',
            title: '申请时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            field: 'itemName',
            title: '申请事项',
            width: '200'
        }, {
            title: '操作',
            width: '50',
            'class': '',
            formatter: function (a) {
                return '<a class="MarketAuditClick" title= "">审核</a>'
            }
        }
    ]
    // 项目审核
    var ProjectAuditcol = [
        {
            field: 'no',
            title: '项目编号',
            width: '200'
        }, {
            field: 'projectName',
            title: '项目名称',
            width: '200'
        }, {
            field: 'typeName',
            title: '项目类型',
            width: '200'
        }, {
            field: 'name',
            title: '施工类型',
            width: '100',
            formatter: function (a) {
                if (a == 1) return '包工包料'
                else if (a == 2) return '包工不包料'
                else if (a == 3) return '清包工'
                else return ''
            }
        }, {
            field: 'unit',
            title: '申请单位',
            width: '150'
        }, {
            field: 'applyName',
            title: '申请人',
            width: '150'
        }, {
            field: 'applyTime',
            title: '申请时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            field: 'itemName',
            title: '申请事项',
            width: '100'
        }, {
            title: '操作',
            width: '50',
            'class': '',
            formatter: function (a, row) {
                return '<a class="projectAuditClick">审核</a>'
            }
        }
    ]
    // 工单审核
    var WorkorderAuditcol = [
        {
            field: 'no',
            title: '工单编号',
            width: '100'
        }, {
            field: 'name',
            title: '工单名称',
            width: '100'
        }, {
            field: 'projectName',
            title: '项目名称',
            width: '100'
        }, {
            field: 'planDays',
            title: '工单周期（天）',
            width: '100',
        }, {
            field: 'actualDays',
            title: '执行周期（天）',
            width: '100',
        }, {
            field: 'trueName',
            title: '施工队长',
            width: '100',
        }, {
            field: 'unit',
            title: '申请单位',
            width: '100',
        }, {
            field: 'applyName',
            title: '申请人',
            width: '100',
        }, {
            field: 'applyTime',
            title: '申请时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            field: 'itemName',
            title: '申请事项',
            width: '100',
            formatter: function (a, b) {
                var obj = {
                    '3001': "物料变更申请",                     // '物料变更申请',
                    '3002': "设计变更申请",                       // '设计变更申请',
                    '3003': "完工申请",                       // '完工申请',
                    '3004': "整改完工申请"               // '整改完工申请',
                }
                return obj[b.itemCode]
            }
        }, {
            title: '操作',
            width: '100',
            'class': '',
            formatter: function (a) {
                return '<a class="taskAuditClick" title= "">审核</a>'
            }
        }
    ]
    // 财务审核
    var FinanceAuditAuditcol = [
        {
            field: 'no',
            title: '申请编号',
            width: '200'
        }, {
            field: 'itemName',
            title: '申请类型',
            width: '200'
        }, {
            field: 'unit',
            title: '申请单位',
            width: '200',
        }, {
            field: 'applyName',
            title: '申请人',
            width: '200',
        }, {
            field: 'applyTime',
            title: '申请时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            width: '50',
            formatter: function (a) {
                return '<a class="financialAuditClick" title= "">审核</a>'
            }
        }
    ]
    //  tab页面切换函数
    switchTab()
    function switchTab() {
        if (nav_idx == 0) initMarketAudit()   //   市场审核
        if (nav_idx == 1) ProjectAudit()    //项目审核
        if (nav_idx == 2) WorkorderAudit()    //工单审核
        if (nav_idx == 3) FinanceAudit()    //财务审核
        if (nav_idx == 4) PurchaseAudit()              //采购审核
        if (nav_idx == 5) CostAudit()    //成本审核
        if (nav_idx == 6) budgetAudit()    //概预算审核
    }
    // //   tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    // 市场审核
    function initMarketAudit() {
        $http({
            url: '/gct-web/audit/pageBidAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("MarketAuditTable", r.data, MarketAuditcol, {
                    total: r.total,
                })
            }
        })
    }
    // 项目审核
    function ProjectAudit() {
        $http({
            url: '/gct-web/audit/pageProjectAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("ProjectAuditTable", r.data, ProjectAuditcol, {
                    total: r.total,
                })
            }
        })
    }
    //采购
    function PurchaseAudit() {
        $http({
            url: ' /gct-web/audit/pagePurchaseAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("PurchaseAuditTable", r.data, PurchaseAuditCol)
            }
        })
    }
    //报销
    function CostAudit() {
        $http({
            url: '/gct-web/audit/pageRepayAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("CostAuditTable", r.data, costCol)
            }
        })
    }
    // 工单审核
    function WorkorderAudit() {
        $http({
            url: '/gct-web/audit/pageTaskAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("WorkorderAuditTable", r.data, WorkorderAuditcol, {
                    total: r.total,
                })
            }
        })
    }
    // 财务审核
    function FinanceAudit() {
        $http({
            url: '/gct-web/audit/pageFinanceAudit',
            data: {
                status: 1
            },
            success: function (r) {
                initTable("FinanceAuditTable", r.data, FinanceAuditAuditcol, {
                    total: r.total,
                })
            }
        })
    }
    // 市场审核
    $('body').on('click', '#MarketAuditTable tbody tr,.MarketAuditClick', function () {
        var obj = {
            '1001': "BiddingApplicationAudited",                     // '投标申请', 
            '1002': "BidApplicationAudited",                       // '标书购买申请', 
            '1003': "DepositApplicationAudited",                       // '保证金申请', 
            '1004': "BusinessApplicationAudited"               // '业务费用申请',
        }
        storage("MarketId", tab_rowData.formId, obj[tab_rowData.itemCode]) //投标id 投标审核详情
        storage('auditId', tab_rowData.id, obj[tab_rowData.itemCode])
        storage('bidId', tab_rowData.bidId, obj[tab_rowData.itemCode])
        goNewPage("./Auditedlist/MarketAudit/" + obj[tab_rowData.itemCode] + '.html')
    })
    //工单审核
    $('body').on('click', '#WorkorderAuditTable tbody tr,.taskAuditClick', function () {
        var obj = {
            '3001': "materialChangeAudited",                     // '工单物料变更申请', 
            '3002': "designChangeAudited",                       // '工单设计变更申请', 
            '3003': "taskCompleteAudited",                       // '工单完工申请', 
            '3004': "rectificationCompleteAudited"               // '工单整改完工申请',
        }
        storage("formId", tab_rowData.formId, obj[tab_rowData.itemCode])   //工单记录表单id  审核页面
        storage('taskId', tab_rowData.bidId, obj[tab_rowData.itemCode])
        storage('auditId', tab_rowData.id, obj[tab_rowData.itemCode])
        goNewPage("./Auditedlist/taskAudited/" + obj[tab_rowData.itemCode] + '.html')
    })
    //点击项目处
    $('body').on('click', '#ProjectAuditTable tbody tr,.projectAuditClick', function () {
        if (tab_rowData.itemCode == 2001) {
            storage('auditId', tab_rowData.id, 'noProject')
            storage('projectId', tab_rowData.formId, 'noProject')
            goNewPage("./Auditedlist/projectAudited/noProject.html")
        } else  if (tab_rowData.itemCode == 2002)  {
            storage('auditId', tab_rowData.id, 'doneProject')
            storage('projectId', tab_rowData.formId, 'doneProject')
            goNewPage("./Auditedlist/projectAudited/doneProject.html")
        } else  if (tab_rowData.itemCode == 2003)  {
            storage('auditId', tab_rowData.id, 'changeProject')
            storage('projectId', tab_rowData.formId, 'changeProject')
            storage('projectIcon', '0', 'changeProject')
            goNewPage("./Auditedlist/projectAudited/changeProject.html")
        }
    })
    //  成本的报销审核
    $('body').on('click', '#CostAuditTable tbody tr,.costAuditClick', function () {
        storage('auditId', tab_rowData.id, 'costAuditedDetails')
        storage('MoneyId', tab_rowData.formId, 'costAuditedDetails')
        goNewPage("./Auditedlist/costAudited/costAuditedDetails.html")
    })
    //  采购的报销审核
    $('body').on('click', '#PurchaseAuditTable tbody tr,.payAuditClick', function () {
        storage('auditId', tab_rowData.id, 'payAuditedDetails')
        storage('procursePlanId', tab_rowData.formId, 'payAuditedDetails')
        goNewPage("./Auditedlist/payAudited/payAuditedDetails.html")
    })
    //财务管理
    $('body').on('click', '#FinanceAuditTable tbody tr,.financialAuditClick', function () {
        var obj = {
            '6001': "financialDeatails",                     // '外管证', 
            '6002': "invoiceDetails",                       // '开票',
            '6003': 'AppropriationDetails',                  //工程款拨付
            '6004': 'contractRecordDetails'                                       //拨付记录
        }
        var obj1 = {
            '6001': 'ExternalPermitMsgId',
            '6002': 'InvoiceId',
            '6003': 'contractId',
            '6004': 'contractRecordId'
        }
        storage(obj1[tab_rowData.itemCode], tab_rowData.formId, obj[tab_rowData.itemCode])
        storage('auditId', tab_rowData.id, obj[tab_rowData.itemCode])
        goNewPage("./Auditedlist/financialAudited/" + obj[tab_rowData.itemCode] + ".html")
    })

    //  概预算项目审核
    $('body').on('click', '#budgetAuditTable tbody tr,.budgetAuditClick', function () {
        storage('auditId', tab_rowData.id, 'budgetAudited')
        storage('budgetId', tab_rowData.formId, 'budgetAudited')
        goNewPage("./Auditedlist/budgetA/budgetAudited.html")
    })
})
// 费用报销初始化列表
var costCol = [
    {
        field: 'no',
        title: '报销编号',
        width: '150'
    }, {
        field: 'typeName',
        title: '费用类型',
        width: '150'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '250'
    }, {
        field: 'amount',
        title: '总费用金额（元）',
        width: '100'
    }, {
        field: 'unit',
        title: '申请单位',
        width: '150'
    }, {
        field: 'applyName',
        title: '申请人',
        width: '150'
    }, {
        field: 'applyTime',
        title: '申请时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        title: '操作',
        width: '50',
        formatter: function (a, b) {
            return '<a class="costAuditClick" title= "">审核</a>'
        }
    }
]
var PurchaseAuditCol = [
    {
        field: 'no',
        title: '采购编号',
        width: '150'
    }, {
        field: 'name',
        title: '采购名称',
        width: '150'
    }, {
        field: 'typeName',
        title: '费用类型',
        width: '250'
    }, {
        field: 'planDays',
        title: '付款方式',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return a == 1 ? '电汇' : '现金'
        }
    }, {
        field: 'buyDate',
        title: '采购日期',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return initDate(a)
        }
    }, {
        field: 'amount',
        title: '采购金额(元)',
        width: '100'
    }, {
        field: 'unit',
        title: '供应商',
        width: '200'
    }, {
        field: 'applyTime',
        title: '申请时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        title: '操作',
        width: '50',
        formatter: function (a, b) {
            return '<a class="payAuditClick" title= "">审核</a>'
        }
    }
]

var budgetListCol = [
    {
        field: 'no',
        title: '项目编号',
        width: '150'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '150'
    }, {
        field: 'typeName',
        title: '项目类型',
        width: '150'
    }, {
        field: 'name',
        title: '单项工程名称',
        width: '150'
    }, {
        field: 'amount',
        title: '结算金额(元)',
        width: '150'
    }, {
        field: 'unit',
        title: '申请单位',
        width: '150'
    }, {
        field: 'applyName',
        title: '申请人',
        width: '150'
    }, {
        field: 'applyTime',
        title: '申请时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '操作',
        width: '150',
        formatter: function (a) {
            return '<a class="budgetAuditClick">审核</a>'
        }
    }
]


function budgetAudit() {
    // log(8520)
    $http({
        url: "/gct-web/audit/pageBudgetAudit",
        data: {
            flag: "1",
        },
        success: function (r) {
            if (r.dataOthers && !$("#budgetProjecttypeId").children().length) {
                getDownSelect('budgetProjecttypeId', '请选择', r.dataOthers, 'id', 'typeName')
            }
            initTable('budgetAuditTable', r.data, budgetListCol)
        }
    })


}