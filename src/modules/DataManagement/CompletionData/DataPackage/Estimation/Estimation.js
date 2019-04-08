$(function () {
    // 初始化列表数据
    var EstimationCol = [{
            field: 'taskCode',
            title: '工单编号',
            width: '150',
            formatter: function (a) {
                if (!a) return '暂无'
                return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
                }
        },
        {
            field: 'taskName',
            title: '工单名称',
            width: '150'
        }, 
        {
            field: 'cost',
            title: '工单成本（元）',
            width: '150'
        }, 
        {
            field: 'constructEstimate',
            title: '施工造价估算（元）',
            width: '150',
        }, 
        {
            field: 'finalValue',
            title: '决算值（元）',
            width: '100',
        }, 
        {
            field: 'constructionUserName',
            title: '施工队长',
            width: '100'
        }, 
        {
            field: 'companyName',
            title: '创建单位',
            width: '150'
        },
        {
            field: 'createrName',
            title: '创建人',
            width: '100'
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
            width: '200',
            formatter: function (a, b) {
                if (b.finalValue != 0 && b.finalValue != null) return '<a data_power="Edit-final-value-operation" class="editEstimation" title= "">编辑决算值</a>'
                else return '<a data_power="Add-final-value-operation" class="addEstimation " title= "">添加决算值</a>'
            }
        }]
    var projectId = storage("projectId")
    initFinalValueList()
    function initFinalValueList() {
        $http({
            url: '/gct-web/order/finalValuePage',
            data: {
                projectId: projectId
            },
            success: function (r) {
                initTable("EstimationListTable", r.data, EstimationCol, {
                    total: r.data,
                })
                $(".dataOthers").html(r.dataOthers)
            },
        })
    }



    // 点击添加决算值估算
    $("body").on("click", '.addEstimation', function () {
        // log(123)
        storage("taskId", tab_rowData.id, 'addEstimation') //工单id 决算值添加
        goNewPage("./Estimation/addEstimation.html")
    }) 

    // 点击编辑决算值估算
    $("body").on("click", '.editEstimation', function () {
        // log(123)
        storage("taskId", tab_rowData.id, 'editEstimation') //工单id 决算值编辑

        goNewPage("./Estimation/editEstimation.html")
    })

    //点击详情
    $("body").on("click", '#EstimationListTable tbody tr', function () {

        // alert(tab_rowData.status)
        storage("taskId", tab_rowData.id, 'detailsEstimation') //工单id 决算值详情
        goNewPage("./Estimation/detailsEstimation.html")
    })


    
    



})