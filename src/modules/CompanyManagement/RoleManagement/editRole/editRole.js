var roleId = storage("roleId");
var appilObj = {};//提交数据
var applyFalg = true;

$(function () {

    initData();//初始化数据，用于获取权限数据
    //点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "确认提交当前操作吗?",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    customerAdd(appilObj)
                }
            }
        })
    })


//点击全部选中
    $("body").on("click", '.all_Select_Private', function () {
        $(this).parent().next().find(".checkClick").addClass("checkActive")
    })
    $("body").on("click", '.all_Cancel_Private', function () {
        $(this).parent().next().find(".checkClick").removeClass("checkActive")
    })

    $("body").on("click", '.viewCompany', function () {
        if ($(this).hasClass('checkActive')) {
            if (!$(".viewDep").hasClass('checkActive')) $(".viewDep").addClass('checkActive')
        }
    })
    $("body").on("click", '.viewDep', function () {
        if (!$(this).hasClass('checkActive')) {
            if ($(".viewCompany").hasClass('checkActive')) $(".viewDep").addClass('checkActive')
        }
    })

})

function initData() {
    if(!roleId) return;
    $http({
        url: '/gct-web/role/beforeUpdate',
        data: {
            roleId: roleId
        },
        success: function (r) {
            $(".pcTab").html("")
            $(".appTab").html("")
            if (!r.data.webMenuList || !r.data.appMenuList) return false;
            dataShow(r.data.webMenuList, 'pcTab');//权限回显
            dataShow(r.data.appMenuList, 'appTab')
            if (!r.data.role) return false;
            //角色信息回显
            $(".roleName").val(r.data.role.roleName);//名称
            $(".boderTextarea").val(r.data.role.roleDescr);//职责描述
            //数据权限处理=1的话，选中。2，不选中
            if (r.data.role.viewDown == 1) $(".viewDown").addClass("checkActive")
            if (r.data.role.viewDep == 1) $(".viewDep").addClass("checkActive")
            if (r.data.role.viewCompany == 1) $(".viewCompany").addClass("checkActive")
        }
    })


}

//校验
function applyVerify() {
    applyFalg = true;
    appilObj.id = roleId;
    appilObj.roleName = $(".roleName").val();//名称
    appilObj.roleDescr = $(".boderTextarea").val();//职责
    appilObj.viewDown = 2;
    appilObj.viewDep = 2;
    appilObj.viewCompany = 2;
    if ($(".viewDown").hasClass("checkActive")) appilObj.viewDown = 1
    if ($(".viewDep").hasClass("checkActive")) appilObj.viewDep = 1
    if ($(".viewCompany").hasClass("checkActive")) appilObj.viewCompany = 1
    if (!$.checkReg(appilObj.roleName, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写角色名称");
        return false
    }
    if (!$.checkReg(appilObj.roleDescr, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写角色职责");
        return false
    }

    var menuStrArr = []
    $(".unitInfo").find(".checkActive").each(function (i, item) {
        menuStrArr.push($(item).attr("index"))
    })
    if (menuStrArr.length == 0) {
        applyFalg = false
        $.popInfo('至少选择一个权限')

    }
    appilObj.menuIds = unique(menuStrArr).join(",")

}


//数据处理

//数据处理
function dataShow(data, el) {


    $(data).each(function (i, item) {
        var trStr = '<div class="privateTr clearfix">' +
            ' <div class="privateText checkAllBox ">' +
            '  <div class="checkBoxPr clearfix" title="' + item.functionalDescription + '"><span class="checkClick ' + activeFn(item.pitchOn) + '" index="' + item.id + '"></span><span class="checkBoxTex">' + item.menuName + '</span>' +
            ' </div></div><div class="privateTd clearfix" style="padding-left: 220px">'
        $(item.children).each(function (k, v) {
            trStr += '<div class="checkBoxPr clearfix" title="' + v.functionalDescription + '">' +
                '   <span class="checkClick ' + activeFn(v.pitchOn) + '" index="' + v.id + '"></span>' +
                '   <span class="checkBoxTex">' + v.menuName + '</span>' +
                ' </div>'
        })
        trStr += '</div></div>'

        $("." + el).append(trStr)

    })

}

//权限是否处于选中转改
function activeFn(data) {
    //1====未选中
    return data == -1 ? '' : 'checkActive'
}

//提交数据
function customerAdd(data) {
    $http({
        url: '/gct-web/role/doUpdate',
        data: data,
        success: function (r) {
            submitSuccess('',function () {
                goBack()
            })
        }
    })



}