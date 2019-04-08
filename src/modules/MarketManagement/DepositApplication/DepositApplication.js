$(function () {
    // log(curPowerObj)
    // 初始化列表
    var col = [{
        field: 'bidNo',
        title: '编号',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'bidName',
        title: '投标名称',
        width: '200'
    }, {
        field: 'bidUnit',
        title: '发标单位',
        width: '150'
    }, {
        field: 'typeName',
        title: '项目类型',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'bidDate',
        title: '预计投标时间',
        width: '100',
        formatter: function (a) {
            return initDate(a)
        }
    }, {
        field: 'inviteAmount',
        title: '招标金额（元）',
        width: '150',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'status',
        title: '状态',
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
        width: '100',
        formatter: function (a, b) {
            // 未提交  对应   添加
            // 已保存  对应   编辑
            // 未过审  对应   编辑
            // 审核中  对应   编辑（置灰）
            // 已过审  对应   中标
            // 已完成  对应   中标
            // 已中标  对应   中标（置灰）
            // 未中标  对应   回执
            // 已回执  对应   回执（置灰）

            var str=''
            if (b.status == '未提交') str+= '<a data_power="Add-margin-application-operation" class="addDeposit" title="">添加</a>'
            else if (b.status == '已保存') str+= '<a data_power="Editing-margin-application-operation" class="editDeposit" title= "">编辑</a>'
            else if (b.status == '未过审') str+= '<a data_power="Editing-margin-application-operation" class="editDeposit" title= "">编辑</a>'
            else if (b.status == '审核中') str+= '<a data_power="Editing-margin-application-operation" class="noEdit" title= "">编辑</a>'
            else if (b.status == '已过审') str+= '<a data_power="Winning-bid-operation" class="suc_Deposit" title= "">中标</a>'
            else if (b.status == '已完成') str+= '<a data_power="Winning-bid-operation" class="suc_Deposit" title= "">中标</a>>'
            else if (b.status == '已中标') str+= '<a data_power="Winning-bid-operation" class="noEdit" title= "">中标</a>'
            else if (b.status == '未中标') str+= '<a data_power="Market-Management_Receipt-operation" class="huizhi" title= "">回执</a>'
            else if (b.status == '已回执') str+= '<a data_power="Market-Management_Receipt-operation" class="noEdit" title= "">回执</a>'

            return str; 
            // if (b.status == '未提交') return '<a data_power="Add-margin-application-operation" class="addDeposit" title="">添加</a><a data_power="Winning-bid-operation" class="noEdit" title= "">中标</a>'
            // if (b.status == '已保存' || b.status == '未过审') return '<a data_power="Editing-margin-application-operation" class="editDeposit" title= "">编辑</a><a data_power="Winning-bid-operation" class="noEdit" title= "">中标</a>'
            // if (b.status == '未中标' || b.status == '审核中' || b.status == '已中标') return '<a data_power="Editing-margin-application-operation" class="noEdit" title= "">编辑</a><a data_power="Winning-bid-operation" class="noEdit" title= "">中标</a>'
            // if (b.status == '已过审') return '<a data_power="Editing-margin-application-operation" class="noEdit" title= "">编辑</a><a data_power="Winning-bid-operation" class="suc_Deposit" title= "">中标</a>'
            // else return '<a data_power="Editing-margin-application-operation" class="noEdit" title= "">编辑</a><a data_power="Winning-bid-operation" class="suc_Deposit" title= "">中标</a>'
        }
    }
    ]
    //初始化  项目类型下拉框
    ProjectTypeList()
    function ProjectTypeList() {
        $http({
            url: '/gct-web/bidApply/getProjectTypeEcho',
            success: function (r) {
                getDownSelect("type", '请选择项目类型', r.data.list, 'id', 'typeName')
            }
        })
    }
    //   js
    //初始化 保住金申请列表1
    // limit       //每页显示条数
    // current     //当前页
    // bidName   //投标名称  字符串
    // bidUnit    //投标单位   字符串
    // type      //项目类型ID  数字
    // status     //状态  数 (8.未提交 1.已保存 2.已完成 3.审核中 4.未过审 5.已过审 6.未中标）
    initDepositApplication()
    function initDepositApplication() {
        bidName = $(".bidName").val() || $(".searchVal").val()
        bidUnit = $(".bidUnit").val()
        type = $(".type").attr("index")
        sts = $(".statusType").attr("index")
        $http({
            url: '/gct-web/bondApply/getBondApplyPage',
            data: {
                limit: 10,
                bidName: bidName,
                bidUnit: bidUnit,
                type: type,
                status: sts
            },
            success: function (r) {
                initTable("DepositListTable", r.data, col, {
                    total: r.data,
                })

                $("#DepositListTable .operate").each(function(k,v){
                    // log($(v).find("a").length)
                    if($(v).find("a").length){
                        $("#DepositListTable .operate").show()
                        return false;
                    }
                })
            }
        })
    }
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initDepositApplication()
    })
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initDepositApplication()
    })
    //点击添加
    $("body").on("click", '.addDeposit', function () {
        storage("auditItem", 1003, 'addDeposit') //事项编码  保证金申请页面
        storage("BiddingId", tab_rowData.id, 'addDeposit') //投标id 保证金申请添加
        goNewPage("./DepositApplication/addDeposit.html")
    })
    //点击编辑
    $("body").on("click", '.editDeposit', function () {
        storage("auditItem", 1003, 'editDeposit') //事项编码  保证金申请页面
        storage("BiddingId", tab_rowData.id, 'editDeposit') //投标id 保证金申请详情
        storage("BondId", tab_rowData.bondId, 'editDeposit') //保证金id 保证金申请详情
        goNewPage("./DepositApplication/editDeposit.html")
    })
    //点击详情
    $("body").on("click", '#DepositListTable tbody tr', function () {
        if (tab_rowData.status == '未提交') {
            return
        } else {
            storage("BiddingId", tab_rowData.id, 'detailsDeposit') //投标id 保证金申请详情
            storage("BondId", tab_rowData.bondId, 'detailsDeposit') //保证金id 保证金申请详情
            storage("statuShhow", tab_rowData.status, 'detailsDeposit') //是否显示字段的状态
            goNewPage("./DepositApplication/detailsDeposit.html")
        }
    })
    //中标
    $('body').on('click', '.suc_Deposit', function () {
        log(tab_rowData)
        $.popConfirm({
            'title': '是否中标',
            'content': '<div class="RoleDiv"style="margin-bottom: 5px">' +
                ' <span class="nameId">请选择：</span> ' +
                '<span class="nameCon"> <span><input class="status f_l yes" type="radio" name="attr" index="1" value="是" style="min-height: 28px;">' +
                '<span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">是</span>' +
                '<input class="status no f_l" type="radio" name="attr" index="2" class="f_l" style="margin-left: 20px; min-height: 28px;" value="否">' +
                ' <span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">否</span></span></span></div></div>',
            confirm: function () {
                var status = $("input[name='attr']:checked").attr('index')
                if (!status) {
                    $.popInfo("请选择！")
                    return false
                } else {
                    costAdd()
                    function costAdd() {
                        $http({
                            url: '/gct-web/bondApply/getBondApplyBid',
                            data: {
                                status: status,
                                bidId: tab_rowData.id
                            },
                            success: function (r) {
                                if (status == '1') {
                                    submitSuccess('恭喜您中标了!', function () {
                                        initDepositApplication()
                                    })
                                }
                                if (status == '2') {
                                    submitSuccess('再接再厉！', function () {
                                        initDepositApplication()
                                    })
                                }
                            }
                        })
                    }
                }
            }
        })
    })

    // 回执
    $('body').on('click', '.huizhi', function () {
        // log(tab_rowData)
        var str =  '<div class="Role-noticeCon">' +
        '<div class="RoleDiv"style="margin-bottom: 5px">' +
        '<span class="nameId"style="width:160px;"><i>*</i>投标保证金回款金额：</span>' +
        '<span class="nameCon clearfix">' +
        '<input  class="bondBackAmount money"maxlength="13" type="text"style="width: 240px;">' +
        '</span>' +
        ' </div>' +
        ' <div class="RoleDiv"style="margin-bottom: 5px">' +
        '<span class="nameId"style="width:160px;"><i>*</i>履约保证金回款金额：</span>' +
        '<span class="nameCon"><input  class="perforBackAmount money" type="text" style="width: 240px;"  maxlength="13" ></span>' +
        '</div></div>'
        $.popConfirm({
            title: '保证金回执',
            content:str,

            confirm: function () {
                var appObj={
                    bondBackAmount : $(".bondBackAmount").val(),//投标保证金回款金额
                    perforBackAmount : $(".perforBackAmount").val(),//履约保证金回款金额
                    id: tab_rowData.bondId,
                }
                // var id = tab_rowData.bondId
                if (!appObj.bondBackAmount) {
                    $.popInfo("投标保证金回款金额不能为空！")
                    return false
                }
                else if (!appObj.perforBackAmount) {
                    $.popInfo("履约保证金回款金额不能为空！")
                    return false
                } else {
                    getReceipt(appObj)
                    
                }
            }
        })
    })
    function getReceipt(data) {
        $http({
            url: '/gct-web/bondApply/getReceipt',
            data:data,
            success: function (r) {
                submitSuccess('', function () {
                    initDepositApplication()
                })
                // submitSuccess('', function () {
                //     initDepositApplication()
                // })
            }
        })
    }
})
