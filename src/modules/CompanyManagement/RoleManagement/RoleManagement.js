
$(function () {
    initData()
    //点击编辑进入编辑页面
    $("body").on("click",'.editDateBtn',function () {
        if(!tab_rowData.id) return false;
        $.popConfirm({
            content:'确认编辑该角色吗？',
            confirm:function () {
                storage("roleId",tab_rowData.id,"editRole");
                goNewPage("./RoleManagement/editRole.html")
            }
        })
    })

    //点击删除进入弹框提示
    $("body").on("click",'.deleteDateBtn',function () {
        if(!tab_rowData.id) return false;
        $.popConfirm({
            content:'确认删除该角色吗？',
            confirm:function () {
                deleteRole(tab_rowData.id)
            }
        })
    })

//    进入详情
    $("body").on("click",'.roleTr',function () {
        if(!tab_rowData.id) return false;
        storage("roleId",tab_rowData.id,"detailsRole");
        goNewPage("./RoleManagement/detailsRole.html")
    })

})

//页面初始化
function initData() {
    $http({
        url: '/gct-web/role/roleListPage',
        success: function (r) {
            initTable('roleListTable', r.data,col)
        }
    })

}

var col = [
    {
        field: 'roleName', title: '角色名称',"class":"roleTr",width:'200'
    },
    {
        field: 'roleDescr', title: '角色职责',width:'200',"class":"roleTr"

    },

    {
        field: 'creator.trueName', title: '创建人',width:'200',"class":"roleTr"

    },
    {
        field: 'createTime', title: '创建时间',width:'200',"class":"roleTr",
        formatter: function (a) {
            return initDate(a, 's')
        }
    },
    {
        title: '操作', 'width': '100', "class": 'proListOper',
        formatter: function (a, row) {
            var str = "";
            str += '<span class = "editDateBtn m_col" data_power="Edit-role-operation">编辑</span>'
            str += '<span class = "deleteDateBtn m_red" data_power="Delete-role-operation">删除</span>'
            return str
        }
    }
]

//删除角色
function deleteRole(roleId){
    $http({
        url: '/gct-web/role/deleteRole',
        data:{
            roleId:roleId
        },
        success: function (r) {
            submitSuccess("",function () {
                initData()
            })
        }

    })

}


