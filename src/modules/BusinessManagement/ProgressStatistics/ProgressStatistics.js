
var ProjectgetData = {}
var ContractgetData = {}
$(function () {
    //  tab页面切换函数
    //搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        switchTab()
    })
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    switchTab()
    function switchTab() {
        var str = [
            '请输入合同名称',
            '请输入项目名称'
        ]
        $('.searchVal').attr("placeholder", str[nav_idx]).attr("maxLength", (50 * (Number(nav_idx) + 1)))
        if (nav_idx == 0) initgetContractPage() //合同进度
        if (nav_idx == 1) getProjectProgressPage() //项目进度
    }
    // 合同进度
    // name           //合同名称
    //  code           //合同编号
    //  companyName  //建设单位
    // initgetContractPage()
    // var ContractgetData = {
    //     name: $(".name").val(),
    //     code: $(".code").val(),
    //     ccompanyName: $(".companyName").val()
    // }
    function initgetContractPage() {
        // var ContractgetData = {}
        var t = $(".searchListContractProgress")
        ContractgetData.name = t.find('.name').val() ? t.find('.name').val() : $(".searchVal").val()
        ContractgetData.code = t.find('.code').val()
        ContractgetData.companyName = t.find('.companyName').val()
        ContractgetData.companyName = t.find('.companyName').val()//合同周期
        ContractgetData.companyName = t.find('.companyName').val()//合同周期
        $http({
            url: '/gct-web/statistics/getContractPage',
            data: ContractgetData,
            success: function (r) {
                initTable("ContractProgressTable", r.data, ContractProgressCol, {
                    total: r.data,
                })
                $("#ContractProgressTable").find("th").eq('4').attr("title", '已签订单金额/合同金额')
            }
        })
    }
    // 项目进度
    // projectName    //项目名称
    // projectCode    //项目编号
    // companyName    //建设单位
    // getProjectProgressPage()
    function getProjectProgressPage() {
        // var ProjectgetData={}
        var t = $(".searchListContractProject")
        ProjectgetData.projectName = t.find('.projectName').val() ? t.find('.projectName').val() : $(".searchVal").val()
        ProjectgetData.projectCode = t.find('.projectCode').val()
        ProjectgetData.companyName = t.find('.companyName').val()
        $http({
            url: '/gct-web/statistics/getProjectProgressPage',
            data: ProjectgetData,
            success: function (r) {
                initTable("ContractProjectTable", r.data, ContractProjectCol, {
                    total: r.data,
                })
                $("#ContractProjectTable").find("th").eq('2').attr("title", '项目所有订单的采购订单总金额之和')
                $("#ContractProjectTable").find("th").eq('3').attr("title", '完工工单施工估算造价之和')
                $("#ContractProjectTable").find("th").eq('4').attr("title", '施工额/项目订单金额')
                $("#ContractProjectTable").find("th").eq('7').attr("title", '回款总额/项目订单金额')
                $("#ContractProjectTable").find("th").eq('8').attr("title", '开票总额 - 回款总额')
            }
        })
    }
    // 订单详情  successmoney
    $("body").on("click", '#ContractProgressTable tbody tr .successmoney', function () {
        // log(tab_rowData)
        storage("frameContractId", tab_rowData.id, 'detailsProgressOrders') //框架合同id 订单明细详情
        goNewPage("././ProgressStatistics/detailsProgressOrders.html")
    })
    // 施工额  successmoney
    $("body").on("click", '#ContractProjectTable tbody tr .shi_gong', function () {
        // log(tab_rowData)
        if (tab_rowData.constructionAmount == 0) {
            return false
        } else {
            storage("projectId", tab_rowData.id, 'detailsAmount') //框架合同id 订单明细详情
            // storage("projectId", tab_rowData.id, 'detailsAmount') //框架合同id 订单明细详情
            goNewPage("././ProgressStatistics/detailsAmount.html")
        }
    })
    //开票明细 all_money
    $("body").on("click", '#ContractProjectTable tbody tr .all_money', function () {
        // log(tab_rowData)
        storage("projectId", tab_rowData.id, 'details_Invoice') //框架合同id 订单明细详情
        goNewPage("././ProgressStatistics/details_Invoice.html")
    })
    // 工程款支付  fun_money
    $("body").on("click", '#ContractProjectTable tbody tr .fun_money', function () {
        // log(tab_rowData)
        storage("projectId", tab_rowData.id, 'detailsProjectFunds') //框架合同id 订单明细详情
        goNewPage("././ProgressStatistics/detailsProjectFunds.html")
    })
    // name           //合同名称
    // code           //合同编号
    // companyName  //建设单位
    // 导出
    $("body").on("click", ".Progress_exportBtn", function () {
        exportTable('/gct-web/statistics/getContractExcel', ContractgetData, this)
    })
    // 导出
    $("body").on("click", ".Project_exportBtn", function () {
        exportTable('/gct-web/statistics/getProjectProgressExcel', ProjectgetData, this)
    })

    //    点击下载
    $("body").on("click",'.downLoadXml',function () {
        if(!tab_rowData.id) return
        exportTable('/gct-web/downloadWord/getDownloadWord', {id:tab_rowData.id}, this)
    })
    //   合同进度列表
    var ContractProgressCol = [{
        field: 'contractNo',
        title: '合同编号',
        width: '100'
    }, {
        field: 'contractName',
        title: '合同名称',
        width: '100'
    }, {
        field: 'contractAmount',
        title: '合同金额（元）',
        width: '100'
    }, {
        field: 'amountAlreadySigned',
        title: '已签订金额（元）',
        width: '100',
        'class': 'successmoney'
    }, {
        field: 'completionDegree',
        title: '完成度(%)',
        width: '100',
        'class': 'successmoney'
    }, {
        field: 'totalRefundYes',
        title: '回款金额(元)',
        width: '100'
    }, {
        field: 'totalRefundNo',
        title: '待回款金额(元)',
        width: '100',
    }, {
        field: 'onTheWay',
        title: '在途额（元）',
        width: '100'
    }, {
        field: 'bondAmount',
        title: '保证金（元）',
        width: '100'
    }, {
        field: 'operatorName',
        title: '建设单位',
        width: '100'
    }, {
        field: 'executiveBranch',
        title: '执行部门',
        width: '100'
    },{
        title: '操作',
        'class': '',
        width: '150',
        formatter: function (a) {
        return '<a class="downLoadXml" download="download" href="">下载业绩资料</a>'

        }
        }]
    // 项目进度
    var ContractProjectCol = [{
        field: 'projectCode',
        title: '项目编号',
        width: '250'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'projectOrderAmount',
        title: '项目订单金额（元）',
        width: '100'
    }, {
        field: 'constructionAmount',
        title: '施工额（元）',
        width: '100',
        'class': 'shi_gong'
    }, {
        field: 'completionDegree',
        title: '完工度(%)',
        width: '100',
    }, {
        field: 'totalInvoice',
        title: '开票总额(元)',
        width: '100',
        'class': 'all_money'
    }, {
        field: 'totalRefund',
        title: '回款总额(元)',
        width: '100',
    }, {
        field: 'projectCompletion',
        title: '项目完成度(%)',
        width: '100'
    }, {
        field: 'accountsReceivable',
        title: '应收账款（元）',
        width: '100'
    }, {
        field: 'totalAllocationOfProjectFunds',
        title: '工程款拨付总额（元）',
        width: '100',
        'class': 'fun_money'
    }, {
        field: 'statusName',
        title: '项目状态',
        width: '50'
    }, {
        field: 'planEndDate',
        title: '计划完工日期',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a)
        }
    }, {
        field: 'executiveBranch',
        title: '执行部门',
        width: '100'
    }, {
        field: 'operatorCompanyName',
        title: '建设单位',
        width: '100'
    }]
})