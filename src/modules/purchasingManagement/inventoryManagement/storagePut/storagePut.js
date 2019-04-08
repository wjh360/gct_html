var storageId = storage('storageId')
$(function () {
    initData()
    //    点击工单整行，整行高亮，调取该工单的物料
    $("#taskTable").on("click", 'tbody tr', function () {
        $(this).toggleClass("bg_blue").siblings().removeClass('bg_blue')
        if ($(this).hasClass('bg_blue')) {
            //    选中
            getMatterListByTaskId(tab_rowData.id)
        } else {
            //    取消选中
            initTable('matterTable', [], matterCol)//物料清空
        }
    })
    //    点击搜索
    $("body").on("click", '.searchTask', function () {
        initData()
        initTable('matterTable', [], matterCol)//物料清空
    })
    //    点击添加
    $("body").on("click", '.addMatterBtn', function () {
        var str = '<tr class="materTr">' +
            ' <td style="width: 100px; "><input maxlength="100" class="inputOrgan matterCode" type="text"></td> ' +
            ' <td style="width: 100px; "><input maxlength="100" class="inputOrgan matterName" type="text"></td> ' +
            '<td style="width: 100px; "><input maxlength="50" class="inputOrgan matterSpec" type="text"></td>' +
            '<td style="width: 50px; "><input maxlength="50" class="inputOrgan matterUnit" type="text"></td> ' +
            '<td style="width: 100px;"><input  maxlength="13"  class="inputOrgan money matterPrice money" type="text"></td> ' +
            '<td style="width: 150px;"><div  class="downSelect clearfix">\n' +
            '                            <span class="matterType downSet overf_Ec downSetOpen" index="" fl_val="请选择" title="请选择"><a\n' +
            '                                    href="javascript:void(0);">请选择</a></span>\n' +
            '                            <ul style="display: block;margin-top: -3px;">\n' +
            '                                <li class="overf_E" index="" title="请选择">请选择</li>\n' +
            '                                <li class="overf_E" index="1" title="设备类">设备类</li>\n' +
            '                                <li class="overf_E" index="2" title="线缆类">线缆类</li>\n' +
            '                                <li class="overf_E" index="3" title="辅材类">辅材类</li>\n' +
            '                                <li class="overf_E" index="4" title="主材料">主材料</li>\n' +
            '                            </ul>\n' +
            '                        </div></td> ' +
            '<td style="width: 100px;" ><div  class="downSelect clearfix">\n' +
            '                            <span class="matterSource downSet overf_Ec downSetOpen" index="" fl_val="请选择" title="请选择"><a\n' +
            '                                    href="javascript:void(0);">请选择</a></span>\n' +
            '                            <ul style="display: block;margin-top: -3px;">\n' +
            '                                <li class="overf_E" index="" title="请选择">请选择</li>\n' +
            '                                <li class="overf_E" index="1" title="甲供">甲供</li>\n' +
            '                                <li class="overf_E" index="2" title="乙供">乙供</li>\n' +
            '                            </ul>\n' +
            '                        </div></td> ' +
            '<td style="width: 100px;"><input maxlength="100" class="inputOrgan matterSupplier" type="text"></td> ' +
            '<td style="width: 50px;"><input maxlength="13" class="inputOrgan matterNum money" type="text"></td> ' +
            '<td style="width: 50px;"><input maxlength="100" class="inputOrgan putWareHouseNum money" type="text"></td> ' +
            '<td style="width: 50px;"><span class="delete_mater m_col"></span></td> </tr>'
        $("#matterTable").find(".no-records-found").remove()
        $("#matterTable tbody").prepend(str)
    })
    //点击删除
    $("body").on('click', '.delete_mater', function () {
        $(this).parents("tr").remove()
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
})
function initData() {
    $http({
        url: '/gct-web/inventory/storageForTaskList',
        data: {
            taskName: $(".searchTaskName").val()
        },
        success: function (r) {
            initTable('taskTable', r.data, taskCol)
            initTable('matterTable', [], matterCol)//物料清空
        }
    })
}
function getMatterListByTaskId(data) {
    $http({
        url: '/gct-web/inventory/getMatterListByTaskId',
        data: {
            taskId: data
        },
        success: function (r) {
            initTable('matterTable', r.data, matterCol)
        }
    })
}
var taskCol = [
    {
        field: 'taskName',
        title: '工单名称',
        width: '300',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec" style="display:inline-block; max-width:300px;">' + a + '</span>'
        }
    },
    {
        field: 'projectName',
        title: '所属项目',
        width: '300',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec" style="display:inline-block; max-width:300px;">' + a + '</span>'
        }
    }, {
        field: 'constructionUserName',
        title: '施工队长',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }
]
var matterCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec matterCode" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    },
    {
        field: 'matterName',
        title: '物料名称',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec matterName" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    },
    {
        field: 'matterSpec',
        title: '规格',
        width: '100',
        formatter: function (a) {
            if (!a) return '<span class="matterSpec" title="" style="display:inline-block; max-width:100px;"></span>'
            return '<span class=" overf_Ec matterSpec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    },
    {
        field: 'matterUnit',
        title: '单位',
        width: '50',
        formatter: function (a) {
            if (!a) return '<span class="matterUnit" title="" style="display:inline-block; max-width:50px;"></span>'
            return '<span class=" overf_Ec matterUnit" style="display:inline-block; max-width:50px;">' + a + '</span>'
        }
    },
    {
        field: 'matterPrice',
        title: '单价(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return '<span class="matterPrice" title="0" style="display:inline-block; max-width:100px;">0</span>'
            return '<span class=" overf_Ec matterPrice" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    },
    {
        field: 'matterType',
        title: '物料类型',
        width: '150',
        'class': 'matterType',
        formatter: function (a) {
            return a
        }
    },
    {
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
            return '<span class=" overf_Ec matterSupplier" style="display:inline-block; max-width:100px;">' + a + '</span>'

        }
    },
    {
        title: '设计值',
        field: 'matterNum',
        width: '50',
        formatter: function (a) {
            if (!a) return '<span class="matterNum" title="" style="display:inline-block; max-width:50px;"></span>'
            return '<span class=" overf_Ec matterNum" style="display:inline-block; max-width:50px;">' + a + '</span>'

        }
    },
    {
        title: '入库量',
        width: '100',
        formatter: function (a) {
            return '<input maxlength="13" class="inputOrgan putWareHouseNum money" type="text" style="width: 90%">'
        }
    },
    {
        title: '操作',
        width: '50',
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
    if ($("#matterTable").find(".no-records-found").length == 1 || $("#matterTable tbody").find("tr").length == 0) {
        applyFlag = false;
        $.popInfo("请至少添加一条物料")
        return false;
    }
    var matterList = []
    $("#matterTable tbody").find("tr").each(function (k, v) {
        if ($(v).hasClass('materTr')) {
            //    新增
            var matterObj = {
                matterCode: $(v).find(".matterCode").val(),
                matterName: $(v).find(".matterName").val(),
                matterSpec: $(v).find(".matterSpec").val(),
                matterUnit: $(v).find(".matterUnit").val(),
                matterPrice: $(v).find(".matterPrice").val(),
                matterType: $(v).find(".matterType").attr('title'),
                matterSource: $(v).find(".matterSource").attr('title'),
                matterSupplier: $(v).find(".matterSupplier").val(),
                matterNum: $(v).find(".matterNum").val(),
                warehousingNum: $(v).find(".putWareHouseNum").val()
            }
            if (!matterObj.matterCode) { applyFlag = false; $.popInfo('第' + (k + 1) + '条物料的物料编号不能为空'); return false; }
            if (!matterObj.matterName) { applyFlag = false; $.popInfo('第' + (k + 1) + '条物料的物料名称不能为空'); return false; }
            if (!matterObj.matterUnit) { applyFlag = false; $.popInfo('第' + (k + 1) + '条物料的物料单位不能为空'); return false; }
            if (!matterObj.matterPrice) { applyFlag = false; $.popInfo('第' + (k + 1) + '条物料的物料单价不能为空'); return false; }
            if (matterObj.matterType == '请选择') { applyFlag = false; $.popInfo('请选择第' + (k + 1) + '条物料的物料类型'); return false; }
            if (matterObj.matterSource == '请选择') { applyFlag = false; $.popInfo('请选择第' + (k + 1) + '条物料的供方属性'); return false; }
            if (!matterObj.warehousingNum) { applyFlag = false; $.popInfo('第' + (k + 1) + '条物料的入库量不能为空'); return false; }
        } else {
            var matterObj = {
                id: $(v).find(".delete_mater").attr("index"),
                matterCode: $(v).find(".matterCode").text(),
                matterName: $(v).find(".matterName").text(),
                matterSpec: $(v).find(".matterSpec").text(),
                matterUnit: $(v).find(".matterUnit").text(),
                matterPrice: $(v).find(".matterPrice").text(),
                matterType: $(v).find(".matterType").html(),
                matterSource: $(v).find(".matterSource").html(),
                matterSupplier: $(v).find(".matterSupplier").text(),
                matterNum: $(v).find(".matterNum").text(),
                warehousingNum: $(v).find(".putWareHouseNum").val()
            }
            if (!Number(matterObj.warehousingNum)) {
                applyFlag = false;
                $.popInfo('第' + (k + 1) + '条物料的入库量不能为空')
                return false;
            }
        }
        matterList.push(matterObj)
    })

    applyObj.matterStr = JSON.stringify(matterList);

}
//提交
function warehousing() {
    $http({
        url: '/gct-web/inventory/warehousing',
        data: applyObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}