$(function () {
    var appListData = {}
    //  tab页面切换函数
    var yearList = []
    var curYear = new Date().getFullYear();
    for (var i = 0; i < curYear; i++) {
        if (curYear - i >= 2018) {
            yearList.push({
                year: curYear - i
            })
        }
    }
    appListData.year = curYear;
    getDownSelect("depmentYear", curYear, yearList, 'year', 'year')
    $(".depmentYear").attr("index", curYear)
    switchTab()
    function switchTab() {
        if (nav_idx == 0) {
            $(".searchVal").attr("maxLength", '100').attr("placeholder", '请输入项目名称')
            projectCostListByPage()   // 项目成本
        }
        if (nav_idx == 1) {
            $(".searchVal").attr("maxLength", '20').attr("placeholder", '请输入单位名称')
            depCostListByPage()    //部门成本
        }
    }
    // //   tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //项目成本
    function projectCostListByPage() {
        appListData = {
            headerStr: '',
            projectName: '',
            depName: '',
            status: ''
        }
        if ($(".searchBtn").hasClass("serActive")) {
            appListData.projectName = $(".searchVal").val()
        } else if ($(".advancedBox").hasClass("active")) {
            appListData.projectName = $(".projectName").val();
            appListData.depName = $(".costDepName").val();
            appListData.status = $(".projectStatus").attr("index");
        }
        $http({
            url: '/gct-web/costStatistics/projectCostListByPage',
            data: appListData,
            success: function (r) {
                initTable("projectCostTable", r.data, projectCostCol)
                $("#projectCostTable").find("th").eq('2').attr("title", '项目所有订单的采购订单总金额之和')
                $("#projectCostTable").find("th").eq('3').attr("title", '项目相关的直接费用的费用报销及工程款支付金额之和')
                $("#projectCostTable").find("th").eq('4').attr("title", '项目成本/项目订单金额')
            }
        })
    }
    // 部门
    function depCostListByPage() {
        appListData = {
            companyName: '',
            depName: '',
            year: ''
        }
        appListData.year = $(".depmentYear").attr("index");
        if ($(".searchBtn").hasClass("serActive")) {
            appListData.companyName = $(".searchVal").val()
        } else if ($(".advancedBox").hasClass("active")) {
            appListData.companyName = $(".companyName").val();
            appListData.depName = $(".depNameDep").val();
        }
        $http({
            url: '/gct-web/costStatistics/depCostListByPage',
            data: appListData,
            success: function (r) {
                initTable("depmentCostTable", r.data, depmentCostCol)
            }
        })
    }
    $("#depmentYear").on("click", 'li', function () {
        setTimeout(function () {
            depCostListByPage()
        })
    })
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { switchTab() })
    //项目成本
    $('body').on('click', '.projectCostClick', function () {
        if (!tab_rowData.id || !tab_rowData.projectCost) return
        storage('projectId', tab_rowData.id, 'projectCost')
        goNewPage('./costStatistics/projectCost.html')
    })
    $('body').on('click', '.depmentClick', function () {
        if (!tab_rowData.id || !tab_rowData.depCost||!Number(tab_rowData.depCost)) return
        storage('departmentId', tab_rowData.id, 'depmentCost')
        storage('year', $(".depmentYear").attr("index"), 'depmentCost')
        goNewPage('./costStatistics/depmentCost.html')
    })
    //导出
    $('body').on('click', '.export_project', function () {
        exportTable('/gct-web/costStatistics/exportProjectCostList', appListData, this)
    })
    $('body').on('click', '.export_depment', function () {
        if (!appListData.year) appListData.year = curYear;
        exportTable('/gct-web/costStatistics/exportDepCostList', appListData, this)
    })

})
//项目成本
var projectCostCol = [
    {
        field: 'projectCode',
        title: '项目编号',
        width: '100'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '100'
    }, {
        field: 'projectOrderAmount',
        title: '项目订单金额(元)',
        width: '200'
    }, {
        field: 'projectCost',
        title: '项目成本(元)',
        width: '200',
        'class': 'm_col projectCostClick'
    }, {
        field: 'estimatedCostRatio',
        title: '预估成本比例(%)',
        width: '200',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" overf_Ec " title="' + (a + '%') + '" style="display:inline-block; max-width:190px;">' + a + '%</span>'
        }
    }, {
        field: 'projectStatus',
        title: '项目状态',
        width: '100',
        formatter: function (a) {
            if (a == 4) return '施工中'
            else if (a == 5) return '完工审核中'
            else if (a == 6) return '完工未过审'
            else return ''
        }
    }, {
        field: 'depName',
        title: '执行部门',
        width: '100'
    }, {
        field: 'constructCompanyName',
        title: '施工单位',
        width: '100'
    }, {
        field: 'planEndDate',
        title: '计划完工日期',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a)
        }
    }
]
//部门成本
var depmentCostCol = [
    {
        field: 'depName',
        title: '部门名称',
        width: '150'
    }, {
        field: 'companyName',
        title: '单位名称',
        width: '150'
    }, {
        field: 'depLeaderName',
        title: '部门负责人',
        width: '100'
    }, {
        field: 'userNum',
        title: '人员数量',
        width: '100'
    }, {
        field: 'depCost',
        title: '部门成本(元)',
        'class': 'm_col depmentClick',
        width: '200'
    }, {
        field: 'perCapitaCost',
        title: '人均成本(元)',
        width: '200'
    }
]
