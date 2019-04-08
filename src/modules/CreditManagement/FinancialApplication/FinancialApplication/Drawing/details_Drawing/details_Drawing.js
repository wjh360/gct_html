$(function () {

    var userData = {
        "companyName": "", //工程公司
        "financeCompanyName": "", //金融公司
        "applyAmount": "", //申请金额
        "user": "", //”申请人”
        "tel": "", //”电话”
        // "status":"",//状态 1待处理2同意
    }

    var DrawingID = storage("DrawingID") //融资申请id
    $http({
        url: '/gct-web/finance/applyMoneyInfo',
        data: {
            id: DrawingID //提款申请id
        },
        success: function (r) {
            eachData(userData, r.data ? r.data : {})
            getFileList(r.data.list)
        }
    })
    
    //生成文件列表
    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }

})