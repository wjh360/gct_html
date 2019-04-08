 var strList = {}, //部门名称 数据序列
    selectedDepId = [],  //选中部门的id
    companyTreeObj = {}  //公司树对象
var newDownSelectIdx = 0;  //新建的单位下拉
$(function () {
    var frameContractId = storage("frameContractId") //框架合同id
    var postObj = {
        contractName: "合同名称",
        contractNo: "合同编号",
        contractAmount: "合同金额",
        startTime: "合同周期开始时间",
        endTime: "合同周期结束时间",
        // operator:"建设单位", 
        paymentMode: "付款方式",
        balanceMode: "结算方式",
        // isAdvance:"",            //有无预付：1-有；2-无
        bondAmount: "保证金金额",
        discount: '折扣系数'
        // depIdStr:"项目部部门ID", 
        // fileStr:"文件", 
    }
    $http({
        url: '/gct-web/frameContract/beforeUpdate',
        data: {
            frameContractId: frameContractId
        },
        success: function (r) {
            //投标名称
            if (r.data.frameContract.bidName) {
                $(".BiddingName").html(r.data.frameContract.bidName);
                $(".bondAmount").attr("disabled", true)
            }
            else $(".BiddingName").parent().hide()
            //框架合同数据回显
            if (r.data.frameContract) eachData(postObj, r.data.frameContract)
            if (r.data.frameContract && r.data.frameContract.isAdvance) $("[name = isAdvance][value = " + r.data.frameContract.isAdvance + "]").attr("checked", "checked")
            //标识：0-执行部门可编辑；1-执行部门不可编辑
            if (!r.data.fcdList) return false;
            $.each(r.data.fcdList, function (i, val) {
                var companyId = val.company.id
                strList[companyId] = strList[companyId] ? strList[companyId] : {
                    companyName: val.company.companyName,
                    depList: []
                }
                strList[companyId]['depList'].push(val.depName)
                selectedDepId.push(val.depId)
            })
            if (!r.data.fileList) return false;
            orFileData['postFileBtnEcho'] = r.data.fileList
            fileUploader({
                btn: 'postFileBtn',
                data: orFileData['postFileBtnEcho'],
                tabId: 'fileListTable',
                col: fileCol,
                other: {
                    fileType: {
                        title: 'fileType',
                        extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                        mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                    }
                }
            })
            //回显 默认建设单位类型
            if (r.data.companyTypeList && r.data.companyTypeList.length) {
                downSelectEcho({
                    el: 'companyTypeList',
                    data: r.data.companyTypeList,
                    ratioName: 'pitchOn',
                    ratio: -1,
                    idx: 'id',
                    txt: 'typeName'
                })
            }
            // //回显默认 建设单位
            if (r.data.lists) {
                viewBuildCompany(r.data.lists)
                var operDate = {}
                var isCompanyType = $(this).parents("#companyTypeList").length ? true : false
                operDate.companyId = r.data.frameContract.operator;//公司
                newDownSelectIdx =r.data.lists.length+1
                getCompanyByTypeId(isCompanyType,operDate)
            }
            if (r.data.icon == 0) {
                showSelectedDep()
                if (!r.data.company) return false;
                createTree([r.data.company], $("#comply_trees"), 'comply_tree', {
                    init: initDepMents,
                    childName: 'companyName'
                })
                var companyTreeObj = $.fn.zTree.getZTreeObj('comply_tree');
                var nodes = companyTreeObj.getNodes();
                companyTreeObj.expandNode(nodes[0], true, false, false);
                companyTreeObj.selectNode(nodes[0]);
                if (!r.data.depList) return false;
                createTree(r.data.depList, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    onCheck: depOnCheck
                })
                //回显 已选中的
                var treeObj = $.fn.zTree.getZTreeObj("dep_tree");
                $.each(selectedDepId, function (i, val) {
                    var nodes = treeObj.getNodeByParam("id", val);
                    if (nodes) {
                        nodes.checked = true
                        treeObj.updateNode(nodes)
                    }
                })
            } else {
                showSelectedDep($(".selectDepBox"))
            }
        }
    })

    function viewBuildCompany(list) {
        $.each(list, function (i, val) {
            var strId = ""
            if (i == 0) {
                strId = 'operatorList'
                // getDownSelect("operatorList", '请选择', r.data, "id", "companyName")
            } else {
                newDownSelectIdx = i + 1
                strId = 'operatorList' + newDownSelectIdx
                $(".bulidCompanyList").append('<div id="' + strId + '" class="downSelect f_l" style="width:300px;margin: 5px;"></div>')
            }
            downSelectEcho({
                el: strId,
                data: val,
                ratioName: 'pitchOn',
                ratio: -1,
                idx: 'id',
                txt: 'companyName'
            })
        })
    }

    //回显 下拉
    function downSelectEcho(data) {
        data = {
            el: data.el,                //元素id
            data: data.data,            //数据
            ratioName: data.ratioName,   // 需要比值的 键名
            ratio: data.ratio,           // 需要比值的 基准值
            idx: data.idx,               // 需要区分的键名 唯一标识 
            txt: data.txt,               // 中文名字 所在的键名
            type: data.type              //比值类型  '==' 的情况下 数据 val[data.ratioName] == 基准值  否则  就是 ！=
        }
        var NewName = "请选择"
        var NewId = ""
        $.each(data.data, function (index, val) {
            if (data.type == '==') {
                if (val[data.ratioName] == data.ratio) {
                    NewId = val[data.idx]
                    NewName = val[data.txt]
                }
            } else {
                if (val[data.ratioName] != data.ratio) {
                    NewId = val[data.idx]
                    NewName = val[data.txt]
                }
            }
        })
        getDownSelect(data.el, NewName, data.data, data.idx, data.txt)
        $("." + data.el).attr('index', NewId)
    }

    // 根据公司类型 获取 同类型的公司
    $("body").on("click", '.downSelect li', function () {
        var companyTypeId = $(this).attr("index")
        var isCompanyType = $(this).parents("#companyTypeList").length ? true : false
        var objData = isCompanyType ? {companyTypeId: companyTypeId} : {companyId: companyTypeId}
        //删除 后面的所有选择  重新渲染下级单位
        for (var index = $(this).parents(".downSelect").index() + 1; index <= newDownSelectIdx; index++) {
            $('#operatorList' + index).remove()
        }
        if (!isCompanyType) newDownSelectIdx = $(this).parents(".downSelect").index() + 1
        getCompanyByTypeId(isCompanyType, objData)
    })


    function getCompanyByTypeId(isCompanyType, objData) {
        $http({
            url: '/gct-web/frameContract/getCompanyByTypeId',
            data: objData,
            success: function (r) {
                if (!r.data || !r.data.length) return
                if (isCompanyType) {
                    getDownSelect("operatorList", '请选择', r.data, "id", "companyName")
                } else {
                    $(".bulidCompanyList").append('<div id="operatorList' + newDownSelectIdx + '" class="downSelect f_l" style="width:300px;margin: 5px;"></div>')
                    getDownSelect('operatorList' + newDownSelectIdx, '请选择', r.data, "id", "companyName")
                }
            }
        })
    }

    //
    //初始化部门 list
    function initDepMents(a, b, c) {
        $http({
            url: '/gct-web/frameContract/getDepByCompanyId',
            data: {
                companyId: c.id   //公司id
            },
            success: function (r) {
                $("#dep_trees").html("")
                createTree(r.data, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    onCheck: depOnCheck
                })
                //回显 已选中的
                var treeObj = $.fn.zTree.getZTreeObj("dep_tree");
                // log(treeObj)
                $.each(selectedDepId, function (i, val) {
                    var nodes = treeObj.getNodeByParam("id", val);
                    if (nodes) {
                        nodes.checked = true
                        treeObj.updateNode(nodes)
                    }
                })
            }
        })
    }

    function depOnCheck(a, b, c, d) {
        var treeObj = $.fn.zTree.getZTreeObj('comply_tree');
        var company = treeObj.getNodeByTId($(".curSelectedNode").parent("li").attr("id"));
        var companyId = company.id
        if (c.checked) {
            strList[companyId] = strList[companyId] ? strList[companyId] : {
                companyName: company.companyName,
                depList: []
            }
            strList[companyId]['depList'].push(c.depName)
            selectedDepId.push(c.id)
        } else {
            strList[companyId]['depList'].splice(strList[companyId]['depList'].indexOf(c.depName), 1)
            selectedDepId.splice(selectedDepId.indexOf(c.id), 1)
        }
        showSelectedDep()
    }

    function showSelectedDep(el) {
        if (!el) el = $(".Selected_dep_list")
        var str = ""
        el.html("")
        for (var k in strList) {
            if (strList[k]['depList'].length) {
                str += '<li >' +
                    '<p class="company_name">' + strList[k].companyName + '</p>' +
                    '<p class="dep_name">' +
                    strList[k]['depList'].join("、 ") +
                    '</p>' +
                    '</li>'
            }
        }
        el.append(str)
    }

    // function getFileList(arr) {
    //     $.each(arr,function(i,val){
    //         if(!val.init){
    //             val.init = getFileList
    //             val.eleName = 'postFileBtn'
    //         }
    //     })
    //     initTable("fileListTable",arr , fileCol)
    // }
    // postFiles("postFileBtn", true, { init: getFileList })
    //  r.data.fileList
    $("body").on("click", '.postBtn', function () {
        var newPostObj = {}
        for (var k in postObj) {
            newPostObj[k] = $("." + k).val()
            if (!newPostObj[k]) return $.popInfo(postObj[k] + '错误！请确认')
        }
        newPostObj.isAdvance = $("input[name='isAdvance']:checked").val()
        newPostObj.operator = returnValue(newDownSelectIdx)
        if (!newPostObj.operator) return $.popInfo('请选择建设单位！')
        newPostObj.depIdStr = selectedDepId.join()
        if (!newPostObj.depIdStr) return $.popInfo('请选择项目部！')
        if (checkFileList('postFileBtn')) return $.popInfo('合同附件至少上传一张！')
        newPostObj.fileStr = JSON.stringify(orFileData['postFileBtn'])
        newPostObj.fileUrlDel = delFileObjUrlList.join(",");//路径
        newPostObj.ids = delFileIdList.join(",");//提交状态
        newPostObj.id = frameContractId
        // log(newPostObj)
        $.popConfirm({
            'title': '',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/frameContract/doUpdate',
                    data: newPostObj,
                    success: function (r) {
                        submitSuccess('', function () {
                            goBack()
                        })
                    }
                })
            }
        })
    })

    //获取建设单位 id
    function returnValue(newDownSelectIdx) {
        for (var index = newDownSelectIdx; index >= 2; index--) {
            if ($('.operatorList' + index).attr('index')) {
                return $('.operatorList' + index).attr('index')
            }
        }
        return $(".operatorList").attr("index")
    }
})