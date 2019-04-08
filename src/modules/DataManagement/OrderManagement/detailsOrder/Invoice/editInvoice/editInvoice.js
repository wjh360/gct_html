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
        if (fileArr[idx].fileIdx) {
            orFileObj['addFilesUploader'].removeFile(fileArr[idx].fileIdx, true)
            orFileData['addFiles'].splice(idx-orFileData['addFilesEcho'].length,1)

        }
        if (fileArr[idx].id){
            delFileIdList.push(fileArr[idx].id)
            orFileData['addFilesEcho'].splice(idx,1)
        }
        // fileArr.splice(idx, 1)
    })
    var invoiceId = storage("invoiceId")
    invoiceInfo()
    function invoiceInfo() {
        $http({
            url: '/gct-web/order/invoiceInfo',
            data: {
                invoiceId: invoiceId,
            },
            success: function (r) {
                if (r.data) {
                    setFileList(r.data.files)
                    $(".invoiceAmount").val(r.data.invoice.invoiceAmount)
                    $(".invoiceNo").val(r.data.invoice.invoiceNo)
                    $(".dateS").val(initDate(r.data.invoice.invoiceDate))
                    orFileData['addFilesEcho'] = r.data.files
                    fileUploader({
                        btn: 'addFiles', //上传文件的id    
                        data: orFileData['addFilesEcho'], //数据=>初始化时可以为空 
                        tabId: 'fileListTable', //文件展示的表格id
                        other: {
                            isMore: true
                        },
                        dataS: setFileList
                    })

                }
            }
        })
    }
    // var orderId = storage("orderId")
    // 获取提交数据
    var postData = {
        invoiceAmount: "发票金额", //金额
        invoiceNo: "发票号",
        dateS: "发票日期",
    }
    function invoiceAdd() {
        var postObj = {
            id: invoiceId,
            // orderId:orderId,
            ids: delFileIdList.join(),
            urls: delFileObjUrlList.join(),
            // files: JSON.stringify(orFileData['addFiles']),
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        if (checkFileList('addFiles')) return $.popInfo("请至少上传一张付款申请凭证")
        postObj.files = JSON.stringify(orFileData['addFiles'])
        $http({
            url: '/gct-web/order/invoiceUpdate',
            data: postObj,
            success: function (r) {
                submitSuccess('',function () {
                    goBack()
                })
            }
        })
    }

    //提交
    $("body").on("click", '.postBtn', function () {
        var thisHtm = $(this).html()
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                invoiceAdd()
            }
        })
    })
})