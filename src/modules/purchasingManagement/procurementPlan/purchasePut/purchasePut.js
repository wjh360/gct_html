var procursePlanId = storage('procursePlanId')
var selectedDepId = {},  //选中部门的id
    companyTreeObj = {}, //公司树对象
    selectComoBJ = {};//选中公司的对象
$(function () {
    initData()
    function initData() {
        $http({
            url: ' /gct-web/purchasePlan/storageEcho',
            data: {
                id: procursePlanId
            },
            success: function (r) {
                if(!r.data) return false;
                initTable('markerTableBuy', r.data.listMatter?r.data.listMatter:[], matterCol)
                if (r.data.companys && r.data.companys.length > 0) {
                    createTree(r.data.companys, $("#comply_trees"), 'comply_tree', {
                        init: initDepMents,
                        childName: 'companyName'
                    })
                    var companyTreeObj = $.fn.zTree.getZTreeObj('comply_tree');
                    var nodes = companyTreeObj.getNodes();
                    companyTreeObj.expandNode(nodes[0], true, false, false);
                    companyTreeObj.selectNode(nodes[0]);
                    initDepMents(1, 1, nodes[0])
                }
            }
        })
    }
    //公司点击事件 初始化 部门树
    function initDepMents(a, b, c) {
        selectComoBJ = c;
        $http({
            url: ' /gct-web/purchasePlan/loadStorageByCompanyId',
            data: {
                companyId: c.id   //公司id
            },
            success: function (r) {
                $("#dep_trees").html("")
                if (!r.data.length) return false
                createTree(r.data, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    childName: 'storageName',
                    onCheck: depOnCheck,
                    chkStyle: 'radio'
                })
            }
        })
    }
    //部门点击事件
    function depOnCheck(a, b, c, d) {
        selectedDepId = c;
        $(".radio_false_part").removeClass("radio_false_part").addClass('radio_false_full')
        $(".radio_true_part").removeClass("radio_true_part").addClass('radio_false_full')
        if (c.checked) selectStorageId = c.id
        showSelectedDep(selectedDepId)
    }
    function showSelectedDep(wfObj) {
        var str = ""
        $(".Selected_dep_list").html("")
        str += '<li >' +
            '<p class="company_name">' + selectComoBJ.companyName + '</p>' +
            '<p class="dep_name">' + wfObj.storageName + '</p>' +
            '</li>'
        $(".Selected_dep_list").html(str)
    }
    //   点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                if (!selectedDepId.id) {
                    $.popInfo("至少选择一个库房")
                    return false;
                }
                storageDo(selectedDepId.id)
            }
        })
    })
})
var matterCol = [
    {
        field: 'matter.matterName',
        title: '物料名称',
        width: '250',
        formatter: function (a) {
            return '<span class=" overf_Ec" style="display:inline-block; max-width:250px;">' + a + '</span>'
        }
    }, {
        field: 'matter.matterSpec',
        title: '规格',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matter.matterUnit',
        title: '单位',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matter.matterPrice',
        title: '单价(元)',
        width: '150',
        formatter: function (a) {
            return a
        }
    }, {
        field: 'matterNum',
        title: '数量',
        width: '150',
        formatter: function (a) {
            return a
        }
    },
    {
        field: 'amount',
        title: '总价',
        width: '250',
        formatter: function (a) {
            return a;
        }
    }, {
        title: '供方属性',
        width: '100',
        formatter: function (a) {
            return '乙供'
        }
    }, {
        title: '物料类型',
        width: '100',
        formatter: function (a) {
            return '辅材'
        }
    }
]
function storageDo(data) {
    $http({
        url: '/gct-web/purchasePlan/storage',
        data: {
            id: procursePlanId,
            storageId: data
        },
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}