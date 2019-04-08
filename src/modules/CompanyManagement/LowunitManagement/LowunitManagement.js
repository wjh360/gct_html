$(function () {
    initData();//初始化数据，用于表格的回显
    //重置密码
    $("body").on("click", '.reset_Password', function () {
        if(!tab_rowData.id)return false;
        $.popConfirm({
            content: '新密码将以短信形式发送至注册的手机号，确定重置密码吗？',
            confirm: function () {
                resetPassword(tab_rowData.id)
            }
        })
    })
    //启用
    $("body").on("click", '.enable_Unit', function () {
        if(!tab_rowData.id)return false;
        $.popConfirm({
            content: '确定重新启用当前账号吗？',
            confirm: function () {
                updateCompanyStatus(tab_rowData.id)
            }
        })
    })
    //停用
    $("body").on("click", '.disable_Unit', function () {
        if(!tab_rowData.id)return false;
        $.popConfirm({
            content: '停用后该账号将无法登录，确定停用吗？',
            confirm: function () {
                updateCompanyStatus(tab_rowData.id)
            }
        })
    })
    //简单高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        initData()
    })
    //   编辑
    $("body").on("click", '.edit_Unit', function () {
        if(!tab_rowData.id)return false;
        storage("companyId", tab_rowData.id, 'editLowmsg');
        goNewPage('./LowunitManagement/editLowmsg.html')
    })
    // 跳详情
    $("body").on("click", '.companyNameTr', function () {
        if(!tab_rowData.id)return false;
        storage("companyId", tab_rowData.id, 'detailsLowmsg');
        goNewPage('./LowunitManagement/detailsLowmsg.html')
    })
    //    点击导出
    $("body").on("click", '.export_Btn', function () {
        exportTable('/gct-web/lowerCompany/exportList', appListData, this)
    })
})
var appListData;

function initData() {
    appListData = {
        companyName: '',     //单位名称
        userName: '',       //账号
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.companyName = $(".searchVal").val()
    } else if ($(".advancedBox").hasClass("active")) {
        appListData.companyName = $(".companyName").val()
        appListData.userName = $(".userName").val()
    }
    $http({
        url: '/gct-web/lowerCompany/listByPage',
        data: appListData,
        success: function (r) {
            initTable('LowListTable', r.data, col)
        }
    })
}

var col = [
    {
        field: 'companyName', title: '单位名称', "class": "companyNameTr", width: '200'
    }, {
        field: 'companyAddress', title: '单位地址', width: '200', "class": "companyNameTr",
        formatter: function (a, row) {
            var address=getCodeTxt(row.province,row.city,row.county)+a;
           return address
        }
    }, {
        field: 'superManager.userName', title: '账号', "class": "companyNameTr", width: '150'
    }, {
        field: 'createrInfo.trueName', title: '创建人', "class": "companyNameTr", width: '150'
    }, {
        field: 'createTimeStamp', title: '创建时间', "class": "companyNameTr", width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'companyStatus', title: '账号状态', "class": "companyNameTr", width: '50',
        formatter: function (a, row) {
            if (a == 1) return '正常'
            else if (a == 2) return '停用'
        }
    }, {
        title: '操作', "class": 'proListOper', width: '150',
        formatter: function (a, row) {
            var str = "";
            str += '<span data_power="Edit-subordinate-unit-operation" class = "edit_Unit m_col" >编辑</span>'
            if (row.companyStatus == 2) str += '<span data_power="Enable-operation" class = "enable_Unit m_green"  >启用</span>'
            else if (row.companyStatus == 1) str += '<span data_power="Deactivated-operation" class = "disable_Unit m_red"  >停用</span>'
            str += '<span data_power="Reset-password-operation" class = "reset_Password m_col "  >重置密码</span>'
            return str
        }
    }
];

//重置密码
function resetPassword(data) {
    $http({
        url: '/gct-web/lowerCompany/resetPassword',
        data: {companyId: data},
        success: function (r) {
            submitSuccess('', function () {
                initData()
            })
        }
    })

}

//停用启用
function updateCompanyStatus(data) {
    $http({
        url: '/gct-web/lowerCompany/updateCompanyStatus',
        data: {companyId: data},
        success: function (r) {
            submitSuccess('', function () {
                initData()
            })
        }
    })

}
