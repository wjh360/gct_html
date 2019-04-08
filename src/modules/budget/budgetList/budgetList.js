$(function () {
    //  tab页面切换函数
    nav_idx = storage("nav_idx") ? storage("nav_idx") : 0


    function switchTab() {
        postObjData = {
            name: "",     //项目名称
            single: "",      //单项工程名称
            no: "",          //项目编号
            projectTypeId: "",   //项目类型ID
            province: "",       //省ID
            city: "",         //市ID
            county: "",     //县ID
            status: ""      //状态   4:审核中  5:未过审   3:已完成

        }
        if ($(".searchBtn").hasClass("serActive")) {
            postObjData.name = $(".searchVal").val()
        } else if ($(".advancedBox").hasClass("active")) {
            postObjData.name = $(".searchList").find(".projectName").val()
            postObjData.single = $(".searchList").find(".singleProjectName").val()
            postObjData.no = $(".searchList").find(".noProjectCode").val()
            postObjData.projectTypeId = $(".projectStatus").attr("index")
            var address = getCodeSub('listProCtiyCounty');//地址
            postObjData.province = address.province;//地址
            postObjData.city = address.city;//地址
            postObjData.county = address.county;//地址
        }
        var n = parseFloat(nav_idx)
        if (n == 0) waitAuditPage()   //项目详情
        else if (n == 3 || n == 4 || n == 5) auditListPage()   //项目详情
        else if (n == 2) myProjectPage()

    }

    // tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx)
        if (switchTab) switchTab()
    })
    //简单搜索,高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        switchTab()
    })

    //    获取项目类型
    projectTypeFn()

    function projectTypeFn() {
        $http({
            url: '/gct-web/budgetProject/getProjectTypeEcho',
            success: function (r) {
                getDownSelect('projectStatus', '请选择', r.data ? r.data : [], 'id', 'typeName')
                switchTab()
            }
        })
    }

    //  点击编辑项目
    $("body").on("click", '.edit_project', function () {
        if (!tab_rowData.id) return false;
        storage("budgetId", tab_rowData.id, 'editBudget')
        goNewPage("./budgetList/editBudget.html")
    })
    $("body").on("click", '.edit_budget', function () {
        if (!tab_rowData.id) return false;
        storage("budgetId", tab_rowData.id, 'editQuota')
        goNewPage("./budgetList/editQuota.html")
    })

    //  点击详情
    $("body").on("click", '.clickTr', function () {
        if (!tab_rowData.id) return false;
        storage("budgetId", tab_rowData.id, 'quotaDetails');
        goNewPage("./budgetList/quotaDetails.html")
        // storage("budgetId", tab_rowData.id, 'budgetAudited');
        // goNewPage('/modules/Auditlist/Auditedlist/budgetA/budgetAudited.html')
    })

    //    点击删除
    $("body").on('click', '.delete_project', function () {
        if (!tab_rowData.id) return false;
        $.popConfirm({
            'content': '确定要删除所选项目吗?',
            confirm: function () {
                submitSuccess('', function () {
                    deletePoject(tab_rowData.id)
                })
            }
        })
    })

    function deletePoject(id) {
        $http({
            url: '/gct-web/budgetProject/getBudGetProjectDel',
            data: { id: id },
            success: function (r) {
                switchTab()
            }
        })
    }


    //    点击下载
    $("body").on("click", '.downLoadXml', function () {
        if (!tab_rowData.id) return
        exportTable('/gct-web/downloadExcel/getDownloadBudgetProject', { budgetProjectId: tab_rowData.id }, this)
    })

})

var postObjData = {
    name: "",     //项目名称
    single: "",      //单项工程名称
    no: "",          //项目编号
    projectTypeId: "",   //项目类型ID
    province: "",       //省ID
    city: "",         //市ID
    county: "",     //县ID
    status: ""      //状态   4:审核中  5:未过审   3:已完成

}

//待提交
function waitAuditPage() {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectSavePage',
        data: postObjData,
        success: function (r) {
            initTable("waitAuditTable", r.data, waitAuditCol)
        }
    })
}

function auditListPage() {
    postObjData.status = nav_idx
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectAuditInPage',
        data: postObjData,
        success: function (r) {
            if (nav_idx == 4) {
                initTable("auditListTable", r.data, AuditProCol)
                //如果为true 则显示单位列  如果为false 则不显示单位列
                if (r.dataOthers) $("#auditListTable").find(".createUnitName").show()
            } else if (nav_idx == 5) initTable("untriedTable", r.data, waitAuditCol)
            else if (nav_idx == 3) {
                initTable("completedTable", r.data, waitAuditCol)
                if (r.dataOthers) $("#completedTable").find(".createUnitName").show()
            }

        }
    })
}

// 我参与的
function myProjectPage() {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectMyInPage',
        data: postObjData,
        success: function (r) {
            initTable("myProjectTable", r.data, waitAuditCol)
            if (r.dataOthers) $("#myProjectTable").find(".createUnitName").show()
        }
    })
}


var AuditProCol = [
    {
        field: 'no',
        title: '项目编号',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'name',
        title: '项目名称',
        width: '150',
        'class': "clickTr"
    }, {
        field: 'projectTypeName',
        title: '项目类型',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'single',
        title: '单项工程名称',
        width: '100',
        'class': "clickTr"

    }, {
        field: 'amount',
        title: '结算金额(元)',
        width: '200',
        'class': "clickTr",
        formatter: function (a) {
            if (!a) return 0
            else return '<span title="' + a + '">' + initText(a, 20) + '</span>'
        }
    }, {
        field: 'createUnitName',
        title: '创建单位',
        width: '100',
        'class': "clickTr createUnitName"
    }, {
        field: 'createName',
        title: '创建人',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        'class': "clickTr",
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
var waitAuditCol = [
    {
        field: 'no',
        title: '项目编号',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'name',
        title: '项目名称',
        width: '150',
        'class': "clickTr"
    }, {
        field: 'projectTypeName',
        title: '项目类型',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'single',
        title: '单项工程名称',
        width: '100',
        'class': "clickTr"

    }, {
        field: 'amount',
        title: '结算金额(元)',
        width: '150',
        'class': "clickTr",
        formatter: function (a) {
            if (!a) return 0
            else return '<span title="' + a + '">' + initText(a, 15) + '</span>'
        }
    }, {
        field: 'createUnitName',
        title: '创建单位',
        width: '100',
        'class': "clickTr createUnitName"
    }, {
        field: 'createName',
        title: '创建人',
        width: '100',
        'class': "clickTr"
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        'class': "clickTr",

        formatter: function (a) {
            return initDate(a, 's')
        }
    },
    {
        title: '操作', width: "100", "class": 'proListOper',
        formatter: function (a, row) {
            var str = "";
            if (nav_idx == '0' || nav_idx == '5') {
                // 未提交列表，1=保存，编辑项目，2提交编辑定额5（未过审）编辑项目
                if (row.status == 1) str += '<span class = "edit_project m_col" data_power="Editorial-Budget-Estimate-Item-Operation">编辑项目</span>'
                else str += '<span class = " m_col edit_budget" data_power="Edit-Quota-Operation">编辑定额</span>'
                str += '<span  class = "delete_project m_red"  data_power="Delete-budget-estimates">删除</span>'
            } else {
                str += '<a class="downLoadXml" download="download" href="">下载</a>'

            }
            return str
        }
    }
]
