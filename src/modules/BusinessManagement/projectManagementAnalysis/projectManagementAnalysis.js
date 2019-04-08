$(function () {
    //简单高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { initData() })
    var appListData = {
        projectName: '',
        depName: '',
        frameConstructName: ''
    }
    initData()
    function initData() {
        appListData = {
            projectName: '',
            depName: '',
            frameConstructName: ''
        }
        if ($(".searchBtn").hasClass("serActive")) {
            appListData.projectName = $(".searchVal").val()
        } else if ($(".advancedBox").hasClass("active")) {
            appListData.projectName = $(".projectName").val();
            appListData.depName = $(".costDepName").val();
            appListData.frameConstructName = $(".frameConstructName").val();
        }
        $http({
            url: '/gct-web/pma/pmaListByPage',
            data: appListData,
            success: function (r) {
                initTable("projectCostTable", r.data, projectCostCol)
                $("#projectCostTable").find("th").eq('3').attr("title", '项目所有订单的采购订单总金额之和')
                $("#projectCostTable").find("th").eq('4').attr("title", ' 项目所有订单的已收款付款申请金额之和')
                $("#projectCostTable").find("th").eq('5').attr("title", '项目所有订单总金额之和 - 已收款付款申请金额之和')
                $("#projectCostTable").find("th").eq('6').attr("title", ' 项目相关的直接费用的费用报销及工程款支付金额之和')
                $("#projectCostTable").find("th").eq('7').attr("title", '项目成本/项目收入')
            }
        })
    }
    $('body').on('click', '.export_project', function () {
        exportTable('/gct-web/pma/exportpmaList', appListData, this)
    })
})
//表格
var projectCostCol = [
    {
        field: 'projectCode',
        title: '项目编号',
        width: '100'
    },
    {
        field: 'projectName',
        title: '项目名称',
        width: '150'
    },
    {
        field: 'frameContract.contractName',
        title: '框架合同',
        width: '100'
    },
    {
        field: 'projectOrderAmount',
        title: '项目订单金额(元)',
        width: '170',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'projectIncomeAmount',
        title: '项目收入(元)',
        width: '120',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'unfinishedAmount',
        title: '未完成额(元)',
        width: '120',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'projectCost',
        title: '项目成本(元)',
        width: '120',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'estimatedCostRatio',
        title: '成本比例(%)',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'actulCycle',
        title: '周期(天)',
        width: '80',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    },
    {
        field: 'depName',
        title: '执行部门',
        width: '100'
    },
    {
        field: 'createrInfo.trueName',
        title: '创建人',
        width: '100'
    }
]
