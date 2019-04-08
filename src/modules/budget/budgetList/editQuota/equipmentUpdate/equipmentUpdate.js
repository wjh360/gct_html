
var meterageIdList = [];//单位
var budgetId = storage('budgetId')
var equitMentId = storage('equitMentId')
var applyFalg = true;
var appilObj={}
appilObj.id =equitMentId
appilObj.budgetProjectId =budgetId

log(budgetId)
log(equitMentId)
$(function () {
    // 获取 单位 list
    //

    initData()

    function initData() {
        $http({
            url: "/gct-web/table4Device/getTable4DeviceInfo",
            data:{id:equitMentId},
            success: function (r) {
                if(!r.data)return
                unitList(r.data)
                appilObj.type =r.data.type
            }
        })
    }

    function unitList(budgetObj) {
        $http({
            url: "/gct-web/table4Device/getTable4DeviceSaveEcho",
            success: function (r) {
                meterageIdList = r.data || []
                getDownSelect('measuringUnit1', '请选择', meterageIdList, 'id', 'name')
                if(budgetObj.meterageId&&budgetObj.meterageName)$(".measuringUnit1").attr("index",budgetObj.meterageId).html(budgetObj.meterageName)
                $(".equitName").val(budgetObj.name)
                $(".specFormat").val(budgetObj.specFormat)
                $(".equitPrice").val(budgetObj.price)
                $(".equitNum").val(budgetObj.num)
                $(".remark").val(budgetObj.remark)

            }
        })
    }

    //    点击提交，获取数据
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "确认提交当前操作吗?",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    doUpdate()
                }
            }
        })
    })

    //提交
    function doUpdate() {
        $http({
            url: '/gct-web/table4Device/getTable4DeviceUpdate',
            data: appilObj,
            success: function (r) {
                submitSuccess('', function () {
                     goBack()
                })
            }
        })

    }
})


function applyVerify() {
    applyFalg = true;

    // 费用
        appilObj.name = $(".equitName").val()
        appilObj.specFormat = $(".specFormat").val()
        if (!appilObj.name) {
            applyFalg = false;
            $.popInfo("请填写设备名称");
            return false
        }

        appilObj.meterageId = $(".measuringUnit1").attr("index")
        if (appilObj.meterageId == '') {
            applyFalg = false;
            $.popInfo("请选择设备单位");
            return false
        }

        appilObj.price = $(".equitPrice").val()
        if (!appilObj.price||appilObj.price==0) {
            applyFalg = false;
            $.popInfo("请填写设备单价");
            return false
        }
        appilObj.num = $(".equitNum").val()

        if (!appilObj.num||appilObj.num==0) {
            applyFalg = false;
            $.popInfo("请填写设备数量");
            return false
        }
      appilObj.remark = $(".remark").val()

}

