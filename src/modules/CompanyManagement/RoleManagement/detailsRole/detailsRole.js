var roleId = storage("roleId");
var appilObj = {};//提交数据
var applyFalg = true;

$(function () {
    initData();//初始化数据，用于获取权限数据
})

function initData() {
    if (!roleId) return;
    $http({
        url: '/gct-web/role/roleDetail',
        data: {
            roleId: roleId
        },
        success: function (r) {
            $(".pcTab").html("")
            $(".appTab").html("")
            if (!r.data.webMenuList || !r.data.appMenuList) return false;
            privateData(r.data.webMenuList, 'pcTab')
            privateData(r.data.appMenuList, 'appTab')
            if (!r.data.role) return false;
            $(".roleName").html(r.data.role.roleName);//名称
            $(".roleDescr").html(r.data.role.roleDescr);//职责
            var str = '';
            if (r.data.role.viewDep == 1) str += '可查看本部门及下级部门的数据,'
            if (r.data.role.viewCompany == 1) str += '可查看本公司数据,'
            if (r.data.role.viewDown == 1) str += '可查看所有下级部门数据,'
            $(".dataPrivate").html(str.slice(0, str.length - 1))
        }
    })


}


function privateData(data, el) {

    $(data).each(function (i, item) {
        var trStr = '<div class="privateTr clearfix" style="margin-bottom: 10px">' +
            ' <div class="privateText checkAllBox ">' +
            '  <div class="checkBoxPr clearfix" title="' + item.functionalDescription + '"><span class="checkBoxTex">' + item.menuName + '</span>' +
            ' </div></div><div class="privateTd clearfix" style="padding-left: 200px">'
        $(item.children).each(function (k, v) {
            trStr += '<div class="checkBoxPr clearfix" title="' + v.functionalDescription + '">' +
                '   <span class="checkBoxTex">' + v.menuName + '</span>' +
                ' </div>'
        })
        trStr += '</div></div>'

        $("." + el).append(trStr)

    })

}