
var strList = {}, //部门名称 数据序列
    selectedDepId = [],  //选中部门的id
    companyTreeObj = {}  //公司树对象
var BiddingId = storage('BiddingId');
var BiddingName = storage('BiddingName');
$(function () {
    if (!BiddingId) $(".BiddingName").parent().hide()
    else $(".BiddingName").html(BiddingName)
    $http({
        url: '/gct-web/frameContract/beforeAdd',
        data: {
            bidId: BiddingId
        },
        success: function (r) {
            //投标名称
            if (!r.data) return false;
            //回显 默认建设单位类型
            if (r.data.companyTypeList && r.data.companyTypeList.length > 0) {
                getDownSelect("companyTypeList", r.data.companyTypeList[0].typeName, r.data.companyTypeList, "id", "typeName")
                $(".companyTypeList").attr('index', r.data.companyTypeList[0].id)
            }
            //回显默认 建设单位
            if (r.data.operatorList) getDownSelect("operatorList", '请选择', r.data.operatorList, "id", "companyName")
            if (r.data.company) {
                createTree([r.data.company], $("#comply_trees"), 'comply_tree', {
                    init: initDepMents,
                    childName: 'companyName'
                })
                var companyTreeObj = $.fn.zTree.getZTreeObj('comply_tree');
                var nodes = companyTreeObj.getNodes();
                companyTreeObj.expandNode(nodes[0], true, false, false);
                companyTreeObj.selectNode(nodes[0]);
            }
            if (r.data.depList && r.data.depList.length > 0) {
                createTree(r.data.depList, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    onCheck: depOnCheck
                })
            }
            if (BiddingId) {
                if (r.data.bondAmount) $(".bondAmount").val(r.data.bondAmount).attr("disabled", true)
            }
        }
    })
    // 根据公司类型 获取 同类型的公司
    var newDownSelectIdx = 0;  //新建的单位下拉
    $("body").on("click", '.downSelect li', function () {
        var companyTypeId = $(this).attr("index")
        var isCompanyType = $(this).parents("#companyTypeList").length ? true : false
        var objData = isCompanyType ? { companyTypeId: companyTypeId } : { companyId: companyTypeId }
        //删除 后面的所有选择  重新渲染下级单位
        for (var index = $(this).parents(".downSelect").index() + 1; index <= newDownSelectIdx; index++) {
            $('#operatorList' + index).remove()
        }
        if (!isCompanyType) newDownSelectIdx = $(this).parents(".downSelect").index() + 1
        $http({
            url: '/gct-web/frameContract/getCompanyByTypeId',
            data: objData,
            success: function (r) {

                if (!r.data || !r.data.length) return
                var strId = ""
                if (isCompanyType) {
                    strId = 'operatorList'
                    // getDownSelect("operatorList", '请选择', r.data, "id", "companyName")
                } else {
                    // var idx = newDownSelectIdx++
                    strId = 'operatorList' + newDownSelectIdx
                    $(".bulidCompanyList").append('<div id="' + strId + '" class="downSelect f_l" style="width:300px;margin: 5px;"></div>')
                }
                getDownSelect(strId, '请选择', r.data, "id", "companyName")
            }
        })
    })
    //公司点击事件 初始化 部门树
    function initDepMents(a, b, c) {
        $http({
            url: '/gct-web/frameContract/getDepByCompanyId',
            data: {
                companyId: c.id   //公司id
            },
            success: function (r) {
                $("#dep_trees").html("")
                if (!r.data.length) return false
                createTree(r.data, $("#dep_trees"), 'dep_tree', {
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
            }
        })
    }
    //部门点击事件
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
    function showSelectedDep() {
        var str = ""
        $(".Selected_dep_list").html("")
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
        $(".Selected_dep_list").append(str)
    }
    fileUploader({
        btn: 'postFileBtn',
        data: [],
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
        if (orFileData['postFileBtn'].length == 0) return $.popInfo('合同附件至少上传一张！')
        newPostObj.fileStr = JSON.stringify(orFileData['postFileBtn'])
        newPostObj.fileUrlDel = delFileObjUrlList.join(",");//路径
        newPostObj.bidId = BiddingId;//投标id
        $.popConfirm({
            'title': '',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/frameContract/doAdd',
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