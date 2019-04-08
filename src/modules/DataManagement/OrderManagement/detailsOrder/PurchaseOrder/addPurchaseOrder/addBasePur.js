var orderId = storage("orderId")
var orderList = []  //订单list
var detailedList = []   //明细list
var detailsColBaseObj = {}  //明细基础data对象
var detailsColBaseObjBrforeTen = {} //前10 判定
var detailedCol = []
var colbaseData = []
var contractId;
var projectId;
var panduanIsEdit;
var constractIds = []
var ServiceFeeLen = 0
var SafetyFeeLen = 0
var objDis = []
//订单费用明细
var FeeCol = [
    {
        title: '序号',
        width: '50',
        align: 'center',
        formatter: function (a, b, c) {
            return '<span style="line-height: 28px;"> ' + (c + 1) + ' </span>'
        },
    }, {
        field: "orderGoods",
        title: '订单产品',
        width: '250',
        formatter: function (a, b) {
            var str = "", placeholder = ""
            if (b['type'] > 1) str = "readonly"
            else placeholder = "请输入施工服务费"
            return '<input placeholder="' + placeholder + '" style="padding-left:5px; width:230px;" ' + str + ' maxlength="50" class="inputOrgan name" type="text" value="' + a + '">'
        },
    }, {
        field: "orderUnit",
        title: '单位',
        width: '100',
        formatter: function (a) {
            return '<input style="padding-left:5px; width:90px;" maxlength="50" class="inputOrgan name1" type="text" value="' + a + '">'
        }
    }, {
        field: "preTax",
        title: '税前金额（元）',
        width: '100',
        formatter: function (a, b) {
            a = !isNaN(parseFloat(b['preTax'])) ? b['preTax'] : ""
            // a = isNaN(parseFloat(a))
            return '<input style="padding-left:5px; width:90px;" maxlength="13" class="inputOrgan money name2" type="text" value="' + a + '">'
        }
    }, {
        field: "taxRate",
        title: '税率（％）',
        width: '100',
        formatter: function (a) {
            return '<input style="padding-left:5px; width:90px;" maxlength="5" class="inputOrgan smallBai name3" type="text" value="' + a + '">'
        }
    }, {
        field: "taxAmount",
        title: '税额（元）',
        width: '100',
        formatter: function (a) {
            return '<input style="padding-left:5px; width:90px;" maxlength="13" class="inputOrgan money name4" type="text" value="' + a + '">'
        }
    }, {
        field: "afterTax",
        title: '税后金额（元）',
        width: '100',
        formatter: function (a) {
            return '<input style="padding-left:5px; width:90px;" maxlength="13" class="inputOrgan money name5 " type="text" value="' + a + '">'
        }
    }, {
        field: "misAddr",
        title: 'MIS分配地点',
        width: '250',
        formatter: function (a) {
            return '<input style="padding-left:5px; width:230px;"  maxlength="50"  class="inputOrgan  name6" type="text" value="' + a + '">'
        }
    }, {
        field: "",
        title: '操作',
        width: '50',
        formatter: function (a) {
            return '<span class="delete_mater m_col" ></span>'
        }
    }
]
//数字失去焦点事件
$("body").on('keyup change', '.inputSTab', function (event) {
    var isSmall = $(this).attr('data_index')
    var str = "9999999999"
    if (isSmall == 1) {
        str = str.slice(0, $(this).attr('data_intact')) + '.99'
    } else {
        str = str.slice(0, $(this).attr('data_intact'))
    }
    var oldTxt = $(this).val() ? $(this).val() : ""
    var reg = oldTxt.match(/\d+\.?\d{0,2}/);
    var txt = '';
    if (reg != null) txt = reg[0];
    if (txt >= str) txt = str
    $(this).val(txt);
});
//文件导入
var X = XLS;
var exlDataObj = [];
function sendfile(obj) {
    var output = "";
    var f = obj.files[0];
    var reader = new FileReader();
    // var name = f.name;
    reader.onload = function (e) {
        var data = e.target.result;
        var arr = fixdata(data);
        var wb = X.read(btoa(arr), { type: 'base64' });
        output = process_wb(wb, "json");
        var exlData = JSON.parse(output);
        for (var i in exlData) {
            exlDataObj = exlData[i]
        }
        var oneFirst = exlDataObj[0]
        if (oneFirst) {
            for (var i = 0; i < colbaseData.length; i++) {
                var eleVal = colbaseData[i]
                // log(objDis[eleVal['title']],eleVal['title'])
                if (objDis.indexOf(eleVal['title']) == -1 && i < 10) {
                    $(obj).val("")
                    return $.popInfo(eleVal['title'] + "格式错误，请重新导入！")
                }
            }
            var newArr = []
            var isError;
            $.each(exlDataObj, function (index, val) {
                var newAObj = {
                    flag: 1
                }
                $.each(colbaseData, function (k, e) {
                    //e.type // 1 文本 2  数字 3 日期 4  时间
                    if (e.type == 1) {
                        if (val[e['title']] && val[e['title']].length && val[e['title']].length > e.length) {
                            isError = true
                            return $.popInfo(e['title'] + '文本长度超出范围')
                        }
                    } else if (e.type == 2) {
                        var isSmall = e.small
                        var str = "9999999999"
                        if (isSmall == 1) {
                            str = str.slice(0, e.intact) + '.99'
                        } else {
                            str = str.slice(0, e.intact)
                        }
                        if (val[e['title']] && isNaN(val[e['title']]) || val[e['title']] > str) {
                            isError = true
                            return $.popInfo(e['title'] + '数字大小超出范围')
                        }
                    } else if (e.type == 3) {
                        if (!IsDate(val[e['title']])) {
                            isError = true
                            return $.popInfo(e['title'] + '格式错误')
                        }
                    } else if (e.type == 4) {
                        if (!isTime(val[e['title']])) {
                            isError = true
                            return $.popInfo(e['title'] + '格式错误')
                        }
                    }
                    if (e['field']) newAObj[e['field']] = val[e['title']]
                });
                newArr.push(newAObj)
            });
            if (isError) return $(obj).val("")
            $(obj).val("")
            objDis = []
            detailedList = detailedList.concat(newArr)
            initDataSort()
        }
    };
    reader.readAsArrayBuffer(f);
}
function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}
function fixdata(data) {
    var o = "",
        l = 0,
        w = 10240;
    for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(null, new Uint8Array(data));
    return o;
}
function process_wb(wb, type) {
    var output = "";
    switch (type) {
        case "json":
            // log(wb, wb['Strings'])
            $.each(wb['Strings'], function (index, eleVal) {
            })
            var str = wb.Sheets['Sheet1'] || wb.Sheets[wb.sheetName[0]] || {}
            if (str) {
                for (var i in str) {
                    i = i + ""
                    if (i == (i.slice(0, i.length - 1) + '1') && i.replace(/[^0-9]/ig, "") == '1') {
                        objDis.push(str[i]['w'])
                    }
                }
            }
            output = JSON.stringify(to_json(wb), 2, 2);
            break;
        case "form":
            output = to_formulae(wb);
            break;
        default:
            output = to_csv(wb);
    }
    return output;
}
//判断是否是有效日期
function IsDate(mystring) {
    if (!mystring) return true
    if (mystring.search(/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29))$/) == -1) {
        return false
    }
    return true
}
//判断是否是有效时间
function isTime(str) {
    if (!str) return true
    var a = str.match(/^(\d{1,2})(:|：)?(\d{1,2})\2(\d{1,2})$/);
    if (a == null) return false
    if (a[1] > 24 || a[3] > 60 || a[4] > 60) { return false }
    return true;
}
//计算税后金额函数
function jiSuanAmount() {
    var serviceFee = 0,
        prodUctFee = 0,
        guiFees = 0
    $.each(orderList, function (index, eleVal) {
        if (eleVal['type'] == 1) {  //服务费
            serviceFee += parseFloat(parseFloat(eleVal['afterTax']).toFixed("2"))
        } else if (eleVal['type'] == 2) {
            prodUctFee += parseFloat(parseFloat(eleVal['afterTax']).toFixed("2"))
        } else if (eleVal['type'] == 3) {
            guiFees += parseFloat(parseFloat(eleVal['afterTax']).toFixed("2"))
        }
    })
    $(".serviceFee").html((serviceFee || "0.00") + " 元")
    $(".prodUctFee").html((prodUctFee || "0.00") + " 元")
    $(".guiFees").html((guiFees || "0.00") + " 元")
}
//日期插件 更改日期 时间时 更改全局
function jedateClicks(val) {
    detailedList[tab_rowData_s['trIdx']][tab_rowData_s['field']] = val
    if (!tab_rowData['flag']) detailedList[tab_rowData_s['trIdx']]['flag'] = 2
}
//初始化施工清单明细tab
function initDataSort(data) {
    var colArr = []
    if (data) {
        detailedCol = [
            {
                title: '序号',
                width: '50',
                align: 'center',
                formatter: function (a, b, c) {
                    return '<span style="line-height: 28px;"> ' + (c + 1) + ' </span>'
                }
            }
        ]
        $.each(data, function (index, eleVal) {
            var attrObj = eleVal['fieldType'], colObj = {}
            colObj = {
                field: eleVal['dataName'],
                title: eleVal['propertyName'],
                type: attrObj['property'],
                length: attrObj['length'],
                intact: attrObj['intact'],
                small: attrObj['small'],
                formatter: function (a, b, c) {
                    //1文本 2数值 3日期 4时间
                    a = a || ""
                    if (attrObj['property'] == 1) {
                        return '<input maxlength="' + attrObj['length'] + '" class="inputOrgan" type="text" value="' + a + '">'
                    } else if (attrObj['property'] == 2) {
                        var maxlength = parseFloat(attrObj['intact']) + (attrObj['small'] == 1 ? 3 : 0)
                        return '<input data_intact="' + attrObj['intact'] + '"   style="width:90px;" maxlength="' +
                            maxlength + '" data_index="' + attrObj['small'] + '" class="inputOrgan inputSTab" type="text" value="' + a + '">'
                    } else if (attrObj['property'] == 3) {
                        return '<div class="jeinpbox f_l" style="width: 230px"><input type = "text" value="' + a +
                            '"  class="jeinput dateS" id = "tabJeiBox' + c + "_" + index + '" placeholder = "请选择日期" />' +
                            '<span class="jeinput_icons"></span>' +
                            '</div >'
                    } else if (attrObj['property'] == 4) {
                        return '<div class="jeinpbox f_l" style="width: 230px"><input type = "text"  value="' + a +
                            '" format="hh:mm:ss" class="jeinput dateS" id = "tabJeiBox' + c + "_" + index + '" placeholder = "请选择时间" />' +
                            '<span class="jeinput_icons"></span>' +
                            '</div >'
                    }
                }
            }
            if (detailsColBaseObj[eleVal['dataName']] == undefined) {
                detailsColBaseObj[eleVal['dataName']] = ""
                detailsColBaseObj[eleVal['dataName'] + '_isNeed'] = eleVal['isNeed']
                detailsColBaseObj[eleVal['dataName'] + '_Name'] = eleVal['propertyName']
                if (colArr.length < 10) {
                    detailsColBaseObjBrforeTen[eleVal['dataName']] = ""
                    detailsColBaseObjBrforeTen[eleVal['dataName'] + '_isNeed'] = eleVal['isNeed']
                    detailsColBaseObjBrforeTen[eleVal['dataName'] + '_Name'] = eleVal['propertyName']
                }
            }
            if (eleVal['isView'] == 1) {
                if (colArr.length < 10) colArr.push(colObj)
                colbaseData.push(colObj)
            }
        })
        colArr.push({
            field: "",
            title: '操作',
            width: '50',
            formatter: function (a) {
                return '<span class="delete_mater m_col" ></span>'
            }
        })
        $.each(colArr, function (index, val) {
            if (val) detailedCol.push(val)
        });
    }
    initTable('ConlistTable', detailedList, detailedCol)//施工清单明细表
    $("#ConlistTable input").not('.jeinput').blur(function () {
        var idx = $(this).parents('tr').attr("data-index")
        var field = detailedCol[$(this).parents('td').index()]['field']
        if (!tab_rowData['flag']) detailedList[idx]['flag'] = 2
        detailedList[idx][field] = $(this).val()
    })

}
//显示订单费用明细
function showTableFees(a, b) {
    if (a) {
        var addOrderBaseObj = {
            orderGoods: b || "",
            orderUnit: "",
            preTax: "",
            taxRate: "",
            taxAmount: "",
            afterTax: "",
            misAddr: "",
            type: a
        }
        orderList.push(addOrderBaseObj)
    }
    jiSuanAmount()
    initTable('FeeTable', orderList, FeeCol)
    $("#FeeTable input").blur(function () {
        var idx = $(this).parents('tr').attr("data-index")
        var field = FeeCol[$(this).parents('td').index()]['field']
        orderList[idx][field] = $(this).val()
        if (field == "afterTax") {  //税后金额 如果当前是税后金额  计算 统计
            jiSuanAmount()
        }
    })
}
//提交说明
var objMsg = {
    orderNo: "请填写采购订单编号",
    propertyId: "请选择订单属性",
    goodsUnit: "请填写订货单位",
    startDate: "",
    finishDate: "",
    testStart: "",
    testEnd: ""
}
var addOrderBaseObjMsg = {
    orderGoods_name: "订单产品",
    orderUnit_name: "单位",
    preTax_name: "税前金额",
    taxRate_name: "税率",
    taxAmount_name: "税额",
    afterTax_name: "税后金额"
}
//提交函数
function addPurchaseOrder() {
    var postData = {
        orderId: orderId,
        contractId: contractId,
        urls: delFileObjUrlList.join(),
        ids: delFileIdList.join(),
        files: JSON.stringify(orFileData['postFileBtn']),
        projectId: projectId,
        constractIds: constractIds.join()
    }
    if (panduanIsEdit) {
        objMsg['contractId'] = "请选择框架合同"
        objMsg['projectId'] = "请选择项目"
    }
    for (var k in objMsg) {
        postData[k] = $("." + k).val() || $('.' + k).attr("index")
        if (!postData[k] && objMsg[k]) return $.popInfo(objMsg[k])
    }
    var isError;
    var newOrderList = []
    var csIndexOd = ['preTax', 'taxRate', 'taxAmount', 'afterTax']
    $.each(orderList, function (index, val) {
        var newOrderObj = {}
        for (var k in val) {
            if (csIndexOd.indexOf(k) != -1 && val[k] <= 0 && addOrderBaseObjMsg[k + '_name']) {
                isError = true
                return $.popInfo('序号 ' + (index + 1) + " " + addOrderBaseObjMsg[k + '_name'] + " 不能为零")
            } else if (!val[k] && addOrderBaseObjMsg[k + '_name']) {
                isError = true
                return $.popInfo('序号 ' + (index + 1) + " " + addOrderBaseObjMsg[k + '_name'] + " 不能为空")
            } else {
                newOrderObj[k] = val[k]
            }
        }
        newOrderList.push(newOrderObj)
    });
    var postdetailedList = []
    $.each(detailedList, function (index, val) {
        var obj = {}
        for (var k in val) {
            if (!val[k] && detailsColBaseObjBrforeTen[k + '_isNeed'] == 1) {
                isError = true
                return $.popInfo('序号 ' + (index + 1) + detailsColBaseObjBrforeTen[k + '_Name'] + " 不能为空")
            }
            if (k.indexOf("_") == -1 && k != 'trIdx' && k != 'fileId') {
                obj[k] = val[k]
            }
        }
        if (val['flag']) {
            postdetailedList.push(obj)
        }
    });
    if (isError) return false
    postData.fees = JSON.stringify(newOrderList)
    if (!newOrderList.length) return $.popInfo('请添加安全生产费订单费用明细')
    if (ServiceFeeLen <= 0) return $.popInfo('施工服务费至少一条数据')
    if (SafetyFeeLen <= 0) return $.popInfo('安全生产费至少一条数据')
    if (postdetailedList.length) postData.constracts = JSON.stringify(postdetailedList)
    // if (!detailedList.length) return $.popInfo('请添加施工服务费订单费用明细')
    orFileData['postFileBtnEcho'] = orFileData['postFileBtnEcho'] || []
    if (!orFileData['postFileBtn'].length && !orFileData['postFileBtnEcho'].length) return $.popInfo('请上传合同附件')
    $http({
        url: '/gct-web/order/purchaseOrderAdd',
        data: postData,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}
//各类点击事件
$(function () {
    var browType = versionIE()
    if (browType > 0 && browType < 10) {
        $("#addImportFile").hide()
    }
    //框架合同下拉点击事件 回显项目list
    $("body").on("click", "#contractId li", function () {

        var id = $(this).attr("index")
        $http({
            url: "/gct-web/project/loadByContractId",
            data: {
                constractId: id
            },
            success: function (r) {
                if (r.data) {
                    contractId = id
                    getDownSelect("projectId", '请选择项目', r.data, 'id', 'projectName', ['projectCode'])
                    $(".projectCode").html("")
                }
            }
        })
    })
    //项目list点击事件回显 项目编号
    $("body").on("click", "#projectId li", function () {
        projectId = $(this).attr("index")
        $(".projectCode").html($(this).attr("morepar_projectCode") || $(this).attr("morepar_projectcode"))
    })
    //提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                addPurchaseOrder()
            }
        })
    })
    //删除施工清单明细
    $("body").on("click", '#ConlistTable .delete_mater', function () {
        var idx = $(this).parents("tr").attr("data-index")
        if (tab_rowData['ID']) constractIds.push(tab_rowData['ID'])
        detailedList.splice(idx, 1)
        initDataSort()
    })
    // 添加施工明细
    $("body").on("click", '.addconlistBtn', function () {
        detailsColBaseObj.flag = 1
        detailedList.push(detailsColBaseObj)
        initDataSort()
    })
    //点击删除订单费用明细
    $("body").on("click", '#FeeTable .delete_mater', function () {
        var idx = tab_rowData_s['trIdx']
        if (tab_rowData['type'] == 1) ServiceFeeLen--;
        if (tab_rowData['type'] == 2) SafetyFeeLen--;
        orderList.splice(idx, 1)
        showTableFees()
    })
    //  表格添加事件
    //添加施工服务费
    $("body").on("click", '.addServiceFeeBtn', function () {
        ServiceFeeLen++;
        showTableFees(1)
    })
    //添加安全生产费
    $("body").on("click", '.addSafetyFeeBtn', function () {
        SafetyFeeLen++;
        showTableFees(2, "安全生产费")
    })
    //添加规费
    $("body").on("click", '.addFeeBtn', function () {
        showTableFees(3, "规费")
    })
})
