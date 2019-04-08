$(function () {
    // 列表数据回显
    var addOrderCol = [{
            title: '',
            'class': "",
            width: '50',
            formatter: function () {
                return '<span class="checkBox"></span>'
            }
        },
        {
            field: 'datumName',
            title: '竣工技术文件名称',
            width: '200'
        }, 
        {
            field: 'projectName',
            title: '项目名称',
            width: '200'
        },
        {
            field: 'reportTrial',
            title: '报审值（元）',
            width: '200',
        },
        {
            field: 'companyName',
            title: '创建单位',
            width: '200',
        },
        {
            field: 'trueName',
            title: '创建人',
            width: '200',
        }, 
        {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a,'s')
            }
        }

    ]

    initPackEcho()

    function initPackEcho() {
        $http({
            url: '/gct-web/order/packEcho',
            success: function (r) {
                initTable("addOrderTable", r.data, addOrderCol, {
                    total: r.data,
                })
            }
        })
    }

    // 添加
    function initpack() {
        $http({
            url: '/gct-web/order/pack',
            data: {
                orderName: $(".orderName").val(), //“订单名称”
                ids: tabObj['addOrderTable'].tab_select_ids.join(','), //工单id
                orderNo: $(".orderNo").val() //“订单编号”
            },
            success: function (r) {
                submitSuccess('',function () {
                    goBack()
                })
            }
        })
    }
    //提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                initpack()
            }
        })
    })


    $('body').on("click", '.all_Select_Private', function () {
        checkAllFun('addOrderTable')
        // tabObj['PackingTable']
    })

    $('body').on("click", '.all_Cancel_Private', function () {
        removecheckAllFun('addOrderTable')
        // tabObj['PackingTable']
    })

})