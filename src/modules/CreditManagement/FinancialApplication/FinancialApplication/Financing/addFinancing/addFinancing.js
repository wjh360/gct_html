$(function () {

    fileUploader ({
        btn:'postFileBtn',
        data:[],
        tabId:'fileListTable',
        col:fileCol,
        other:{
            fileType: {
                title: 'fileType',
                extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
            }
        }
    })

    //  获取必传字段
    var postData = { //注释部分为非必传项
        user: "申请人", //申请人
        phone: "电话号码", //电话号码
        financeApplyType: "融资类型", //类型 1补充流动资金2项目贷款
        apply: "融资金额", //融资金额 \
        thisYear: "今年金额", //今年金额 
        lastYear: "去年金额", //去年金额
        yeatBefor: "前年金额", //前年金额
        repaymentSource: "还款来源", //还款来源
        // file:
        //  remark :""              //其他说明
        // file:"附件"
    }

    //提交融资申请添加
    function addFinancing() {
        var postObj = {
            remark: $(".remark").val()
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (k == 'financeApplyType') val = $(".type").attr("index")
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        if(checkFileList('postFileBtn')) return $.popInfo("请上传附件！")
        postObj.files = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/finance/addFinanceApply',
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
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                addFinancing()
            }
        })
    })

})