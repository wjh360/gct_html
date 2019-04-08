//表四乙  表四丙 表格-------------------------------------------------------------------------------------------------------------------------------
var isSIb;                  //判断是否是表四丙    true/是  false/否 
//--除税价
var subtotal = 0            //小计计算
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

//---服务费
var totalObj = {}
var fuwuFee = {
    "1": 'agentOptical',    //采购代理服务费-光缆
    "2": 'agentCable',       //采购代理服务费-电缆
    "3": 'agentPlastic',    //采购代理服务费-塑料及塑料制品
    "4": 'agentWood',       //采购代理服务费-木材及木制品
    "5": 'agentCement',     //采购代理服务费-水泥及水泥构件
    "6": 'agentOther',      //采购代理服务费-其他	
}
var fuwuFeeNum = 0;
var TypeList = {
    1: "光缆类",
    2: "电缆类",
    3: "塑料及塑料制品类",
    4: "木材及木制品类",
    5: "水泥及水泥构件类",
    6: "其他类"
}
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
    var attrSrcTab = !isSIb ? 'tableFourTableB' : 'tableFourTableC'
    DetaxAmonutAll = 0
    initTable(attrSrcTab, tableFourTableBData, tableFourColumnsB_C)
    $("#" + attrSrcTab + " tbody tr").each(function (index, ele) {
        if ($(ele).find(".tableFourBTableOther").length) $('#' + attrSrcTab).bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 8, rowspan: 1 });
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
    subtotal = 0
    z_subtotal = 0
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
                    a: "Ⅰ",
                    b: "Ⅱ",
                    c: "Ⅲ",
                    d: "Ⅳ",
                    e: "Ⅴ",
                    f: "Ⅵ",
                    g: "Ⅶ",
                    h: "Ⅷ",
                    r: "Ⅸ",
                    j: "Ⅹ",
                    k: "Ⅺ",
                    l: "Ⅻ"
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
                        else if (index == 4) {
                            // log(fuwuFee[k], totalObj[fuwuFee[k]], totalObj)
                            e.val = parseFloat(totalObj[fuwuFee[k]]) || 0
                        }

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
        }
    })
}
//删除材料
$("body").on("click", ".del_matterBtn", function () {
    var attrSrcTab = !isSIb ? 'tableFourTableB' : 'tableFourTableC'
    var arr = tabObj[attrSrcTab]['tab_select_ids']
    var arrObj = tabObj[attrSrcTab]['tab_select_data']
    var str = ""
    $.each(arrObj, function (index, eleVal) {
        if (eleVal['quotaProject'] && eleVal['quotaProjectId']) {
            str += TypeList[eleVal['material']['type']] + "材料中序号为 " + eleVal['idx'] + " 的材料属于定额项目，无法删除！<br>"
        }
    })
    if (str.length) return $.popAlert({ 'content': str })

    if (arr.length) {
        $.popConfirm({
            'content': '确定删除所选内容吗？',
            'confirm': function () {
                $http({
                    url: "/gct-web/tableThreeNail/equipmentDel",
                    data: {
                        budgetId: budgetId,
                        budgetEquipmentIds: arr.join(),
                        type: isSIb ? 2 : 1
                    },
                    success: function (r) {
                        submitSuccess('操作成功', function () {
                            getEchoTableFourB()
                        })
                    }
                })
            }
        })
    } else return $.popInfo("请选择需要删除的材料！")
})
//转移材料
$("body").on("click", ".change_matterBtn", function () {
    var attrSrcTab = !isSIb ? 'tableFourTableB' : 'tableFourTableC'
    var arr = tabObj[attrSrcTab]['tab_select_ids']
    if (arr.length) {
        $.popConfirm({
            'content': '确定转移所选内容吗？',
            'confirm': function () {
                $http({
                    url: "/gct-web/tableThreeNail/equipmentChange",
                    data: {
                        budgetId: budgetId,
                        budgetEquipmentIds: arr.join(),
                        type: isSIb ? 2 : 1
                    },
                    success: function (r) {
                        submitSuccess('操作成功', function () {
                            getEchoTableFourB()
                        })
                    }
                })
            }
        })
    } else return $.popInfo("请选择需要转移的材料！")
})


//失去焦点事件
function blurFn(_tar, curTrIdx, attr) {
    var oldVal = (parseFloat(tableFourTableBData[curTrIdx][attr]) || 0).toFixed(2)
    tableFourTableBData[curTrIdx][attr] = (parseFloat($(_tar).val()) || 0).toFixed(2)
    if (tableFourTableBData[curTrIdx][attr] == oldVal) return false //未修改
    showTableFourB()
    return true //修改
}



$("body").on("click", "#tableFourTableB .confirmTablePn,#tableFourTableC .confirmTablePn", function (e) {
    var _this = this
    var curTrIdx = $(_this).parents("tr").attr("data-index")
    var valAttrIpt = $(_this).siblings("input")
    if ($(_this).parents(".editNum").length) {
        if (blurFn(valAttrIpt, curTrIdx, 'num'))
            upDateFourBTable({
                flag: 1,
                budgetEquipmentId: tab_rowData.id,
                num: tableFourTableBData[curTrIdx]['num']
            })
    } else if ($(_this).parents(".editPrice").length) {
        if (blurFn(valAttrIpt, curTrIdx, 'price'))
            upDateFourBTable({
                flag: 2,
                budgetEquipmentId: tab_rowData.id,
                price: tableFourTableBData[curTrIdx]['price']
            })
    } else if ($(_this).parents(".editRemark").length) {
        var oldVal = tableFourTableBData[curTrIdx]['remark']
        tableFourTableBData[curTrIdx]['remark'] = $(valAttrIpt).val()
        if (tableFourTableBData[curTrIdx]['remark'] == oldVal) return false //未修改
        showTableFourB()
        upDateFourBTable({
            flag: 3,
            budgetEquipmentId: tab_rowData.id,
            remark: tableFourTableBData[curTrIdx]['remark']
        })
    } else if ($(_this).parents(".editNumService").length) {
        tableFourTableBData[parseFloat(curTrIdx) + 1]['serviceNum'] = (parseFloat($(valAttrIpt).val()) || 0).toFixed(2)
        if (blurFn(valAttrIpt, curTrIdx, 'val'))
            upDateFourBTable({
                flag: 4,
                type: tab_rowData.typeStatus,
                agent: tableFourTableBData[curTrIdx]['val']
            })
    }

})

