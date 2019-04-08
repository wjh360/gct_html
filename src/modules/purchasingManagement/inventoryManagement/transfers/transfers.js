var companyId = storage('companyId')
var storageId = storage('storageId')
var selectMatterId = []
var selectStorageId = ''
$(function () {
    var searData = {
        storageId: storageId,
        matterName: '',
        matterCode: '',
    }
    //    点击搜索
    $("body").on("click", '.searchTask', function () {
        if (!$(".searchMatterName").val() && !$(".searchMatterCode").val()) {
            $.popInfo("请输入物料编码或物料名称")
            return false;
        }
        searData = {
            matterName: $(".searchMatterName").val(),
            matterCode: $(".searchMatterCode").val(),
            storageId: storageId,
            ids: selectMatterId.join(",")
        }
        getMatterList()
    })
    //点击行，进入
    //    点击工单整行，整行高亮，调取该工单的物料
    $("#materSearchTable").on("click", 'tbody tr', function () {
        $("#matterTable").find(".no-records-found").remove()
        selectMatterId.push($(this).find(".delete_mater").attr("index"))
        $("#matterTable").find("tbody").append($(this).clone())
        $(this).remove()
    })
    //点击删除
    $("body").on('click', '.delete_mater', function () {
        // 如果能进行模糊匹配
        if( $("#materSearchTable").find(".no-records-found"))$("#materSearchTable").find(".no-records-found").remove()
        if ($(this).parents("tr").find(".matterCode").attr("title").toLowerCase().indexOf(searData.matterCode.toLowerCase()) != -1 && $(this).parents("tr").find(".matterName").attr("title").toLowerCase().indexOf(searData.matterName.toLowerCase()) != -1) {
            $(this).parents("tr").find(".transferWareNum").val("")
            $("#materSearchTable").find("tbody").append($(this).parents("tr").clone())
        }
        if($(this).attr("index"))selectMatterId.splice(selectMatterId.indexOf($(this).attr("index")), 1)
        $(this).parents("tr").remove()
    })
    //    输入调拨量，如果调拨量大于可调量，不能
    $("body").on("keyup", '.transferWareNum', function () {
        var inputNum = $(this).val();
        var useNum = $(this).parents("tr").find(".useNum").text();
        if (Number(inputNum) > Number(useNum)) {
            $(this).val('')
            $.popInfo("挑拨量不能大于可调量")
        }
    })

    //   点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // /:2  提交  3提交审核
                getDataFrom()
                if (applyFlag) {
                    warehousing()
                }
            }
        })
    })
    //物料接口，点击搜搜调取
    function getMatterList() {
        $http({
            url: '/gct-web/inventory/getMatterList',
            data: searData,
            success: function (r) {
                $(".noSearch").remove()
                initTable('materSearchTable', r.data, matterCol)//物料清空
            }
        })
    }
    getReceiveStorage()
    function getReceiveStorage() {
        $http({
            url: '/gct-web/inventory/getReceiveStorage',
            data: {
                companyId: companyId,
                storageId: storageId
            },
            success: function (r) {
                if (!r.data && !r.data.length) return false
                initTable('matterTable', [], matterCol)//物料清空
                var matterList=r.data.matterList?r.data.matterList:[]
                initTable('materSearchTable', matterList, matterCol)//物料清空
                if(!r.data.sList) return
                createTree(r.data.sList, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    onCheck: depOnCheck,
                    chkStyle: 'radio',
                    childName: 'storageName'
                })
            }
        })
    }
    //部门点击事件
    function depOnCheck(a, b, c, d) {
        $(".radio_false_part").removeClass("radio_false_part").addClass('radio_false_full')
        $(".radio_true_part").removeClass("radio_true_part").addClass('radio_false_full')
        if (c.checked) selectStorageId = c.id
    }
})
var matterCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100',
        formatter: function (a) {
            return '<span class="overf_Ec matterCode" title="'+a+'" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matterName',
        title: '物料名称',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec matterName" title="'+a+'" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '50',
        formatter: function (a) {
            if (!a) return '<span class="matterSpec" title="" style="display:inline-block; max-width:50px;"></span>'
            return '<span class="matterSpec overf_Ec"  style="display:inline-block; max-width:50px;">'+a+'</span>'
        }
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '50',
        formatter: function (a) {
            if (!a) return '<span class="matterUnit" title="" style="display:inline-block; max-width:50px;"></span>'
            return '<span class="matterUnit overf_Ec"  style="display:inline-block; max-width:50px;">'+a+'</span>'
        }
    }, {
        field: 'matterPrice',
        title: '单价(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return '<span class="matterPrice" title="0" style="display:inline-block; max-width:100px;">0</span>'
            return '<span class="matterPrice overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '100',
        'class': 'matterType',
        formatter: function (a) {
            return a
        }
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '100',
        'class': 'matterSource',
        formatter: function (a) {
            if (!a) return ''
            return a;
        }
    }, {
        field: 'matterSupplier',
        title: '供应商单位',
        width: '100',
        formatter: function (a) {
            if (!a) return '<span class="matterSupplier" title="" style="display:inline-block; max-width:100px;"></span>'
            return '<span class="matterSupplier overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'

        }
    }, {
        title: '可调量',
        field: 'storageMatter.useNum',
        width: '100',
        formatter: function (a) {
            if (!a) return '<span class="tit useNum" title= "0">0</span>'
            return '<span class="useNum overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'allotNum',
        title: '调拨量',
        width: '100',
        'class': 'matterTableShow',
        formatter: function (a) {
            return '<input maxlength="13" class="inputOrgan transferWareNum money" value="' + (a ? a : '') + '" type="text" style="width: 90%">'
        }
    }, {
        title: '操作',
        width: '50',
        'class': 'matterTableShow',
        formatter: function (a, row) {
            //index中放着物料id
            return '<span class="delete_mater m_col" index="' + row.id + '" ></span>'
        }
    }
]
var applyObj = {}
var applyFlag = true;
function getDataFrom() {
    applyFlag = true;
    applyObj.storageId = storageId;
    applyObj.receiveStorage = selectStorageId;
    if (!selectStorageId) {
        applyFlag = false;
        $.popInfo("请选择接收库房")
        return false;
    }
    var matterList = []
    if ($("#matterTable").find(".no-records-found").length == 1 || $("#matterTable tbody").find("tr").length == 0) {
        applyFlag = false;
        $.popInfo("请至少选择一条物料")
        return false;
    }
    $("#matterTable tbody").find("tr").each(function (k, v) {
        if (!Number($(v).find(".transferWareNum").val())) {
            applyFlag = false;
            $.popInfo("请填写第" + (k + 1) + "条物料的调拨量")
            return false;
        }
        if (Number($(v).find(".transferWareNum").val()) > Number($(v).find(".useNum").text())) {
            applyFlag = false;
            $.popInfo("第" + (k + 1) + "条物料的调拨量大于可挑拨量")
            return false;
        }
        matterList.push({
            id: $(v).find(".delete_mater").attr("index"),
            matterCode: $(v).find(".matterCode").text(),            //物料编号
            matterName: $(v).find(".matterName").text(),           //物料名称
            matterSpec: $(v).find(".matterSpec").text(),            //规格
            matterUnit: $(v).find(".matterUnit").text(),          //单位
            matterPrice: $(v).find(".matterPrice").text(),             //单价
            matterType: $(v).find(".matterType").html(),           //物料类型
            matterSource: $(v).find(".matterSource").html(),             //供方属性
            matterSupplier: $(v).find(".matterSupplier").text(),            //供应商单位
            allotNum: $(v).find(".transferWareNum").val(),             //调拨量
        })
    })

    applyObj.matterStr = JSON.stringify(matterList);

}
//提交
function warehousing() {
    $http({
        url: '/gct-web/inventory/allot',
        data: applyObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}