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
            $(".applyAmount").html(r.data.applyAmount + "元")
            getFileList(r.data.list)
        }
    })

    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }

    //提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                agree()
            }

        })
    })
    // 同意
    function agree() {
        $http({
            url: '/gct-web/finance/agree',
            data: {
                id: DrawingID //提款申请id
            },
            success: function (r) {
                submitSuccess('', function () {
                    goBack()
                })
            }
        })
    }
})