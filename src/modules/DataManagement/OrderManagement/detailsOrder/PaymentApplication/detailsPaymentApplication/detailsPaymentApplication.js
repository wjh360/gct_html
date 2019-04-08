$(function () {

    function setFileList(a) {
        var str = ""
        $.each(a, function (index, eleVal) {
            str += '<span class="imgFileIdx"><img class="imgView" src="' + baseFileUrl + eleVal.thumbnailUrl + '" data_file="' + eleVal.projectFileUrl + '" alt=""></span>'
        })
        if (a.length >= 10) $("#addFiles").hide()
        $(".filesList").html(str)
    }

    var payApplyId = storage("payApplyId")
    getList()
    // $("body").on("click",'.imgFileIdx',function () {
    //     if($(this).find(".imgView").attr("src")){
    //         viewBigImg($(this).attr("src"))
    //     }
    // })
    function getList(date) {
        $http({
            url: '/gct-web/order/payApplyInfo',
            data: {
                id: payApplyId,
            },
            success: function (r) {
                
                if(r.data){
                    initTable("PaymentApplicationTable", r.data.list, PaymentApplication_listCol2)
                    setFileList(r.data.files)
                    if(r.data.payApply){
                        $(".nowAmount").html(r.data.payApply.applyAmount)
                        $(".startDate").html(initDate(r.data.payApply.createTime))
                    }
                }
            }
        })
    }

})