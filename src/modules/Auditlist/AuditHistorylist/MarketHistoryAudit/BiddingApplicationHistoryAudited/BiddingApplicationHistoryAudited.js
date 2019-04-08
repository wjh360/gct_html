$(function () {
    var MarketId = storage("MarketId") //投标申请id
    // 回显提交内容
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: MarketId
            },
            success: function (r) {
                var a = r.data.obj
                // log(a)
                $(".bidName").html(a.bidName) //投标名称
                $(".bidUnit").html(a.bidUnit) //投标单位
                $(".person").html(a.person) //联系人
                $(".tel").html(a.tel) //联系电话
                $(".bidDate").html(initDate(a.bidDate)) //预计投标日期
                $(".inviteAmount").html((a.inviteAmount ? a.inviteAmount : '0') + '元') //招标金额
                $(".bidAmount").html((a.bidAmount ? a.bidAmount : '0') + "元")//预计中标金额
                $(".bidOrice").html(a.bidOrice) //预计中标价格
                $(".inviteDescr").html(a.inviteDescr) //招标简介
                $(".remark").html(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人
                $(".typeName").html(a.typeName)
                $(".address").html(a.regionList)
                //    回显附件
                orFileData['postFileBtnEcho'] = r.data.obj.fileList
                fileUploader({
                    btn: 'postFileBtn',
                    data: orFileData['postFileBtnEcho'],
                    tabId: 'fileListTable',
                    col: fileColDetail
                })
                auditNoPassRemark(MarketId, '1001')
                // 回显地区
                var getData = r.data.obj
                if (getData.regionList) {
                    $.each(getData.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
            }
        })
    }
    var auditId = storage('auditId')
    formAuditList(auditId)
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