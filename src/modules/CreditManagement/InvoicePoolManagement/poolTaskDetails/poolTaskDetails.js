
var datumId = storage('datumId')
$(function () {
    initData()
    //  点击决算值，进入详情
    $("body").on("click", '.finalClickTr', function () {
        storage("taskId", tab_rowData.id, 'poolFinalAccountDetails')//工单Id
        goNewPage("./poolFinalAccountDetails.html")
    })
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/getTaskByfinishDatumIdPage',
        data: {
            finishDatumId: datumId
        },
        success: function (r) {
            if(r.dataOthers&&r.dataOthers.finishDatum){
                $(".datumName").html(r.dataOthers.finishDatum.datumName)
                $(".projectName").html(r.dataOthers.finishDatum.projectName)
            }

            initTable('shiGongTable', r.data, col)
        }
    })
}
var col = [
    {
        field: 'taskCode',
        title: ' 工单编号',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'taskName',
        title: '工单名称',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'cost',
        title: '工单成本（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return 0
            else return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'constructEstimate',
        title: ' 施工造价估算（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'finalValue',
        title: '决算值（元）',
        width: '100',
        'class': 'finalClickTr',
        formatter: function (a) {
            if (!a) return '0'
            else return '<span class="overf_Ec m_col" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'constructionUserName',
        title: '施工队长',
        width: '150',
        formatter: function (a) {
            if (!a) return 0
            else return '<span class=" overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'companyName',
        title: ' 创建单位',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            else return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'createName',
        title: '创建人',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            else return '<span class=" overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            else return initDate(a, 's')
        }
    }
]
