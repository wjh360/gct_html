var storageLogId = storage('storageLogId')
$(function () {
    matterInfo()
    //   点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                returnMatter(4)
            }
        })
    })
    $("body").on("click", '.noPassBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                returnMatter(5)
            }
        })
    })
})
//项目详情
function matterInfo() {
    $http({
        url: '/gct-web/inventory/details',
        data: {
            storageLogId: storageLogId
        },
        success: function (r) {
            // 退料状态：4-已确认；3-未确认
            if (r.data.status == 3) {
                $(".btnApply").show()
            } else {
                $(".confirmBox").show()
                r.data.receiveUserName ? $(".receiveUserName").html(r.data.receiveUserName) : $(".receiveUserName").parent().hide()
                r.data.receiveUserTel ? $(".receiveUserTel").html(r.data.receiveUserTel) : $(".receiveUserTel").parent().hide()
                r.data.confirmTime ? $(".confirmTime").html(initDate(r.data.confirmTime, 's')) : $(".confirmTime").parent().hide()
            }
            dataShow(r.data)
            initTable('matterTable', r.data.matterList, matterCol)
        }
    })
}
function dataShow(r) {
    $(".auditApply").html(r.explain)
    r.collerNo ? $(".collerNo").html(r.collerNo) : $(".collerNo").parent().hide()
    r.createrName ? $(".createrName").html(r.createrName) : $(".createrName").parent().hide()
    r.creatertel ? $(".creatertel").html(r.creatertel) : $(".creatertel").parent().hide()
    r.createTime ? $(".createTime").html(initDate(r.createTime, 's')) : $(".createTime").parent().hide()
}
var matterCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },
    {
        field: 'matterName',
        title: '物料名称',
        width: '100',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
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
        field: 'matterUnit',
        title: '单位',
        width: '50',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:50px;">'+a+'</span>'
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
        field: 'matterType',
        title: '物料类型',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },
    {
        field: 'matterSource',
        title: '供方属性',
        width: '50',
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
        title: '退料量',
        width: '100',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    }
]
function returnMatter(data) {
    $http({
        url: '/gct-web/inventory/returnMaterial',
        data: {
            storageLogId: storageLogId,
            icon: data            //操作：4-确定；5-驳回
        },
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}