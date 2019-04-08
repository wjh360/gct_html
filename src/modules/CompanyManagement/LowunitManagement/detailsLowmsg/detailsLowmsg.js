var companyId = storage("companyId");//下级单位Id
var appilObj={};//提交数据
var applyFalg = true;
$(function () {
    initData()
})
//页面初始请求数据
function initData() {
    $http({
        url: '/gct-web/lowerCompany/info',
        data:{companyId:companyId},
        success: function (r) {
            if(!r.data.menuList||!r.data.company)return false;
            privateData(r.data.menuList)
            baseInterDate(r.data.company)
        }
    })

}
function baseInterDate(data) {
    $(".nameCon").eq(0).html(data.companyName);//名称
    $(".nameCon").eq(1).html(data.companyAbbreviation);//简写
    if (data.companyPerson) $(".nameCon").eq(2).html(data.companyPerson);//联系人
    else $(".nameCon").eq(2).parent().hide()
    if (data.companyTel) $(".nameCon").eq(3).html(data.companyTel);//电话
    else $(".nameCon").eq(3).parent().hide()
    if (data.companyEmail) $(".nameCon").eq(4).html(data.companyEmail);//邮箱
    else $(".nameCon").eq(4).parent().hide()
    $(".nameCon").eq(5).html(getCodeTxt(data.province, data.city, data.county) + data.companyAddress);//邮箱
    if (data.superManager&&data.superManager.userName) {
        $(".nameCon").eq(6).html(data.superManager.userName);//账号
        $(".nameCon").eq(7).html(data.superManager.trueName);//账号
    }else{
        $(".commonCon").eq(1).hide()
    }
}
function privateData(data) {
    $(".pcTab").html("")
    $(".appTab").html("")
    $(data).each(function (i, item) {
        var trStr = '<div class="privateTr clearfix">' +
            ' <div class="privateText checkAllBox ">' +
            '  <div class="checkBoxPr clearfix" title="'+item.functionalDescription+'"><span class="checkBoxTex">' + item.menuName + '</span>' +
            ' </div></div><div class="privateTd clearfix"  style="padding-left: 200px">'
        $(item.children).each(function (k, v) {
            trStr += '<div class="checkBoxPr clearfix" title="'+v.functionalDescription+'">' +
                '   <span class="checkBoxTex">' + v.menuName + '</span>' +
                ' </div>'
        })
        trStr += '</div></div>'
        if (item.menuTerminal == 2) $(".pcTab").append(trStr)
        else if (item.menuTerminal == 3) $(".appTab").append(trStr)
    })
}
