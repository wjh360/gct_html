$(function () {
    $(".searchVal").attr("maxLength", '50')
    var colFrame = [
        {
            field: 'bidName',
            title: '投标名称',
            width: '200'
        }, {
            field: 'contractName',
            title: '合同名称',
            width: '200'
        }, {
            field: 'contractNo',
            title: '合同编号',
            width: '100'
        }, {
            field: 'contractAmount',
            title: '合同金额(元)',
            width: '100'
        }, {
            field: 'typeName',
            title: '建设单位类型',
            width: '100'
        }, {
            field: 'depName',
            title: '项目部',
            width: '100'
        }, {
            field: 'trueName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTimeStamp',
            title: '创建时间 ',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            'class': 'operaction',
            width: '115',
            formatter: function (a, rows) {
                // 是否回执 1.已回执 2.未回执 isReceipt
                if (nav_idx == 0) {
                    if (!rows.id) return '<a data_power="Add-framework-contract-operation"  class="addManagement" title= "">添加</a><a data_power="Remove-framework-contract-operation" class=" m_grey" title= "">删除</a><a data_power="Business-administration_Receipt-operation" class="m_grey" title= "">回执</a>';
                    else return '<a  data_power="Edit-frame-contract-operation" class="editManagement" title= "">编辑</a><a data_power="Remove-framework-contract-operation" class=" ' + (rows.bidName ? 'm_grey' : 'delManagement m_red') + '" title= "">删除</a><a data_power="Business-administration_Receipt-operation" class="returnReceipt ' + (rows.isReceipt == 2 ? '' : 'm_grey') + ' " title= "">回执</a>'
                } else if (nav_idx == 1) {
                    return '<a data_power="Business-administration_Receipt-operation" class=" ' + (rows.isReceipt == 2 ? 'returnReceipt' : 'm_grey') + ' " title= "">回执</a>'
                }

            }
        }
    ]
    var colConstruct = [    //施工合同 表格参数
        {
            field: 'companyName',
            title: '创建单位',
            width: '150'
        }, {
            field: 'frameContract.contractName',
            title: '框架合同名称',
            width: '150'
        }, {
            field: 'contractName',
            title: '合同名称',
            width: '150'
        }, {
            field: 'contractNo',
            title: '合同编号',
            width: '150'
        }, {
            field: 'secondParty',
            title: '合同乙方',
            width: '100'
        }, {
            field: 'createrName',
            title: '创建人',
            width: '100'
        }, {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, {
            title: '操作',
            'class': '',
            width: '115',
            formatter: function () {
                return '<a data_power="Edit-construction-contract-operation" class="editConyract" title= "">编辑</a><a data_power="Delete-construction-contract-operation" class="delConyract m_red" title= "">删除</a>'
            }
        }
    ]
    //点击合同行的添加
    $("body").on("click", '.addManagement', function () {
        if (!tab_rowData.bId || !tab_rowData.bidName) return
        storage('BiddingId', tab_rowData.bId, 'addFramework');
        storage('BiddingName', tab_rowData.bidName, 'addFramework');
        goNewPage('./contractManagement/FrameworkContract/addFramework.html')
    })
    //添加合同的按钮
    $("body").on("click", '.addFrameWork', function () {
        storage('BiddingId', -1, 'addFramework');
        storage('BiddingName', -1, 'addFramework');
        goNewPage('./contractManagement/FrameworkContract/addFramework.html')
    })
    //添加施工合同
    $('body').on('click', '.addconstMent', function () {
        goNewPage("./contractManagement/constructionContract/addConstruction.html")
    })
    // tab页面切换函数
    switchTab()
    function switchTab() {
        if (nav_idx == 0) initFrameList()   //工作消息
        else if (nav_idx == 1) initFrameOtherList()   //工作消息
        else if (nav_idx == 2) initConstructList()    //系统消息
    }
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { switchTab() })
    var buildCompanyId; //初始建设单位类型id    如果有值则 目前登陆单位为建设单位
    //初始化 框架合同
    function initFrameList(page) {
        var t = $(".searchListFrame")
        var contractName = t.find('.contractName').val() ? t.find('.contractName').val() : $(".searchVal").val()
        var bidName = t.find('.bidName').val()
        var contractNo = t.find('.contractNo').val()
        var companyName = t.find('.companyName').val()
        var companyTtypeId = t.find('.companyTtype').attr('index')
        $http({
            url: '/gct-web/frameContract/frameContractListByPage',
            data: {
                contractName: contractName,          //合同名称
                bidName: bidName,                    //投标名称
                contractNo: contractNo,              //合同编号
                companyTtypeId: buildCompanyId ? buildCompanyId : companyTtypeId,       //建设单位类型
                companyName: companyName,              //创建单位
                // page: page ? apge :1
            },
            success: function (r) {
                initTable("frameTable", r.data, colFrame)
                if (r.dataOthers && r.dataOthers.companyType) {         //建设单位登陆
                    $("#companyTtype").html(r.dataOthers.companyType.typeName).addClass('overf_E').css({ 'border': 'none' })
                    buildCompanyId = r.dataOthers.companyType.id
                } else if (r.dataOthers && $("#companyTtype").find("li").length == 0) {                          //其他类型单位登陆
                    getDownSelect('companyTtype', '请选择建设单位类型', r.dataOthers.companyTypeList, 'id', 'typeName')
                }
            }
        })
    }
    //执行框架合同
    function initFrameOtherList() {
        var t = $(".searchListframeOthere")
        var contractName = t.find('.contractName').val() ? t.find('.contractName').val() : $(".searchVal").val()
        var bidName = t.find('.bidName').val()
        var contractNo = t.find('.contractNo').val()
        var companyName = t.find('.companyName').val()
        var companyTtypeId = t.find('.companyTtypeOther').attr('index')
        $http({
            url: '/gct-web/frameContract/frameContractListByDepAndPage',
            data: {
                contractName: contractName,          //合同名称
                bidName: bidName,                    //投标名称
                contractNo: contractNo,              //合同编号
                companyTtypeId: buildCompanyId ? buildCompanyId : companyTtypeId,       //建设单位类型
                companyName: companyName,              //创建单位
            },
            success: function (r) {
                initTable("frameOtherTable", r.data, colFrame)
                // $("#frameOtherTable").find(".operaction").hide()
                if (r.dataOthers && r.dataOthers.companyType) {         //建设单位登陆
                    $("#companyTtypeOther").html(r.dataOthers.companyType.typeName).addClass('overf_E').css({ 'border': 'none' })
                    buildCompanyId = r.dataOthers.companyType.id
                } else if (r.dataOthers && $("#companyTtypeOther").find("li").length == 0) {                          //其他类型单位登陆
                    getDownSelect('companyTtypeOther', '请选择建设单位类型', r.dataOthers.companyTypeList, 'id', 'typeName')
                }
            }
        })
    }
    //初始化 施工合同
    function initConstructList() {
        var t = $(".searchListConstruct")
        var contractName = t.find('.contractName').val() ? t.find('.contractName').val() : $(".searchVal").val()
        // var bidName = t.find('.bidName').val()
        var contractNo = t.find('.contractNo').val()
        var companyName = t.find('.companyName').val()
        var frameContractName = t.find(".frameContractName").val()
        $http({
            url: '/gct-web/constructContract/constructContractListByPage',
            data: {
                contractName: contractName,          //合同名称
                contractNo: contractNo,              //合同编号
                companyName: companyName,              //创建单位
                frameContractName: frameContractName     //框架合同
            },
            success: function (r) {
                initTable("constructTable", r.data ? r.data : [], colConstruct, {
                    total: r.total,
                })
            }
        })
    }
    //编辑框架合同
    $("body").on("click", '.editManagement', function () {
        if (!tab_rowData.id) return
        var frameContractId = tab_rowData.id
        storage("frameContractId", frameContractId, 'editFramework')  //框架合同id  编辑页面
        goNewPage("./contractManagement/FrameworkContract/editFramework.html")
    })
    //删除框架合同
    $("body").on("click", '.delManagement', function () {
        if (!tab_rowData.id) return
        var frameContractId = tab_rowData.id
        $.popConfirm({
            content: '确定删除吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/frameContract/doDel',
                    data: {
                        frameContractId: frameContractId
                    },
                    success: function (r) {
                        initFrameList()
                    },
                })
            }
        })
    })
    //查看框架合同详情
    $("body").on("click", '#frameTable tbody tr,#frameOtherTable tbody tr', function (e) {
        if (!tab_rowData.id) return
        var frameContractId = tab_rowData.id
        if (frameContractId) {
            storage("frameContractId", frameContractId, 'detailsFramework')  //框架合同id  编辑页面
            goNewPage("./contractManagement/FrameworkContract/detailsFramework.html")
        }
    })
    //编辑 施工合同
    $("body").on("click", '.editConyract', function () {
        if (!tab_rowData.id) return
        var constructContractId = tab_rowData.id
        storage("constructContractId", constructContractId, 'editConstruction')  //施工合同id  编辑页面
        goNewPage("./contractManagement/constructionContract/editConstruction.html")
    })
    //删除 施工合同
    $("body").on("click", '.delConyract', function () {
        if (!tab_rowData.id) return
        var constructContractId = tab_rowData.id
        $.popConfirm({
            content: '确定删除吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/constructContract/doDel',
                    data: {
                        constructContractId: constructContractId
                    },
                    success: function (r) {
                        initConstructList()
                    },
                })
            }
        })
    })
    //查看 施工合同详情
    $("body").on("click", '#constructTable tbody tr', function () {
        if (!tab_rowData.id) return
        var constructContractId = tab_rowData.id
        storage("constructContractId", constructContractId, 'detailsConstruction')  //施工合同id  详情页面
        goNewPage("./contractManagement/constructionContract/detailsConstruction.html")
    })
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })

    //  点击回执
    $("body").on("click", '.returnReceipt', function () {
        if (!tab_rowData.id) return false;
        var str = '<div style="margin-top: 17px"><span class="tan_text"><i class="m_red">*</i>投标保证金回款金额：</span><input class="inputOrgan  money bondBackAmount" maxlength="13" style="width: 260px"></div>';

        $.popConfirm({
            title: '保证金回执',
            content: str,
            confirm: function () {
                var addObj = {
                    bondBackAmount: $(".bondBackAmount").val(),
                    id: tab_rowData.id

                }
                if (!addObj.bondBackAmount||addObj.bondBackAmount==0) { $.popInfo("请填写投标保证金回款金额"); return false; }
                else {
                     getReceipt(addObj)
                }
            }
        })

    })
    function getReceipt(data) {
        $http({
            url: '/gct-web/frameContract/getReceipt',
            data: data,
            success: function (r) {
                submitSuccess('', function () {
                    switchTab()
                })
            }
        })
    }
})
