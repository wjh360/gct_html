
var invoiceId = storage('invoiceId')
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
        url: '/gct-web/invoicePond/invoiceInfo',
        data: {
            id: invoiceId
        },
        success: function (r) {
            if(r.data.invoice){
                $(".invoiceNo").html(r.data.invoice.invoiceNo)
                if(r.data.invoice.invoiceAmount)$(".invoiceAmount").html(r.data.invoice.invoiceAmount + ' 元')
                if(r.data.invoice.invoiceDate)$(".invoiceDate").html(initDate(r.data.invoice.invoiceDate))
                //    凭证
                $.each(r.data.invoice.file, function (k, v) {
                    var str = '<div class="picUploader_box" index="' + v.projectFileUrl + '">\n' +
                        '        <img src="' + (baseFileUrl + v.thumbnailUrl) + '" alt="">\n' +
                        '    </div>';
                    $(".picBigContainer").append(str);
                })
            }


        }
    })
}
