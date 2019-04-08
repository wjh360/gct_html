
//编辑
var invoicePoolId = storage("invoicePoolId")//发票池I
$(function () {
    //   页面数据返显
    initData()
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/beforeUpdate',
        data: {
            id: invoicePoolId,
            flag: 1  //标识：0-用于编辑数据反显；1-用于发票池详情
        },
        success: function (r) {
            if(!r.data.invoicePond)return false;
            dataShow(r.data.invoicePond)
        }
    })
}
function dataShow(r) {
    $(".pondName").html(r.pondName)
    $(".pondMoney").html((r.pondAmount ? r.pondAmount : '0') + '元')
    if (r.contractNo) $(".contractNo").html(r.contractNo)
    else $(".contractNo").parent().hide()
    if (r.contractAmount) $(".contractMoney").html(r.contractAmount + '元')
    else $(".contractMoney").parent().hide()
    if (r.startDate) $(".timeDate").html(initDate(r.startDate) + '  至 ' + initDate(r.endDate))
    $(".invoiceDate").html(r.invoiceDate + '月')
    //    如果金融机构：不显示金融机构字段
    // 工程公司：不显示工程公司、联系人、联系电话字
    if (!r.constructCompanyName) {
        $(".constructCompanyBox").hide()
    } else {
        $(".constructCompany").html(r.constructCompanyName)
        $(".poolUser").html(r.user)
        $(".poolTel").html(r.tel)
    }
    if (!r.financeCompanyName) {
        $(".financeCompanyBox").hide()
    } else {
        $(".financeCompany").html(r.financeCompanyName)
    }
}
