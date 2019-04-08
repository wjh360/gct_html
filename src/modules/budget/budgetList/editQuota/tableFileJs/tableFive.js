//表五-------------------------------------------------------------------------------------------------------------------------------
var fiveTabObj;

var nailRate = 0;

function getEchoTableFive() {
    $http({
        url: "/gct-web/tableThreeNail/tableFive",
        data: {
            budgetId: budgetId,
        },
        success: function (r) {
            initTableFiveData(r.data)

        }
    })
}


// var tableFiveData = []


function initTableFiveData(data) {
    var obj = data.budgetProjectFive || {}
    nailRate = data.nailRate || 0
    fiveTabObj = [
        {
            no: 'Ⅰ',
            name: "Ⅱ",
            attr: "Ⅲ",
            price: "Ⅳ",
            price_B: "Ⅴ",
            all: "Ⅵ",
            remark_val: "Ⅶ",
        },
        {
            name: '建设用地及综合赔补费',
            attr: '',
            pirce: '',
            t_name: 'landSubtractTax',
            t_name2: 'landAddTax',
            t_name3: 'landContainTax',
            remark: 'landRemark'
        },
        {
            name: '项目建设管理费',
            attr: '',
            remark: 'manageRemark',
            flag: '3'
        },
        {
            name: '可行性研究费',
            remark: 'researchRemark',
            flag: '4'
        },
        {
            name: '研究试验费',
            remark: 'testRemark',
            flag: '5'
        },
        {
            name: '勘察设计费',
            remark: 'designRemark',
            flag: '6'
        },
        {
            name: '环境影响评价费',
            remark: 'efectRemark',
            flag: '7'
        },
        {
            name: '建设工程监理费',
            remark: 'supervisorRemark',
            flag: '8'
        },
        {
            name: '安全生产费',
            attr: '建筑安装工程费×' + data.safe + "%",
            remark: 'safeRemark',
            flag: '9',
            t_name: 'safeSubtractTax',
            t_name2: 'safeAddTax',
            t_name3: 'safeContainTax'
        },
        {
            name: '引进技术及引进设备其他费',
            remark: 'importRemark',
            flag: '10'
        },
        {
            name: '工程保险费',
            remark: 'secureRemark',
            flag: '11'
        },
        {
            name: '工程招标代理费',
            remark: 'inviteRemark',
            flag: '12'
        },
        {
            name: '专利及专利技术使用费',
            remark: 'patentRemark',
            flag: '13'
        },
        {
            name: '其他费用',
            remark: 'otherRemark',
            flag: '14'
        },
        {
            no: '总计',
            t_name: 'totalSubtractTax',
            t_name2: 'totalAddTax',
            t_name3: 'totalContainTax'
        },
        {
            name: '生产准备及开办费（运营费）',
            remark: 'produceRemark',
            flag: '15'
        }
    ]

    $.each(fiveTabObj, function (index, eleVal) {
        if (eleVal['t_name']) {
            eleVal['price'] = obj[eleVal['t_name']]
            eleVal['price_B'] = obj[eleVal['t_name2']]
            eleVal['all'] = obj[eleVal['t_name3']]
        }
        eleVal['remark_val'] = obj[eleVal['remark']]
    })
    initTable('tableFiveTable', fiveTabObj, tableFiveColumns)
    $("#tableFiveTable tbody tr").each(function (index, ele) {
        if ($(ele).find('.tableFiveTableOther').length) {
            $('#tableFiveTable').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: 'no', colspan: 3, rowspan: 1 });
            $(ele).addClass("footerActive")
        } else $(ele).find('td').show()
    })
}

$("body").on("click", "#tableFiveTable .confirmTablePn", function () {
    // var oldVal = fiveTabObj[curTrIdx]['price']
    var curTrIdx = $(this).parents("tr").attr("data-index")

    var typeStatus = $(this).attr("index")
    var oldVal;

    if (!tab_rowData.flag) {
        if (typeStatus == 1) {  //更改除税价
            oldVal = fiveTabObj[curTrIdx]['price']
            var valAttrIpt = $(this).siblings("input").val()
            if (oldVal == valAttrIpt) return submitSuccess("操作成功")
            fiveTabObj[curTrIdx]['price'] = valAttrIpt
            fiveTabObj[curTrIdx]['price_B'] = parseFloat(valAttrIpt * nailRate / 100 || 0).toFixed(2)
            fiveTabObj[curTrIdx]['all'] = (parseFloat(valAttrIpt) + parseFloat(fiveTabObj[curTrIdx]['price_B']) || 0).toFixed(2)
            fiveTabObj[14]['price'] = (parseFloat(valAttrIpt) + parseFloat(fiveTabObj[8]['price']) || 0).toFixed(2)
            fiveTabObj[14]['price_B'] = (parseFloat(fiveTabObj[curTrIdx]['price_B']) + parseFloat(fiveTabObj[8]['price_B']) || 0).toFixed(2)
            fiveTabObj[14]['all'] = (parseFloat(fiveTabObj[curTrIdx]['all']) + parseFloat(fiveTabObj[14]['all']) || 0).toFixed(2)
            initTable('tableFiveTable', fiveTabObj, tableFiveColumns)
            postFiveTab({
                landSubtractTax: valAttrIpt,
                flag: 1
            })

        } else {
            oldVal = fiveTabObj[curTrIdx]['remark_val']
            var valAttrIpt = $(this).siblings("input").val()
            if (oldVal == valAttrIpt) return submitSuccess("操作成功")
            fiveTabObj[curTrIdx]['remark_val'] = valAttrIpt
            postFiveTab({
                landRemark: valAttrIpt,
                flag: 2
            })
        }
    } else {
        oldVal = fiveTabObj[curTrIdx]['remark_val']
        var valAttrIpt = $(this).siblings("input").val()
        if (oldVal == valAttrIpt) return submitSuccess("操作成功")
        fiveTabObj[curTrIdx]['remark_val'] = valAttrIpt
        var data = {
            flag: tab_rowData.flag
        }
        data[tab_rowData['remark']] = valAttrIpt
        postFiveTab(data)
    }
})


function postFiveTab(data) {
    data.budgetId = budgetId
    $http({
        url: "/gct-web/tableThreeNail/tableFiveUpdate",
        data: data,
        success: function (r) {
            submitSuccess('操作成功')
        }
    })
}