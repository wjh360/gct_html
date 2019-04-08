$(function () {
    // 初始化表格
    var col = [{
        field: 'bidNo',
        title: '编号',
        width: '100'
    },
    {
        field: 'bidName',
        title: '投标名称',
        width: '200'
    },
    {
        field: 'bidUnit',
        title: '发标单位',
        width: '150'
    },
    {
        field: 'typeName',
        title: '项目类型',
        width: '150',
    }, 
    {
        field: 'bidDate',
        title: '预计投标时间',
        width: '200',
        formatter: function (a) {
            return initDate(a)
        }
    },
    {
        field: 'inviteAmount',
        title: '招标金额（元）',
        width: '150'
    }, 
    {
        field: 'status',
        title: '状态',
        width: '100'
    }, 
    {
        field: 'createTime',
        title: '提交时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, 
    {
        title: '操作',
        'class': '',
        width: '100',
        formatter: function (a, b) {
            if (b.status == '未提交') return '<a data_power="Add-bid-purchase-request-operation" class="addBid" title= "">添加</a><a data_power="Abandonment-operation" class="DiscardBid" title= "">弃标</a>'
            if (b.status == '已保存' || b.status == '未过审') return '<a data_power="Edit-bid-purchase-application-operation" class="editBid" title= "">编辑</a><a data_power="Abandonment-operation" class="DiscardBid" title= "">弃标</a>'
            else return '<a data_power="Edit-bid-purchase-application-operation" class="noEdit " title= "">编辑</a><a data_power="Abandonment-operation" class="noEdit" title= "">弃标</a>'
        }
    }]
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
    //初始化 投标申请列表
    //    limit          //每页显示条数  数字
    //    current        //当前页  数字
    //    bidName        //投标名称  字符串
    //    bidUnit        //投标单位  字符串
    //    type           //项目类型ID  数字
    //    status         //状态  数字  (1.保存 3.审核中 4.未过审 7.已弃标)
    initBidList()
    function initBidList() {
        bidName = $(".bidName").val() || $(".searchVal").val()
        bidUnit = $(".bidUnit").val()
        type = $(".type").attr("index")
        sts = $(".statusType").attr("index")
        $http({
            url: '/gct-web/bidDocApply/getBidDocApplyPage',
            data: {
                limit: 10,
                bidName: bidName,
                bidUnit: bidUnit,
                type: type,
                status: sts
            },
            success: function (r) {
                initTable("bidListTable", r.data, col, {
                    total: r.data,
                })
            }
        })
    }
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initBidList()
    })
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initBidList()
    })
    //点击添加
    $("body").on("click", '.addBid', function () {
        storage("auditItem", 1002, 'addBid') //事项编码  投标购买页面
        storage("BiddingId", tab_rowData.id, 'addBid') //投标id 投标购买添加
        goNewPage("./BidApplication/addBid.html")
    })
    //点击编辑
    $("body").on("click", '.editBid', function () {
        storage("auditItem", 1002, 'editBid') //事项编码  投标购买页面
        storage("BiddingId", tab_rowData.id, 'editBid') //投标id 投标购买添加
        storage("DocId", tab_rowData.docId, 'editBid') //标书购买id 投标购买详情
        goNewPage("./BidApplication/editBid.html")
    })
    //点击详情
    $("body").on("click", '#bidListTable tbody tr', function () {
        if (tab_rowData.status == '未提交') {
            return false
        } else {
            storage("BiddingId", tab_rowData.id, 'detailsBid') //投标id 投标购买详情
            storage("DocId", tab_rowData.docId, 'detailsBid') //标书购买id 投标购买详情
            goNewPage("./BidApplication/detailsBid.html")
        }
    })
    // 点击弃标  DiscardBid
    $("body").on("click", '.DiscardBid', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定弃标吗？</div>",
            confirm: function () {
                $http({
                    url: '/gct-web/bidApply/getBidApplyDiscard',
                    data: {
                        id: tab_rowData.id //ID 数字
                    },
                    success: function (r) {
                        submitSuccess('', function () {
                            initBidList()
                        })
                    }
                })
            }
        })
    })
})