$(function () {

    var datumId = storage("datumId") //竣工资料id
    // 回显提交内容
    checkDecideInfo()
    function checkDecideInfo() {
        $http({
            url: '/gct-web/order/checkDecideInfo',
            data: {
                datumId: datumId
            },
            success: function (r) {
                if( !r.data) return false
                var a = r.data
                $(".checkDecide").html(a.finishDatum.checkDecide + "元") //审定值
                //    回显附件
                getFileList(r.data.files)
                       
            }
        })
    }
      //生成文件列表
      function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }
})