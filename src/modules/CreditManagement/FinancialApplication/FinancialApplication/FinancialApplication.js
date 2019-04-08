$(function () {
    // 初始化融资申请列表  FinancingTable
    var col = [{
            field: 'type',
            title: '融资类型',
            width: '200',
            formatter: function (a) {
                // log(a)
                if (a == 1) return "补充流动资金"
                else return "项目贷款"
            }
        }, {
            field: 'applyAmount',
            title: '融资金额（元）',
            width: '200'
        }, {
            field: 'user',
            title: '申请人',
            width: '200'
        }, {
            field: 'tel',
            title: '联系电话',
            width: '200',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:200px;">' + a + '</span>'
            }

        }, {
            field: 'trueName',
            title: '创建人',
            width: '200'
        }, {
            field: 'createTimeStamp',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }

    ]
    //初始化 投标申请列表
    // initFinanceApplyPage()

    function initFinanceApplyPage() {
        $http({
            url: '/gct-web/finance/financeApplyPage',
            success: function (r) {

                initTable("FinancingTable", r.data, col, {
                    total: r.data,
                })
            },
        })
    }


    // 初始化理财申请列表 TransactionsTable
    var col_1 = [{
            field: 'user',
            title: '申请人',
            width: '200'
        }, {
            field: 'tel',
            title: '联系电话',
            width: '200',

            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:200px;">' + a + '</span>'
            
            }

        }, {
            field: 'manageAmount',
            title: '理财金额（元）',
            width: '200',

        }, {
            field: 'interestRate',
            title: '期望利率（%）',
            width: '200',

        }, {
            field: 'trueName',
            title: '创建人',
            width: '200'
        }, {
            field: 'createTimeStamp',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }

    ]

    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    switchTab()

    function switchTab() {
        if (nav_idx == 0) initFinanceApplyPage() //融资申请
        if (nav_idx == 1) initmanageMoneyPage() //理财申请
        if (nav_idx == 2) initapplyMoneyPage() //提款申请
    }

    //初始化理财申请列表
    // initmanageMoneyPage()

    function initmanageMoneyPage() {
        $http({
            url: '/gct-web/finance/manageMoneyPage',
            success: function (r) {
                initTable("TransactionsTable", r.data, col_1, {
                    total: r.data,
                })
            },
        })
    }



    // 初始化提款申请列表  DrawingTable

    var col_2 = [{
            field: 'financeCompanyName',
            title: '金融机构',
            width: '200'
        }, {
            field: 'companyName',
            title: '工程公司',
            width: '200',
        },
        {
            field: 'applyAmount',
            title: '申请金额（元）',
            width: '100',
        },
        {
            field: 'user',
            title: '申请人',
            width: '150',
        },
        {
            field: 'tel',
            title: '联系电话',
            width: '150',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
            
            }
        }, {
            field: 'trueName',
            title: '创建人',
            width: '150'
        }, {
            field: 'createTimeStamp',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        },
        {
            field: 'status',
            title: '申请状态',
            width: '80',
            formatter: function (a) {
                // log(a)
                if (a == 1) return "待处理"
                else return "同意"
            }
        }
    ]
    // initapplyMoneyPage()
    function initapplyMoneyPage() {
        $http({
            url: '/gct-web/finance/applyMoneyPage',
            success: function (r) {

                initTable("DrawingTable", r.data, col_2, {
                    total: r.data,
                })
            }
        })
    }


    // 融资申请
    // 点击添加
    $("body").on("click", '.addFinancing', function () {

        goNewPage("./FinancialApplication/Financing/addFinancing.html")
    })
    // 点击详情
    $("body").on("click", '#FinancingTable tbody tr', function () {

        storage("FinancingID", tab_rowData.id, 'detailsFinancing') //ID   融资申请详情页面
        goNewPage("./FinancialApplication/Financing/detailsFinancing.html")
    })
    // 理财申请
    // 点击添加
    $("body").on("click", '.addTransactions', function () {

        goNewPage("./FinancialApplication/Transactions/addTransactions.html")
    })

    // 点击详情
    $("body").on("click", '#TransactionsTable tbody tr', function () {
        storage("TransactionsID", tab_rowData.id, 'detailsTransactions') //ID   理财申请详情页面
        goNewPage("./FinancialApplication/Transactions/detailsTransactions.html")
    })


    // 提款申请
    // 点击添加
    $("body").on("click", '.addDrawing', function () {

        goNewPage("./FinancialApplication/Drawing/addDrawing.html")
    })

    // 点击详情
    $("body").on("click", '#DrawingTable tbody tr', function () {
        if (tab_rowData.status == 1) {

            storage("DrawingID", tab_rowData.id, 'detailsDrawing') //ID   提款申请详情页面
            goNewPage("./FinancialApplication/Drawing/detailsDrawing.html")
        } else {
            storage("DrawingID", tab_rowData.id, 'details_Drawing') //ID   提款申请详情页面
            goNewPage("./FinancialApplication/Drawing/details_Drawing.html")
        }
    })
})