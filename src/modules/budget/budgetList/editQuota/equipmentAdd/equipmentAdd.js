
var meterageIdList = [];//单位
var budgetId = storage('budgetId')
var EquitType = storage('EquitType')

$(function () {
    // 获取 单位 list

    $http({
        url: "/gct-web/table4Device/getTable4DeviceSaveEcho",
        success: function (r) {
            meterageIdList = r.data || []
            getDownSelect('measuringUnit1', '请选择', meterageIdList, 'id', 'name')
        }
    })

    //  点击添加费用append内容
    $("body").on("click", '.addMaterail', function () {
        var str_con = "";
        var ind = $(".equitBox").length+1;
        if(ind==11) return false;
        str_con += '<div class="commonCon materailSum equitBox">\n' +
            '                <div class="inforHeader clearfix">\n' +
            '                    <div class="verHang f_l"></div>\n' +
            '                    <div class="headerText f_l">设备<span class="reimIndex">'+ind+'</span></div>\n' +
            '                    <div class="pic_delete_page f_r"><img src="./../../../../img/money_delete.png" style="width: 40px;height: 40px" alt=""></div>\n' +
            '                </div>\n' +
            '                <!--内容区-->\n' +
            '                <div class="Role-noticeCon">\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>设备名称：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="允许输入100个字，允许重复" class="equitName" type="text" maxlength="100" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top">规格程式：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="" class="specFormat" type="text" maxlength="100" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>单位：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <div id="measuringUnit'+ind+'" class="downSelect measuringUnit" style="margin-top: 3px;width: 150px;">\n' +
            '                                </div>\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>单价：</span>\n' +
            '                        <span class="nameCon ">\n' +
            '                               <input placeholder="" class="money equitPrice" type="text" maxlength="13" style="width: 350px;"> 元\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>数量：</span>\n' +
            '                        <span class="nameCon ">\n' +
            '                               <input placeholder="" class="money equitNum" type="text" maxlength="13" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top">备注：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="允许输入20个字" class="remark" type="text" maxlength="20" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '\n' +
            '                </div>\n' +
            '            </div>'
        $(".reimburseMent").append(str_con)

        if(ind==10) $(".addMaterail").hide()
         if (!meterageIdList.length) return false;

         getDownSelect("measuringUnit" + ind, '请选择', meterageIdList, 'id', 'name')

    })

//    点击删除
    $("body").on("click",'.pic_delete_page',function () {
        $(this).parents(".materailSum").remove()
        var ind = $(".materailSum").length;
        if(ind<10) $(".addMaterail").show();
    })


    //    点击提交，获取数据
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "确认提交当前操作吗?",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    doAdd()
                }
            }
        })
    })

    //提交
    function doAdd() {
        $http({
            url: '/gct-web/table4Device/getTable4DeviceSave',
            data: appilObj,
            success: function (r) {
                submitSuccess('', function () {
                     goBack()
                })
            }
        })

    }
})

var applyFalg = true;
var appilObj={}
function applyVerify() {
    applyFalg = true;

    // 费用
    var reimburseMentInfo = [];
    $(".equitBox").each(function (k, v) {
        var kIndex = k + 1
        var reimburseMentInfoObj = {}
        reimburseMentInfoObj.type=EquitType
        reimburseMentInfoObj.budgetProjectId=budgetId
        reimburseMentInfoObj.name = $(v).find(".equitName").val()
        reimburseMentInfoObj.specFormat= $(v).find(".specFormat").val()
        if (!reimburseMentInfoObj.name) {
            applyFalg = false;
            $.popInfo("请选择设备" + kIndex + " 设备名称");
            return false
        }

        reimburseMentInfoObj.meterageId = $(".measuringUnit" + kIndex).attr("index")
        if (reimburseMentInfoObj.meterageId == '') {
            applyFalg = false;
            $.popInfo("请选择设备" + kIndex + " 单位");
            return false
        }

        reimburseMentInfoObj.price = $(v).find(".equitPrice").val()
        if (!reimburseMentInfoObj.price||reimburseMentInfoObj.price==0) {
            applyFalg = false;
            $.popInfo("请选择设备" + kIndex + " 单价");
            return false
        }
        reimburseMentInfoObj.num = $(v).find(".equitNum").val()
        if (!reimburseMentInfoObj.num||reimburseMentInfoObj.num==0) {
            applyFalg = false;
            $.popInfo("请选择设备" + kIndex + " 数量");
            return false
        }
        reimburseMentInfoObj.remark = $(v).find(".remark").val()
        reimburseMentInfo.push(reimburseMentInfoObj)

    })

    appilObj.deviceJson = JSON.stringify(reimburseMentInfo)

    // orFileData是个对象

}

