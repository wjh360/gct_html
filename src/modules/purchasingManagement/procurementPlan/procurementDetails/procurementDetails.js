
var procursePlanId = storage('procursePlanId')
$(function () {
    initData()
})
function initData() {
    $http({
        url: '/gct-web/purchasePlan/purchaseInfo',
        data: {
            id: procursePlanId
        },
        success: function (r) {
            if(r.data.purchase){
                $(".details_Text").eq(0).html(r.data.purchase.name)
                $(".details_Text").eq(4).html(initDate(r.data.purchase.buyDate))
                $(".details_Text").eq(5).html(r.data.purchase.mode == 1 ? '电汇' : '现金')
                $(".details_Text").eq(6).html(r.data.purchase.purpose)
                $(".purMaterSumMoney").html(r.data.purchase.amount)
            }
            if (r.data.project && r.data.project.id) $(".details_Text").eq(1).html(r.data.project.projectName)
            else $(".details_Text").eq(1).parent().hide()
            if (r.data && r.data.task && r.data.task.id) $(".details_Text").eq(2).html(r.data.task.taskName)
            else $(".details_Text").eq(2).parent().hide()
            if(r.data.costItem)$(".details_Text").eq(3).html(r.data.costItem.costName)

            $(".details_Text").eq(7).html(r.data.companyName + (r.data.depName ? ('——' + r.data.depName) : '') + ('——' + r.data.trueName))

            initTable('butMaterailTable', r.data.listMatter?r.data.listMatter:[], matterCol)
           if(r.data.supplier){
               $(".details_Text").eq(8).html(r.data.supplier.name)
               $(".details_Text").eq(9).html(r.data.supplier.address)
               if (r.data.supplier.openBank) $(".details_Text").eq(10).html(r.data.supplier.openBank)
               else $(".details_Text").eq(10).parent().hide()
               if (r.data.supplier.account) $(".details_Text").eq(11).html(r.data.supplier.account)
               else $(".details_Text").eq(11).parent().hide()
           }

            if (r.data.files||r.data.files.length==0) initTable("markerTableBuy", r.data.files, fileColDetail)
            else { $("#markerTableBuy").parents(".fileTable_White").hide() }
        }
    })
}

var matterCol = [
    {
        field: 'matter.matterName',
        title: '物料名称',
        width: '250',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:250px;">'+a+'</span>'
        }
    }, {
        field: 'matter.matterSpec',
        title: '规格',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'matter.matterUnit',
        title: '单位',
        width: '100',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }, {
        field: 'matter.matterPrice',
        title: '单价(元)',
        width: '150',
        formatter: function (a) {
            return a
        }
    }, {
        field: 'matterNum',
        title: '数量',
        width: '150',
        formatter: function (a) {
            return a
        }
    },
    {
        field: 'amount',
        title: '总价',
        width: '250',
        formatter: function (a) {
            return a;
        }
    }, {
        title: '供方属性',
        width: '100',
        formatter: function (a) {
            return '乙供'
        }
    }, {
        title: '物料类型',
        width: '100',
        formatter: function (a) {
            return '辅材'
        }
    }
]