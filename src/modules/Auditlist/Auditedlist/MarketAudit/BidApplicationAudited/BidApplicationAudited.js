$(function () {
    // 招标信息回显
    var MarketId = storage("MarketId") //投标申请id
    var bidId = storage("bidId")
    // 回显提交内容
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: bidId //投标申请id
            },
            success: function (r) {
                var a = r.data.obj
                if (!a) return false
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
                // 回显地区
                var getData = r.data.obj
                if (getData.regionList) {
                    $.each(getData.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                $(".typeName").html(a.typeName) //项目类型
                getFileList(r.data.obj.fileList)//    回显附件
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
    // 获取提交回显
    getBidDocAddlyInfo()
    function getBidDocAddlyInfo() {
        $http({
            url: '/gct-web/bidDocApply/getBidDocAddlyInfo', //详情接口
            data: {
                docId: MarketId //标书购买申请ID
            },
            success: function (r) {

                var a = r.data.obj
                // log(a)
                $(".purchaseAmount").html((a.purchaseAmount ? a.purchaseAmount : '0') + "元") //金额
                $(".remark").html(a.remark) //备注
                getFileList1(r.data.obj.fileList) //附件
            },
        })
    }
    function getFileList1(arr) {
        fileCol[2].formatter = function () {
            return '<a class="downLoadFile" download="download" href="">' + '下载' + '</a>'
        }
        initTable("fileListTable1", arr, fileCol)
    }
})