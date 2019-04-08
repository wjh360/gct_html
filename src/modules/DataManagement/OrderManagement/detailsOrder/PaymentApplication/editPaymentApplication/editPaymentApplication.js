$(function () {
    var curClickAmountIdx = 0
    function setFileList(a) {
        var str = ""
        $.each(a, function (index, eleVal) {
            str += '<span class="imgFileIdx"><img class="imgView" src="' + baseFileUrl + eleVal.thumbnailUrl + '" data_file="' + eleVal.projectFileUrl + '" alt=""><i></i></span>'
        })
        if (a.length >= 10) $("#addFiles").hide()
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
        var fileArr = orFileData['addFilesEcho'].concat(orFileData['addFiles'])
        if (fileArr.length >= 10) $("#addFiles").show()
        delFileObjUrlList.push(fileArr[idx].projectFileUrl)
        delFileObjUrlList.push(fileArr[idx].thumbnailUrl)
        // if (fileArr[idx].fileIdx) orFileObj['addFilesUploader'].removeFile(fileArr[idx].fileIdx, true)
        // if (fileArr[idx].id) delFileIdList.push(fileArr[idx].id)
        if (fileArr[idx].fileIdx) {
            orFileObj['addFilesUploader'].removeFile(fileArr[idx].fileIdx, true)
            orFileData['addFiles'].splice(idx - orFileData['addFilesEcho'].length, 1)
        }
        if (fileArr[idx].id) {
            delFileIdList.push(fileArr[idx].id)
            orFileData['addFilesEcho'].splice(idx, 1)
        }
        fileArr.splice(idx, 1)
    })
    var payApplyId = storage("payApplyId")
    getList()
    function getList(date) {
        $http({
            url: '/gct-web/order/payApplyUpdateEcho',
            data: {
                id: payApplyId,
            },
            success: function (r) {
                $(".nowAmount").val(r.data.applyAmount)
                $('.nowAmountView').html(r.data.applyAmount - r.data.nowAmount > 0 ? r.data.applyAmount - r.data.nowAmount : '0.00')
                $(".ApplicationNum").html(r.data.nowAmount || '0.00')
                if (r.data.dateList && r.data.dateList.length) {
                    $.each(r.data.dateList, function (index, eleVal) {
                        eleVal.invoiceDate = initDate(eleVal.invoiceDate)
                    })
                    getDownSelect('startDate', initDate(r.data.invoiceDate), r.data.dateList, 'invoiceDate', 'invoiceDate')
                } else {
                    getDownSelect('startDate', '请选择日期', r.data.dateList, 'invoiceDate', 'invoiceDate')
                }
                curClickAmountIdx = r.data.list.length - 1
                initTable("PaymentApplicationTable", r.data.list, PaymentApplication_listCol1)
                orFileData['addFilesEcho'] = r.data.files
                fileUploader({
                    btn: 'addFiles',              //上传文件的id    
                    data: orFileData['addFilesEcho'],                        //数据=>初始化时可以为空 
                    tabId: 'fileListTable',          //文件展示的表格id
                    other: {
                        isMore: true
                    },
                    dataS: setFileList
                })
            }
        })
    }
    // var orderId = storage("orderId")
    $('body').on('click', '#startDate li', function () {
        getTabList($(this).attr("index"))
    })
    function getTabList(date) {
        $http({
            url: '/gct-web/order/payApplyUpdateInvoices',
            data: {
                id: payApplyId,
                date: date
            },
            success: function (r) {
                $('.nowAmountView').html($(".nowAmount").val() || '0.00')
                $(".ApplicationNum").html('0.00')
                initTable("PaymentApplicationTable", r.data.list, PaymentApplication_listCol)
                $("#PaymentApplicationTable").find(".checkBoxTrue").addClass("checkBoxLocking").removeClass("checkBoxTrue").removeClass("checkBox")
                getApplicationNum()
            }
        })
    }
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
            count += parseFloat(eleVal['invoiceAmount'])
        })
        if (count < $(".nowAmount").val()) {
            $('.nowAmountView').html(($(".nowAmount").val() - count).toFixed(2))
        } else {
            $(".nowAmountView").html("0.00")
        }
        $(".ApplicationNum").html(count.toFixed(2) || '0.00')
    }
    $('body').on('click', '.postBtn', function () {
        //         orderId：1 订单ID
        // applyAmount:321  申请金额
        // idStr：“1，2，3，” 发票ID以逗号分割
        // urls:”aa/bb,cc/dd”  删除的文件路径以逗号拼接成字符串
        // files:[
        // {
        // "fileName":"asd", //名字
        // "projectFileUrl":"a/b", //路径
        // "projectFileSize":321 大小
        // thumbnailUrl:”缩略图路径”
        // suffixName：“文件后缀名”
        // },......
        // ],   
        if (!$(".nowAmount").val()) return $.popInfo("请填写付款申请金额")
        if (checkFileList('addFiles')) return $.popInfo("请至少上传一张付款申请凭证")
        if ($(".nowAmountView").html() != '0.00') return $.popInfo("未勾选足够发票")
        getTableSelectId("PaymentApplicationTable")
        var arr = tabObj['PaymentApplicationTable'].tab_select_ids

        var lastClickAmount = arr[curClickAmountIdx]
        !lastClickAmount || arr.splice(curClickAmountIdx, 1)
        !lastClickAmount || arr.push(lastClickAmount)

        $.popConfirm({
            'content': '确定提交当前操作内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/order/payApplyUpdate',
                    data: {
                        id: payApplyId,
                        urls: delFileObjUrlList.join(),
                        applyAmount: $(".nowAmount").val(),
                        idStr: arr.join(),
                        files: JSON.stringify(orFileData['addFiles']),
                        ids: delFileIdList.join()
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