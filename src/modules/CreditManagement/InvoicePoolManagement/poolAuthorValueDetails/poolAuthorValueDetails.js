
var checkDecideId = storage('checkDecideId')
$(function () {
    initData()
})
function initData() {
    $http({
        url: '/gct-web/invoicePond/checkDecideInfo',
        data: {
            finishDatumId: checkDecideId
        },
        success: function (r) {
            $(".checkDecide").html((r.data.checkDecide ? r.data.checkDecide : 0) + '元')
            if(!r.data.fileList)return false;
            initTable('projectTableContruct', r.data.fileList, fileColDetail)
        }
    })
}
