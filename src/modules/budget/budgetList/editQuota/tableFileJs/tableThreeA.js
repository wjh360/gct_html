//表三甲-------------------------------------------------------------------------------------------------------------------------------
var delThreeTableAList = [] //删除数据集合
var sumTrue = true;         //当前项目是否提交

var index_one = {
    no: "Ⅱ",
    name: "Ⅲ",
    buildType: "Ⅳ",
    meterageName: "Ⅴ",
    num: "Ⅵ",
    mechanic: "Ⅶ",
    generalWorker: "Ⅷ",
    mechanicTotal: "Ⅸ",
    generalTotal: "Ⅹ",
    o: "Ⅰ"
}

var tableThreeData = [index_one]
var tableThreeDataAfterTotalList = [
    {
        w: "合计",
        mechanicTotal: "",
        generalTotal: ""
    }, {
        w: "特殊地区施工增加费",
        special: "true",
        mechanicTotal: "",
        generalTotal: ""
    }, {
        w: "工程总工日在100工日以下增加15%（线路/管道）",
        LE: "100",
        mechanicTotal: "",
        generalTotal: ""
    }, {
        w: "工程总工日在100~250工日以内增加10%(线路/管道)",
        LE: "250",
        mechanicTotal: "",
        generalTotal: ""
    }, {
        w: "总计",
        amount: "true",
        mechanicTotal: "",
        generalTotal: ""
    }
]
var tableThreeDataSpecialAreaFee_m = storage('tableThreeDataSpecialAreaFee_m')     //特殊地区施工增加费_ 技工系数
var tableThreeDataSpecialAreaFee_g = storage('tableThreeDataSpecialAreaFee_g')     //特殊地区施工增加费_ 普工系数
var proDataThree = storage('proDataThree') || {}       //回显回来的项目数据
var projectType = proDataThree['projectType']; // 项目类型  （ 1线路 2设备）* 需要计算    3管道 
var buildTypeObj = {
    3: "demolishArtificial",    //拆除人工工日系数
    4: "warehousingRtificial", //入库拆除人工工日系数
    5: "noRtificial"           //不入库人工工日系数
}
// 显示表格表三甲
function showTableThreeA() {
    if (tableThreeData.length < 6 || !tableThreeData[tableThreeData.length - 1]['w'])
        tableThreeData = tableThreeData.concat(tableThreeDataAfterTotalList)
    if (tableThreeData.length <= 6) tableThreeData = []
    jisuanAllTotal()
    initTable('tableThreeTableA', tableThreeData, tableThreeColumnsA)
    // 表格内编辑数量 更改整个数据结构 
    $("#tableThreeTableA .editNum").bind("blur", function (e) {
        var curTrIdx = $(this).parents("tr").attr("data-index")
        var obj = tableThreeData[curTrIdx]
        obj["num"] = $(this).val()
        if (obj.quotaProject && !obj['flag']) obj.flag = "2"
        sumTrue = false
        showTableThreeA()
    })
    $("#tableThreeTableA tbody tr").each(function (index, ele) {
        if ($(ele).find('.tableThreeTableOther').length) {
            $('#tableThreeTableA').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 9, rowspan: 1 });
            $(ele).addClass("footerActive")
        } else $(ele).find('td').show()
    })
    $(".downSelect").parents('td').css("padding", 0)
    $(".QuotaNo").bind("blur", function () {
        var _this = this
        var val = $(_this).val()
        if (!val) return $.popInfo("请输入定额编号")
        $http({
            url: "/gct-web/tableThreeNail/quotaSearch",
            data: { no: val },
            success: function (r) {
                if (!r.data) return false
                if (r.data.length) {
                    var addData = {
                        no: "",
                        name: "",
                        buildType: "",
                        meterageName: "",
                        num: "",
                        mechanic: "",
                        generalWorker: "",
                        mechanicTotal: "",
                        generalTotal: "",
                        status: "newAdd"
                    }
                    var newData = r.data[0] || {}
                    newData.status = "newAdd"
                    newData.mechanicTotal = ""
                    newData.generalTotal = ""
                    newData.flag = "1"
                    newData.mechanicNum = newData.mechanic
                    newData.generalNum = newData.generalWorker
                    newData.buildType = $(_this).parents("td").siblings(".selectD").find(".downSet").attr("index")
                    tableThreeData.splice(tableThreeData.length - 6, 1, newData)
                    tableThreeData.splice(tableThreeData.length - 5, 0, addData)
                    // log(newData)
                    showTableThreeA()
                } else {
                    $.popInfo("此定额项目编号不存在，请重新输入！")
                }
            }
        })
    })
}
//手动添加定额项目
$("body").on("click", ".handAddQuota", function () {
    var addData = {
        no: "",
        name: "",
        buildType: "",
        meterageName: "",
        num: "",
        mechanic: "",
        generalWorker: "",
        mechanicTotal: "",
        generalTotal: "",
        status: "newAdd"
    }
    if (!tableThreeData.length) {
        tableThreeData = [index_one]
        tableThreeData.push(addData)
    } else tableThreeData.splice(tableThreeData.length - 5, 0, addData)
    sumTrue = false
    showTableThreeA()
})
//删除一行
$("body").on("click", ".delTablePn", function () {
    var curTrIdx = $(this).parents("tr").attr("data-index")
    tableThreeData[curTrIdx].flag = '3'
    if (tableThreeData[curTrIdx]['quotaProject']) delThreeTableAList.push(tableThreeData[curTrIdx])
    tableThreeData.splice(curTrIdx, 1)
    if (tableThreeData.length <= 6) {
        $.each(tableThreeData, function (index, eleVal) {
            if (eleVal['w']) {
                eleVal["mechanicTotal"] = ""
                eleVal['generalTotal'] = ""
            }
        })
    }
    sumTrue = false
    showTableThreeA()
})
//表格内下拉列表 选择事件
$("body").on("click", ".selectD ul li", function () {
    var curTrIdx = $(this).parents("tr").attr("data-index")
    tableThreeData[curTrIdx]['buildType'] = $(this).attr("index")
    if (tableThreeData[curTrIdx].quotaProject && !tableThreeData[curTrIdx]['flag']) tableThreeData[curTrIdx]['flag'] = 2
    sumTrue = false
    showTableThreeA()
})
//回显表三甲list
function getEchoTableThreeA() {
    var selectedQuotaList = storage('selectedQuotaList') || []
    tableThreeData = [index_one]
    tableThreeData = tableThreeData.concat(selectedQuotaList)
    var list = storage('tableThreeData') || []
    tableThreeData = tableThreeData.concat(list)
    if (selectedQuotaList.length || list.length) {
        sumTrue = false
        showTableThreeA()
        return false
    }

    $http({
        url: "/gct-web/tableThreeNail/addEcho",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            delThreeTableAList = []
            proDataThree = r.data
            projectType = proDataThree.projectType
            var threeNail = r.data.threeNail || {}
            var arr = ['Sum', 'Special', 'One', 'Two', 'Total']
            // 0/合计 1/特殊地区施工增加费 2/工程总工日在100工日以下增加15%（线路/管道） 3/工程总工日在100~250工日以内增加10%(线路/管道) 4/总计
            $.each(tableThreeDataAfterTotalList, function (index, eleVal) {
                eleVal['mechanicTotal'] = threeNail['mechanic' + arr[index]] || ""      //技工
                eleVal['generalTotal'] = threeNail['general' + arr[index]] || ""        //技工
            })
            tableThreeData = tableThreeData.concat(proDataThree.quotaList || [])
            var proData = r.data.budgetProject || {}
            var specialAreaFee = r.data.specialAreaFee || {}
            var specialAreaObj = {
                1: 'two',
                2: 'three',
                3: 'four',
                4: 'primeval',
                5: 'primeval',
                6: 'unfixed'
            }
            if (specialAreaObj[proData.specialArea]) {  //获取当前项目特殊地区施工增加费系数
                // log(specialAreaObj[proData.specialArea])
                tableThreeDataSpecialAreaFee_m = specialAreaFee[specialAreaObj[proData.specialArea] + "Artisan"] || ""
                tableThreeDataSpecialAreaFee_g = specialAreaFee[specialAreaObj[proData.specialArea] + "General"] || ""
            }
            showTableThreeA()
        }
    })
}
// 保存事件
$("body").on("click", "#three_Btn_Style .saveBtn", function () {

    $.popConfirm({
        'title': '',
        'content': '是否保存当前操作的内容？',
        'confirm': function () {
            saveData()
        }
    })
})
//计算//计算各种合计值
function jisuanAllTotal() {
    var firstArtisanTotal = 0   //技工合计
    var firstGeneralTotal = 0   //普工合计
    var allArtisanAmount = 0    //技工总计
    var allGeneralAmount = 0    //普工总计
    $.each(tableThreeData, function (index, eleVal) {
        if (!eleVal['w'] && index > 0) {
            if (eleVal.buildType) {
                if (eleVal['quotaProject']) {
                    var onrPriceA = eleVal['quotaProject']['mechanic']
                    var onePriceB = eleVal['quotaProject']['generalWorker']
                } else {
                    var onrPriceA = eleVal['mechanicNum'] || eleVal['mechanic']
                    var onePriceB = eleVal['generalNum'] || eleVal['generalWorker']
                }
                if (buildTypeObj[eleVal.buildType]) {
                    var typeNatil = eleVal['quotaProject'] ? eleVal['quotaProject'][buildTypeObj[eleVal.buildType]] : eleVal[buildTypeObj[eleVal.buildType]]
                    eleVal['mechanicTotal'] = parseFloat(accMul(eleVal['num'], accMul(onrPriceA, typeNatil)) || 0).toFixed(2)
                    eleVal['generalTotal'] = parseFloat(accMul(eleVal['num'], accMul(onePriceB, typeNatil)) || 0).toFixed(2)
                } else if (eleVal.buildType == 2 && proDataThree['kuojian']) {
                    eleVal['mechanicTotal'] = (accMul(eleVal['num'], accMul(onrPriceA, proDataThree['kuojian'])) || 0).toFixed(2)
                    eleVal['generalTotal'] = (accMul(accMul(proDataThree['kuojian'], onePriceB), eleVal['num']) || 0).toFixed(2)
                } else if (eleVal.buildType == 1) {
                    eleVal['mechanicTotal'] = parseFloat(accMul(eleVal['num'], onrPriceA) || 0).toFixed(2)            //单行 技工合计
                    eleVal['generalTotal'] = parseFloat(accMul(eleVal['num'], onePriceB) || 0).toFixed(2)            //单行 普工合计
                }
            } else {
                eleVal['mechanicTotal'] = ""             //单行 技工合计
                eleVal['generalTotal'] = ""             //单行 普工合计
            }
            // log(eleVal['generalTotal'],index)
            firstArtisanTotal += parseFloat(eleVal['mechanicTotal'] || 0)
            firstGeneralTotal += parseFloat(eleVal['generalTotal'] || 0)
        }
        else if (eleVal['w'] == "合计") {
            // log(eleVal['generalTotal'])
            eleVal['mechanicTotal'] = firstArtisanTotal.toFixed(2)
            eleVal['generalTotal'] = firstGeneralTotal.toFixed(2)
        } else if (eleVal['special'] === "true") {
            firstArtisanTotal = parseFloat(firstArtisanTotal.toFixed(2))
            firstGeneralTotal = parseFloat(firstGeneralTotal.toFixed(2))

            eleVal['mechanicTotal'] = tableThreeDataSpecialAreaFee_m ?
                (((accMul(firstArtisanTotal, tableThreeDataSpecialAreaFee_m) / 100).toFixed(2) - firstArtisanTotal) || 0).toFixed(2) : ""            //特殊地区 技工
            // log((firstArtisanTotal * tableThreeDataSpecialAreaFee_m / 100).toFixed(2), firstArtisanTotal)
            eleVal['generalTotal'] = tableThreeDataSpecialAreaFee_g ?
                (((accMul(firstGeneralTotal, tableThreeDataSpecialAreaFee_g) / 100).toFixed(2) - firstGeneralTotal) || 0).toFixed(2) : ""            //单行 普工合计
        } else if (eleVal['LE'] === '100') {  //工程总工日在100工日以下增加15%（线路/管道）
            var allDay = firstArtisanTotal + firstGeneralTotal
            if (allDay <= 100 && (projectType == 3 || projectType == 1)) {
                // log(firstGeneralTotal)
                eleVal['mechanicTotal'] = accMul(firstArtisanTotal, 15) / 100 > 0 ? (accMul(firstArtisanTotal, 15) / 100).toFixed(2) : ""
                eleVal['generalTotal'] = accMul(firstGeneralTotal, 15) / 100 > 0 ? (accMul(firstGeneralTotal, 15) / 100).toFixed(2) : ""
            } else {
                eleVal['mechanicTotal'] = ""
                eleVal['generalTotal'] = ""
            }
        } else if (eleVal['LE'] === '250') { //工程总工日在100~250工日以内增加10%(线路/管道)
            var allDay = firstArtisanTotal + firstGeneralTotal

            if (allDay > 100 && allDay <= 250 && (projectType == 3 || projectType == 1)) {
                eleVal['mechanicTotal'] = accMul(firstArtisanTotal, 10) / 100 > 0 ? (accMul(firstArtisanTotal, 10) / 100).toFixed(2) : ""
                eleVal['generalTotal'] = accMul(firstGeneralTotal, 10) / 100 > 0 ? (accMul(firstGeneralTotal, 10) / 100).toFixed(2) : ""
            } else {
                eleVal['mechanicTotal'] = ""
                eleVal['generalTotal'] = ""
            }
        }
        if (eleVal['w'] && !eleVal['amount'] && index > 0) {
            allArtisanAmount += parseFloat(eleVal['mechanicTotal'] || 0)
            allGeneralAmount += parseFloat(eleVal['generalTotal'] || 0)
        } else if (eleVal['w'] && eleVal['amount']) {
            eleVal['mechanicTotal'] = allArtisanAmount.toFixed(2)
            eleVal['generalTotal'] = allGeneralAmount.toFixed(2)

        }
    })
}
//保存事件函数
function saveData(isLeave, status, hrefs) {
    var postArr = []
    var isError = 0

    $.each(tableThreeData, function (index, eleVal) {
        if (index > 0 && index < tableThreeData.length - 5) {
            if (eleVal.quotaId) eleVal.BjQuotaId = eleVal.quotaId
            else eleVal.BjQuotaId = eleVal.id
            if (eleVal.id && eleVal.flag) {
                var eleObj = {
                    buildType: eleVal.buildType,       //建设类型 1新建2扩建3拆除4入库拆除5不入库拆除
                    num: eleVal.num,               //数量
                    flag: eleVal.flag,            //1添加  2是编辑  3删除
                }
                if (!eleObj.num) {                  //数量必填
                    isError = 1
                    return $.popInfo((eleVal.name || eleVal['quotaProject']['name']) + "定额项目数量未填写，请确认")
                }
                if (eleVal.flag != 1) eleObj.id = eleVal.id //概预算定额项目ID     //编辑删除时必传 
                else eleObj.quotaId = eleVal.id        //定额项目ID   //添加时必传
                postArr.push(eleObj)
            }
        }
    })
    if (isError) return false;
    for (var i = 1; i < tableThreeData.length - 5; i++) {
        var eleVal = tableThreeData[i]
        for (var k = i + 1; k < tableThreeData.length - 5; k++) {
            var objE = tableThreeData[k]
            if (eleVal.BjQuotaId == objE.BjQuotaId && eleVal.buildType == objE.buildType) {
                return $.popInfo((eleVal.name || eleVal['quotaProject']['name']) + "定额项目重复，请删除一条!")
            }
        }
    }
    // 删除的数据
    delThreeTableAList = delThreeTableAList.concat(storage('delThreeTableAList') || [])
    $.each(delThreeTableAList, function (index, eleVal) {
        var eleObj = {
            buildType: eleVal.buildType,       //建设类型 1新建2扩建3拆除4入库拆除5不入库拆除
            num: eleVal.num,               //数量
            flag: eleVal.flag,            //1添加  2是编辑  3删除
            id: eleVal.id            //概预算定额项目ID     //编辑删除时必传 
        }
        postArr.push(eleObj)
    })
    if (postArr.length) {
        $http({
            url: "/gct-web/tableThreeNail/quotaAdd",
            data: {
                budgetId: budgetId,
                quotaStr: JSON.stringify(postArr)
            },
            success: function (r) {
                submitSuccess("操作成功", function () {
                    delThreeTableAList = []
                    if (isLeave) leaveTableThree(status, hrefs)
                    else {
                        for (var i = 1; i < tableThreeData.length - 5; i++) {
                            var eleVal = tableThreeData[i]
                            if (eleVal['flag']) eleVal['flag'] = null
                        }
                        sumTrue = true; //当前已提交成功
                    }
                    clearTabThreeSto()
                })

            }
        })
    } else {
        submitSuccess("操作成功")
        if (isLeave) leaveTableThree(status, hrefs)
    }
}
//当前页面离开表三甲时函数
function leaveTableThree(status, hrefs) {
    tableThreeData = tableThreeData.splice(0, 1)    //数据清空
    delThreeTableAList = []
    clearTabThreeSto()
    sumTrue = true
    if (status == 1) {  //tab 切换
        var _this = hrefs
        nav_idx = $(_this).parents("li").attr("data_index")
        $("li.active").removeClass("active")
        $(_this).parents("li").addClass("active")
        $(".tab-pane.fade.in.active").removeClass("in").removeClass("active").hide()
        $($(_this).attr("href")).addClass("in").addClass("active").show()
        storage("nav_idx", nav_idx)
        if (window.switchTab) window.switchTab()
    } else if (status == 2) {   //返回上页
        storage('nav_idx', -1)
        storage('nav_twos_idx', -1)
        goNewPage(hrefs)
    } else if (status == 3) {   //添加
        goNewPage(hrefs)
    }
}
//如果当前是表三甲时  离开页面需要提示保存
$("body").on("click", ".breadCrumdBtn span", function () {
    var hrefs = $(this).parents("li").attr("data_href")
    if (nav_idx == 3 && tableThreeData.length && !sumTrue) {
        $.popConfirm({
            'title': '提示',
            'content': '是否保存当前操作的内容？',
            'confirm': function () {
                saveData(true, 2, hrefs)//需要调用请求保存函数后 调用 leaveTableThree(2, hrefs)
            },
            'error': function () {
                leaveTableThree(2, hrefs)
            }
        })
        return false
    }
})
//如果当前是表三甲时  自动添加定额页面需要提示保存
$("body").on("click", ".checkAddQuota", function () {
    var hrefs = './editQuota/quotaItemAdd.html'
    if (nav_idx == 3 && tableThreeData.length) {
        var arr = []
        $.each(tableThreeData, function (index, eleVal) {
            if (index > 0) arr.push(eleVal)
        })
        storage('tableThreeData', arr)
    }
    storage('proDataThree', proDataThree)
    storage('delThreeTableAList', delThreeTableAList)
    storage('tableThreeDataSpecialAreaFee_m', tableThreeDataSpecialAreaFee_m)
    storage('tableThreeDataSpecialAreaFee_g', tableThreeDataSpecialAreaFee_g)
    goNewPage(hrefs)

})


function clearTabThreeSto() {
    storage('selectedQuotaList', -1)
    storage('tableThreeData', -1)
    storage('proDataThree', -1)
    storage('delThreeTableAList', -1)
}