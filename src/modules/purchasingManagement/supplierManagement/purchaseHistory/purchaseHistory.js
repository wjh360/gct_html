var supperlierId = storage('supperlierId')
$(function () {
    initData()
})
function initData() {
    $http({
        url: '/gct-web/purchasePlan/supplierMatterPage',
        data: {
            id: supperlierId
        },
        success: function (r) {
            initTable('LowListTable', r.data, matterCol)
        }
    })
}
var matterCol = [
    {
        field: 'matter.matterCode',
        title: '物料编码',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:150px;">'+a+'</span>'
        }
    }, {
        field: 'matter.matterName',
        title: '物料名称',
        width: '200',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:200px;">'+a+'</span>'
        }
    }, {
        field: 'matterNum',
        title: '采购数量',
        width: '130',
        formatter: function (a) {
            if (!a) return 0
            return '<span class="overf_Ec"  style="display:inline-block; max-width:130px;">'+a+'</span>'
        }
    }, {
        field: 'matter.matterPrice',
        title: '单价(元)',
        width: '150',
        formatter: function (a) {
            if (!a) return 0
            return a
        }
    }, {
        field: 'amount',
        title: '采购金额(元)',
        width: '200',
        formatter: function (a) {
            if (!a) return 0
            return '<span class="overf_Ec"  style="display:inline-block; max-width:200px;">'+a+'</span>'
        }
    }, {
        field: 'createTime',
        title: '采购日期',
        width: '200',
        formatter: function (a) {
            if (!a) return ''
            else return initDate(a)
        }
    }
]