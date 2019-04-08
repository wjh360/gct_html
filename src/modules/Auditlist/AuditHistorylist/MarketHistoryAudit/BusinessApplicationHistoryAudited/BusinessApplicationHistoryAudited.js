$(function () {
    var MarketId = storage("MarketId")
    //初始化  费用类型下拉框
    CostTypeList()
    function CostTypeList() {
        $http({
            url: '/gct-web/costApply/getCostTypeAll',
            success: function (r) {
                // log(r)
                getDownSelect("costType", '请选择费用类型', r.data.list, 'id', 'costName')
            }
        })
    }
    // 回显提交内容
    getCostApplyInfo()
    function getCostApplyInfo() {
        $http({
            url: '/gct-web/costApply/getCostApplyInfo',
            data: {
                id: MarketId //业务费用id
            },
            success: function (r) {
                var a = r.data.obj
                // log(a)
                $(".bidName").html(a.bidName) //投标名称
                $(".costAmount").html((a.costAmount ? a.costAmount : '0') + "元")//费用金额
                $(".costCause").html(a.costCause) //费用事由
                $(".costDate").html(initDate(a.costDate)) //费用日期
                $(".applyUser").html(a.applyUser) //费用申请人
                $(".remark").html(a.remark) //备注
                $(".costName").html(a.costName) //费用类型
                getFileList(r.data.obj.fileList)
            }
        })
    }
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
    var auditId = storage('auditId')
    formAuditList(auditId)
})
