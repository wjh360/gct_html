$(function () {
    // 初始化列表数据
    var col = [
        {
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
            width: '200',
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
            width: '150',
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
            title: '操作',
            'class': '',
            width: '100',
            formatter: function (a) {
                return '<a data_power="Cost-list" class="BusinessList" title= "">费用列表</a>'
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
            },
        })
    }
    //   js
    //初始化 保住金申请列表
    // limit       //每页显示条数   
    // current     //当前页
    // bidName   //投标名称  字符串
    // bidUnit    //投标单位   字符串
    // type      //项目类型ID  数字
    initCostApplyPage()
    function initCostApplyPage() {
        bidName = $(".bidName").val() || $(".searchVal").val()//投标名称
        bidUnit = $(".bidUnit").val() //发标单位
        type = $(".type").attr("index")
        $http({
            url: '/gct-web/costApply/getCostApplyPage',
            data: {
                limit: 10,
                bidName: bidName,
                bidUnit: bidUnit,
                type: type
            },
            success: function (r) {
                initTable("BusinessListTable", r.data, col, {
                    total: r.total
                })
            }
        })
    }
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initCostApplyPage()
    })
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initCostApplyPage()
    })
    //点击费用列表
    $("body").on("click", '.BusinessList', function () {
        storage("BiddingId", tab_rowData.id, 'BusinessList') //投标id  费用列表页面
        storage("BiddingName", tab_rowData.bidName, 'addBusiness')
        goNewPage("./BusinessApplication/BusinessList.html")
    })
})