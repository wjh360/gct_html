var storageId = ''
$(function () {
    //简单搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        storageForMatterPage()
    })
    //点击使用量
    $("body").on("click", '.userNumClick', function () {
        if (!storageId || !tab_rowData.id) return false;
        storage('matterId', tab_rowData.id, 'materialUseDetails')
        storage('storageId', storageId, 'materialUseDetails')
        goNewPage('./inventoryManagement/materialUseDetails.html')
    })
    //点击现场余量
    $("body").on("click", '.siteMarginClick', function () {
        if (!storageId || !tab_rowData.id) return false;
        storage('matterId', tab_rowData.id, 'siteMarginDetails')
        storage('storageId', storageId, 'siteMarginDetails')
        goNewPage('./inventoryManagement/siteMarginDetails.html')
    })
    //点击物料名称，进详情
    $("body").on("click", '.matterTrClick', function () {
        if (!storageId || !tab_rowData.id) return false;
        storage('matterId', tab_rowData.id, 'materialDetails')
        storage('storageId', storageId, 'materialDetails')
        goNewPage('./inventoryManagement/materialDetails.html')
    })
    //入库
    $("body").on("click", '.putWareHouse', function () {
        if (!storageId) return false;
        storage('storageId', storageId, 'storagePut')
        goNewPage('./inventoryManagement/storagePut.html')
    })
    //调拨
    $("body").on("click", '.transferMatter', function () {
        if (!$(".companyList").attr("index") || !storageId) return false;
        storage('companyId', $(".companyList").attr("index"), 'transfers')
        storage('storageId', storageId, 'transfers')
        goNewPage('./inventoryManagement/transfers.html')
    })
    //发料
    $("body").on("click", '.sendMatter', function () {
        var strId = $(".companyList").attr("index")
        if (!strId || !storageId) return false;
        storage('companyId', strId, 'sendMaterialRequisition')
        storage('storageId', storageId, 'sendMaterialRequisition')
        goNewPage('./inventoryManagement/sendMaterialRequisition.html')
    })
    //点击删除
    $("body").on("click", '.delete_Matter', function () {
        if (!tab_rowData.id) return false;
        $.popConfirm({
            title: '删除库房',
            content: '确定删除所选领料单吗？',
            confirm: function () {
                deleteStoreIssueRecord(tab_rowData.id)
            }
        })
    })
    //点击领料单列表，跳转进入领料单详情
    $("body").on("click", '.issueClickBtn', function () {
        if (!tab_rowData.id) return false;
        storage('storageLogId', tab_rowData.id, 'detailsMateriaLRequisition')
        goNewPage('./inventoryManagement/detailsMateriaLRequisition.html')
    })
    //点击确认
    $("body").on("click", '.reject_Matter', function () {
        if (!tab_rowData.id) return false;
        storage('storageLogId', tab_rowData.id, 'returnOrderDetails')
        goNewPage('./inventoryManagement/returnOrderDetails.html')
    })
    //点击确认退料的名字，进入详情4-已确认；3-未确认
    $("body").on("click", '.returnMatterClick', function () {
        if (tab_rowData.id && tab_rowData.status == 4) {
            storage('storageLogId', tab_rowData.id, 'returnOrderDetails')
            goNewPage('./inventoryManagement/returnOrderDetails.html')
        }
    })
    $("body").on("click", '.opertionClickBtn', function () {
        if (!tab_rowData.id) return false;
        storage('storageLogId', tab_rowData.id, 'warehouseRecordDetails')
        goNewPage('./inventoryManagement/warehouseRecordDetails.html')

    })
    //部门点击事件
    function treeClick(event, treeId, treeNode) {
        storageId = treeNode.id
        switchTab()
    }
    ///点击创建一级库房
    $("body").on('click', '.creatFirstStorage', function (event) {
        if (!$(".companyList").attr("index")) {
            $.popInfo("请先创建公司")
            return false;
        }
        storage('companyId', $(".companyList").attr("index"), 'warehouseFirstAdd')
        goNewPage('./inventoryManagement/warehouseFirstAdd.html')
    });
    //修改树节点
    function beforeEditName(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        var treeObj = treeNode;
        $.popConfirm({
            title: '编辑库房',
            content: '<div style="margin-top: 17px"><span class="tan_text">上级库房：</span><span class="tan_Detail overf_E">' + (treeObj.storageName?treeObj.storageName:'') + '</span></div>' +
                '<div style="margin-top: 17px"><span class="tan_text">所属部门：</span><span class="tan_Detail overf_E">' + (treeObj.depName?treeObj.depName:'') + '</span></div>' +
                '<div style="margin-top: 17px"><span class="tan_text"><i>*</i>库房名称：</span><input class="inputOrgan tanStorageName" maxlength="100" value="' + (treeObj.storageName?treeObj.storageName:'') + '" style="width: 300px"></div>' +
                '<div style="margin-top: 17px"><span class="tan_text"><i>*</i>库房地址：</span><input class="inputOrgan tanStorageAddr" maxlength="100" value="' + (treeObj.storageAddr?treeObj.storageAddr:'') + '" style="width: 300px"></div>',
            confirm: function () {
                var appObj = {
                    id: treeObj.id,
                    depId: treeObj.depId,
                    storageName: $(".tanStorageName").val(),
                    storageAddr: $(".tanStorageAddr").val()
                }
                if (!appObj.storageName) {
                    $.popInfo("请填写库房名称");
                    return false
                }
                if (!appObj.storageAddr) {
                    $.popInfo("库房地址");
                    return false
                }
                updateStorage(appObj, treeObj)
            }
        })
        $(".box-content").css({
            'max-height': '500px'
        })
        return false
    }
    //更新部门
    function updateStorage(data, ztreeSelectObj) {
        $http({
            url: '/gct-web/inventory/doUpdate',
            data: data,
            success: function (r) {
                if (!$(".companyList").attr("index")) return false;
                companyAndStorageList($(".companyList").attr("index"), ztreeSelectObj)
            }
        })
    }
    //删除树节点
    function beforeRemove(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        zTree.selectNode(treeNode);
        // var treeObj = treeNode;
        $.popConfirm({
            title: '删除库房',
            content: ' 确定要删除吗？',
            confirm: function () {
                deleteStorage(treeNode)
            }
        })
        return false;
    }
    //删除库房
    function deleteStorage(ztree) {
        $http({
            url: '/gct-web/inventory/doDelete',
            data: { storageId: ztree.id },
            success: function (r) {
                if (!$(".companyList").attr("index")) return;
                companyAndStorageList($(".companyList").attr("index"))
            }
        })
    }
    //添加树节点
    function addHoverDom(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        var treeObj = treeNode;
        //获取span元素
        var sObj = $("#" + treeNode.tId + "_span");
        //如果节点正在比编辑状态或者批量添加，直接返回
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0 || $("#seeBtn_" + treeNode.tId).length > 0) return;
        //添加节点的字符串
        if (noAttrPower || curPowerObj && curPowerObj['Add-lower-level-warehouse-operation']) {
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                + "' title='添加下级库房' onfocus='this.blur();'></span>";
            //将添加的节点的字符串放到span元素的后面
            sObj.after(addStr);
            //获取添加按钮节点
            var btn = $("#addBtn_" + treeNode.tId);
            //添加按钮绑定事件
            if (btn) btn.bind("click", function () {
                $.popConfirm({
                    title: '创建下级库房',
                    content: '<div style="margin-top: 17px"><span class="tan_text">上级库房：</span><span class="tan_Detail overf_E">' + (treeObj.storageName?treeObj.storageName:'') + '</span></div>' +
                        '<div style="margin-top: 17px"><span class="tan_text">所属部门：</span><span class="tan_Detail overf_E">' + (treeObj.depName?treeObj.depName:'') + '</span></div>' +
                        '<div style="margin-top: 17px"><span class="tan_text"><i>*</i>库房名称：</span><input class="inputOrgan tanStorageName" maxlength="100" style="width: 300px"></div>' +
                        '<div style="margin-top: 17px"><span class="tan_text"><i>*</i>库房地址：</span><input class="inputOrgan tanStorageAddr" maxlength="100" style="width: 300px"></div>',
                    confirm: function () {
                        var appObj = {
                            fatherId: treeObj.id,
                            depId: treeObj.depId,
                            storageName: $(".tanStorageName").val(),
                            storageAddr: $(".tanStorageAddr").val()
                        }
                        if (!appObj.storageName) {
                            $.popInfo("请填写库房名称");
                            return false
                        }
                        if (!appObj.storageAddr) {
                            $.popInfo("库房地址");
                            return false
                        }
                        addStorage(appObj, treeObj)
                    }
                })
                $(".box-content").css({
                    'max-height': '500px'
                })
            });
        }
        //查看按钮
        var addStr1 = "<span class='button see' id='seeBtn_" + treeNode.tId
            + "' title='查看' onfocus='this.blur();'></span>";
        sObj.after(addStr1);
        //    点击查看
        var btn1 = $("#seeBtn_" + treeNode.tId);
        //添加按钮绑定事件
        if (btn1) btn1.bind("click", function () {
            $.popConfirm({
                title: '库房详情',
                content: '<div style="margin-top: 17px"><span class="tan_text">上级库房：</span><span class="tan_Detail overf_E">' + (treeObj.fatherStorageName ? treeObj.fatherStorageName : '') + '</span></div>' +
                    '<div style="margin-top: 17px"><span class="tan_text">所属部门：</span><span class="tan_Detail overf_E">' + treeObj.depName + '</span></div>' +
                    '<div style="margin-top: 17px"><span class="tan_text">库房名称：</span><span class="tan_Detail overf_E">' + treeObj.storageName + '</span></div>' +
                    '<div style="margin-top: 17px"><span class="tan_text">库房地址：</span><span class="tan_Detail overf_E">' + treeObj.storageAddr + '</span></div>',
                confirm: function () {
                }
            })
            $(".box-content").css({
                'max-height': '500px'
            })
        });
    }
    function addStorage(data, ztreeSelectObj) {
        $http({
            url: '/gct-web/inventory/doAdd',
            data: data,
            success: function (r) {
                if (!$(".companyList").attr("index")) return;
                companyAndStorageList($(".companyList").attr("index"), ztreeSelectObj)
            }
        })
    }
    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
        $("#seeBtn_" + treeNode.tId).unbind().remove();
    }
    // 创建树
    function createTree(testData, obj, treeObj) {
        treeObj = 'tree'
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
                selectedMulti: false,
                showIcon: false,
                showTitle: false
            },
            edit: {
                drag: {
                    isCopy: false,
                    isMove: false,
                },
                enable: true,
                editNameSelectAll: true,
                showRemoveBtn: function (treeId, treeNode) {
                    if (!treeNode.children || !treeNode.children.length) {
                        if (noAttrPower || curPowerObj && curPowerObj['Delete-warehouse-operation']) {
                            return true;
                        }
                    }
                },
                removeTitle: "删除库房",
                renameTitle: "编辑库房",
                showRenameBtn: function (treeId, treeNode) {
                    if (noAttrPower || curPowerObj && curPowerObj['Edit-warehouse-operation']) {
                        return true;
                    }
                }
            },
            data: {
                simpleData: {
                    enable: true
                },
                key: {
                    name: "storageName"
                }
            },
            callback: {
                onClick: treeClick,
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove
            }
        };
        var zNodes = null, zTreeObj = null, newCount = 1;
        if (testData.length > 0 && $('#' + treeObj).length == 0) {
            zNodes = testData;
            var _ul = $('<ul id=' + treeObj + ' class="ztree"></ul>');          //创建树dom
            obj.append(_ul);
            zTreeObj = $.fn.zTree.init($('#' + treeObj), setting, zNodes);      //实例化树
        }
    }
    companyAndStorageList()
    //用于页面初始化和通过选择公司渲染库房====通过库房Id请求物料列表
    function companyAndStorageList(data, ztreeObjSelect) {
        $("#treeDemo").html("")
        $http({
            url: '/gct-web/inventory/companyAndStorageList',
            data: {
                companyId: data
            },
            success: function (r) {
                //渲染公司，只渲染一遍，其余的时候不渲染
                //    渲染库房sList
                if (r.data) {
                    if (!$(".companyList").attr("index") && r.data.companyList && r.data.companyList.length > 0) {
                        getDownSelect('companyList', r.data.companyList[0].companyName, r.data.companyList, 'id', 'companyName')
                        $(".companyList").attr("index", r.data.companyList[0].id)
                    }
                    if (!r.data.sList || r.data.sList.length == 0) r.data.sList = []
                    createTree(r.data.sList, $('#treeDemo'));
                    var zTree = $.fn.zTree.getZTreeObj("tree");
                    if (r.data.sList.length > 0) zTree.expandAll(true)
                    if (r.data.sList.length) {
                        if (!ztreeObjSelect) var node = zTree.getNodeByParam("id", r.data.sList[0].id);
                        else var node = ztreeObjSelect
                        storageId = node.id;//库房Id
                        zTree.checkNode(node, true, true);
                        zTree.selectNode(node);
                        if (data) {
                            storage('nav_idx', 0)
                            $(".nav-tabs li").eq(0).trigger("click")
                            $(".nav-tabs li").removeClass('active')
                            $(".tab-pane").removeClass('active').removeClass('in')
                            $(".nav-tabs li").eq(0).trigger("click").addClass("active")
                            $("#materialList").addClass('in active')
                        } else {
                            switchTab()
                        }
                    } else {
                        switchTab()
                    }
                } else {
                    $.popInfo(r.message)
                    if (data) {
                        storageId = ''
                        storage('nav_idx', 0)
                        $(".nav-tabs li").removeClass('active')
                        $(".tab-pane").removeClass('active').removeClass('in')
                        $(".nav-tabs li").eq(0).trigger("click").addClass("active")
                        $("#materialList").addClass('in active')
                    }
                }
                //通过库房Id查看物料列表
                // tab页面切换函数
            }
        })
    }
    //点击下拉
    $("body #companyList").on("click", 'li', function () {
        companyAndStorageList($(this).attr("index"))
    })
    // 参数配置
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        $(".searchBox").hide()
        if (nav_idx == 0) {
            storageForMatterPage();
            $(".searchBox").show()
        }
        else if (nav_idx == 1) {
            storageForStoreIssuePage()
        }
        else if (nav_idx == 2) {
            storageForReturnMaterialPage()
        }
        else if (nav_idx == 3) {
            storageForOperationRecordPage()
        }
    }
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
})
function storageForMatterPage() {
    var appListData = {
        matterName: '',     //项目名称
        matterCode: '',       //创建单位
        storageId: storageId,    //库房Id
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.matterName = $(".searchVal").val()
    } else if ($(".advancedBox").hasClass("active")) {
        appListData.matterName = $(".matterName").val();
        appListData.matterCode = $(".matterCode").val();
    }
    if (!storageId) return initTable('materialListTable', [], materialCol)
    $http({
        url: '/gct-web/inventory/storageForMatterPage',
        data: appListData,
        success: function (r) {
            initTable('materialListTable', r.data, materialCol)
        }
    })
}
function storageForStoreIssuePage() {
    if (!storageId) return initTable('issueListTable', [], issueListCol)
    $http({
        url: '/gct-web/inventory/storageForStoreIssuePage',
        data: {
            storageId: storageId
        },
        success: function (r) {
            initTable('issueListTable', r.data, issueListCol)
        }
    })
}
function storageForReturnMaterialPage() {
    if (!storageId) return initTable('returnMaterialTable', [], returnMaterialCol)
    $http({
        url: '/gct-web/inventory/storageForReturnMaterialPage',
        data: {
            storageId: storageId
        },
        success: function (r) {
            initTable('returnMaterialTable', r.data, returnMaterialCol)
        }
    })
}
function storageForOperationRecordPage() {
    if (!storageId) return initTable('operationRecordsTable', [], operationRecordsTableCol)
    $http({
        url: '/gct-web/inventory/storageForOperationRecordPage',
        data: {
            storageId: storageId
        },
        success: function (r) {
            initTable('operationRecordsTable', r.data, operationRecordsTableCol)
        }
    })
}
var materialCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '150',
        'class':'matterTrClick'
    },
    {
        field: 'matterName',
        title: '物料名称',
        width: '150',
        'class':'matterTrClick'
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '100',
        'class':'matterTrClick'
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '100',
        'class':'matterTrClick'
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '100',
        'class':'matterTrClick'
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '100',
        'class':'matterTrClick'
    }, {
        field: 'storageMatter.matterNum',
        title: '库存量',
        width: '100',
        'class':'matterTrClick',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },
    {
        field: 'useNum',
        title: '使用量',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class=" m_col userNumClick overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    },
    {
        field: 'surplusNum',
        title: '现场余量',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="tit m_col siteMarginClick overf_Ec" style="display:inline-block; max-width:100px;">' + a+ '</span>'
        }
    }
]
var issueListCol = [
    {
        field: 'collerNo',
        title: '领料单号',
        width: '150',
        'class': 'issueClickBtn'
    },
    {
        field: 'createrName',
        title: '制单人',
        width: '150',
        'class': 'issueClickBtn'
    }, {
        field: 'receiveUserName',
        title: '领料人',
        width: '100',
        'class': 'issueClickBtn'
    }, {
        field: 'createTime',
        title: '发单时间',
        width: '200',
        'class': 'issueClickBtn',
        formatter: function (a) {
            if (!a) return ''
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '领料状态',
        width: '60',
        'class': 'issueClickBtn',
        formatter: function (a) {
            //领料状态：1-未领料；2-已领料
            return a == 1 ? '<span class="m_red">未领料</span>' : '<span class="m_col">已领料</span>'
        }
    },
    {
        title: '操作', width: "50",
        formatter: function (a, row) {
            var str = "";
            if (row.status == 1) str += '<span class = "delete_Matter m_red" data_power="Delete-feed-order-operation">删除</span>'
            else str += '<span class = "m_grey" data_power="Delete-feed-order-operation">删除</span>'
            return str
        }
    }
]
var returnMaterialCol = [
    {
        field: 'collerNo',
        title: '退料单号',
        width: '150',
        'class': 'returnMatterClick'
    },
    {
        field: 'createrName',
        title: '退料人',
        width: '100',
        'class': 'returnMatterClick'
    }, {
        field: 'receiveUserName',
        title: '确认人',
        width: '100',
        'class': 'returnMatterClick'
    }, {
        field: 'createTime',
        title: '退料时间',
        width: '200',
        'class': 'returnMatterClick',
        formatter: function (a) {
            return a ? initDate(a, 's') : ''
        }
    }, {
        field: 'status',
        title: '退料状态',
        width: '70',
        'class': 'returnMatterClick',
        formatter: function (a) {
            // 退料状态：4-已确认；3-未确认
            return a == 4 ? '<span class="m_col">已确认</span>' : '<span class="m_red">未确认</span>'
        }
    },
    {
        title: '操作', width: "100",
        formatter: function (a, row) {
            var str = "";
            //
            if (row.status == 4) str += '<span data_power="Return-confirmation-operation" class = " m_grey" >退料确认</span>'
            else str += '<span data_power="Return-confirmation-operation" class = "reject_Matter m_col" >退料确认</span>'
            return str
        }
    }
]
var operationRecordsTableCol = [
    {
        field: 'recordName',
        title: '操作事项',
        width: '200',
        'class': 'opertionClickBtn'
    },
    {
        field: 'createrName',
        title: '操作人',
        width: '250',
        'class': 'opertionClickBtn'
    }, {
        field: 'createTime',
        title: '操作时间',
        width: '200',
        'class': 'opertionClickBtn',
        formatter: function (a) {
            if (!a) return ''
            return initDate(a, 's');
        }
    }
]
//删除发料单
function deleteStoreIssueRecord(data) {
    $http({
        url: '/gct-web/inventory/deleteStoreIssueRecord',
        data: {
            storageLogId: data
        },
        success: function (r) {
            submitSuccess('', function () {
                storageForStoreIssuePage()
            })
        }
    })
}
