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
                $(".checkDecide").val(a.finishDatum.checkDecide) //审定值
                //    回显附件
                orFileData['postFileBtnEcho'] = r.data.files
                fileUploader({
                    btn: 'postFileBtn',
                    data: orFileData['postFileBtnEcho'],
                    tabId: 'fileListTable',
                    col: fileCol,
                    other:{
                        fileType: {
                            title: 'fileType',
                            extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                            mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                        }
                    }
                })
            },
        })
    }

    function checkDecideAdd() {
        var postObj={
           checkDecide: $(".checkDecide").val(), //“审定值金额”
           datumId: datumId, //竣工资料ID
           ids:delFileIdList.join(),
           urls:delFileObjUrlList.join(),
        }
       if(checkFileList('postFileBtn')) return $.popInfo("请上传附件！")
       postObj.files = JSON.stringify(orFileData['postFileBtn'])
       $http({
           url: '/gct-web/order/checkDecideAdd',
           data: postObj,
           success: function (r) {
            submitSuccess('',function () {
                goBack()
            })
           }
       })
   }

   //提交
   $("body").on("click", '.postBtn', function () {
       $.popConfirm({
           content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
           confirm: function () {
               checkDecideAdd()
           }
       })
   })

})