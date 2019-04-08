//表三乙-------------------------------------------------------------------------------------------------------------------------------

var total;
var tableThreebBuildTypeObj = {
    3: "demolishMachine",    //拆除机械台班系数 
    4: "warehousingMachine", //入库拆除机械台班系
    5: "noMachine"           //不入库机械台班系数
}




var index_oneC = {
    no: "Ⅱ",
    name: "Ⅲ",
    buildType: "Ⅳ",
    meterageName: "Ⅴ",
    quotaNum: "Ⅵ",
    nameMeter: "Ⅶ",
    numRate: "Ⅷ",
    priceMeter: "Ⅸ",
    num: "Ⅹ",
    price: "Ⅺ",
    o: "Ⅰ"
}

var tableThreeDataCAfterTotalList = [
    {
        w: "合计"
    }, {
        w: "总计"
    }
]
function getEchoTableThreeC() {
    var tableThreeDataC = [index_oneC]
    $http({
        url: "/gct-web/tableThreeNail/meterList",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            total = r.data.total
            tableThreeDataC = tableThreeDataC.concat(r.data.list || []).concat(tableThreeDataCAfterTotalList)
            if (tableThreeDataC.length <= 3) tableThreeDataC = []
            initTable('tableThreeTableC', tableThreeDataC, tableThreeColumnsCs)
            $("#tableThreeTableC tbody tr").each(function (index, ele) {
                if ($(ele).find('.tableThreeTableOther').length) {
                    $('#tableThreeTableC').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 9, rowspan: 1 });
                    $(ele).addClass("footerActive")
                } else $(ele).find('td').show()
            })
        }
    })
}


//表三丙
var tableThreeColumnsCs = [
    [   //一级表头
        {
            title: '序号',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (!b.w && c > 0) return c
                else if (b.w) {
                    return '<span class="tableThreeTableOther">' + b.w + '</span>'
                } else {
                    return b.o
                }
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 200,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['no']
                else return a
            }
        }, {
            title: '项目名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['name']
                else return a
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            width: 100,
            rowspan: 2
        }, {
            title: '数量',
            field: 'quotaNum',
            colspan: 1,
            width: 100,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = a || ""
                    return str
                } return a
            }
        }, {
            title: '仪表名称',
            field: 'nameMeter',
            colspan: 1,
            width: 200,
            rowspan: 2
        }, {
            title: '单位定额值',
            // field: 'f',
            align: "priceMechanics",
            colspan: 2,
            rowspan: 1,
            align: 'center'
        }, {
            title: '合计值（工日）',
            // field: 'g',
            align: "center",
            colspan: 2,
            rowspan: 1
        }
    ],
    [
        {
            title: '数量（台班）',
            field: 'numRate',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '单价（元）',
            field: 'priceMeter',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '数量（台班）',
            field: 'num',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b['num']) return b['num']
                    else return ""
                }
                return a
            }
        }, {
            title: '合价（元）',
            field: 'price',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c, d) {
                if (c > 0) {

                    if (b.w) {
                        return total
                    } else {
                        if (b['price']) return b['price']
                        else return ""
                    }
                } return a
            }
        }
    ]  //二级表头
]

