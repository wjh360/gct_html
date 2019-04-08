$(function () {
    // 初始化列表数据
    var OrderListCol = [
        {
            field: 'orderNo',
            title: '订单编号',
            width: '100'
        }, 
        {
            field: 'orderName',
            title: '订单名称',
            width: '100',

            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        
            }
        }, 
        {
            field: 'projectName',
            title: '项目名称',
            width: '100',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
            }
        }, 
        {
            field: 'contractName',
            title: '合同名称',
            width: '100',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
            }
        }, 
        {
            field: 'invoicePercent',
            title: '发票（%）',
            width: '80',
        }, 
        {
            field: 'payPercent',
            title: '付款（%）',
            width: '80',
        }, 
        {
            field: 'incomePercent',
            title: '收款（%）',
            width: '80',
        }, 
        {
            field: 'companyName',
            title: '创建单位',
            width: '100',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
            }
        }, 
        {
            field: 'trueName',
            title: '创建人',
            width: '100',
        }, 
        {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }, 
        {
            title: '操作',
            'class': '',
            width: '150',
            formatter: function (a, b) {
                // log(b)
                if (b.contractName != '') return '<a data_power="Edit-order-operation" class="editOrder" title= "">技术文件维护</a><a data_power="Delete-order-operation" class="delOrder m_red" title= "">删除</a>'
                else return '<a data_power="Edit-order-operation" class="editOrder" title= "">技术文件维护</a><a data_power="Delete-order-operation" class="noEdit" title= "">删除</a>'
            }
        }
    ]

    initPackPage()
    function initPackPage() {
        $http({
            url: '/gct-web/order/orderPage',
            data: {
                orderName: $(".orderName").val(),  //订单名称
                orderNo: $(".orderNo").val(),//“订单编号”,
                contractName: $(".contractName").val(),//,“合同名称”
                projectName: $(".projectName").val(),//“项目名称”
                companyName: $(".companyName").val(),//”公司名称”
            },
            success: function (r) {
                initTable("OrderListTable", r.data, OrderListCol, {
                    total: r.data,
                })
            }
        })
    }


    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initPackPage()
    })
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initPackPage()
    })
    // 点击编辑
    $("body").on("click", '.editOrder', function () {

        storage("orderId", tab_rowData.id, 'editOrder') //订单id 编辑订单页面
        goNewPage("./OrderManagement/editOrder.html")
    })

    // 点击详情
    $("body").on("click", '#OrderListTable tbody tr', function () {

        storage("orderId", tab_rowData.id, 'detailsOrder') //订单id 编辑订单页面
        goNewPage("./OrderManagement/detailsOrder.html")

    })

    // 删除订单
    $("body").on("click", '.delOrder', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定删除此订单吗？</div>",
            confirm: function () {
                packDel()
            }
        })
    })

    function packDel() {
        $http({
            url: '/gct-web/order/packDel',
            data: {
                orderId: tab_rowData.id
            },
            success: function (r) {
                initPackPage()
            }
        })
    }
})