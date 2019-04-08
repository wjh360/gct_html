$(function () {
    fileUploader({
        btn: 'addFiles',              //上传文件的id    
        data: [],                        //数据=>初始化时可以为空 
        tabId: 'fileListTable',          //文件展示的表格id
        other: {
            isMore: true
        },
        dataS: setFileList
    })
    var curClickAmountIdx = 0
    function setFileList() {
        var str = ""
        $.each(orFileData['addFiles'], function (index, eleVal) {
            str += '<span class="imgFileIdx"><img class="imgView" src="' + baseFileUrl + eleVal.thumbnailUrl + '" data_file="' + eleVal.projectFileUrl + '" alt=""><i></i></span>'
        })
        if (orFileData['addFiles'].length >= 10) $("#addFiles").hide()
        $(".filesList").html(str)
    }
    $('body').on('mouseenter', '.imgFileIdx', function () {
        $(this).find('i').show()
    })
    $('body').on('mouseleave', '.imgFileIdx', function () {
        $(this).find('i').hide()
    })
    $('body').on('click', '.imgFileIdx i', function () {
        var idx = $(this).parents(".imgFileIdx").index()
        $(this).parents(".imgFileIdx").remove()
        if (orFileData['addFiles'].length >= 10) $("#addFiles").show()
        delFileObjUrlList.push(orFileData['addFiles'][idx].projectFileUrl)
        delFileObjUrlList.push(orFileData['addFiles'][idx].thumbnailUrl)
        orFileObj['addFilesUploader'].removeFile(orFileData['addFiles'][idx].fileIdx, true)
        orFileData['addFiles'].splice(idx, 1)
    })

    var orderId = storage("orderId")
    getList()
    function getList(date) {
        $http({
            url: '/gct-web/order/payApplyAddEcho',
            data: {
                orderId: orderId,
                date: date
            },
            success: function (r) {
                $('.nowAmountView').html($(".nowAmount").val() || '0.00')
                $(".ApplicationNum").html('0.00')
                if (!date) {
                    if (r.data.dateList && r.data.dateList.length) {
                        var desDate = ""
                        $.each(r.data.dateList, function (index, eleVal) {
                            eleVal.invoiceDate = initDate(eleVal.invoiceDate)
                            if(desDate == eleVal.invoiceDate){
                                r.data.dateList.splice(index,1)
                            } else desDate = eleVal.invoiceDate
                        })
                        getDownSelect('startDate', r.data.dateList[0].invoiceDate, r.data.dateList, 'invoiceDate', 'invoiceDate')
                    } else {
                        getDownSelect('startDate', '请选择日期', r.data.dateList, 'invoiceDate', 'invoiceDate')
                    }
                }
                initTable("PaymentApplicationTable", r.data.list, PaymentApplication_listCol)
            }
        })
    }
    $('body').on('click', '#startDate li', function () {
        getList($(this).attr("index"))
    })
    $(".nowAmount").bind("input propertychange", function () {
        $('.nowAmountView').html($(this).val())
        $(".table").find(".checkBox").removeClass("checkBox").removeClass("checkBoxTrue").addClass("checkBoxLocking")
        $(".ApplicationNum").html('0.00')
    })
    $('body').on('click', '.checkBoxLocking', function () {
        if (!$('.nowAmount').val()) return $.popInfo("请输入付款申请金额！")
        else if ($(".nowAmountView").html() == '0.00') return false
        else $(this).addClass("checkBoxTrue").removeClass("checkBoxLocking")
        curClickAmountIdx = $(this).parents('tr').attr("data-index")
        getApplicationNum()
    })
    $('body').on('click', '.checkBoxTrue', function () {
        $(this).addClass("checkBoxLocking").removeClass("checkBoxTrue").removeClass("checkBox")
        getApplicationNum()
    })
    function getApplicationNum() {
        getTableSelectId('PaymentApplicationTable')
        var count = 0
        $.each(tabObj['PaymentApplicationTable'].tab_select_data, function (index, eleVal) {
            count += parseFloat(eleVal['nowAmount'])
        })
        if (count < $(".nowAmount").val()) {
            $('.nowAmountView').html(($(".nowAmount").val() - count).toFixed(2))
        } else {
            $(".nowAmountView").html("0.00")
        }
        // log(count)
        $(".ApplicationNum").html(count.toFixed(2))
    }
    $('body').on('click', '.postBtn', function () {  
        if (!$(".nowAmount").val()) return $.popInfo("请填写付款申请金额")
        if (!orFileData['addFiles'].length) return $.popInfo("请至少上传一张付款申请凭证")
        if ($(".nowAmountView").html() > 1) return $.popInfo("未勾选足够发票")
        var arr = tabObj['PaymentApplicationTable'].tab_select_ids
        var lastClickAmount = arr[curClickAmountIdx]
        !lastClickAmount || arr.splice(curClickAmountIdx, 1)
        !lastClickAmount || arr.push(lastClickAmount)

        $.popConfirm({
            'content': '确定提交当前操作内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/order/payApplyAdd',
                    data: {
                        orderId: orderId,
                        urls: delFileObjUrlList.join(),
                        applyAmount: $(".nowAmount").val(),
                        idStr: arr.join(),
                        files: JSON.stringify(orFileData['addFiles']),
                    },
                    success: function (r) {
                        submitSuccess('提交成功', function () {
                            goBack()
                        })
                    }
                })
            }
        })
        
    })
})