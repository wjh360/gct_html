// //未入库计划
var unPlan = [
    { 'projectStatus': '请选择', 'id': '' },
    { 'projectStatus': '审核中', 'id': '3' },
    { 'projectStatus': '未过审', 'id': '4' }
]
// //施工中//我参与的
var donePlan = [
    { 'projectStatus': '请选择', 'id': '' },
    { 'projectStatus': '已入库', 'id': '3' },
    { 'projectStatus': '待入库', 'id': '2' }
]
$(function () {
    // tab页面切换函数
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        if (nav_idx == 0) getDownSelect('plan_status', '请选择', unPlan, 'id', 'projectStatus')
        else if (nav_idx == 1) getDownSelect('plan_status', '请选择', donePlan, 'id', 'projectStatus')
        initData()
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //简单搜索高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        initData()
    })
    //    点击添加c采购计划
    $("body").on("click", '.plan_Add', function () {
        goNewPage("./procurementPlan/procurementAdd.html")
    })
    //点击编辑
    $("body").on("click", '.edit_project', function () {
        if (!tab_rowData.id) return false;
        storage('procursePlanId', tab_rowData.id, 'procurementUpdate')
        goNewPage("./procurementPlan/procurementUpdate.html")
    })
    //   点击表格，进入详情
    $("body").on("click", '.purseClickTr', function () {
        if (!tab_rowData.id) return false;
        storage('procursePlanId', tab_rowData.id, 'procurementDetails')
        goNewPage("./procurementPlan/procurementDetails.html")
    })
    //  点击入库
    $("body").on("click", '.put_project', function () {
        if (!tab_rowData.id) return false;
        storage('procursePlanId', tab_rowData.id, 'purchasePut')
        goNewPage("./procurementPlan/purchasePut.html")
    })
})
// //初始数据
function initData() {
    var appListData = {
        name: '',     //项目名称
        status: '',       //创建单位
        mode: '',       //创建单位
        supplierName: '',       //创建单位
        isStorage: '',       //创建单位
    }
    if (nav_idx == 0) {
        appListData.isStorage = 1;//1未入库列表 可入库计划列表不传值
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.name = $(".searchVal").val()
    } else if ($(".advancedBox").hasClass("active")) {
        appListData.name = $(".purseName").val();
        appListData.supplierName = $(".supplierName").val();
        appListData.status = $(".plan_status").attr("index");
        appListData.mode = $(".payList").attr("index");
        if (nav_idx == 1) {
            appListData.status=''
            appListData.isStorage = $(".plan_status").attr("index");// 2待入库  3已入库
        }
    }
    $http({
        url: '/gct-web/purchasePlan/purchasePage',
        data: appListData,
        success: function (r) {
            if (nav_idx == 0) {
                initTable('unPlanTable', r.data, col)
            }
            else {
                initTable('donePlanTable', r.data, col)
            }
        }
    })
}
var col = [
    {
        field: 'no',
        title: '采购编号',
        width: '150',
        "class": 'purseClickTr'
    }, {
        field: 'name',
        title: '采购名称',
        width: '200',
        "class": 'purseClickTr'
    }, {
        field: 'costName',
        title: '费用类型',
        width: '100',
        "class": 'purseClickTr'
    }, {
        field: 'mode',
        title: '付款方式',
        width: '100',
        "class": 'purseClickTr',
        formatter: function (a) {
            if (a == 1) return '电汇'
            else if (a == 2) return '现金'
            else return ''
        }
    }, {
        field: 'buyDate',
        title: '采购日期',
        width: '150',
        "class": 'purseClickTr',
        formatter: function (a) {
            if (!a) return ''
            return initDate(a)
        }
    }, {
        field: 'amount',
        title: '采购金额（元）',
        width: '100',
        "class": 'purseClickTr',
        formatter: function (a) {
            if (!a) return '0'
            return a
        }
    }, {
        field: 'status',
        title: '状态',
        width: '100',
        "class": 'purseClickTr',
        formatter: function (a, rows) {
            //  2完成 3审核中 4未通过  5审核通过
            // 2待入库  3已入库
            if (!a) return ''
            if (nav_idx == 0) {
                if (a == 2) return '完成'
                else if (a == 3) return '审核中'
                else if (a == 4) return '未过审'
                else if (a == 5) return '审核通过'
            }
            else if (nav_idx == 1) return rows.isStorage == 2 ? '待入库' : '已入库'
        }
    }, {
        field: 'supplierName',
        title: '供应商',
        width: '150',
        "class": 'purseClickTr'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        "class": 'purseClickTr',
        formatter: function (a) {
            return initDate(a, 's')
        }
    },
    {
        title: '操作', "class": 'proListOper', width: "50",
        formatter: function (a, row) {
            var str = "";
            if (nav_idx == 0) {
                if (row.status == 4) {
                    str += '<span data_power="Edit-purchase-plan-operation" class = "edit_project m_col" >编辑</span>'
                } else {
                    str += '<span data_power="Edit-purchase-plan-operation" class = " m_grey" >编辑</span>'
                }
            } else if (nav_idx == 1) {
                if (row.isStorage != 2) {
                    str += '<span data_power="Warehousing-operation" class = "m_grey  "  >入库</span>'
                } else {
                    str += '<span data_power="Warehousing-operation" class = "put_project m_col "  >入库</span>'
                }
            }
            return str
        }
    }
]
