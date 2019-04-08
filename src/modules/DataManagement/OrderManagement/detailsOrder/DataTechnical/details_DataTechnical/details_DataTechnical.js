$(function(){
    var datumId = storage("datumId")
    // 初始化列表
    var detailsDataTechnicalCol = [{
        field: 'taskCode',
        title: '工单编号',
        width: '100'
    }, 
    {
        field: 'taskName',
        title: '工单名称',
        width: '200'
    }, 
    {
        field: 'cost',
        title: '工单成本（元）',
        width: '100'
    },
    {
        field: 'constructEstimate',
        title: '施工造价估算（元）',
        width: '100',
    }, 
    {
        field: 'finalValue',
        title: '决算值（元）',
        width: '100',
    }, 
    {
        field: 'constructionUserName',
        title: '施工队长',
        width: '150'
    }, 
    {
        field: 'companyName',
        title: '创建单位',
        width: '150'
    },
    {
        field: 'createrName',
        title: '创建人',
        width: '150'
    }, 
    {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
    finshDatumInfo()
    function finshDatumInfo() {
        $http({
            url: '/gct-web/order/finshDatumInfo',
            data: {
                datumId: datumId //决算申请id
            },
            success: function (r) {
                if( !r.dataOthers) return false
                $(".datumName").html(r.dataOthers.datumName)//技术文件名称
                $(".proejctName").html(r.dataOthers.proejctName)//项目名称
                initTable("detailsDataTechnicalTable", r.data, detailsDataTechnicalCol, {
                    total: r.data,
                })
            }
        })
    }
})