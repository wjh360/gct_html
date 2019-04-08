
//--除税价
var subtotal //小计计算
var mainMaterialRate        // 运杂费 对象
var mainMaterialRateNum = 0 //运杂费之和
var secureRate;             //运输保险费率
var purchaseRate;           //保管费率
var fuwuFeeRate;           //采购代理服务费
var DetaxAmonutAll;         //除税价总计
var editFuFee = 0;
var tableFourTableBData = []

var EquitType = 1;// // 1.需要安装设备  2.不需要安装设备;默认是安装设备
$(function () {
    //设备
    //点击需求不需求
    $("body").on("click", '.equipBtn', function () {
        EquitType = $(this).attr("index")
        $(this).addClass("activeTable").siblings().removeClass("activeTable")
        getEchoTableFourA()

    })

})

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
                    noFlag: 1,
                    typrName: '采购代理服务费',
                    subtractTax: budgetProjectDevice.subtractTaxAgent ? budgetProjectDevice.subtractTaxAgent : '0',//除税价-小计
                    addTax: budgetProjectDevice.addTaxAgent ? budgetProjectDevice.addTaxAgent : '0',////增值税-小计
                    containTax: budgetProjectDevice.containTaxAgent ? budgetProjectDevice.containTaxAgent : '0'//含税价-小计
                }
                editFuFee = fuwuFeeRate.subtractTax
                //总计
                DetaxAmonutAll = {
                    noFlag: 1,
                    typrName: '合计',
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




            var newArr =
            {
                a: "Ⅰ",//
                name: "Ⅱ",//二级表
                specFormat: "Ⅲ",
                meterageName: "Ⅳ",
                num: "Ⅴ",
                price: "Ⅵ",
                subtractTax: "Ⅶ",
                addTax: "Ⅷ",
                containTax: "Ⅸ",
                remark: "Ⅹ"
            }
            // 存放格式化数据后的list
            tableFourTableBData.unshift(newArr)
            showTableFourA()
        }
    })
}

function showTableFourA() {
    if (tableFourTableBData.length <= 2) tableFourTableBData = []
    initTable('tableFourTableA', tableFourTableBData, tableFourColumnsAs)
    $("#tableFourTableA tbody tr").each(function (index, ele) {
        if ($(ele).find(".tableFourTableAOther").length) {
            $('#tableFourTableA').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: 'a', colspan: 6, rowspan: 1 });
            $(ele).addClass("footerActive")
        }

    })

}
//表四甲
var tableFourColumnsAs = [
    [   //一级表头
        {
            title: '序号',
            field: 'a',
            width: 50,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (b.noFlag == 1) return '<span class="tableFourTableAOther">' + b.typrName + '</span>'
                if (c > 0) return c
                return b.a
            }
        }, {
            title: '设备名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit" title="' + a + '">' + initText(a, 10) + '</span>'
            }
        }, {
            title: '规格程式',
            field: 'specFormat',
            colspan: 1,
            rowspan: 2,
            width: 150,
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit" title="' + a + '">' + initText(a, 10) + '</span>'
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            width: 100,
            rowspan: 2
        }, {
            title: '数量',
            field: 'num',
            colspan: 1,
            width: 100,
            rowspan: 2
        }, {
            title: '单价（元）',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '合计（元）',
            align: "center",
            colspan: 3,
            rowspan: 1
        }, {
            title: '备注',
            field: 'remark',
            colspan: 1,
            align: "center",
            rowspan: 2,
            width: 100,
            'class': "footerActive_dis",
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit"title="' + a + '">' + initText(a) + '</span>'
            }
        }
    ],
    [
        {
            title: '除税价',
            field: 'price',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '除税价',
            field: 'subtractTax',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '增值税',
            field: 'addTax',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '含税价',
            field: 'containTax',
            colspan: 1,
            width: 100,
            rowspan: 1
        }
    ]  //二级表头
]
