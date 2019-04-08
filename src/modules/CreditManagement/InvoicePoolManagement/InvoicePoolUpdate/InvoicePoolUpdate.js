
var invoicePoolId = storage("invoicePoolId")//发票池Id
var appilObj = {};//提交数据
var applyFalg = true;
$(function () {
    //   页面数据返显
    initData()
    //点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    poolUpdate()
                }
            }
        })
    })
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/beforeUpdate',
        data: {
            id: invoicePoolId,
            flag: 0   //标识：0-用于编辑数据反显；1-用于发票池详情
        },
        success: function (r) {
            if(!r.data.invoicePond)return false;
            dataShow(r.data.invoicePond)
            if (!r.data.companyList) r.data.companyList = []
            r.data.companyList.unshift({
                id: '',
                companyName: '请选择'
            })
            getDownSelect('constructCompany', r.data.invoicePond.constructCompanyName ? r.data.invoicePond.constructCompanyName : '请选择', r.data.companyList, 'id', 'companyName');
            $(".constructCompany").attr("index", r.data.invoicePond.constructCompanyName ? r.data.invoicePond.constructId : '');
        }
    })
}
//编辑数据回显
function dataShow(r) {
    $(".pondName").val(r.pondName)
    $(".poolUser").val(r.user)
    $(".poolTel").val(r.tel)
    $(".pondMoney").val(r.pondAmount)
    $(".contractNo").val(r.contractNo)
    $(".contractMoney").val(r.contractAmount)
    $("#startTime").val(initDate(r.startDate))
    $("#endTime").val(initDate(r.endDate))
    $(".invoiceDate").val(r.invoiceDate)
}
//校验
function applyVerify() {
    appilObj = {}
    applyFalg = true;
    appilObj.id = invoicePoolId;//id
    appilObj.pondName = $(".pondName").val();//名称
    appilObj.constructId = $(".constructCompany").attr("index");//工程公司
    appilObj.userName = $(".poolUser").val();//联系人
    appilObj.tel = $(".poolTel").val();//联系电话
    appilObj.pondMoney = $(".pondMoney").val();// //发票池金额
    appilObj.contractNo = $(".contractNo").val(); //合同编号
    appilObj.contractMoney = $(".contractMoney").val();//合同金额
    appilObj.startTime = $("#startTime").val();//合同有效期开始时间
    appilObj.endTime = $("#endTime").val();//合同有效期开始时间
    appilObj.invoiceDate = $(".invoiceDate").val();//密码
    if (!$.checkReg(appilObj.pondName, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写发票池名称");
        return false
    }
    if (!appilObj.constructId) {
        applyFalg = false;
        $.popInfo("请选择工程公司");
        return false
    }
    if (!$.checkReg(appilObj.userName, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写联系人");
        return false
    }
    if (!$.checkReg(appilObj.tel, 'phone')) {
        applyFalg = false;
        $.popInfo("请填写联系电话");
        return false
    }
    if (!Number(appilObj.pondMoney)) {
        applyFalg = false;
        $.popInfo("请填写发票池金额");
        return false
    }
    if (!$.checkReg(appilObj.invoiceDate, 'age')) {
        applyFalg = false;
        $.popInfo("请填写发票有效期");
        return false
    }
    if (appilObj.startTime != '' && appilObj.endTime == '' || appilObj.startTime == '' && appilObj.endTime != '') {
        applyFalg = false;
        $.popInfo("请完整填写合同有效期");
        return false
    }
}
//提交数据
function poolUpdate() {
    $http({
        url: '/gct-web/invoicePond/doUpdate',
        data: appilObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}