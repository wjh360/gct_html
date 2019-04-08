$(function () {

    //初始化  金融机构下拉框
    FinanceTypeList()
    function FinanceTypeList() {
        $http({
            url: '/gct-web/finance/addApplyMoneyEcho',
            success: function (r) {
                getDownSelect("financeId", '请选择金融机构', r.data, 'id', 'companyName')
            }
        })

    }
    fileUploader({
        btn: 'postFileBtn',
        data: [],
        tabId: 'fileListTable',
        col: fileCol,
        other: {
            fileType: {
                title: 'fileType',
                extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
            }
        }
    })
    //  获取必传字段
    var postData = { //注释部分为非必传项
        financeId: "金融机构", //金融机构
        user: "申请人",
        phone: "联系电话", //联系电话
        applyAmountS: "申请金额", //申请金额
        // files: "附件", //附件
    }

    //提交业务费用申请添加
    function addDrawing() {
        var postObj = {}
        for (var k in postData) {
            val = $("." + k).val()
            if (k == 'financeId') val = $(".financeId").attr("index")
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        if (checkFileList('postFileBtn')) return $.popInfo("请上传附件！")
        postObj.files = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/finance/addApplyMoney',
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
                addDrawing()
            }
        })
    })


})