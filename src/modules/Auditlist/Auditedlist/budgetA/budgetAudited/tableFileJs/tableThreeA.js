//表三甲-------------------------------------------------------------------------------------------------------------------------------
var delThreeTableAList = [] //删除数据集合
var sumTrue = true;         //当前项目是否提交
var projectType; // 项目类型  （ 1线路 2设备）* 需要计算    3管道 
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
var tableThreeData = []
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
var tableThreeDataSpecialAreaFee_m = ""     //特殊地区施工增加费_ 技工系数
var tableThreeDataSpecialAreaFee_g = ""     //特殊地区施工增加费_ 普工系数
var proDataThree = {}       //回显回来的项目数据
var buildTypeObj = {
    3: "demolishArtificial",    //拆除人工工日系数
    4: "warehousingRtificial", //入库拆除人工工日系数
    5: "noRtificial"           //不入库人工工日系数
}
// 显示表格表三甲
function showTableThreeA() {
    tableThreeData = tableThreeData.concat(tableThreeDataAfterTotalList)
    if (tableThreeData.length <= 6) tableThreeData = []
    // jisuanAllTotal()
    initTable('tableThreeTableA', tableThreeData, tableThreeColumnsAs)
    // 表格内编辑数量 更改整个数据结构 
    $("#tableThreeTableA .editNum").bind("blur", function (e) {
        var curTrIdx = $(this).parents("tr").attr("data-index")
        var obj = tableThreeData[curTrIdx]
        obj["num"] = $(this).val()
        // log(obj["num"])
        if (obj.quotaProject && !obj['flag']) obj.flag = "2"
        showTableThreeA()
    })
    $("#tableThreeTableA tbody tr").each(function (index, ele) {
        if ($(ele).find('.tableThreeTableOther').length) {
            $('#tableThreeTableA').bootstrapTable('mergeCells', { index: $(ele).attr("data-index"), field: '', colspan: 8, rowspan: 1 });
            $(ele).addClass("footerActive")
        } else $(ele).find('td').show()
    })
    $(".downSelect").parents('td').css("padding", 0)
}


//回显表三甲list
function getEchoTableThreeA() {
    tableThreeData = [index_one]
    $http({
        url: "/gct-web/tableThreeNail/addEcho",
        data: {
            budgetId: budgetId            //概预算项目ID
        },
        success: function (r) {
            if (!r.data) return false
            delThreeTableAList = []
            proDataThree = r.data
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
                6: 'unfixed'
            }
            if (specialAreaObj[proData.specialArea]) {  //获取当前项目特殊地区施工增加费系数
                tableThreeDataSpecialAreaFee_m = specialAreaFee[specialAreaObj[proData.specialArea] + "Artisan"] || ""
                tableThreeDataSpecialAreaFee_g = specialAreaFee[specialAreaObj[proData.specialArea] + "General"] || ""
            }
            showTableThreeA()
        }
    })
}






//表三甲
var tableThreeColumnsAs = [
    [   //一级表头
        {
            title: '序号',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0 && !b['w']) return c
                else if (b.w) {
                    return '<span class="tableThreeTableOther">' + b.w + '</span>'
                }
                return b.o
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 100,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (a) return a
                else if (b.status == "newAdd")
                    return '<input placeholder="请输入定额编号" class="QuotaNo" value="">'
                else if (b.quotaProject) return b.quotaProject.no
            }
        }, {
            title: '项目名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b.quotaProject) return b.quotaProject.name
                return a
            }
        }, {
            title: '建设类型',
            field: 'buildType',
            colspan: 1,
            rowspan: 2,
            width: 100,
            "class": "selectD",
            formatter: function (a, b, c) {
                if (c > 0) {
                    var status = a || "1"
                    var statusObj = {
                        '1': "新建",
                        '2': "扩建",
                        '3': "拆除",
                        '4': "入库拆除",
                        '5': "不入库拆除"
                    }
                    return statusObj[status]
                } return a
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            rowspan: 2,
            width: 100,
        }, {
            title: '数量',
            field: 'num',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = a || ""
                    if (!window.quotaDetails) return '<input placeholder="请输入数量" class="editNum money" value="' + str + '">'
                    return str
                } return a
            }
        }, {
            title: '单位定额值（工日）',
            // field: 'f',
            align: "center",
            colspan: 2,
            rowspan: 1
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
            title: '技工',
            field: 'mechanic',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        // log(b['mechanicNum'], proDataThree['kuojian'], b.num)
                        if (b['mechanicNum']) return b['mechanicNum']
                        // var returnb;
                        // if (buildTypeObj[b.buildType]) {
                        //     if (b['quotaProject']) {
                        //         returnb = b['quotaProject']['mechanic'] * b['quotaProject'][buildTypeObj[b.buildType]] || 0
                        //     } else {
                        //         returnb = b['mechanicNum'] * b[buildTypeObj[b.buildType]] || 0
                        //     }
                        // } else if (b.buildType == 2 && proDataThree['kuojian']) {

                        //     if (b['quotaProject']) {
                        //         returnb = b['quotaProject']['mechanic'] * proDataThree['kuojian'] || 0
                        //     } else returnb = b['mechanicNum'] * proDataThree['kuojian'] || 0
                        // } else if (b.buildType == 1) {
                        //     returnb = b['mechanicNum'] || a
                        // }
                        // returnb = returnb.toFixed(2)
                        // if (returnb) return returnb
                        // else
                        return ""
                    }
                } return a
            }
        }, {
            title: '普工',
            field: 'generalWorker',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        if (b['generalNum']) return b['generalNum']
                        return ""
                        // var returnb;
                        // if (buildTypeObj[b.buildType]) {
                        //     if (b['quotaProject']) {
                        //         returnb = b['quotaProject']['generalWorker'] * b['quotaProject'][buildTypeObj[b.buildType]] || 0
                        //     } else {
                        //         returnb = b['generalNum'] * b[buildTypeObj[b.buildType]] || 0
                        //     }
                        // } else if (b.buildType == 2 && proDataThree['kuojian']) {

                        //     if (b['quotaProject']) {
                        //         returnb = b['quotaProject']['generalWorker'] * proDataThree['kuojian'] || 0
                        //     } else {
                        //         returnb = b['generalNum'] * proDataThree['kuojian'] || 0
                        //     }
                        // } else if (b.buildType == 1) {
                        //     returnb = b['generalNum'] || a
                        //     b['generalNum'] = returnb
                        // }
                        // if (returnb) return returnb.toFixed(2)
                        // else return ""
                    }
                } return a
            }
        }, {
            title: '技工',
            field: 'mechanicTotal',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        if (b['mechanicTotal']) return b['mechanicTotal']
                        return ""
                        // log(b)
                        // var returnb;
                        // if (buildTypeObj[b.buildType]) {
                        //     if (b['quotaProject']) {
                        //         returnb = (b['quotaProject']['mechanic'] * b['quotaProject'][buildTypeObj[b.buildType]]).toFixed(2) * b.num || ""
                        //     } else {
                        //         returnb = (b['mechanicNum'] * b[buildTypeObj[b.buildType]]).toFixed(2) * b.num || ""
                        //     }

                        // } else if (b.buildType == 2 && proDataThree['kuojian']) {
                        //     if (b['quotaProject']) {
                        //         returnb = (b['quotaProject']['mechanic'] * proDataThree['kuojian']).toFixed(2) * b.num || ""

                        //     } else {
                        //         returnb = (b['mechanicNum'] * proDataThree['kuojian']).toFixed(2) * b.num || ""

                        //     }
                        // } else if (b.buildType == 1) {
                        //     returnb = b.num * b['mechanicNum'] || ""
                        // }
                        // if (returnb) return returnb.toFixed(2)
                        // else return ""
                    }

                } return a
            }
        }, {
            title: '普工',
            field: 'generalTotal',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        if (b['generalTotal']) return b['generalTotal']
                        return ""
                        // var returnb;
                        // if (buildTypeObj[b.buildType]) {
                        //     if (b['quotaProject']) {
                        //         returnb = (b['quotaProject']['generalWorker'] * b['quotaProject'][buildTypeObj[b.buildType]]).toFixed(2) * b.num || ""
                        //     } else {
                        //         returnb = (b['generalNum'] * b[buildTypeObj[b.buildType]]).toFixed(2) * b.num || ""
                        //     }
                        // } else if (b.buildType == 2 && proDataThree['kuojian']) {
                        //     if (b['quotaProject']) {
                        //         returnb = b.num * (b['quotaProject']['generalWorker'] * proDataThree['kuojian']).toFixed(2) || ""

                        //     } else {
                        //         returnb = b.num * (b['generalNum'] * proDataThree['kuojian']).toFixed(2) || ""

                        //     }
                        // } else if (b.buildType == 1) {
                        //     returnb = b.num * b['generalNum'] || ""
                        // }
                        // if (returnb) return returnb.toFixed(2)
                        // else return ""
                    }
                } return a
            }
        }
    ]  //二级表头
]
