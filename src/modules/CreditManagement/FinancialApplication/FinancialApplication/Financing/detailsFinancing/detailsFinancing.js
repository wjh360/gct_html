$(function () {

    var userData = {
        "thisYearAmount": "", //今年
        "lastYearAmount": "", //去年
        "yeatBeforAmount": "", //前年
        "applyAmount": "", //融资金额
        "user": "", //申请人”
        "tel": "", //”电话”
        "repaymentSource": "", //repaymentSource：”还款来源”
        "remark": "", //remark：”其他说明
        // "type":""//融资类型 1补充流动资金2项目贷款
    }

    var FinancingID = storage("FinancingID") //融资申请id
    $http({
        url: '/gct-web/finance/financeApplyInfo',
        data: {
            id: FinancingID //融资申请id
        },
        success: function (r) {
            eachData(userData, r.data ? r.data : {})
            if (r.data.type == 1) {
                $(".type").html("补充流动资金")
            } else {
                $(".type").html("项目贷款")
            }
            // 回显附件
            getFileList(r.data.list)
        }
    })
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }

})