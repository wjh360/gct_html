var auditItem = 7001
var budgetId = storage("budgetId")
//tab 切换-----------------------------------------------------------------------------------------------------------------------------
$(function () {
    //  tab页面切换函数
    switchTab()
    // tab切换点击事件
    $("body").on("click", '.content .tabHeader .nav-tabs li a', function () {
        //如果当前是表三甲时  tab切换需要提示保存
        var _this = this
        if (nav_idx == 3 && tableThreeData.length && !window.quotaDetails && !sumTrue) {
            $.popConfirm({
                'title': '提示',
                'content': '是否保存当前操作的内容？',
                'confirm': function () {
                    return saveData(true, 1, _this)//需要调用请求保存函数后 调用 leaveTableThree(1, _this)
                },
                'error': function () {
                    leaveTableThree(1, _this)
                }
            })
            return false
        } else {
            nav_idx = $(_this).parents("li").attr("data_index")
            storage("nav_idx", nav_idx)
            if (window.clearTabThreeSto) clearTabThreeSto()
            sumTrue = true
            if (switchTab) switchTab()
        }
    })


})

function switchTab() {
    nav_idx = parseFloat(nav_idx)
    switch (nav_idx) {
        case 0:
            initDataDetails()   //项目详情
            break;
        case 1:
            getEchoTableOne()      // 表一
            break;
        case 2:
            getEchoTableTwo()      // 表二
            break;
        case 3:
            getEchoTableThreeA()    // 表三甲
            break;
        case 4:
            getEchoTableThreeB()   // 表三乙
            break;
        case 5:
            getEchoTableThreeC()   //表三丙
            break;
        case 6:
            getEchoTableFourA()    //表四甲
            break;
        case 7:
            getEchoTableFourB()    //表四乙
            break;
        case 8:
            getEchoTableFourB()    //表四甲
            break;
        case 9:
            getEchoTableFive()     //表五
            break;
        default:
            break;
    }
}



// 表四乙丙 添加材料

$("body").on("click", ".addMatter", function () {
    if (nav_idx == 7) storage('addMatterType', 1, 'materialAdd')
    else if (nav_idx == 8) storage('addMatterType', 2, 'materialAdd')
    storage('budgetId', budgetId, 'materialAdd')
    goNewPage("/modules/budget/budgetList/editQuota/materialAdd.html")
})

$("body").on("click",'.cancelBtnList',function () {
    $.popConfirm({
        content: '确定取消该操作吗?',
        confirm: function () {
            goNewPage("/modules/budget/budgetList.html")
        }
    })

})



$("body").on("click", ".editTablePn", function () {
    var txt = $(this).siblings("input").val()
    $(this).hide().siblings("input").show().removeAttr("readonly").val("").focus().val(txt).siblings(".confirmTablePn").css("display", 'inline-block')

    if (nav_idx == 2) {
        // var str = '<div class="titBox"></div>'
        $(this).siblings('.titBox').show()
    }
})

$("body").on("click", "table tr td .confirmTablePn", function () {
    $(this).hide().siblings("input").attr("readonly", "readonly").siblings(".editTablePn").css("display", 'inline-block')
    if (nav_idx == 2) {
        $(this).siblings('.titBox').hide()
    }
})





//表一---------------------------------------------------------------------------------------------------------------------------------

function getEchoTableOne() {
    $http({
        url: "/gct-web/tableThreeNail/tableOne",
        data: {
            budgetId: budgetId
        },
        success: function (r) {
            if (!r.data) return false
            var tableOneData = [
                {
                    no: "Ⅱ",
                    name: "Ⅲ",
                    no_txt: "Ⅳ",
                    needDevice: "Ⅴ",
                    noNeedDevice: "Ⅵ",
                    architectureSub: "Ⅶ",
                    no_txt2: "Ⅷ",
                    no_txt3: "Ⅸ",
                    architectureSubCount: "Ⅹ",
                    architectureAddCount: "Ⅺ",
                    architectureContainCount: "Ⅻ",
                    no_txt4: "XIII",
                    idx: "Ⅰ"
                },
                {
                    no: '表二',
                    name: '建筑安装工程费',
                    // small_scale: "",
                    needDevice: '',
                    noNeedDevice: '',
                    architectureSub: '',
                    architectureSubCount: '',
                    architectureAddCount: '',
                    architectureContainCount: '',
                },
                {
                    no: '表五',
                    name: '工程建设其他费',
                    otherSub: "",
                    otherAdd: "",
                    otherContain: ""
                },
                {
                    no: "合计",
                    sumSub: "",
                    sumAdd: "",
                    sumContain: "",
                    Other: true
                }, {
                    no: "施工费",
                    constructFee: "",
                    Other: true
                }, {
                    no: "合同结算价（折后）",
                    contractFee: "",
                    Other: true
                }
            ]

            $.each(tableOneData, function (index, eleVal) {
                for (var k in eleVal) {
                    if (!eleVal[k]) {
                        eleVal[k] = r.data[k]
                    }
                }
            })

            initTable('tableOneTable', tableOneData, tableOneColumns)
            $("#tableOneTable .tableOneTableOther").each(function (index, ele) {
                $('#tableOneTable').bootstrapTable('mergeCells', { index: $(ele).parents("tr").attr("data-index"), field: 'no', colspan: 8, rowspan: 1 });
                $(ele).parents("tr").addClass("footerActive")
            })
            $("#tableOneTable .tableOneTableOther").eq(1).parents("tr").attr("title", '（建筑安装工程费-材料费-规费）×折扣系数')
            $("#tableOneTable .tableOneTableOther").last().parents("tr").attr("title", '施工费+材料费（表四丙）+规费+（施工费+规费+材料费）×税率+安全生产费+表五其他有关费用（若发生）')
        }
    })
}




$("body").on("click", ".postBtn", function () {

    $.popConfirm({
        'content': '确定提交本项目概预算吗？',
        'confirm': function () {
            $http({
                url: "/gct-web/tableThreeNail/commit",
                data: {
                    budgetId: budgetId
                },
                success: function (r) {
                    submitSuccess('操作成功', function () {
                        storage('nav_idx', -1)
                        storage('nav_twos_idx', -1)
                        clearTabThreeSto()
                        // goBack()
                        goNewPage("./../budgetList.html")
                    })
                }
            })
        }
    })
})



