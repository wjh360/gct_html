
var acceptCerId =  storage('acceptCerId')
$(function () {
    initData()
})
function initData() {
    $http({
        url: '/gct-web/order/checkCertificate',
        data: {
            datumId: acceptCerId
        },
        success: function (r) {
           var fileArrOne=[]
           var fileArrTwo=[]
            if(!r.data) return
            $(r.data).each(function (k,v) {
                // fileCode：6004  初步   6005竣工
                if(v.fileCode==6004)fileArrOne.push(v)
                else if(v.fileCode==6005)fileArrTwo.push(v)

            })

            initTable("projectContractTable", fileArrOne, fileColDetail)
            initTable("workstartReports",fileArrTwo, fileColDetail)
        }
    })
}