var applyObj = {}
var applyFalg = true;
function getDataFrom(flag) {
    applyFalg = true;
    applyObj.status  = flag;//提交状态
    applyObj.name = $(".projectName").val();//项目名称
    applyObj.no = $(".projectCode").val();//项目编号
    applyObj.single = $(".projectSingle").val(); //单项工程名称
    applyObj.projectType = $(".projectStatus").attr("index");//项目类型

    var address = getCodeSub('listProCtiyCounty');//地址
    applyObj.province = address.province;//地址
    applyObj.city = address.city;//地址
    applyObj.county = address.county;//地址
    applyObj.distance = $(".projectDistance").val();//施工距离
    applyObj.unitId ="";//建设单位ID
    $(".constructionUnit").each(function (k, v) {
        if (k != 0 && $(v).find("span").attr("index")) {
            applyObj.unitId = $(v).find("span").attr("index")
        }
    })
    applyObj.saleRate = $(".saleRate").val();//施工消项税率
    applyObj.nailRate = $(".nailRate").val();//甲供材料采购税率
    applyObj.deviceRate = $(".deviceRate").val();//设备采购税率
    applyObj.discount = $(".discount").val();//折扣系数
    applyObj.orderName = $(".orderName").val();//订单名称
    applyObj.orderNo = $(".orderNo").val();//订单编号
    applyObj.orderAmount = $(".orderAmount").val();//订单金额
    applyObj.specialArea = $(".specialArea").attr("index");//特殊地区
    applyObj.environment = $("#environment").hasClass("checkBoxTrue")?'1':'2';//1.干扰地区  2
    applyObj.isCity = $("#isCity").hasClass("checkBoxTrue")?'1':'2';// isCity   //1.城区 2.非城区
    applyObj.supervisor = $(".supervisor").val();//监理单位
    applyObj.person = $(".projectPerson").val();//工程负责人

    //保存时只校验项目名称，其余时都校验

    if (!$.checkReg(applyObj.name, 'noNull')) {applyFalg = false;$.popInfo("请填写项目名称"); return false}
    if (!$.checkReg(applyObj.no, 'noNull')) {applyFalg = false;$.popInfo("请填写项目编号"); return false}
    if (!$.checkReg(applyObj.single, 'noNull')) {applyFalg = false;$.popInfo("请填写单项工程名称"); return false}
    if (!applyObj.projectType) {applyFalg = false;$.popInfo("请选择项目类型"); return false}
    if (!applyObj.province) {applyFalg = false;$.popInfo("请选择项目区域"); return false}
    if (!$.checkReg(applyObj.distance, 'noNull')) {applyFalg = false;$.popInfo("请填写施工距离"); return false}
    if (!applyObj.unitId) {applyFalg = false;$.popInfo("请选择建设单位"); return false}
    if (!$.checkReg(applyObj.saleRate, 'noNull')) {applyFalg = false;$.popInfo("请填写施工销项税率"); return false}


}
