$(function () {
    getList()
    function getList() {
        $http({
            url: "/gct-web/finance/backPage",
            data: {
                name: $(".fName").val() || $(".searchVal").val(),               //:”付款方名称”
                status: $(".statusType").attr('index')              //:1 状态 1待回执  2已回执
            },
            success: function (r) {
                initTable('ReimbursementMsgListTable', r.data, col)
            }
        })
    }
    //简单搜索// 高级搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { getList() })
    $("body").on("click", "#ReimbursementMsgListTable tbody tr", function () {
        storage('backInfoId', tab_rowData.id, 'detailsReimbursementMsg')
        goNewPage("./ReimbursementMsg/detailsReimbursementMsg.html")
    })
    $("body").on("click", ".receiptBtn", function () {
        $.popConfirm({
            'content': '确定要对所选通知执行回执操作吗？',
            'confirm': function () {
                $http({
                    url: "/gct-web/finance/backAccept",
                    data: {
                        id: tab_rowData.id
                    },
                    success: function (r) {
                        $.popInfo("操作成功")
                        getList()
                    }
                })
            }
        })
    })
})
var col = [
    {
        field: 'no',
        title: '通知编号',
        width: '150'
    }, {
        field: 'name',
        title: '付款方名称',
        width: '150'
    }, {
        field: 'amount',
        title: '到款金额(元)',
        width: '150'
    }, {
        field: 'date',
        title: '到款日期',
        width: '150',
        formatter: function (a, b) {
            return initDate(a)
        }
    }, {
        field: 'status',
        title: '通知状态',
        width: '100',
        formatter: function (a, b) {
            // 状态 1待回执  2已回执
            return a == 1 ? '待回执' : '已回执'
        }
    }, {
        field: 'trueName',
        title: '创建人',
        width: '150'
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a, b) {
            return initDate(a, 's')
        }
    }, {
        field: '',
        title: '操作',
        width: '80',
        formatter: function (a, b) {
            if (b.status == 1 && b.isCanBack == 1) return '<a data_power="Receipt-operation" class="receiptBtn">回执</a>'
            else return '<a data_power="Receipt-operation" class="noEdit">回执</a>'
        }
    }
]