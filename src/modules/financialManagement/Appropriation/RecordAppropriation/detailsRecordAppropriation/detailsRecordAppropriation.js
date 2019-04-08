$(function () {
    var contractRecordId = storage("contractRecordId")//工程款支付ID
    // 编辑回显
    appropriateLogInfo()
    function appropriateLogInfo() {
        $http({
            url: '/gct-web/finance/appropriateLogInfo',
            data: {
                id: contractRecordId  //工程款支付ID
            },
            success: function (r) {
                var a = r.data
                $(".contractName").html(a.constructContract.contractName)//合同名称
                $(".secondParty").html(a.constructContract.secondParty)//乙方
                $(".ratio").html(a.appropriate.ratio)//比例
                $(".nowAmount").html(a.appropriate.nowAmount + "元")//待支付金额
                $(".amount").html(a.appropriateLog.amount + "元")
                // 工单列表
                initTable("taskListTable", r.data.list, taskListCol)
            }
        })
    }
    // 工单列表
    var taskListCol = [
        {
            field: 'taskName',
            title: '工单名称',
            width: '100',
            'class': 'companyName'
        }, {
            field: 'projectName',
            title: '项目名称',
            width: '100'
        }, {
            field: 'constructionUserName',
            title: '施工队长',
            width: '100',
            'class': 'companyName'
        }, {
            field: 'orderName',
            title: '订单名称',
            width: '100'
        }, {
            field: 'typeName',
            title: '竣工技术文件名称',
            width: '100',
            'class': 'companyName'
        }, {
            field: 'constructEstimate',
            title: '预估值（元）',
            width: '100'
        }, {
            field: 'finalValue',
            title: '决算值（元）',
            width: '100',
        }, {
            field: 'sumCost',
            title: '审定值（元）',
            width: '100'
        }
    ]
    
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx",nav_idx)
        switchTab()
    })
    function switchTab() {
        if (nav_idx == 0) appropriateLogInfo()
        if(nav_idx == 1) auditList()
    }
    // 操作记录
    auditList()
    function auditList() {
        $http({
            url: '/gct-web/audit/auditRecord',
            data: {
                id: contractRecordId,  //工程款支付ID
                auditItem: 6004
            },
            success: function (r) {
                $("#Operation_record").html("")
                $.each(r.data, function (index, eleVal) {
                    var str = '<div class="commonCon" style="margin-top:10px;">' +
                        '<div class="inforHeader clearfix">' +
                        '<div class="verHang f_l"></div>' +
                        '<div class="headerText f_l" style="margin-right:20px;">操作人：<span>' + eleVal.applyName + '</span></div>' +
                        '<div class="headerText f_l">操作时间：<span>' + initDate(eleVal.applyTime, 's') + '</span></div>' +
                        '</div>' +
                        '<div class="page" style=" margin-top: 10px; padding: 0 20px; ">' +
                        '<table id="Operation_recordTable' + index + '"></table>' +
                        '<div id="Operation_recordTable' + index + 'Page"></div>' +
                        '</div>' +
                        '</div>'
                    $("#Operation_record").append(str)
                    initTable('Operation_recordTable' + index, eleVal.list, Auditcol)
                })
            }
        })
    }
    var Auditcol = [
        {
            field: 'auditName',
            title: '审核人',
            width: '200'
        }, {
            field: 'auditTime',
            title: '审核时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's') || '暂无'
            }
        }, {
            field: 'status',
            title: '审核结果',
            width: '200',
            formatter: function (a) {
                return a == 5 ? '通过' : (a == 4 ? '驳回' : '暂无')
            }
        }, {
            field: 'auditRemark',
            title: '审核意见',
            width: '200',
        }
    ]
})