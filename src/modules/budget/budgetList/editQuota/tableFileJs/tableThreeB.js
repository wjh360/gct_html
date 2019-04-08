//表三乙-------------------------------------------------------------------------------------------------------------------------------
var proDataThreeB = {} // 表三乙 项目资料
var priceAll = 0
var numAll = 0
var tableThreeBBuildTypeObj = {
    3: "demolishMachine",    //拆除机械台班系数 
    4: "warehousingMachine", //入库拆除机械台班系
    5: "noMachine"           //不入库机械台班系数
}
function showTableThreeB() {
    priceAll = 0
    numAll = 0
    initTable('tableThreeTableB', tableThreeDataB, tableThreeColumnsB)
    $("#tableThreeTableB tbody tr").each(function (index, ele) {
        if ($(ele).find('.tableThreeTableOther').length) {
            $('#tableThreeTableB').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 10, rowspan: 1 });
            $(ele).addClass("footerActive")
        } else $(ele).find('td').show()
    })
}

$("body").on("click", "#tableThreeTableB .confirmTablePn", function () {
    var curTrIdx = $(this).parents("tr").attr("data-index")
    var oldVal = tableThreeDataB[curTrIdx]['quotaNum']
    tableThreeDataB[curTrIdx]['quotaNum'] = $(this).siblings("input").val()
    if (oldVal == tableThreeDataB[curTrIdx]['quotaNum']) return submitSuccess("修改成功")
    postTableThreeDataB(tab_rowData.id, $(this).siblings("input").val())
})







var index_oneB = {
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
}
var tableThreeDataB = [
    index_oneB
]
var tableThreeDataBAfterTotalList = [
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
function getEchoTableThreeB() {
    tableThreeDataB = [index_oneB]
    $http({
        url: "/gct-web/tableThreeNail/mechanicsList",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            tableThreeDataB = tableThreeDataB.concat(r.data.list || []).concat(tableThreeDataBAfterTotalList)
            proDataThreeB = r.data.budgetProject || {}
            tableThreeDataB = tableThreeDataB.length > 3 ? tableThreeDataB : []
            showTableThreeB()
        }
    })
}
function postTableThreeDataB(id, num) {
    $http({
        url: "/gct-web/tableThreeNail/mechanicsUpdate",
        data: {
            budgetId: budgetId,            //概预算项目ID
            budgetMechanicsId: id,
            num: num
        },
        success: function (r) {
            if (!r.data) return false
            submitSuccess("修改成功")
            showTableThreeB()
        }
    })
}