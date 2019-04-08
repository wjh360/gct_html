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
    var orderId = storage("orderId") || storage("orderId", "", "detailsOrder")
    // 获取提交数据
    var postData = {
        invoiceAmount: "发票金额",//金额
        invoiceNo: "发票号",
        dateS: "发票日期",
    }

    function invoiceAdd() {
        var postObj = {
            orderId: orderId,
            urls: delFileObjUrlList.join(),
            // files: JSON.stringify(orFileData['addFiles']),
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        if (!orFileData['addFiles'].length) return $.popInfo("请至少上传一张付款申请凭证")
        postObj.files = JSON.stringify(orFileData['addFiles'])
        $http({
            url: '/gct-web/order/invoiceAdd',
            data: postObj,
            success: function (r) {
                submitSuccess('', function () {
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