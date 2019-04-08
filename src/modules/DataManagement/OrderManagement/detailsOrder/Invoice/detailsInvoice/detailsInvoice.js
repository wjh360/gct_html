$(function () {
    
    function setFileList(a) {
        var str = ""
        $.each(a, function (index, eleVal) {
            str += '<span class="imgFileIdx"><img class="imgView" src="' + baseFileUrl + eleVal.thumbnailUrl + '" data_file="' + eleVal.projectFileUrl + '" alt=""></span>'
        })
        if (a.length >= 10) $("#addFiles").hide()
        $(".filesList").html(str)
    }
    var invoiceId = storage("invoiceId")
    invoiceInfo()
    // $("body").on("click",'.imgView',function () {
    //     if($(".imgView").attr("src")){
    //         viewBigImg($(this).attr("src"))
    //     }
    // })
    function invoiceInfo() {
        $http({
            url: '/gct-web/order/invoiceInfo',
            data: {
                invoiceId: invoiceId,
            },
            success: function (r) {
                if(r.data){
                    setFileList(r.data.files)
                    $(".invoiceAmount").html(r.data.invoice.invoiceAmount)
                    $(".invoiceNo").html(r.data.invoice.invoiceNo)
                    $(".invoiceDate").html(initDate(r.data.invoice.invoiceDate)) 
                }
            }
        })
    }







})