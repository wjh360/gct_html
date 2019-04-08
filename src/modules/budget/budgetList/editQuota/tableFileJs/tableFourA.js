
//--除税价
var subtotal //小计计算
var mainMaterialRate        // 运杂费 对象
var mainMaterialRateNum = 0 //运杂费之和
var secureRate;             //运输保险费率
var purchaseRate;           //保管费率
var fuwuFeeRate;           //采购代理服务费
var DetaxAmonutAll;         //除税价总计
var editFuFee=0;
var tableFourTableBData = []

var EquitType = 1;// // 1.需要安装设备  2.不需要安装设备;默认是安装设备
$(function () {
    //设备
    //点击需求不需求
    $("body").on("click", '.equipBtn', function () {
        EquitType = $(this).attr("index")
        $(this).addClass("activeTable").siblings().removeClass("activeTable")
        // $("#tableFourTableA").html("")
        getEchoTableFourA()

    })
    //点击添加设备
    $("body").on("click", ".AddEquitMent", function () {
        storage('EquitType', EquitType, 'equipmentAdd')
        storage('budgetId', budgetId, 'equipmentAdd')
        goNewPage("/modules/budget/budgetList/editQuota/equipmentAdd.html")
    })
    //点击编辑设备
    $("body").on("click", ".EditEquitMent", function () {
        var selectId = tabObj['tableFourTableA']['tab_select_ids']
        if (selectId.length == 1) {
            $.popConfirm({
                content: "确定编辑所选内容吗?",
                confirm: function () {
                    storage('equitMentId', selectId[0], 'equipmentUpdate')
                    storage('budgetId', budgetId, 'equipmentUpdate')
                    goNewPage("/modules/budget/budgetList/editQuota/equipmentUpdate.html")
                }
            })

        } else {
            $.popInfo("请选择一条设备编辑")
        }

    })


    //    点击删除
    $("body").on("click", ".del_equitMent", function () {
        var selectId = tabObj['tableFourTableA']['tab_select_ids']
        var selectArr = selectId.join(",")
        if (selectId.length) {
            $.popConfirm({
                content: "确定删除所选内容吗?",
                confirm: function () {
                    $http({
                        url: "/gct-web/table4Device/getTable4DeviceDel",
                        data: {
                            ids: selectArr
                        },
                        success: function (r) {
                            submitSuccess('', function () {
                                getEchoTableFourA()
                            })
                        }
                    })
                }
            })

        } else {
            $.popInfo("请选择要删除的设备")
        }

    })

    //   点击编辑保存
    $("body #tableFourTableA").on("click", '.subtractTaxConfirm', function () {
        var subtractTaxInput = $(".subtractTaxInputFourA").val()
        if(!budgetProjectDeviceId) return
        if(editFuFee==subtractTaxInput){
            submitSuccess('', function () {
            })
        }
        else if ($.checkReg(subtractTaxInput, 'noNull')) {
            $http({
                url: "/gct-web/table4Device/getBudgetProjectDeviceSave",
                data: {
                    id: budgetProjectDeviceId,
                    subtractTaxAgent: subtractTaxInput
                },
                success: function (r) {
                    submitSuccess('', function () {
                        getEchoTableFourA()
                    })
                }
            })
        }
    })
})
var budgetProjectDeviceId;//概预算设备Id
//获取数据
function getEchoTableFourA() {

    $http({
        url: "/gct-web/table4Device/getTable4Device",
        data: {
            budgetProjectId: budgetId,
            type: EquitType // 1.需要安装设备  2.不需要安装设备
        },
        success: function (r) {
            if (!r.data) return false
            tableFourTableBData = r.data.deviceVOList || {}
            if (r.data.budgetProjectDevice) {
                budgetProjectDeviceId = r.data.budgetProjectDevice.id
                var budgetProjectDevice = r.data.budgetProjectDevice
                //小计
                subtotal = {
                    noFlag: 1,
                    typrName: '小计',
                    subtractTax: budgetProjectDevice.subtractTaxSubtotal ? budgetProjectDevice.subtractTaxSubtotal : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxSubtotal ? budgetProjectDevice.addTaxSubtotal : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxSubtotal ? budgetProjectDevice.containTaxSubtotal : '0'//含税价-小计
                }

                //运杂费
                mainMaterialRate = {
                    noFlag: 1,
                    typrName: '运杂费',
                    subtractTax: budgetProjectDevice.subtractTaxBlend ? budgetProjectDevice.subtractTaxBlend : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxBlend ? budgetProjectDevice.addTaxBlend : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxBlend ? budgetProjectDevice.containTaxBlend : '0'//含税价-小计
                }
                //运输保险费率
                secureRate = {
                    noFlag: 1,
                    typrName: '运输保险费',
                    subtractTax: budgetProjectDevice.subtractTaxInsurance ? budgetProjectDevice.subtractTaxInsurance : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxInsurance ? budgetProjectDevice.addTaxInsurance : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxInsurance ? budgetProjectDevice.containTaxInsurance : '0'//含税价-小计
                }
                //保管
                purchaseRate = {
                    noFlag: 1,
                    typrName: '采购保管费',
                    subtractTax: budgetProjectDevice.subtractTaxSurely ? budgetProjectDevice.subtractTaxSurely : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxSurely ? budgetProjectDevice.addTaxSurely : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxSurely ? budgetProjectDevice.containTaxSurely : '0'//含税价-小计
                }
                //代理服务费
                fuwuFeeRate = {
                    noFlag: 2,
                    typrName: '采购代理服务费',
                    subtractTax: budgetProjectDevice.subtractTaxAgent ? budgetProjectDevice.subtractTaxAgent : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxAgent ? budgetProjectDevice.addTaxAgent : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxAgent ? budgetProjectDevice.containTaxAgent : '0'//含税价-小计
                }
                editFuFee = fuwuFeeRate.subtractTax
                //总计
                DetaxAmonutAll = {
                    noFlag: 1,
                    typrName: '总计',
                    subtractTax: budgetProjectDevice.subtractTaxTotal ? budgetProjectDevice.subtractTaxTotal : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxTotal ? budgetProjectDevice.addTaxTotal : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxTotal ? budgetProjectDevice.containTaxTotal : '0'//含税价-小计
                }

                tableFourTableBData.push(subtotal)
                tableFourTableBData.push(mainMaterialRate)
                tableFourTableBData.push(secureRate)
                tableFourTableBData.push(purchaseRate)
                tableFourTableBData.push(fuwuFeeRate)
                tableFourTableBData.push(DetaxAmonutAll)
            }



            //第一行数据
            var newArr =
            {
                a: "Ⅰ",//
                b: "Ⅱ",//二级表
                name: "Ⅲ",
                specFormat: "Ⅳ",
                meterageName: "Ⅴ",
                num: "Ⅵ",
                price: "Ⅶ",
                subtractTax: "Ⅷ",
                addTax: "Ⅸ",
                containTax: "Ⅹ",
                remark: "Ⅺ"

            }
            // 存放格式化数据后的list
            tableFourTableBData.unshift(newArr)
            showTableFourA()
        }
    })
}

function showTableFourA() {
    if (tableFourTableBData.length <= 2) tableFourTableBData = []
    initTable('tableFourTableA', tableFourTableBData, tableFourColumnsA)
    $("#tableFourTableA tbody tr").each(function (index, ele) {
        if ($(ele).find(".tableFourTableAOther").length) {
            $('#tableFourTableA').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: 'a', colspan: 7, rowspan: 1 });
            $(ele).addClass("footerActive")
        }

    })

}
