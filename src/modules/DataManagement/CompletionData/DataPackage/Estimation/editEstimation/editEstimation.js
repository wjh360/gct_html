$(function () {

    // 回显数据
    var taskId = storage("taskId")
    finalValueInfo()
    function finalValueInfo() {
        $http({
            url: '/gct-web/order/finalValueInfo',
            data: {
                taskId: taskId //投标申请id
            },
            success: function (r) {
                if( !r.data) return false
                $(".finalValue").val(r.data.finalValue) //金额
                // 附件回显
                orFileData['postFileBtnEcho'] = r.data.files
                fileUploader({
                    btn: 'postFileBtn',
                    data: orFileData['postFileBtnEcho'],
                    tabId: 'fileListTable',
                    col: fileCol,
                    other:{
                        fileType: {
                            title: 'fileType',
                            extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                            mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                        }
                    }
                })
            }
        })
    }
    // 获取提交数据
    var postData = {
        finalValue: "决算值金额",
        // taskId:"工单id"
        // files:"附件"
    }
    //标书购买申请添加
    function addEstimation() {
        var postObj = {
            taskId: taskId,
            ids: delFileIdList.join(),
            urls: delFileObjUrlList.join(),
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        if (checkFileList('postFileBtn')) return $.popInfo("请上传附件！")
        postObj.files = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/order/finalValueAdd',
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
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                addEstimation()
            }
        })
    })
})