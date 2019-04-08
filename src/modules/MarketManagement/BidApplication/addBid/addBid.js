$(function () {
    //     // 招标信息回显
    var BiddingId = storage("BiddingId") //投标申请id
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: BiddingId
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".bidName").html(a.bidName) //投标名称
                $(".bidUnit").html(a.bidUnit) //投标单位
                $(".person").html(a.person) //联系人
                $(".tel").html(a.tel) //联系电话
                $(".bidDate").html(initDate(a.bidDate)) //预计投标日期
                $(".inviteAmount").html((a.inviteAmount ? a.inviteAmount : '0') + '元') //招标金额
                $(".bidAmount").html((a.bidAmount ? a.bidAmount : '0') + "元") //预计中标金额
                $(".bidOrice").html(a.bidOrice) //预计中标价格
                $(".inviteDescr").html(a.inviteDescr) //招标简介
                $(".remark_details").html(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人 
                if (a.regionList) {// 回显地区
                    $.each(a.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                $(".typeName").html(a.typeName) //项目类型
                getFileList(r.data.obj.fileList)
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable1", arr, fileColDetail)
    }
    //    附件
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
    // 获取提交数据
    var postData = {
        purchaseAmount: "标书购买费用", //标书购买费用  字符串
        // remark :"备注"           //备注  字符串 
        // status :"操作状态"            //操作状态  数字  (1.保存   2.提交)
        // bidId  :"投标ID"           //投标ID  数字
    }
    //标书购买申请添加
    function addBidPost(status) {
        var postObj = {
            remark: $(".remark").val(),
            bidId: BiddingId, //投标ID
            status: status
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val && (status != 1 || k == 'purchaseAmount')) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        postObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/bidDocApply/getBidDocApplyInsert',
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
                    addBidPost(2)
                } else addBidPost(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                addBidPost(1)
            }
        })
    })
})
