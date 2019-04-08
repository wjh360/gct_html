var appilObj = {};//提交数据
var applyFalg = true;
$(function () {
    initData()
    //点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "确定提交当前操作的内容吗?",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    customerAdd(appilObj)
                }
            }
        })
    })
})
//页面初始请求数据
function initData() {
    $http({
        url: '/gct-web/lowerCompany/beforeAdd',
        success: function (r) {
            if (!r.data.menuList) return false;
            dataShow(r.data.menuList)
        }
    })

}
//点击全部选中
$("body").on("click", '.all_Select_Private', function () {
    $(this).parent().next().find(".checkClick").addClass("checkActive")
})
$("body").on("click", '.all_Cancel_Private', function () {
    $(this).parent().next().find(".checkClick").removeClass("checkActive")
})
//数据处理
function dataShow(data) {
    $(".pcTab").html("")
    $(".appTab").html("")
    $(data).each(function (i, item) {
        var trStr = '<div class="privateTr clearfix">' +
            ' <div class="privateText checkAllBox ">' +
            '  <div class="checkBoxPr" title="' + item.functionalDescription + '"><span class="checkClick " index="' + item.id + '"></span><span class="checkBoxTex">' + item.menuName + '</span>' +
            ' </div></div><div class="privateTd clearfix" style="padding-left: 220px">'
        $(item.children).each(function (k, v) {
            trStr += '<div class="checkBoxPr" title="' + v.functionalDescription + '">' +
                '   <span class="checkClick " index="' + v.id + '"></span>' +
                '   <span class="checkBoxTex">' + v.menuName + '</span>' +
                ' </div>'
        })
        trStr += '</div></div>'
        if (item.menuTerminal == 2) $(".pcTab").append(trStr)
        else if (item.menuTerminal == 3) $(".appTab").append(trStr)
    })
}
//校验
function applyVerify() {
    appilObj = {}
    applyFalg = true;
    appilObj.companyName = $(".companyName").val();//名称
    appilObj.companyAbbreviation = $(".companyAbbreviation").val();//缩写
    appilObj.companyPerson = $(".companyPerson").val();//联系人
    appilObj.companyTel = $(".companyTel").val();//联系电话
    appilObj.companyEmail = $(".companyEmail").val();//企业邮箱
    var address = getCodeSub('unitAddress');//地址
    appilObj.province = address.province;//地址
    appilObj.city = address.city;//地址
    appilObj.county = address.county;//地址
    appilObj.companyAddress = $(".companyAddress").val();//详细地址
    appilObj.userName = $(".userName").val();//账号
    appilObj.trueName = $(".trueName").val();//用户名
    appilObj.password = $(".password").val();//密码
    appilObj.confirmPassword = $(".passwordConfirm").val();//密码
    if (!$.checkReg(appilObj.companyName, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写单位名称");
        return false
    }
    if (!$.checkReg(appilObj.companyAbbreviation, 'noSpeclice')) {
        applyFalg = false;
        $.popInfo(" 请填写单位缩写");
        return false
    }
    if ($.checkReg(appilObj.companyTel, 'noNull') && !$.checkReg(appilObj.companyTel, 'phone1')) {
        applyFalg = false;
        $.popInfo(" 联系电话格式错误，请重新填写");
        return false
    }
    if ($.checkReg(appilObj.companyEmail, 'noNull') && !$.checkReg(appilObj.companyEmail, 'email')) {
        applyFalg = false;
        $.popInfo(" 联系邮箱格式错误，请重新填写");
        return false
    }
    if (!$.checkReg(appilObj.province, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写单位地址");
        return false
    }
    if (!$.checkReg(appilObj.city, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写单位地址");
        return false
    }
    if (!$.checkReg(appilObj.county, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写单位地址");
        return false
    }
    if (!$.checkReg(appilObj.companyAddress, 'noNull')) {
        applyFalg = false;
        $.popInfo(" 请填写详情地址");
        return false
    }
    if (appilObj.userName != '' || appilObj.trueName != '' || appilObj.password != '' || appilObj.confirmPassword != '') {
        if (!$.checkReg(appilObj.userName, 'phone')) {
            applyFalg = false;
            $.popInfo("账号格式错误，请输入11位手机号");
            return false
        }
        if (!$.checkReg(appilObj.trueName, 'noNull')) {
            applyFalg = false;
            $.popInfo("用户名允许输入10字");
            return false
        }
        if (!$.checkReg(appilObj.password, 'pass')) {
            applyFalg = false;
            $.popInfo("密码不符合规则，请重新填写");
            return false
        }
        if (appilObj.password != appilObj.confirmPassword) {
            applyFalg = false;
            $.popInfo(" 两次密码不一致，请核对");
            return false
        }
    }
    var menuStrArr = [];//权限
    $(".checkActive").each(function (i, item) {
        menuStrArr.push($(item).attr("index"))
    })
    if (menuStrArr.length == 0) {
        applyFalg = false
        $.popInfo('至少选择一个权限')
        return false;
    }
    appilObj.menuStr = unique(menuStrArr).join(",")
}
//提交数据
function customerAdd(data) {
    $http({
        url: '/gct-web/lowerCompany/doAdd',
        data: data,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })

}