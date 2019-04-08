// //待立项的下拉
var unproject = [
    { 'projectStatus': '请选择', 'id': '' },
    { 'projectStatus': '已保存', 'id': '1' },
    { 'projectStatus': '立项审核中', 'id': '2' },
    { 'projectStatus': '立项未过审', 'id': '3' }
]
// //施工中//我参与的
var workProject = [
    { 'projectStatus': '请选择', 'id': '' },
    { 'projectStatus': '施工中', 'id': '4' },
    { 'projectStatus': '完工审核中', 'id': '5' },
    { 'projectStatus': '变更审核中', 'id': '8' },
    { 'projectStatus': '完工未过审', 'id': '6' },
    { 'projectStatus': '已完工', 'id': '7' }
]
$(function () {
    // tab页面切换函数
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx) + 1
        if (nav_idx == 1) getDownSelect('projectStatus', '请选择', unproject, 'id', 'projectStatus')
        else getDownSelect('projectStatus', '请选择', workProject, 'id', 'projectStatus')
        initData()
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //简单搜索,高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        initData()
    })
    //    点击项目添加
    $("body").on("click", '.projectAdd', function () {
        goNewPage("./projectManagement/projectAdd.html")
    })

    //    点击整行，跳到项目详情页面
    $("body").on("click", 'tbody td', function () {
        if (!$(this).hasClass('operate')) {
            if (!tab_rowData.id) return false;
            storage("projectId", tab_rowData.id, 'projectDetails')
            goNewPage("./projectManagement/projectDetails.html")
        }
    })
    //点击编辑
    $("body").on("click", '.edit_project', function () {
        if (!tab_rowData.id) return false;
        storage("projectId", tab_rowData.id, 'projectUpdate')
        goNewPage("./projectManagement/projectUpdate.html")
    })
    //    点击完工
    $("body").on("click", '.complete_project', function () {
        if (!tab_rowData.id) return false;
        storage("projectId", tab_rowData.id, 'completeAppliy')
        goNewPage("./projectManagement/completeAppliy.html")
    })
    //    点击删除
    $("body").on("click", '.delete_project', function () {
        if (!tab_rowData.id) return false;
        $.popConfirm({
            'content': '确定要删除所选项目吗?',
            confirm: function () {
                deletePoject(tab_rowData.id)
            }
        })
    })

    //  点击项目变更
    $("body").on("click", '.change_project', function () {
        if (!tab_rowData.id) return false;
        storage("projectId", tab_rowData.id, 'projectChange')
        goNewPage("./projectManagement/projectChange.html")
    })
})
var tableName = ['daiLiXiangTable', 'shiGongTable', 'myProjectTable', 'projectListTable']
// //初始数据
function initData() {
    var appListData = {
        icon: nav_idx,
        projectName: '',     //项目名称
        createCompanyName: '',       //创建单位
        status: '',       //创建单位
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.projectName = $(".searchVal").val()
    } else if ($(".advancedBox").hasClass("active")) {
        appListData.projectName = $(".projectName").val();
        appListData.createCompanyName = $(".createCompanyName ").val();
        appListData.status = $(".projectStatus").attr("index");
    }
    $http({
        url: '/gct-web/project/listByPage',
        data: appListData,
        success: function (r) {
            // "dataOthers":0         //标识：0-展示创建单位一列，1-不展示建设单位一列
            initTable(tableName[nav_idx - 1], r.data, (nav_idx == 1 || nav_idx == 2) ? col : col2)
            if (r.dataOthers == 1 && (nav_idx == 1 || nav_idx == 2)) {
                $(".createCompanyName").parents(".querytr").hide()
                $(".createCompanyNameTr").hide()
            } else {
                $(".createCompanyName").parents(".querytr").show()
                $(".createCompanyNameTr").show()
            }
        }
    })
}

//项目列表数据的回显
var proJectStatusArr = ['已保存', '立项审核中', '立项未过审', '施工中', '完工审核中', '完工未过审', '已完工', '变更审核中']
var col = [
    {
        field: 'projectCode',
        title: '项目编号',
        width: '150'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'projectTypeInfo.typeName',
        title: '项目类型',
        width: '150'
    }, {
        field: 'constructType',
        title: '施工类型',
        width: '100',
        formatter: function (a) {
            if (a == 1) return '包工包料'
            else if (a == 2) return '包工不包料'
            else if (a == 3) return '清包工'
            else return ''
        }
    }, {
        field: 'createCompanyName',
        title: '创建单位',
        'class': 'createCompanyNameTr',
        width: '150'
    }, {
        field: 'createrInfo.trueName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTimeStamp',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'projectStatus',
        title: '项目状态',
        width: '120',
        formatter: function (a) {
            if (!a) return ''
            else return proJectStatusArr[a - 1]
        }
    },
    {
        title: '操作', "class": 'proListOper', width: "100",
        formatter: function (a, row) {
            var str = "";
            if (nav_idx == 1) {
                if (row.projectStatus != 2) {
                    str += '<span data_power="Edit-item-operation" class = "edit_project m_col" >编辑</span>'
                    str += '<span data_power="Delete-item-operation" class = "delete_project m_red"  >删除</span>'
                } else {
                    str += '<span data_power="Edit-item-operation" class = " m_grey"  >编辑</span>'
                    str += '<span data_power="Delete-item-operation" class = " m_grey"  >删除</span>'
                }
            } else if (nav_idx == 2) {
                //审核和已完工==置灰
                // 完工审核中，完工，变更审核
                if (row.projectStatus == 5 || row.projectStatus == 7 || row.projectStatus == 8) {
                    str += '<span data_power="Change-project-operations" class = "m_grey "  >变更</span> <span data_power="Completion-operation" class = "m_grey  "  >完工</span>'
                } else {
                    str += '<span data_power="Change-project-operations" class = "m_col change_project"  >变更</span> <span data_power="Completion-operation" class = "complete_project m_col "  >完工</span>'
                }

            }
            return str
        }
    }
]
var col2 = [
    {
        field: 'projectCode',
        title: '项目编号',
        width: '150'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'projectTypeInfo.typeName',
        title: '项目类型',
        width: '150'
    }, {
        field: 'constructType',
        title: '施工类型',
        width: '100',
        formatter: function (a) {
            if (a == 1) return '包工包料'
            else if (a == 2) return '包工不包料'
            else if (a == 3) return '清包工'
            else return ''
        }
    }, {
        field: 'createCompanyName',
        title: '创建单位',
        'class': 'createCompanyNameTr',
        width: '150'
    }, {
        field: 'createrInfo.trueName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTimeStamp',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'projectStatus',
        title: '项目状态',
        width: '120',
        formatter: function (a) {
            if (!a) return ''
            else return proJectStatusArr[a - 1]
        }
    }
]
//删除角色
function deletePoject(projectId) {
    $http('/gct-web/project/doDelete', {
        projectId: projectId
    }, function () {
        submitSuccess("操作成功", function () {
            initData()
        })
    })
}
