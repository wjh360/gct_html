$(function () {
    var BiddingId = storage("BiddingId") //投标申请id
    //初始化  费用类型下拉框
    function CostTypeList(typeId) {
        $http({
            url: '/gct-web/bidApply/getProjectTypeEcho',
            success: function (r) {
                downSelectEcho({
                    el: 'proType',                //元素id
                    data: r.data.list,            //数据
                    ratioName: 'id',                // 需要比值的 键名
                    ratio: typeId,           // 需要比值的 基准值
                    idx: 'id',               // 需要区分的键名 唯一标识 
                    txt: 'typeName',               // 中文名字 所在的键名
                    type: '=='
                })
            }
        })
    }
    // 回显提交内容
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: BiddingId //投标id
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".bidName").val(a.bidName) //投标名称
                $(".bidUnit").val(a.bidUnit) //投标单位
                $(".person").val(a.person) //联系人
                $(".tel").val(a.tel) //联系电话
                $(".bidDate").val(initDate(a.bidDate)) //预计投标日期
                $(".inviteAmount").val(a.inviteAmount ? a.inviteAmount : '0')//招标金额
                $(".bidAmount").val(a.bidAmount ? a.bidAmount : '0') //预计中标金额
                $(".bidOrice").val(a.bidOrice) //预计中标价格
                $(".inviteDescr").val(a.inviteDescr) //招标简介
                $(".remark").val(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人
                // 回显下拉
                CostTypeList(r.data.obj.projectType);
                // 回显地区
                if (a.regionList) {
                    $.each(a.regionList, function (index, eleVal) {
                        if (index > 0) {
                            createProCity(eleVal)
                        } else {
                            getCodeEcho('biddingCounty1', eleVal.province, eleVal.city, eleVal.county)
                        }
                    })
                }
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
    $("body").on("click", '.addCounty', function () {
        createProCity()
    })
    $('body').on('click', '.delProCity', function () {
        var idx = parseInt($(this).parents(".RoleDiv").attr("index"))
        $(this).parents(".RoleDiv").remove()
        for (var i = idx + 1; i <= proCtiyCountyLen; i++) {
            $("#biddingCounty" + i).attr("id", "biddingCounty" + (i - 1)).parents(".RoleDiv").attr("index", i - 1)
        }
        proCtiyCountyLen--
    })
    //  获取必传字段
    var postData = { //注释部分为非必传项
        bidName: "投标名称", //投标名称   字符串
        bidUnit: "投标单位", //投标单位  字符串
        // person :"联系人",    //联系人  字符串
        // tel : "联系电话",    //联系电话 字符串
        projectType: "项目类型", //项目类型ID  数字
        inviteAmount: "招标金额", //招标金额  字符串
        bidAmount: "预计中标金额", //预计中标金额  字符串
        bidOrice: "预计中标价格", //预计中标价格  字符串
        bidDate: "预计投标日期", //预计投标日期  字符串
        inviteDescr: "招标简介", //招标简介  字符串
        // remark : "备注"  //备注  字符串
        // province: "省"
    }
    //提交投标申请添加
    function editBidding(status) {
        var postObj = {
            person: $(".person").val(),
            tel: $(".tel").val(),
            remark: $(".remark").val(),
            // projectType:projectType,
            // regionJson: addressArr,
            status: status,
            id: BiddingId, //投标id
            // regionIds:  //需要删除得省市县 多个地区ID以逗号分隔
            // fileIds:delFileIdList.join() //需要删除得附件   多个附件ID以逗号分隔         
        }
        var proCtiyCountyArr = []
        for (var i = 1; i <= proCtiyCountyLen; i++) {
            var eleData = getCodeSub('biddingCounty' + i)
            if (eleData['province']) proCtiyCountyArr.push(eleData)
        }
        postObj.regionJson = JSON.stringify(proCtiyCountyArr)
        for (var k in postData) {
            val = $("." + k).val()
            if (k == 'projectType') val = $(".proType").attr("index")
            if (!val && (status != 1 || k == 'bidName')) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        postObj.fileIds = delFileIdList.join(","); //提交状态
        postObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/bidApply/getBidApplyUpdate',
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
                    editBidding(2)
                } else editBidding(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                editBidding(1)
            }
        })
    })
})
var proCtiyCountyLen = 1  //项目地区数量
function createProCity(data) {
    proCtiyCountyLen++;
    var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
        '<span class="nameId f_l" style="width:120px;height:34px;"></span>' +
        '<span class="f_l">' +
        '<div id="biddingCounty' + proCtiyCountyLen + '" class="proCtiyCounty"></div>' +
        '</span>' +
        '<span class="delProCity"></span>'
    '</div>'
    $(".addcountyMore").append(str)
    creatCityDiv('biddingCounty' + proCtiyCountyLen)
    if (data) {
        getCodeEcho('biddingCounty' + proCtiyCountyLen, data.province, data.city, data.county)
    }
}