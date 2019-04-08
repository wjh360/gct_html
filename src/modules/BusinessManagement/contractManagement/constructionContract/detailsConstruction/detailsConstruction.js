$(function () {
    var postObj = {
        contractName: "合同名称",
        contractNo: "合同编号",
        secondParty: "合同乙方",
        startTime: "合同周期开始时间",
        endTime: "合同周期结束时间",
        paymentMode: "付款方式",
        balanceMode: "结算方式",
        // isAdvance: 1         //有无预付：1-有；2-无
        creditCode: "统一社会信用代码",
        person: "负责人",
        tel: "联系电话",
        accountNum: "收款账号",
        openBank: "开户行"
        // fileStr:”***”         //合同文件
    }
    var constructContractId = storage("constructContractId")  //施工合同id
    $http({
        url: '/gct-web/constructContract/info',
        data: {
            constructContractId: constructContractId
        },
        success: function (r) {
            if (r.data.constructContract) eachData(postObj, r.data.constructContract)
            if (r.data.constructContract && r.data.constructContract.isAdvance) $(".isAdvance").html(r.data.constructContract.isAdvance == 1 ? '有' : '无')
            if (r.data.constructContract && r.data.constructContract.frameContract) $(".contractName").html(r.data.constructContract.frameContract.contractName)
            if (!r.data.fileList) return false;
            getFileList(r.data.fileList)
        }
    })
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
})