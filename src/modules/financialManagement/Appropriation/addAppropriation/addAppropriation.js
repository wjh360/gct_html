$(function () {
    var noTedData = []          //未选工单
    var selectedData = []       //已选选工单
    var selectedId = []         //已选工单id
    var count = 0;
    var curProjectId;
    initData()
    function initData(search) {
        $http({
            url: ' /gct-web/finance/appropriateAddEcho',
            data: {
                search: search,
                ids: selectedId.join()
            },
            success: function (r) {
                search || search === "" || getDownSelect('contractList', '请选择', r.data.contractList, 'id', 'contractName', ['secondParty']);
                noTedData = r.data.taskList
                resetTable()
            }
        })
    }
    //合同下拉点击 回显合同乙方
    $('body').on('click', '#contractList li', function () {
        $(".secondParty").html($(this).attr('morepar_secondparty'))
    })
    //重置表格
    function resetTable() {
        initTable('fileListTable', noTedData, col)
        initTable('selectedFileListTable', selectedData, colSelected)
        if (!selectedData.length) curProjectId = null;
        count = 0
        $.each(selectedData, function (index, eleVal) {
            if (eleVal.sumCost) {
                count += parseFloat(eleVal.sumCost)
            } else {
                count += parseFloat(eleVal.finalValue)
            }
        })
        count = $(".moneyBil").val() ? $(".moneyBil").val() * count : count
        $(".unpaid").html(count.toFixed(2) || '0.00')
    }
    //点击未选列表 选择工单 
    $('body').on('click', '#fileListTable tbody tr', function () {
        if (!curProjectId) curProjectId = tab_rowData.projectId
        else {
            if (tab_rowData.projectId != curProjectId) return $.popInfo('请选择同一个项目的工单!')
        }
        var idx = $(this).attr("data-index")
        selectedId.push(tab_rowData.id)
        noTedData.splice(idx, 1)
        selectedData.push(tab_rowData)
        resetTable()
    })
    //点击删除已选
    $('body').on('click', '#selectedFileListTable tbody tr .delTrData', function () {
        var idx = $(this).parents("tr").attr("data-index")
        selectedId.splice(idx, 1)
        selectedData.splice(idx, 1)
        noTedData.push(tab_rowData)
        resetTable()
    })
    //点击搜索 刷新 列表
    $('body').on('click', '.searchBtns', function () {
        initData($(".searchVal").val())
    })
    $(".moneyBil").bind("input propertychange", function () {
        var str = $(this).val()
        // log(str)
        if (isNaN(str)) str = '0.'
        else {
            if (str >= 1) str = '0.' + str
            else str = str
            if (str.lastIndexOf(".") != 1 && str.lastIndexOf(".") > -1) str = str.slice(0, str.lastIndexOf("."))
            if (str.indexOf('00') == 0) str = '0.0'
        }

        $(this).val(str)
        if (str > 0 && count > 0) {
            $(".unpaid").html((count * str).toFixed(2))
        }
    })
    $(".moneyBil").bind("blur", function () {
        var str = $(this).val()
        if (str == '0.' || !str || str == 0) {
            $(this).val('')
            $.popInfo('支付比例输入错误！')
        }
    })
    $('body').on('click', '.postBtn', function () {
        var obj = {
            ids: selectedId.join(),                    //：”1，2，3“ 工单ID
            ratio: $(".moneyBil").val(),                      //：比例
            amount: $(".money").val(),                      //： 支付金额
            contractId: $(".contractList").attr("index"),                      //：1  合同ID
        }
        if (!obj['contractId']) return $.popInfo("请选择施工合同！")
        if (!obj['ids']) return $.popInfo("请选择工单！")
        if (!obj['ratio']) return $.popInfo("请填写支付比例！")
        if (!obj['amount']) return $.popInfo("请填写支付金额！")
        // log(obj.amount >$(".unpaid").html())
        var str = parseFloat(obj.amount) > parseFloat($(".unpaid").html()) ? '支付金额大于待支付金额，确定提交审核吗？' : '确定提交审核吗？'
        // log(str)
        $.popConfirm({
            'content': str,
            'confirm': function () {
                $http({
                    url: ' /gct-web/finance/appropriateAdd',
                    data: obj,
                    success: function (r) {
                        submitSuccess("提交成功", function () {
                            goBack()
                        })
                    }
                })
            }
        })
    })
})
//所有工单
var col = [
    {
        field: 'taskName',
        title: '工单名称',
        width: 200
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 200
    }, {
        field: 'constructionUserName',
        title: '施工队长',
        width: 200
    }, {
        field: 'orderName',
        title: '订单名称',
        width: 200
    }, {
        field: 'typeName',
        title: '竣工技术文件名称',
        width: 200
    }, {
        field: 'constructEstimate',
        title: '预估值(元)',
        width: 200
    }, {
        field: 'finalValue',
        title: '决算值(元)',
        width: 200
    }, {
        field: 'sumCost',
        title: '审定值(元)',
        width: 200,
        formatter: function (a) {
            return a || '暂无'
        }
    },
]
//已选工单
var colSelected = [
    {
        field: 'taskName',
        title: '工单名称',
        width: 200
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 200
    }, {
        field: 'constructionUserName',
        title: '施工队长',
        width: 200
    }, {
        field: 'orderName',
        title: '订单名称',
        width: 200
    }, {
        field: 'typeName',
        title: '竣工技术文件名称',
        width: 200
    }, {
        field: 'constructEstimate',
        title: '预估值(元)',
        width: 200
    }, {
        field: 'finalValue',
        title: '决算值(元)',
        width: 200
    }, {
        field: 'sumCost',
        title: '审定值(元)',
        width: 200,
        formatter: function (a) {
            return a || '暂无'
        }
    }, {
        field: '',
        title: '操作',
        width: 200,
        formatter: function (a) {
            return '<span class="delTrData" style="color:red; cursor: pointer;">删除</span>'
        }
    }
]
