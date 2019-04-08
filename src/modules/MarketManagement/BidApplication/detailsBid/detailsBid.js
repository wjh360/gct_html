$(function () {
    //     // 招标信息回显
    var BiddingId = storage("BiddingId") //投标申请id
    var DocId = storage("DocId") //投标购买id
    // 回显提交内容
    getBidAddlyInfo()

    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: BiddingId //投标申请id
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
                $(".typeName").html(a.typeName) //项目类型
                // 回显地区
                if (a.regionList) {
                    $.each(a.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                //    回显附件
                getFileList(r.data.obj.fileList)
                getBidDocAddlyInfo()
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
    // 获取标书购买回显
    function getBidDocAddlyInfo() {
        $http({
            url: '/gct-web/bidDocApply/getBidDocAddlyInfo', //详情接口
            data: {
                docId: DocId //标书购买申请ID
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".purchaseAmount").html((a.purchaseAmount ? a.purchaseAmount : '0') + "元") //费用
                $(".remark").html(a.remark) //备注
                getFileList1(r.data.obj.fileList) //回显附件
            }
        })
    }
    function getFileList1(arr) {
        initTable("fileListTable1", arr, fileColDetail)
    }
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