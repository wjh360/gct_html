//表三乙-------------------------------------------------------------------------------------------------------------------------------

var total;
var tableThreeDataBAfterTotalList = [
    {
        w: "合计",
        total: ""
    }, {
        w: "总计",
        amount: "true",
        total: ""
    }
]
//初始化表三乙数据
function getEchoTableThreeB() {
    // tableThreeDataB = tableThreeDataB.splice(0, 1)
    $http({
        url: "/gct-web/tableThreeNail/mechanicsList",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            var tableThreeDataB = [{
                no: "Ⅱ",
                name: "Ⅲ",
                buildType: "Ⅳ",
                meterageName: "Ⅴ",
                quotaNum: "Ⅵ",
                nameMechanics: "Ⅶ",
                numRate: "Ⅷ",
                priceMechanics: "Ⅸ",
                num: "Ⅹ",
                price: "Ⅺ",
                o: "Ⅰ"
            }]
            tableThreeDataB = tableThreeDataB.concat(r.data.list || []).concat(tableThreeDataBAfterTotalList)
            total = r.data.total
            if (tableThreeDataB.length <= 3) tableThreeDataB = []
            initTable('tableThreeTableB', tableThreeDataB, tableThreeColumnsBs)
            $("#tableThreeTableB tbody tr").each(function (index, ele) {
                if ($(ele).find('.tableThreeTableOther').length) {
                    $('#tableThreeTableB').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 10, rowspan: 1 });
                    $(ele).addClass("footerActive")
                } else $(ele).find('td').show()
            })
        }
    })
}
//表三乙
var tableThreeColumnsBs = [
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
            width: 100,
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
            title: '建设类型',
            field: 'buildType',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                var statusObj = {
                    '1': "新建",
                    '2': "扩建",
                    '3': "拆除",
                    '4': "入库拆除",
                    '5': "不入库拆除"
                }
                if (c > 0) return statusObj[a]
                return a
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
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = a || ""
                    return str
                } return a
            }
        }, {
            title: '机械名称',
            field: 'nameMechanics',
            colspan: 1,
            width: 200,
            rowspan: 2
        }, {
            title: '单位定额值',
            // field: 'f',
            align: "priceMechanics",
            colspan: 2,
            width: 100,
            align: "center",
            rowspan: 1
        }, {
            title: '合计值（工日）',
            // field: 'g',
            align: "center",
            colspan: 2,
            width: 100,
            rowspan: 1
        }
    ],
    [
        {
            title: '数量（台班）',
            field: 'numRate',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    // log(b)
                    if (b['numRate']) return b['numRate']
                    else return ""
                }
                return a
            }
        }, {
            title: '单价（元）',
            field: 'priceMechanics',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '数量（台班）',
            field: 'num',
            colspan: 1,
            width: 100,
            rowspan: 1,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b['num']) return b['num']
                    else return "0.00"
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
                    if (b['price']) return b['price']
                    else if (b['w']) return total
                    else return "0.00"
                } return a
            }
        }
    ]  //二级表头
]
