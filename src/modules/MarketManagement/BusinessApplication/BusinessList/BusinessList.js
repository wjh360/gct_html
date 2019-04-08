$(function () {
    var BiddingId = storage("BiddingId")
    // 初始化列表
    // 初始化列表数据
    var col = [
        {
            field: 'costNo',
            title: '编号',
            width: '200'
        }, {
            field: 'costName',
            title: '费用类型',
            width: '200'
        }, {
            field: 'costAmount',
            title: '金额（元）',
            width: '200'
        }, {
            field: 'costCause',
            title: '事由',
            width: '200',
        }, {
            field: 'status',
            title: '状态',
            width: '200'
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
            width: '200',
            formatter: function (a, b) {
                if (b.status == '已保存') return '<a data_power="Edit-operating-expenses-request-operation" class="editBusiness" title= "">编辑</a><a data_power="Removal-of-operating-expenses-request-operation" class="delBusiness m_red" title= "">删除</a>'
                if (b.status == '审核中' || b.status == '已过审' || b.status == '已完成') return '<a data_power="Edit-operating-expenses-request-operation" class="noEdit" title= "">编辑</a><a data_power="Removal-of-operating-expenses-request-operation" class="noEdit" title= "">删除</a>'
                if (b.status == '未过审') return '<a data_power="Edit-operating-expenses-request-operation" class="editBusiness" title= "">编辑</a><a data_power="Removal-of-operating-expenses-request-operation" class="m_red delBusiness" title= "">删除</a>'
                // else return '<a data_power="Edit-operating-expenses-request-operation" class="editBusiness" title= "">编辑</a><a data_power="Removal-of-operating-expenses-request-operation" class="noEdit" title= "">删除</a>'
            }
        }
    ]
    //初始化  费用类型下拉框
    CostTypeList()
    function CostTypeList() {
        $http({
            url: '/gct-web/costApply/getCostTypeAll',
            success: function (r) {
                getDownSelect("costType", '请选择费用类型', r.data.list, 'id', 'costName')
            }
        })
    }
    //   js
    //初始化 费用列表
    // limit      //每页显示条数
    // current    //当前页
    // costType   //费用事项ID  数字
    // startDate    //开始日期  字符串
    // endDate     //结束日期 字符串
    // status       //状态1.已保存2.已完成 3.审核中 4.未过审 5.已过审  数字
    // bidId       //投标ID 数字
    initCostApplyInfoPage()
    function initCostApplyInfoPage() {
        startDate = $(".startDate").val() //开始日期
        endDate = $(".endDate").val() //结束日期
        costType = $(".costType").attr("index") //费用事项ID 
        sts = $(".statusType").attr("index")  //状态
        $http({
            url: '/gct-web/costApply/getCostApplyInfoPage',
            data: {
                limit: 10,
                startDate: startDate,
                endDate: endDate,
                costType: costType, //费用事项ID 
                status: sts,
                bidId: BiddingId, //投标id
            },
            success: function (r) {
                initTable("BusinessInfoListTable", r.data, col, {
                    total: r.total,
                })
            }
        })
    }
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initCostApplyInfoPage()
    })
    //点击添加
    $("body").on("click", '.addBusiness', function () {
        // log(123)
        isYesProcess(1004, function () {
            storage("BiddingId", BiddingId, 'addBusiness') //费用id  业务页面
            storage("auditItem", 1004, 'addBusiness') //事项编码  业务申请页面
            goNewPage("./BusinessList/addBusiness.html")
        })
    })
    //点击编辑
    $("body").on("click", '.editBusiness', function () {
        isYesProcess(1004, function () {
            storage("auditItem", 1004, 'editBusiness') //事项编码  业务申请页面
            storage("BusinessId", tab_rowData.id, 'editBusiness') //业务费用ID  费用编辑页面
            goNewPage("./BusinessList/editBusiness.html")
        })
    })
    //点击详情
    $("body").on("click", '#BusinessInfoListTable tbody tr', function () {
        storage("BusinessId", tab_rowData.id, 'detailsBusiness') //业务费用ID  费用详情页面
        goNewPage("./BusinessList/detailsBusiness.html")
    })
    //点击删除
    function getCostApplyDel() {
        $http({
            url: '/gct-web/costApply/getCostApplyDel',
            data: {
                id: tab_rowData.id //费用ID 数字
            },
            success: function (r) {
                initCostApplyInfoPage()
            }
        })
    }
    //删除
    $("body").on("click", '.delBusiness', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定删除当前操作的内容吗？</div>",
            confirm: function () {
                submitSuccess('', function () {
                    getCostApplyDel()
                })
            }
        })
    })
})