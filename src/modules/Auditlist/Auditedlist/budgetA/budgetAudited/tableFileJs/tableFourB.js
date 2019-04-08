//表四乙  表四丙 表格-------------------------------------------------------------------------------------------------------------------------------
var isSIb;                  //判断是否是表四丙    true/是  false/否 
//--除税价
var subtotal = 0;           //小计计算
var mainMaterialRate        //运杂费 对象
var diRate = {              //运杂费
    "1": "opticalRate",     //光缆费率
    "2": "electricRate",    //电缆费率
    "3": "plasticRate",     //塑料及塑料制品费率
    "4": "woodRate",        //木材及木制品费率
    "5": "cementRate",      //水泥及水泥构件费率
    "6": "otherRate",       //其他费率
}
var mainMaterialRateNum = 0 //运杂费之和
var secureRate;             //运输保险费率
var purchaseRate;           //保管费率
var DetaxAmonutAll;         //除税价总计
//--除税价 增值税
var nailRate;               //甲供材料采购税率
var z_subtotal = 0
//---fuwuFee
var fuwuFee = {
    "1": 'agentOptical',    //采购代理服务费-光缆
    "2": 'agentCabl',       //采购代理服务费-电缆
    "3": 'agentPlastic',    //采购代理服务费-塑料及塑料制品
    "4": 'agentWood',       //采购代理服务费-木材及木制品
    "5": 'agentCement',     //采购代理服务费-水泥及水泥构件
    "6": 'agentOther',      //采购代理服务费-其他	
}
var TypeList = {
    1: "光缆类",
    2: "电缆类",
    3: "塑料及塑料制品类",
    4: "木材及木制品类",
    5: "水泥及水泥构件类",
    6: "其他类"
}

var totalObj = {}







var typeArr = [
    {
        type: 'computeType',
        computeType: 'subtotal',
        name: ''
    }, {
        type: 'computeType',
        computeType: 'rate',
        name: '（2）运杂费'
    }, {
        type: 'computeType',
        computeType: 'Insurance',
        name: '（3）运输保险费'
    }, {
        type: 'computeType',
        computeType: 'safekeeping',
        name: '（4）采购保管费'
    }, {
        type: 'computeType',
        computeType: 'Service',
        name: '（5）采购代理服务费',
        val: ''
    }, {
        type: 'computeType',
        computeType: 'amount',
        name: ''
    }
]
var tableFourTableBData = []
function showTableFourB() {
    // if (tableFourTableBData.length <= 2) tableFourTableBData = []
    var attrSrcTab = !isSIb ? 'tableFourTableB' : 'tableFourTableC'
    DetaxAmonutAll = 0
    initTable(attrSrcTab, tableFourTableBData, tableFourColumnsB_Cs)
    $("#" + attrSrcTab + " tbody tr").each(function (index, ele) {
        if ($(ele).find(".tableFourBTableOther").length) {
            $('#' + attrSrcTab).bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: 'a', colspan: 7, rowspan: 1 });
        }
        else $(ele).find('td').show()
    })
}
//修改表格数据
function upDateFourBTable(data) {
    data.budgetId = budgetId
    data.category = !isSIb ? 1 : 2
    $http({
        url: "/gct-web/tableThreeNail/equipmentUpdate",
        data: data,
        success: function (r) {
            submitSuccess("操作成功")
        }
    })
}
//获取数据
function getEchoTableFourB() {
    isSIb = nav_idx == 8 ? true : false
    $http({
        url: "/gct-web/tableThreeNail/equipmentList",
        data: {
            budgetId: budgetId,
            type: !isSIb ? 1 : 2
        },
        success: function (r) {
            if (!r.data) return false
            mainMaterialRate = r.data.mainMaterialRate || {}
            secureRate = r.data.secureRate
            purchaseRate = r.data.purchaseRate
            nailRate = r.data.budgetProject && r.data.budgetProject.nailRate ? r.data.budgetProject.nailRate : 0
            totalObj = r.data.total || {}
            var newArr = [
                {
                    b: "Ⅰ",
                    c: "Ⅱ",
                    d: "Ⅲ",
                    e: "Ⅳ",
                    f: "Ⅴ",
                    g: "Ⅵ",
                    h: "Ⅶ",
                    r: "Ⅷ",
                    j: "Ⅸ",
                    k: "Ⅹ",
                    l: "Ⅺ",
                    // l: "Ⅻ"
                }
            ] // 存放格式化数据后的list
            var dataList = r.data.list || []
            for (var k = 1; k <= 6; k++) {
                var newIdxArr = []
                var idx = 0
                $.each(dataList, function (index, eleVal) {
                    if (eleVal['material']['type'] == k) {
                        eleVal.idx = ++idx
                        newIdxArr.push(eleVal)
                    }
                })
                if (newIdxArr.length) {
                    $.each(typeArr, function (index, e) {
                        if (index == 0) e.name = '（1）' + TypeList[k] + '小计'
                        else if (index == 4) e.val = parseFloat(totalObj[fuwuFee[k]]) || 0
                        else if (index == 5) e.name = '（6）' + TypeList[k] + '合计'

                        newIdxArr.push({
                            type: e.type,
                            computeType: e.computeType,
                            name: e.name,
                            val: e.val,
                            typeStatus: k
                        })
                    })
                    newArr = newArr.concat(newIdxArr)
                }
            }
            newArr.push({
                type: 'computeType',
                name: '总计',
                computeType: "all"
            })
            tableFourTableBData = dataList.length ? newArr : []
            showTableFourB()
            // clickFun()

        }
    })
}








//表四乙 丙
var tableFourColumnsB_Cs = [
    [   //一级表头
        {
            title: '序号',
            field: 'a',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0 && b.type !== 'computeType') return b['idx']
                else if (b.type == 'computeType') {
                    return '<span class="tableFourBTableOther">' + b.name + '</span>'
                }
                return b.b
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 100,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0 && b['material'] && b['quotaProject']) return b['quotaProject']['no']
                return b.c
            }
        }, {
            title: '名称',
            field: 'a',
            colspan: 1,
            rowspan: 2,
            // width: 100,
            formatter: function (a, b, c) {
                if (c > 0 && b['material']) {
                    var str = b['material']['name']
                    return str //'<span title="' + str + '">' + initText(str, 5) + '</span>'
                }
                return b.d
            }
        }, {
            title: '规格程式',
            field: 'b',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0 && b['material']) return b['material']['specFormat']
                return b.e
            }
        }, {
            title: '单位',
            field: 'd',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) return b['meterageName']
                return b.f
            }
        }, {
            title: '数量',
            field: 'e',
            colspan: 1,
            rowspan: 2,
            width: 100,
            'class': 'editNum',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['num'] || ""
                    return str
                }
                return b.g
            }
        }, {
            title: '单价（元）',
            field: 'e',
            colspan: 1,
            rowspan: 1
        }, {
            title: '合计（元）',
            align: "center",
            colspan: 3,
            rowspan: 1
        }, {
            title: '备注',
            colspan: 1,
            align: "center",
            rowspan: 2,
            width: 100,
            'class': 'editRemark',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['remark'] || ""
                    return str //'<span title="' + str + '">' + initText(str) + '</span>'
                }
                return b.l
            }
        }
    ], [
        {
            title: '除税价',
            field: 'k',
            colspan: 1,
            rowspan: 1,
            width: 100,
            'class': 'editPrice',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['price'] || ""
                    return str
                }
                return b.h
            }
        }, {
            title: '除税价',
            field: 'l',
            colspan: 1,
            rowspan: 1,
            width: 100,
            'class': 'editNumService',
            formatter: function (a, b, c) {
                if (c > 0) {
                    // var str = (b['num'] * b['price'] || 0).toFixed(2)
                    if (b.type != 'computeType') return b['subtractTax']
                    else if (b.computeType == 'subtotal') { //小计
                        return totalObj["subtotal" + styObj[b['typeStatus']]] || "0.00"
                    } else if (b.computeType == 'rate') {   //运杂费
                        return totalObj["blend" + styObj[b['typeStatus']]] || "0.00"
                    } else if (b.computeType == 'Insurance') {  //运输保险费
                        // log(totalObj["insurance" + styObj[b['typeStatus']]], styObj[b['typeStatus']])
                        return totalObj["insurance" + styObj[b['typeStatus']]] || "0.00"
                    } else if (b.computeType == 'safekeeping') {    //采购保管费
                        return totalObj["surely" + styObj[b['typeStatus']]]
                    } else if (b.computeType == 'Service') {    //采购代理服务费
                        return totalObj["agent" + styObj[b['typeStatus']]]
                    } else if (b.computeType == 'amount') {     //合计
                        return totalObj["count" + styObj[b['typeStatus']]]
                    } else if (b.computeType == 'all') {
                        return totalObj["total"]
                    }
                }
                return b.r
            }
        }, {
            title: '增值税',
            field: 'm',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0 && !isSIb) {
                    if (b.type != 'computeType') {
                        return b['addTax']
                    }
                    else if (b.computeType == 'subtotal') { //小计
                        return totalObj["subtotal" + styObj[b['typeStatus']] + "Add"] || "0.00"
                    } else if (b.computeType == 'rate') {   //运杂费
                        return totalObj["blend" + styObj[b['typeStatus']] + "Add"] || "0.00"
                    } else if (b.computeType == 'Insurance') {  //运输保险费
                        return totalObj["insurance" + styObj[b['typeStatus']] + "Add"] || "0.00"
                    } else if (b.computeType == 'safekeeping') {    //采购保管费
                        return totalObj["surely" + styObj[b['typeStatus']] + "Add"]
                    } else if (b.computeType == 'Service') {    //采购代理服务费
                        return totalObj["agent" + styObj[b['typeStatus']] + "Add"]
                    } else if (b.computeType == 'amount') {     //合计
                        return totalObj["count" + styObj[b['typeStatus']] + "Add"]
                    } else if (b.computeType == 'all') {
                        return totalObj["totalAdd"]
                    }
                }
                return b.j
            }
        }, {
            title: '含税价',
            field: 'n',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0 && !isSIb) {
                    if (b.type != 'computeType') {
                        return b['containTax']
                    }
                    else if (b.computeType == 'subtotal') { //小计
                        return totalObj["subtotal" + styObj[b['typeStatus']] + "Contain"] || "0.00"
                    } else if (b.computeType == 'rate') {   //运杂费
                        return totalObj["blend" + styObj[b['typeStatus']] + "Contain"] || "0.00"
                    } else if (b.computeType == 'Insurance') {  //运输保险费
                        return totalObj["insurance" + styObj[b['typeStatus']] + "Contain"] || "0.00"
                    } else if (b.computeType == 'safekeeping') {    //采购保管费
                        return totalObj["surely" + styObj[b['typeStatus']] + "Contain"]
                    } else if (b.computeType == 'Service') {    //采购代理服务费
                        return totalObj["agent" + styObj[b['typeStatus']] + "Contain"]
                    } else if (b.computeType == 'amount') {     //合计
                        return totalObj["count" + styObj[b['typeStatus']] + "Contain"]
                    } else if (b.computeType == 'all') {
                        return totalObj["totalContain"]
                    }
                }
                return b.k
            }
        }
    ]  //二级表头
]



var styObj = {
    1: "Optical",
    2: "Cable",
    3: "Plastic",
    4: "Wood",
    5: "Cement",
    6: "Other"
}