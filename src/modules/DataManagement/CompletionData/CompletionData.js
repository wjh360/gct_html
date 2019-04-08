$(function () {
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    switchTab()

    function switchTab() {
        if (nav_idx == 0) initfinishProjectPage() //打包资料
        if (nav_idx == 1) initfinishDatumPage() //竣工技术
    }

    // 初始化打包资料表格
    var DataPackageCol = [{
        field: 'projectCode',
        title: '项目编号',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            // return '<span class="tit" title= "' + a + '">' + initText(a, 15) + '</span>'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a +'</span>'
        }
    }, 
    {
        field: 'projectName',
        title: '项目名称',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, 
    {
        field: 'projectTypeInfo.typeName',
        title: '类型名称',
        width: '150'
    }, 
    {
        field: 'constructType',
        title: '施工类型',
        width: '100',
        formatter: function (a, b) {
            if (b.constructType == 1) return "包工包料"
            if (b.constructType == 2) return "包工不包料"
            else return "清包工"
        }
    }, 
    {
        field: 'createCompanyName',
        title: '创建单位',
        width: '150',
    }, 
    {
        field: 'createrInfo.trueName',
        title: '创建人',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, 
    {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, 
    {
        title: '操作',
        'class': '',
        width: '150',
        formatter: function (a) {
            return '<a data_power="Final-value-management-list" class="Estimation" title= "">决算值管理</a><a data_power="Packing-data-operation" class="PackingMsg" title= "">打包资料</a>'
        }
    }]
    function initfinishProjectPage() {
        $http({
            url: '/gct-web/order/finishProjectPage',
            success: function (r) {
                initTable("DataPackageTable", r.data, DataPackageCol)
            }
        })
    }
    // 初始化竣工技术表格
    var DataTechnicalCol = [{
        field: 'datumName',
        title: '竣工技术文件名称',
        width: '200'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200',
    }, {
        field: 'trueName',
        title: '创建人',
        width: '100',
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
        formatter: function (a) {
            return '<a data_power="Unpacking-operation" class="Unpacking" title= "">解包</a>'
        }
    }]
    function initfinishDatumPage() {
        $http({
            url: '/gct-web/order/finishDatumPage',
            success: function (r) {
                initTable("DataTechnicalTable", r.data, DataTechnicalCol, {
                    total: r.data,
                })
            }
        })
    }
    // 点击决算值估算
    $("body").on("click", '.Estimation', function () {
        storage("projectId", tab_rowData.id, 'Estimation') //项目id 决算值估算列表
        goNewPage("./CompletionData/DataPackage/Estimation.html")
    })
    // 点击打包资料
    $("body").on("click", '.PackingMsg', function () {
        storage("projectId", tab_rowData.id, 'PackingMsg') //项目id 打包资料页面
        goNewPage("./CompletionData/DataPackage/PackingMsg.html")
    })
    // 点击竣工技术列表正行跳详情
    $("body").on("click", '#DataTechnicalTable tbody tr', function () {
        storage("datumId", tab_rowData.id, 'detailsDataTechnical') //竣工资料Id 竣工技术情
        goNewPage("./CompletionData/DataTechnical/detailsDataTechnical.html")
    })
    // 点击解包
    $("body").on("click", '.Unpacking', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i> 确定要对当前文件解包吗？</div>",
            confirm: function () {
                unpackFinshDatum()
            }
        })
    })

    function unpackFinshDatum() {
        $http({
            url: '/gct-web/order/unpackFinshDatum',
            data: {
                datumId: tab_rowData.id
            },
            success: function (r) {
                submitSuccess('操作成功', function () {
                    initfinishDatumPage()
                    initfinishProjectPage()
                })
            }
        })
    }

})