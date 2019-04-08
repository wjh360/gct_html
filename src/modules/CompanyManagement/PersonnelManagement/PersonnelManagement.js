$(function () {

    $('.searchVal').attr("maxLength", 10)
    //人员列表配置
    var col = [
        {
            field: 'userName',
            title: '账号',
            width: '150'
        }, {
            field: 'trueName',
            title: '姓名',
            width: '100'
        }, {
            field: 'sex',
            title: '性别',
            width: '30'
        }, {
            field: 'roleName',
            title: '角色',
            width: '100'
        }, {
            field: 'createName',
            title: '创建人',
            width: '150'
        }, {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            'class': 'proListPersonnel',
            width: '100',
            formatter: function () {
                return '<a class="editRole" title= "" data_power="Edit-personnel-operation">编辑</a><a class="delPerson m_red" title= "" data_power="Delete-personnel-operation">删除</a>'
            }
        }
    ]
    // 

    var departmentId = ""
    var curDepPersonList = []

    creatZtree()
    //初始化部门树
    function creatZtree() {

        $http({
            url: '/gct-web/dep/getDepAll',
            success: function (r) {
                r.data = r.data.length ? r.data : []
                createTree(r.data, $('#treeDemo'));
                var zTree = $.fn.zTree.getZTreeObj("tree");
    
                if (r.data.length) {
                    var node = zTree.getNodeByParam("id", r.data[0].id);
                    departmentId = r.data[0].id
                    storage('departmentId', departmentId, 'addPersonnel') //部门id 添加人员页面
                    storage('departmentName', r.data[0].depName, 'addPersonnel') //部门名称 添加人员页面
                    zTree.checkNode(node, true, true);
                    zTree.selectNode(node);
                }

                getRoleAll('roleAllList')
                initPersonList()
            }
        })
    }

    //点击编辑
    $("body").on("click", '.editRole', function () {
        // log()
        storage("personId", tab_rowData.id, 'editPersonnel') //人员id  编辑人员页面

        goNewPage("./PersonnelManagement/editPersonnel.html")
    })

    //点击删除人员
    $("body").on("click", '.delPerson', function () {
        // log()
        $.popConfirm({
            content: '确定删除吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/sysUser/getSysUserDel',
                    data: {
                        id: tab_rowData.id          //人员ID 数字
                    },
                    success: function (r) {

                        initPersonList()
                    }
                })
            }
        })
    })


    $("body").on("click", '#perSonListTable tbody tr', function () {
        // log(tab_rowData)
        storage("personId", tab_rowData.id, 'detailsPersonnel') //人员id 人员详情
        goNewPage("./PersonnelManagement/detailsPersonnel.html")
    })


    //初始化 人员列表

    // current     //当前页 数字         暂不用传 自动添加
    // limit       //没页显示条数 数字 暂不用传 自动添加
    // trueName    //姓名  字符串
    // userName    //账号 字符串  
    // roleId      //角色ID  数字
    function initPersonList() {
        trueName = $(".searchVal").val() ? $(".searchVal").val() : $(".searchList .trueName").val()
        userName = $(".searchList .userName").val()
        roleId = $(".roleAllList").attr("index") ? $(".roleAllList").attr("index") : ""
        $http({
            url: '/gct-web/sysUser/getSysUserPage',
            data: {
                trueName: trueName,
                userName: userName,
                roleId: roleId,
                depId: departmentId
            },
            success: function (r) {
                curDepPersonList = r.data
                storage('curDepPersonListLen', curDepPersonList.length + "", 'addPersonnel')
                initTable("perSonListTable", r.data, col, {
                    total: r.data,
                })
            }
        })
    }



    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () { initPersonList() })

    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () { initPersonList() })



    //部门点击事件 
    function treeClick(event, treeId, treeNode) {
        departmentId = treeNode.id
        storage('departmentId', departmentId, 'addPersonnel') //部门id 添加人员页面
        storage('departmentName', treeNode.depName, 'addPersonnel') //部门名称 添加人员页面
        initPersonList()
    }
    //添加部门
    function addOneDep(depName, trnode, zTree) {
        zTree = $.fn.zTree.getZTreeObj("tree");
        $http({
            url: '/gct-web/dep/getDepInsert',
            data: {
                depName: depName,
                fatherDep: trnode ? trnode.id : 0,
                depType: trnode ? trnode.depType + 1 : 1
            },
            success: function (r) {
                var newNode = {
                    depName: depName,
                    id: r.data.id,
                    depType: trnode ? trnode.depType + 1 : 1
                };

                if (zTree) {
                    if (trnode) {
                        trnode.noRemoveBtn = true
                        trnode.showRemoveBtn = undefined
                    }

                    zTree.addNodes(trnode, newNode)

                    // zTree.updateNode(trnode, true)
                    var node = zTree.getNodeByParam("id", newNode.id)
                    departmentId = newNode.id
                    storage('departmentId', departmentId, 'addPersonnel') //部门id 添加人员页面
                    storage('departmentName', newNode.depName, 'addPersonnel') //部门名称 添加人员页面
                    zTree.checkNode(node, true, true);
                    zTree.selectNode(node);
                    initPersonList()
                }
                // 
                else { creatZtree() }
            }
        })
    }

    ///创建一级部门事件
    $("body").on('click', '.creatFirstDep', function (event) {
        $.popConfirm({
            title: '创建部门',
            content: '<div class="tanTr" style="margin-top:20px;">部门名称：<input type="text" maxlength="10" value="" class="inputOrgan addOneDep" style="width:300px;height: 35px;"></div>',
            confirm: function () {
                if (!$(".addOneDep").val()) return $.popInfo('部门名称错误')
                else addOneDep($(".addOneDep").val())
            }
        })
    });


    //删除部门

    function deleteDepartment(trnode, ztree) {
        $http({
            url: '/gct-web/dep/getDepDelete',
            data: { id: trnode.id },
            success: function (r) {
                ztree.removeNode(trnode)
            }
        })


    }


    //更新部门
    function upDateDepartment(txt, id, ztree, trnode) {
        // log(ztree,trnode)
        $http({
            url: '/gct-web/dep/getDepUpdate',
            data: {
                depName: txt,
                id: id
            },
            success: function (r) {
                trnode.depName = txt
                ztree.updateNode(trnode, true)
            }
        })

    }





    //修改树节点
    function beforeEditName(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("tree");
        // console.log(treeNode);
        var treeObj = treeNode;
        var faterDep = treeObj.getParentNode()
        faterDep = faterDep ? faterDep.depName : ''
        $.popConfirm({
            title: '编辑部门',
            content: '<div class="tanTr" >上级部门：<span>' + faterDep + '</span></div>' +
                '<div class="tanTr">部门名称：<input type="text" maxlength="10" value="' + treeObj.depName + '" class="inputOrgan addXiaStaff">' +
                '</div>',
            confirm: function () {
                var txt = $(".addXiaStaff").val()
                if (!txt) return $.popInfo('部门名称不能为空');
                upDateDepartment(txt, treeNode.id, zTree, treeObj)
            }
        })
        return false

    }


    //删除树节点
    function beforeRemove(treeId, treeNode) {

        var zTree = $.fn.zTree.getZTreeObj("tree");
        zTree.selectNode(treeNode);
        // var treeObj = treeNode;
        $.popConfirm({
            title: '编辑部门',
            content: '<div class="warnIcon"><i></i> 确定要删除吗？</div>',
            confirm: function () {
                deleteDepartment(treeNode, zTree)
            }
        })
        return false;
    }


    //添加树节点
    function addHoverDom(treeId, treeNode) {
        // console.log(treeId,treeNode)
        var zTree = $.fn.zTree.getZTreeObj("tree");
        var treeObj = treeNode;
        //获取span元素
        var sObj = $("#" + treeNode.tId + "_span");

        //如果节点正在比编辑状态或者批量添加，直接返回
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        if (!curPowerObj['Add-lower-department-operations'] && !noAttrPower) return
        //添加节点的字符串
        // if (!powerPerson['rygl_tian_jia_bu_men_cao_zuo']) return
        // if(treeObj.depType >= 4) return false
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加下级部门' onfocus='this.blur();'></span>";


        //将添加的节点的字符串放到span元素的后面
        sObj.after(addStr);

        //获取添加按钮节点

        var btn = $("#addBtn_" + treeNode.tId);

        //添加按钮绑定事件
        if (btn) btn.bind("click", function () {
            //    log(treeObj)
            $.popConfirm({
                title: '创建部门',
                content: '<div class="tanTr" >上级部门：<span >' + treeObj.depName + '</span></div>' +
                    '<div class="tanTr">部门名称：<input type="text" maxlength="10" class="inputOrgan addXiaStaff">' +
                    '</div>',
                confirm: function () {
                    var depName = $(".addXiaStaff").val()
                    if (!depName) return $.popInfo("部门名称不能为空");
                    // console.log(treeObj)
                    addOneDep(depName, treeObj, zTree)
                }
            })
        });
    }

    function removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId).unbind().remove();
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
                enable: true,
                drag: {
                    isCopy: false,
                    isMove: false
                },
                editNameSelectAll: true,
                showRemoveBtn: function (treeId, treeNode) {
                    if (!treeNode.children || !treeNode.children.length) {
                        if (noAttrPower || curPowerObj['Delete-departmental-actions']) return true
                    }
                },
                removeTitle: "删除部门",
                renameTitle: "编辑部门",
                showRenameBtn: function (treeId, treeNode) {
                    if (noAttrPower || curPowerObj['Edit-department-operation']) return true

                }
            },
            data: {
                simpleData: {
                    enable: true
                },
                key: {
                    name: "depName"
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
})


