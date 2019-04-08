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
                $(".bidName").html(a.bidName) //投标名称
                $(".bidUnit").html(a.bidUnit) //投标单位
                $(".person").html(a.person) //联系人
                $(".tel").html(a.tel) //联系电话
                $(".bidDate").html(initDate(a.bidDate)) //预计投标日期
                $(".inviteAmount").html((a.inviteAmount ? a.inviteAmount : '0') + '元') //招标金额
                $(".bidAmount").html((a.bidAmount ? a.bidAmount : '0') + "元") //预计中标金额
                $(".bidOrice").html(a.bidOrice) //预计中标价格
                $(".inviteDescr").html(a.inviteDescr) //招标简介
                $(".remark").html(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人
                $(".typeName").html(a.typeName)
                $(".address").html(a.regionList)
                // 回显地区
                var getData = r.data.obj
                if (getData.regionList) {
                    $.each(getData.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                getFileList(a.fileList) //    回显附件
                auditNoPassRemark(MarketId, '1001') //回显审核信息
            }
        })
        function getFileList(arr) {
            initTable("fileListTable", arr, fileColDetail)
        }
    }
})