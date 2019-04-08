$(function () {
    var BusinessId = storage("BusinessId")
    //初始化  费用类型下拉框
    function CostTypeList(typeId) {
        $http({
            url: '/gct-web/costApply/getCostTypeAll',
            success: function (r) {
                downSelectEcho({
                    el: 'costType',                //元素id
                    data: r.data.list,            //数据
                    ratioName: 'id',                // 需要比值的 键名
                    ratio: typeId,           // 需要比值的 基准值
                    idx: 'id',               // 需要区分的键名 唯一标识 
                    txt: 'costName',               // 中文名字 所在的键名
                    type: '=='
                })
            }
        })
    }
    // 回显提交内容
    getCostApplyInfo()
    function getCostApplyInfo() {
        $http({
            url: '/gct-web/costApply/getCostApplyInfo',
            data: {
                id: BusinessId     //业务费用id
            },
            success: function (r) {
                if( !r.data.obj) return false
                var a = r.data.obj
                $(".bidName").val(a.bidName)//投标名称
                $(".costAmount").val(a.costAmount)//费用金额
                $(".costCause").val(a.costCause)//费用事由
                $(".costDate").val(initDate(a.costDate))//费用日期
                $(".applyUser").val(a.applyUser)//费用申请人
                $(".remark").val(a.remark)//备注
                CostTypeList(r.data.obj.costType);//类型
                //    回显附件
                orFileData['postFileBtnEcho'] = r.data.obj.fileList
                fileUploader({
                    btn: 'postFileBtn',
                    data: orFileData['postFileBtnEcho'],
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
            }
        })
    }
    //  获取必传字段
    var postData = { //注释部分为非必传项
        // bidId :"投标ID",//投标ID
        // status :"操作状态",//操作状态  数字  (1.保存   2.提交)
        costType: "费用类型", //费用事项ID
        costAmount: "费用金额", //费用金额
        costCause: "费用事由", //费用事由
        costDate: "费用日期", //费用日期
        // remark:"备注", //备注
        // fileJson:"附件" //JSON字符串  附件
    }
    //提交业务费用申请编辑
    function editBusiness(status) {
        var postObj = {
            remark: $(".remark").val(),
            // fileJson: fileJson,
            status: status,
            id: BusinessId,
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
            url: '/gct-web/costApply/getCostApplyUpdate',
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
                    editBusiness(2)
                } else editBusiness(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                editBusiness(1)
            }
        })
    })
})