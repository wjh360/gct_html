$(function () {

    $(".projectPerson").html(storage('curLoginName', "", 'login'))
    $(".bidName").html(storage('BiddingName'))
    var BiddingId = storage("BiddingId")
    //初始化  费用类型下拉框
    CostTypeList()
    function CostTypeList() {
        $http({
            url: '/gct-web/costApply/getCostTypeAll',
            success: function (r) {
                getDownSelect("costType", '请选择费用类型', r.data.list, 'id', 'costName')
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
        // bidId :"投标ID",//投标ID
        // status :"操作状态",//操作状态  数字  (1.保存   2.提交)
        costType: "费用类型", //费用事项ID
        costAmount: "费用金额", //费用金额
        costCause: "费用事由", //费用事由
        costDate: "费用日期" //费用日期
        // remark:"备注", //备注
        // fileJson:"附件" //JSON字符串  附件
    }
    //提交业务费用申请添加
    function addBusiness(status) {
        var postObj = {
            remark: $(".remark").val(),
            // fileJson: fileJson,
            bidId: BiddingId,
            status: status
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (k == 'costType') val = $(".costType").attr("index")
            if (!val && (status != 1 || k == 'costType')) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
            if (val == '') {
                $.popInfo(postData[k] + '输入错误，请确认！')
                return
            }
        }
        postObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/costApply/getCostApplyInsert',
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
                if (thisHtm == '提交') {
                    addBusiness(2)
                } else addBusiness(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                addBusiness(1)
            }
        })
    })
})