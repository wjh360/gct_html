var vel = 'name';
var auditItem = 5001;
$(function () {
    fileUploader({
        btn: 'postFileBtn',
        data: [],
        tabId: 'workstartReports',
        col: fileCol,
        other: {
            fileType: {
                title: 'fileType',
                extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
            }
        }
    })
    initTable('butMaterailTable', [], matterCol)
    initData()
    //    点击添加物料
    $("body").on("click", '.addMaterBtn', function () {
        var str = '<tr class="materTr">' +
            ' <td style="width: 250px; "><input maxlength="100" class="inputOrgan matterName" type="text"></td> ' +
            '<td style="width: 100px; "><input maxlength="50" class="inputOrgan matterSpec" type="text"></td>' +
            '<td style="width: 100px; "><input maxlength="50" class="inputOrgan matterUnit" type="text"></td> ' +
            '<td style="width: 150px; "><input maxlength="13" class="inputOrgan money matterPrice" type="text"></td> ' +
            '<td style="width: 150px;"><input  maxlength="13"  class="inputOrgan money matterNum" type="text"></td> ' +
            '<td style="width: 250px;" class="matterSumPrice" ></td> ' +
            '<td style="width: 100px;">乙供</td> ' +
            '<td style="width: 100px;">辅材</td> ' +
            '<td style="width: 50px;"><span class="delete_mater m_col" ></span></td> </tr>'
        $("#butMaterailTable").find(".no-records-found").hide()
        $("#butMaterailTable tbody").prepend(str)
    })
    //   单价总价失去焦点，计算总价
    $("body").on("blur", '.matterNum', function () {
        $(this).parents(".materTr").find(".matterSumPrice").html(money_cheng($(this).val(), $(this).parents(".materTr").find(".matterPrice").val()))
        purMaterSumMoney()
    })
    $("body").on("blur", '.matterPrice', function () {
        $(this).parents(".materTr").find(".matterSumPrice").html(money_cheng($(this).val(), $(this).parents(".materTr").find(".matterNum").val()))
        purMaterSumMoney()
    })
    //    点击删除
    $("body").on("click", '.delete_mater', function () {
        $(this).parents("tr").remove()
        if ($(".delete_mater").length == 0) {
            $("#butMaterailTable").find(".no-records-found").show()
        }
        purMaterSumMoney()
    })
    //    点击项目下拉
    $("body #projectList").on("click", 'li', function () {
        listPurchaseByProjectId($(this).attr("index"))
    })
    //   点击提交
    $("body").on("click", '.postBtn', function () {
        var thisHtm = $(this).html()
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // /:2  提交  3提交审核
                if (thisHtm == '提交') getDataFrom(2)
                else getDataFrom(3)
                if (applyFalg) {
                    doAddProject()
                }
            }
        })
    })
})
function purMaterSumMoney() {
    var sunMoney = 0;
    $(".matterSumPrice").each(function (k, v) {
        sunMoney = money_Add(sunMoney, $(v).html())
    })
    $(".purMaterSumMoney").html(sunMoney)
}
function initData() {
    $http({
        url: '/gct-web/purchasePlan/purchaseAddEcho',
        success: function (r) {
            //    项目
            if (r.data.projectList) {
                r.data.projectList.unshift({
                    id: '',
                    projectName: '请选择'
                })
                getDownSelect('projectList', '请选择', r.data.projectList, 'id', 'projectName')
            }
            //  费用
            if (r.data.costItemList) {
                r.data.costItemList.unshift({
                    id: '',
                    costName: '请选择'
                })
                getDownSelect('costItemList', '请选择', r.data.costItemList, 'id', 'costName')
            }
            if(r.data.supplierList)superShow(r.data.supplierList)
            //    采购发起人
            $(".constructionCompany").find(".details_Text").eq(0).html(r.data.companyName)
            $(".constructionCompany").find(".details_Text").eq(1).html(r.data.depName)
            $(".constructionCompany").find(".details_Text").eq(2).html(storage('curLoginName', "", 'login'))
        }
    })
}
function superShow(arr) {
    $('#search-form').autocomplete({
        hints: arr,
        width: 498,
        height: 32,
        onSubmit: function (text, obj) {
            if (obj) {
                applyObj.supplier = obj;//供应商Id
                $.each(arr, function (k, v) {
                    if (v.id == obj) {
                        $(".suplierAddress").val(v.address)
                        $(".suplierOpenBank").val(v.openBank)
                        $(".suplierAccount").val(v.account)
                    }
                })
            }
        }
    });
}
var matterCol = [
    {
        title: '物料名称<span class="m_red">*</span>',
        width: '250',
    }, {
        title: '规格',
        width: '100'
    }, {
        title: '单位<span class="m_red">*</span>',
        width: '100'
    }, {
        title: '单价(元)<span class="m_red">*</span>',
        width: '150'
    }, {
        title: '数量<span class="m_red">*</span>',
        width: '150'
    },
    {
        title: '总价',
        width: '250'
    }, {
        title: '供方属性',
        width: '100'
    }, {
        title: '物料类型',
        width: '100'
    },
    {
        title: '操作',
        width: '50'
    }
]
//根据项目选工单
function listPurchaseByProjectId(data) {

    if (!data) return
    $http({
        url: '/gct-web/task/listPurchaseByProjectId',
        data: {
            projectId: data
        },
        success: function (r) {
            if (!r.data) return false;
                r.data.unshift({
                    id: '',
                    taskName: '请选择'
                })
                getDownSelect('taskList', '请选择', r.data, 'id', 'taskName')

        }
    })
}
var applyObj = {}
var applyFalg = true;
function getDataFrom(flag) {
    applyFalg = true;
    applyObj.status = flag;
    applyObj.name = $(".procureName").val();
    applyObj.projectId = $(".projectList").attr("index")
    applyObj.taskId = $(".taskList").attr("index")
    applyObj.typeId = $(".costItemList").attr("index")
    applyObj.buyDate = $("#startTime").val()
    applyObj.purpose = $("#purpose").val()
    applyObj.mode = $(".constructionType").find(".radioActive").attr("index")
    applyObj.supplierName = $(".autocomplete-input").val()
    applyObj.account = $(".suplierAccount").val()
    applyObj.openBank = $(".suplierOpenBank").val()
    applyObj.address = $(".suplierAddress").val()

    //保存时只校验项目名称，其余时都校验
    if (!$.checkReg(applyObj.Name, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写采购计划名称,采购计划名称不能为空");
        return false
    }
    if (applyObj.typeId == '') {
        applyFalg = false;
        $.popInfo("请选择费用类型");
        return false
    }
    if (applyObj.buyDate == '') {
        applyFalg = false;
        $.popInfo("请选择采购日期");
        return false
    }
    if (!applyObj.mode) {
        applyFalg = false;
        $.popInfo("请选择付款方式");
        return false
    }
    if (!applyObj.purpose) {
        applyFalg = false;
        $.popInfo("请填写采购用途");
        return false
    }
    //如果是电汇，开户行账号必写。如果是现金，开户行，账号可以不填
    if (!applyObj.supplierName) {
        applyFalg = false;
        $.popInfo("请填写供应商名称,供应商名称不能为空");
        return false
    }
    if (!applyObj.address) {
        applyFalg = false;
        $.popInfo("请填写供应商地址 ,供应商地址不能为空");
        return false
    }
    if (applyObj.mode == 1) {
        if (!applyObj.openBank || !applyObj.account) {
            applyFalg = false;
            $.popInfo("付款方式为电汇时，供应商开户行和供应商地址不能为空");
            return false
        }
        if (orFileData['postFileBtn'].length == 0) {
            applyFalg = false;
            $.popInfo("请上传采购合同");
            return false
        }

    }
    //物料
    var matterList = []
    if ($(".materTr").length == 0) {
        applyFalg = false;
        $.popInfo("请添加采购物料");
        return false
    }
    $(".materTr").each(function (k, v) {
        var obj = {
            matterName: $(v).find(".matterName").val(),
            matterSpec: $(v).find(".matterSpec").val(),
            matterUnit: $(v).find(".matterUnit").val(),
            matterNum: $(v).find(".matterNum").val(),
            matterPrice: $(v).find(".matterPrice").val()
        }
        if (!obj.matterName) { applyFalg = false; $.popInfo("请填写第" + (k + 1) + "条采购物料的物料名称"); return false }
        if (!obj.matterUnit) { applyFalg = false; $.popInfo("请填写第" + (k + 1) + "条采购物料的单位"); return false }
        if (!Number(obj.matterNum)) { applyFalg = false; $.popInfo("请填写第" + (k + 1) + "条采购物料的数量"); return false }
        if (!obj.matterPrice) { applyFalg = false; $.popInfo("请填写第" + (k + 1) + "条采购物料的单价"); return false }
        matterList.push(obj)
    })
    applyObj.files = JSON.stringify(orFileData['postFileBtn'])//项目合同
    applyObj.matters = JSON.stringify(matterList)//物料
    applyObj.urls = delFileObjUrlList.join(",");//路径
}
//提交
function doAddProject() {
    $http({
        url: '/gct-web/purchasePlan/purchaseAdd',
        data: applyObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}