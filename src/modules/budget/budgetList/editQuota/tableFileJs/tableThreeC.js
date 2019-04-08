//表三乙-------------------------------------------------------------------------------------------------------------------------------
var proDataThreeC = {} // 表三乙 项目资料
var priceAllC = 0
var tableThreebBuildTypeObj = {
    3: "demolishMachine",    //拆除机械台班系数 
    4: "warehousingMachine", //入库拆除机械台班系
    5: "noMachine"           //不入库机械台班系数
}
function showTableThreeC() {
    priceAllC = 0
    numAll = 0
    initTable('tableThreeTableC', tableThreeDataC, tableThreeColumnsC)
    $("#tableThreeTableC tbody tr").each(function (index, ele) {
        if ($(ele).find('.tableThreeTableOther').length) {
            $('#tableThreeTableC').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 9, rowspan: 1 });
            $(ele).addClass("footerActive")
        } else $(ele).find('td').show()
    })
}

$("body").on("click", "#tableThreeTableC .confirmTablePn", function () {
    var curTrIdx = $(this).parents("tr").attr("data-index")
    var oldVal = tableThreeDataC[curTrIdx]['quotaNum']
    tableThreeDataC[curTrIdx]['quotaNum'] = $(this).siblings("input").val()
    if (oldVal == tableThreeDataC[curTrIdx]['quotaNum']) return submitSuccess("修改成功")
    postTableThreeDataC(tab_rowData.id, $(this).siblings("input").val())
})


var index_oneC = {
    no: "Ⅱ",
    name: "Ⅲ",
    meterageName: "Ⅳ",
    quotaNum: "Ⅴ",
    nameMeter: "Ⅵ",
    numRate: "Ⅶ",
    priceMeter: "Ⅷ",
    num: "Ⅸ",
    price: "Ⅹ",
    // price: "Ⅺ",
    o: "Ⅰ"
}
var tableThreeDataC = []
var tableThreeDataCAfterTotalList = [
    {
        w: "合计",
        mechanicTotal: "",
        generalTotal: ""
    }, {
        w: "总计",
        amount: "true",
        mechanicTotal: "",
        generalTotal: ""
    }
]
function getEchoTableThreeC() {
    tableThreeDataC = [index_oneC]
    $http({
        url: "/gct-web/tableThreeNail/meterList",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            tableThreeDataC = tableThreeDataC.concat(r.data.list || []).concat(tableThreeDataCAfterTotalList)
            tableThreeDataC = tableThreeDataC.length > 3 ? tableThreeDataC : []
            proDataThreeC = r.data.budgetProject || {}
            showTableThreeC()
        }
    })
}
function postTableThreeDataC(id, num) {
    $http({
        url: "/gct-web/tableThreeNail/meterUpdate",
        data: {
            budgetId: budgetId,            //概预算项目ID
            budgetMeterId: id,
            num: num
        },
        success: function (r) {
            if (!r.data) return false
            submitSuccess("修改成功")
            showTableThreeC()
        }
    })
}
