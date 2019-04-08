var treeList = []       //树 list
var selectedTreeList = [] //已选中 树 list
var slectedQuotaMenuId = ""         // 待选择定额项目 菜单树Id
var quotaList = []          //待选择定额项目 list
var selectedQuotaList = []   //已选择定额项目 list
var searchSelectedList = [] //已选择定额项目 搜索list
var slectedTrueQuotaMenuId = "";
$(function () {

    initTable('SelectedChoseTable', [], selectedCol)
    initEcho()
    //回显数据 //搜索数据
    function initEcho(menuId, search) {
        // htmlDown()
        $http({
            url: "/gct-web/tableThreeNail/addQuotaEcho",
            data: {
                menuId: menuId,            //目录ID 默认是null
                search: search              //搜索
            },
            success: function (r) {
                // htmlDownRemove()
                if (!r.data) return false
                quotaList = r.data.quotaList || []
                if (!menuId) {
                    treeList = r.data.quotaMenu || []
                    createTree(treeList, $("#comply_trees"), 'comply_tree', {
                        "init": getList,
                        childName: 'name'
                    })
                    var zTree = $.fn.zTree.getZTreeObj("comply_tree");
                    var node = zTree.getNodeByParam("id", treeList[0].id);
                    slectedQuotaMenuId = treeList[0].id
                    zTree.checkNode(node, true, true);
                    zTree.selectNode(node);
                }
                initTable('waitChoseTable', quotaList, col)
            }
        })
    }
    //树菜单点击事件
    function getList(a, b, c) {
        $(".searchQuota").siblings(".inputOrgan").val("")
        // log(c.id)
        // showquotaTable(c.id)
        slectedQuotaMenuId = c.id

        initEcho(c.id)
    }
    //显示定额项目list
    // function showquotaTable(id) {
    //     var tableData = []
    //     $.each(quotaList, function (index, eleVal) {
    //         if (eleVal.listId == id) tableData.push(eleVal)
    //     })
    //     initTable('waitChoseTable', tableData, col)
    // }
    //搜索 待选择定额项目
    $("body").on("click", ".searchQuota", function () {
        var searchVal = $(this).siblings(".inputOrgan").val()
        initEcho(slectedQuotaMenuId, searchVal)
        // initEcho(slectedQuotaMenuId, searchVal)
    })

    //单击待选定额项目表格  选择项目
    var threeIdList = []
    $("body").on("click", "#waitChoseTable tbody tr", function () {
        var zTree = $.fn.zTree.getZTreeObj("comply_tree");
        var node = zTree.getNodeByParam("id", slectedQuotaMenuId);
        tab_rowData.buildType = 1
        tab_rowData.flag = 1
        tab_rowData.fatherIdList = getMenuFatherIdList(tab_rowData.listId)

        selectedQuotaList.push(tab_rowData)

        // log(selectedQuotaList)
        var selectedZTree = $.fn.zTree.getZTreeObj("selected_comply_tree");
        var selectednode1;
        if (selectedZTree) {
            selectednode1 = selectedZTree.getNodeByParam("id", tab_rowData.listId);
        }

        if (threeIdList.indexOf(slectedQuotaMenuId) == -1 && !selectednode1) {
            selectedTreeList.push(node)
            threeIdList.push(slectedQuotaMenuId)
        }

        $("#selected_comply_trees").html("")
        createTree(selectedTreeList, $("#selected_comply_trees"), 'selected_comply_tree', {
            "init": getSelectedList,
            childName: 'name'
        })
        selectedZTree = $.fn.zTree.getZTreeObj("selected_comply_tree");
        var selectednode = selectedZTree.getNodeByParam("id", slectedQuotaMenuId);
        slectedTrueQuotaMenuId = slectedQuotaMenuId
        selectedZTree.checkNode(selectednode, true, true);
        selectedZTree.selectNode(selectednode);
        $(".searchSelectedQuota").siblings(".inputOrgan").val("")
        getSelectedList("", "", { id: slectedQuotaMenuId })
    })
    function getMenuFatherIdList(id) {
        var zTree = $.fn.zTree.getZTreeObj("comply_tree");
        var node = zTree.getNodeByParam("id", id);
        var nodes;
        var arr = []
        // log(node.level, node)
        for (var i = node.level; i >= 0; i--) {
            if (node.fatherId) {
                node = zTree.getNodeByParam("id", node.fatherId);
                arr.push(node.id)
            }
        }
        return arr
    }

    // 已选定额项目菜单点击事件
    function getSelectedList(a, b, c) {
        var tableData = []
        searchSelectedList = []
        $(".searchSelectedQuota").siblings(".inputOrgan").val("")
        $.each(selectedQuotaList, function (index, eleVal) {
            if (eleVal.listId == c.id || eleVal['fatherIdList'].indexOf(c.id) != -1) searchSelectedList.push(eleVal)
        })
        slectedTrueQuotaMenuId = c.id
        initTable('SelectedChoseTable', searchSelectedList, selectedCol)
    }

    //搜索 已选择定额项目
    var searchSelectedList = []
    $("body").on("click", ".searchSelectedQuota", function () {
        var searchVal = $(this).siblings(".inputOrgan").val()
        var tableData = []
        $.each(selectedQuotaList, function (index, eleVal) {
            if (eleVal['no'].has(searchVal) || eleVal['name'].has(searchVal) || eleVal['abbr'].has(searchVal)) {
                tableData.push(eleVal)
            }
        })
        searchSelectedList = tableData
        initTable('SelectedChoseTable', tableData, selectedCol)
    })
    //删除 已选择定额项目
    $("body").on("click", "#SelectedChoseTable tbody tr .delSelectedQuota", function () {
        var trIdx = $(this).parents('tr').attr("data-index")
        // var delIdx = ""
        log(searchSelectedList)
        if (searchSelectedList.length && (searchSelectedList.length < selectedQuotaList.length)) {    //当前表格是搜索时 删除 搜索里的数据
            for (var i = 0; i < selectedQuotaList.length; i++) {
                var el = selectedQuotaList[i];
                if (searchSelectedList[trIdx].id == el.id) {
                    selectedQuotaList.splice(i, 1)
                    break;
                }
            }
            searchSelectedList.splice(trIdx, 1)
            initTable('SelectedChoseTable', searchSelectedList, selectedCol)

            if (!searchSelectedList.length) {
                $.each(selectedTreeList, function (index, eleVal) {
                    if (eleVal.id == slectedTrueQuotaMenuId) {
                        selectedTreeList.splice(index, 1)
                        threeIdList.splice(index, 1)
                    }
                })
                $("#selected_comply_trees").html("")
                createTree(selectedTreeList, $("#selected_comply_trees"), 'selected_comply_tree', {
                    "init": getSelectedList,
                    childName: 'name'
                })
            }
        } else {
            selectedQuotaList.splice(trIdx, 1)
            searchSelectedList.splice(trIdx, 1)
            initTable('SelectedChoseTable', selectedQuotaList, selectedCol)
        }

        // log(selectedQuotaList)
    })
    $("body").on("click", ".postBtn", function () {
        // log(selectedQuotaList)
        storage('selectedQuotaList', selectedQuotaList, 'editQuota')
        submitSuccess('操作成功', function () {
            goNewPage('/modules/budget/budgetList/editQuota.html')
        })

    })

})

var col = [
    {
        field: '',
        title: '序号',
        width: 60,
        formatter: function (a, b, c) {
            return c + 1
        }
    }, {
        field: 'no',
        title: '定额编号',
        width: 100,
    }, {
        field: 'name',
        title: '项目名称',
        width: 400,
        formatter: function (a) {
            return a
        }
    }, {
        field: 'abbr',
        title: '项目简称',
        width: 100
    }, {
        field: 'meterageName',
        title: '单位',
    }, {
        field: 'mechanic',
        title: '技工工日',
    }, {
        field: 'generalWorker',
        title: '普工工日',
    }
]
var selectedCol = [
    {
        field: '',
        title: '序号',
        width: 60,
        formatter: function (a, b, c) {
            return c + 1
        }
    }, {
        field: 'no',
        title: '定额编号',
        width: 100,
    }, {
        field: 'name',
        title: '项目名称',
        width: 400,
        formatter: function (a) {
            return a
        }
    }, {
        field: 'abbr',
        title: '项目简称',
        width: 100
    }, {
        field: 'meterageName',
        title: '单位',
    }, {
        field: 'mechanic',
        title: '技工工日',
    }, {
        field: 'generalWorker',
        title: '普工工日',
    }, {
        field: '',
        title: '操作',
        width: 80,
        formatter: function () {
            return '<sapn class="delSelectedQuota" style="color:#ff1818;     cursor: pointer;">删除</sapn>'
        }
    }
]
