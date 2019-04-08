$(function () {

    var userData = {
        "user": "", //”申请人”
        "tel": "", //”电话”
        // "trueName": "", //trueName：“创建人”
        // "createTimeStamp": "", //createTimeStamp：时间
    }

    var TransactionsID = storage("TransactionsID")  //融资申请id
    $http({
        url: '/gct-web/finance/manageMoneyInfo',
        data: {
            id: TransactionsID     //融资申请id
        },
        success: function (r) {
            eachData(userData, r.data ? r.data : {})
            manageAmount:$(".manageAmount").html((r.data.manageAmount?r.data.manageAmount:'0')+"元")
            interestRate:$(".interestRate").html((r.data.interestRate?r.data.interestRate:'0')+"%")
            expectCycle:$(".expectCycle").html((r.data.expectCycle?r.data.expectCycle:'0')+"个月")
        }
    })

})