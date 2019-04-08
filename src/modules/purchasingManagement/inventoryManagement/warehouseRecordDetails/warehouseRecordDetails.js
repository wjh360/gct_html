var storageLogId=storage('storageLogId')

$(function () {
    initData()
})

function initData() {
    $http({
        url: '/gct-web/inventory/details',
        data:{
            storageLogId:storageLogId
        },
        success: function (r) {
            if(!r.data.matterList) return false;
            initTable('LowListTable',r.data.matterList,matterCol)
        }

    })


}


var matterCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }

    },
    {
        field: 'matterName',
        title: '物料名称',
        width: '100',
        formatter: function (a) {
            return '<span class=" overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }

    },
    {
        field: 'matterSpec',
        title: '规格',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }

    },

    {
        field: 'matterPrice',
        title: '单价(元)',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },
    {
        field: 'matterUnit',
        title: '单位',
        width: '50',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:50px;">'+a+'</span>'
        }
    },
    {
        field: 'matterType',
        title: '物料类型',
        width: '150',
        formatter: function (a) {
            return a
        }
    },
    {
        field: 'matterSource',
        title: '供方属性',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return a;
        }

    }, {
        field: 'matterSupplier',
        title: '供应商单位',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },

    {
        field: 'operationNum',
        title: '数量',
        width: '100',
        formatter: function (a) {
            if (!a) return '0'
           return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }
]