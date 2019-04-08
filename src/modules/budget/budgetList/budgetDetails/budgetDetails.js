var budgetId = storage("budgetId")
// $(function () {
// if (!window.editQuotaPage) initDataDetails()
// })


//详情数据回显
function initDataDetails() {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectInfo',
        data: { id: budgetId },
        success: function (r) {
            if (!r.data) return
            dataShow(r.data)
        }
    })
}

function dataShow(data) {
    $("#projectDetail .projectName").html(data.name);//项目名称
    $("#projectDetail .projectCode").html(data.no);//项目编号
    $("#projectDetail .projectSingle").html(data.single); //单项工程名称
    $("#projectDetail .listProCtiyCounty").html(getCodeTxt(data.province, data.city, data.county))
    $("#projectDetail .projectDistance").html(data.distance);//施工距离
    $("#projectDetail .saleRate").html(data.saleRate);//施工消项税率
    $("#projectDetail .nailRate").html(data.nailRate);//甲供材料采购税率
    $("#projectDetail .deviceRate").html(data.deviceRate);//设备采购税率
    $("#projectDetail .discount").html(data.discount ? data.discount  : "");//折扣系数
    $("#projectDetail .orderName").html(data.orderName);//订单名称
    $("#projectDetail .orderNo").html(data.orderNo);//订单编号
    $("#projectDetail .orderAmount").html(data.orderAmount);//订单金额
    //施工环境
    var str=''
    if (data.environment == 1) str+='干扰地区'
    if (data.isCity == 1) str+=' 城区部分'
    $(".environment").html(str)
    $("#projectDetail .supervisor").html(data.supervisor);//监理单位
    $("#projectDetail .projectPerson").html(data.person);//工程负责人
    //项目类型
    $("#projectDetail .projectTypeName").html(data.projectTypeName)

    //    特殊地区
    $("#projectDetail .specialArea").html(data.specialAreaName)
    //    建设单位
    $("#projectDetail .unitName").html(data.unitName)



}