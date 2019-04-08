
var payApplyId = storage('payApplyId')
$(function () {
    initData()
    $("body").on("click", '.picUploader_box', function () {
        if ($(this).attr("index")) {
            viewBigImg($(this).attr("index"))
        }
    })
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/payApplyInfo',
        data: {
            id: payApplyId
        },
        success: function (r) {
            if (r.data) {
                $(".applyAmount").html((r.data.applyAmount ? r.data.applyAmount : '0') + '元')
                $(".invoiceDate").html(initDate(r.data.invoiceDate))
                //    凭证
                if(!r.data.file) return false;
                $.each(r.data.file, function (k, v) {
                    var str = '<div class="picUploader_box" index="' + v.projectFileUrl + '">\n' +
                        '        <img src="' + (baseFileUrl + v.thumbnailUrl) + '" alt="">\n' +
                        '    </div>';
                    $(".picBigContainer").append(str);
                })
                initTable('projectTableContruct', r.data.list, col)
            }
        }
    })
}
var col = [
    {
        field: 'invoiceNo',
        title: '发票号',
        width: '300',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:300px;">'+a+'</span>'
        }
    }, {
        field: 'invoiceAmount',
        title: '发票金额(元)',
        width: '300',
        formatter: function (a) {
            if (!a) return ''
            else return a;
        }
    }, {
        field: 'invoiceAmount',
        title: '付款申请金额（元）',
        width: '300',
        formatter: function (a) {
            if (!a) return 0
            else return a
        }
    }
]
