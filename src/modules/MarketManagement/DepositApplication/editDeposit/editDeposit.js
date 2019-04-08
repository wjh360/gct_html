$(function () {
    //     // 招标信息回显
    var BiddingId = storage("BiddingId") //投标申请id
    var BondId = storage("BondId")  ////保证金id
    // 回显提交内容
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: BiddingId  //投标申请id
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
                $(".bidAmount").html(a.bidAmount + "元") //预计中标金额
                $(".bidOrice").html(a.bidOrice) //预计中标价格
                $(".inviteDescr").html(a.inviteDescr) //招标简介
                $(".remark_details").html(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人
                // 回显地区
                if (a.regionList) {
                    $.each(a.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                $(".typeName").html(a.typeName)//项目类型
                getFileList(r.data.obj.fileList)
                getBondApplyInfo()
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable1", arr, fileColDetail)
    }
    // 提交信息回显（详情）
    function getBondApplyInfo() {
        $http({
            url: '/gct-web/bondApply/getBondApplyInfo',
            data: {
                bondId: BondId     //保证金id
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".bondUnit").val(a.bondUnit)//保证金收款单位
                $(".openBank").val(a.openBank)//收款单位开户行
                $(".bankAccount").val(a.bankAccount)//银行账户
                $(".bondAmount").val(a.bondAmount ? a.bondAmount : '0')//保证金金额
                $(".bondDate").val(initDate(a.bondDate))//保证金缴纳日期
                $(".remark").val(a.remark)//备注
                $(".perforAmount").val(a.perforAmount ? a.perforAmount : '0')
                // 回显附件
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
        bondUnit: "保证金收款单位", //保证金收款单位  字符串
        openBank: "收款单位开户行", //收款单位开户行  字符串
        bankAccount: "银行账户", //银行账户     字符串
        bondAmount: "保证金金额", //保证金金额  字符串
        bondDate: "保证金缴纳日期", //保证金缴纳日
        //  remark: "备注", //备注  字符串 
        //  status: "操作状态", //操作状态  数字  (1.保存   2.提交)
        //  bidId: "招标ID", //招标ID  数字
        //  fileJson: "附件" //JSON字符串  附件
    }
    //提交投标申请添加
    function editDeposit(status) {
        var postObj = {
            remark: $(".remark").val(),
            status: status,
            bidId: BiddingId, //  投标id 
            // fileJson:fileJson  //附件 
            bondId: BondId    //保证金id    
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val && (status != 1 || k == 'bondUnit')) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
            if (val == '') {
                $.popInfo(postData[k] + '输入错误，请确认！')
                return
            }
        }
        postObj.fileIds = delFileIdList.join(",");//提交文件
        postObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/bondApply/getBondApplyUpdate',
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
                    editDeposit(2)
                } else editDeposit(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                editDeposit(1)
            }
        })
    })
})
// var proCtiyCountyLen = 0  //项目地区数量
// function createProCity(data) {
//     proCtiyCountyLen++;
//     var str = ""
//     if (proCtiyCountyLen > 1) {
//         str = '<span class="nameId f_l" style="width:100px;height:34px;"></span>'
//     } else {
//         str = '<span class="nameId">项目地区：</span>'
//     }
//     var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
//         str +
//         '<span >' +
//         '<span style="padding:0 10px;">' + (data.provinceName?data.provinceName:'') + '</span>' +
//         '<span style="padding:0 10px;">' +(data.cityName?data.cityName:'') + '</span>' +
//         '<span style="padding:0 10px;">' + (data.countyName?data.countyName:'') + '</span>'
//     '</span>' +
//         '<span class="delProCity"></span>'
//     '</div>'
//     $(".addcountyMore").append(str)
// }