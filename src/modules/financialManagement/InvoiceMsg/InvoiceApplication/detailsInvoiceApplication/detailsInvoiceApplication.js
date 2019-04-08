$(function () {
    var InvoiceId = storage('InvoiceId');
    var ses = 0;
    var postObjMsg = {
        name: '请填写付款方名称',
        idNumber: '请填写纳税人识别号',
        tel: '请填写地址、电话',
        account: '请填写开户行及账号'
    }
    switchTab()
    function switchTab() {
        if (nav_idx == 0) getIncoiceDetails()
        else formAuditRecord(InvoiceId, 6002, function (r) {
            getOpertingLog(r.data)
        })
        ses++;
    }
    //   tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab && ses <= 1) switchTab()
    })
    //获取开票详情
    function getIncoiceDetails() {
        $http({
            url: '/gct-web/invoice/getInvoiceInfo',
            data: {
                id: InvoiceId
            },
            success: function (r) {
                if (!r.data) return false
                var getData = r.data.invoiceManageVO
                $(".invoice").html(getData.type == 1 ? '增值税普票' : '专票')
                eachData(postObjMsg, getData)
                if (getData.invoiceManageGoods) {
                    $.each(getData.invoiceManageGoods, function (index, eleVal) {
                        createSer(eleVal)
                    })
                }
            }
        })
    }
    //获取操作记录
    function getOpertingLog(data) {
        $("#ExternalRecord").html("")
        $.each(data, function (index, eleVal) {
            var str = '<div class="commonCon" style="margin: 0;margin-top:10px;">' +
                '<div class="inforHeader clearfix">' +
                '<div class="verHang f_l"></div>' +
                '<div class="headerText f_l" style="margin-right:20px;">操作人：<span>' + eleVal.applyName + '</span></div>' +
                '<div class="headerText f_l">操作时间：<span>' + initDate(eleVal.applyTime, 's') + '</span></div>' +
                '</div>' +
                '<div class="page" style=" margin-top: 10px; padding: 0 20px; ">' +
                '<table id="ExternalRecordTable' + index + '"></table>' +
                '<div id="ExternalRecordTable' + index + 'Page"></div>' +
                '</div>' +
                '</div>'
            $("#ExternalRecord").append(str)
            initTable('ExternalRecordTable' + index, eleVal.list, Auditcol)
        })
    }
})
var serLen = 0  //服务下标
function createSer(data) {
    serLen = serLen + 1
    var str = '<div class="reimburseMent reimburseMent' + serLen + '" index="' + serLen + '" data_id="' + (data ? data.id : '') + '">' +
        '<div class="commonCon ">' +
        '<div class="inforHeader clearfix">' +
        '<div class="verHang f_l"></div>' +
        '<div class="headerText f_l">货物或服务<span class="reimIndex">' + serLen + '</span></div>' +
        '</div>' +
        '<div class="Role-noticeCon">' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="width: 120px;">货物或服务名称：</span>' +
        '<span class="nameCon ">' +
        '<span></span>' + (data ? data.name : '') + '</span>' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="width: 120px;">规格：</span>' +
        '<span class="nameCon ">' +
        '<span>' + (data ? data.matterSpec : '') + '</span>' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;">单位：</span>' +
        '<span class="nameCon"style="width: 120px;">' +
        '<span>' + (data ? data.matterUnit : '') + '</span>' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;">数量：</span>' +
        '<span class="nameCon"style="width: 120px;">' +
        '<span>' + (data ? data.num : '') + '</span>' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;">金额：</span>' +
        '<span class="nameCon"style="width: 120px;">' +
        '<span>' + ((data ? data.amount : "")+"元") + '</span>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".serList").append(str)
}
// 财务审核
var Auditcol = [
    {
        field: 'auditName',
        title: '审核人',
        width: '200'
    }, {
        field: 'auditTime',
        title: '审核时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's') || '暂无'
        }
    }, {
        field: 'status',
        title: '审核结果',
        width: '200',
        formatter: function (a) {
            return a == 5 ? '通过' : (a == 4 ? '驳回' : '暂无')
        }
    }, {
        field: 'auditRemark',
        title: '审核意见',
        width: '200',
    }
]
