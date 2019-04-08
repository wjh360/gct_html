$(function () {
    var contractId = storage("contractId")//工程款支付ID
    // 添加回显
    appropriateLogAddEcho()
    function appropriateLogAddEcho() {
        $http({
            url: '/gct-web/finance/appropriateLogAddEcho',
            data: {
                appropriateId: contractId  //工程款支付ID
            },
            success: function (r) {
                var a = r.data
                if (!a) return false
                $(".contractName").html(a.constructContract.contractName)//合同名称
                $(".secondParty").html(a.constructContract.secondParty)//乙方
                $(".ratio").html(a.appropriate.ratio)//比例
                $(".nowAmount").html(a.appropriate.nowAmount + "元")//待支付金额
                // 工单列表
                initTable("taskListTable", r.data.list, taskListCol)
            }
        })
    }
    // 提交
    $("body").on("click", '.postBtn', function () {
        var postObj = {}
        postObj.amount = $(".amount").val(),
            postObj.appropriateId = contractId
        if (!postObj['amount']) return $.popInfo("请填写支付金额！")
        var str = $(".amount").val() > parseFloat($(".nowAmount").html()) ? '支付金额大于待支付金额，确定提交审核吗？' : '确定提交审核吗？'
        $.popConfirm({
            content: str,
            confirm: function () {
                $http({
                    url: '/gct-web/finance/appropriateLogAdd',
                    data: postObj,
                    success: function (r) {
                        submitSuccess('', function () {
                            goBack()
                        })
                    }
                })
            }
        })
    })
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
})