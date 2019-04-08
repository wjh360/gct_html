$(function () {
    $(".projectPerson").html(storage('curLoginName', "", 'login'))// 回显项目发起人
    var proCtiyCountyLen = 1 //项目地区数量
    // 添加地区
    $("body").on("click", '.addCounty', function () {
        proCtiyCountyLen++;
        var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
            '   <span class="nameId f_l" style="height:34px;"></span>' +
            '   <span class="f_l">' +
            '       <div id="biddingCounty' + proCtiyCountyLen + '" class="proCtiyCounty"></div>' +
            '   </span>' +
            '   <span class="delProCity"></span>'
        '</div>'
        $(".addcountyMore").append(str)
        creatCityDiv('biddingCounty' + proCtiyCountyLen)
    })
    // 删除地区
    $('body').on('click', '.delProCity', function () {
        var idx = parseInt($(this).parents(".RoleDiv").attr("index"))
        $(this).parents(".RoleDiv").remove()
        for (var i = idx + 1; i <= proCtiyCountyLen; i++) {
            $("#biddingCounty" + i).attr("id", "biddingCounty" + (i - 1)).parents(".RoleDiv").attr("index", i - 1)
        }
        proCtiyCountyLen--
    })
    // 上传附件
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
    //项目类型下拉框
    ProjectTypeList()
    function ProjectTypeList() {
        $http({
            url: '/gct-web/bidApply/getProjectTypeEcho',
            success: function (r) {
                getDownSelect("proType", '请选择项目类型', r.data.list, 'id', 'typeName')
            }
        })
    }
    //  获取必传字段
    var postData = { //注释部分为非必传项
        bidName: "投标名称", //投标名称   字符串
        bidUnit: "发标单位", //投标单位  字符串
        // person :"联系人",    //联系人  字符串
        // tel : "联系电话",    //联系电话 字符串
        projectType: "项目类型", //项目类型ID  数字
        inviteAmount: "招标金额", //招标金额  字符串
        bidAmount: "预计中标金额", //预计中标金额  字符串
        bidOrice: "预计中标价格", //预计中标价格  字符串
        bidDate: "预计投标日期", //预计投标日期  字符串
        inviteDescr: "招标简介" //招标简介  字符串
        // remark : "备注"  //备注  字符串
        // province: "省"
    }
    //提交投标申请添加
    function addBidding(status) {
        var postObj = {
            person: $(".person").val(),
            tel: $(".tel").val(),
            remark: $(".remark").val(),
            status: status
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (k == 'projectType') val = $(".proType").attr("index")
            if (!val && (status != 1 || k == 'proType')) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
            if (val == '') {
                $.popInfo(postData[k] + '输入错误，请确认！')
                return
            }
        }
        var proCtiyCountyArr = []
        for (var i = 1; i <= proCtiyCountyLen; i++) {
            var eleData = getCodeSub('biddingCounty' + i)
            if (eleData['province']) proCtiyCountyArr.push(eleData)
            // if (eleData['city']) proCtiyCountyArr.push(eleData)
            // if (eleData['county']) proCtiyCountyArr.push(eleData)
            if (eleData['province'] == '') {
                // proCtiyCountyArr.push(eleData)
                $.popInfo("省输入错误，请确认！")
                return
            }
        }
        postObj.regionJson = JSON.stringify(proCtiyCountyArr)
        postObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        // log(postObj)
        $http({
            url: '/gct-web/bidApply/getBidApplyInsert',
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
                    addBidding(2)
                } else addBidding(3)
            }
        })
    })
    //保存
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定保存当前操作的内容吗？</div>",
            confirm: function () {
                addBidding(1)
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
