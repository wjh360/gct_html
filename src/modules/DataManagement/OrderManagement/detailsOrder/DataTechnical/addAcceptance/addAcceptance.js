var datumId = storage("datumId")
$(function(){  
    function checkCertificateAdd() {
        var postObj = {
            ids: delFileIdList.join(),
            urls: delFileObjUrlList.join(),
            datumId:datumId
        }
        var files = []
        if (checkFileList('postFileBtn') && checkFileList('postFileBtn1')) return $.popInfo("请上传附件！")
        if (orFileData['postFileBtn'].length) {
            orFileData['postFileBtn'].forEach(function (ele, idx) {
                ele.fileCode=6004
                files.push(ele)
            });
        }
        if (orFileData['postFileBtn1'].length) {
            orFileData['postFileBtn1'].forEach(function (ele, idx) {
                ele.fileCode=6005
                files.push(ele)
            });
        }
        postObj.files = JSON.stringify(files)
        log(postObj)
        $http({
            url: '/gct-web/order/checkCertificateAdd',
            data: postObj,
            success: function (r) {
                submitSuccess('', function () {
                    goBack()
                })
            }
        })

    }
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                checkCertificateAdd()
            }
        })
    })

    


    // 回显
    checkCertificate()
    function checkCertificate () {
        $http({
            url: '/gct-web/order/checkCertificate',
            data: {
                datumId: datumId
            },
            success: function (r) {
                if(!r.data)return false
                //    回显附件
                 // var data = r.data
                var file1 = [],file2 = []
                r.data.forEach(function (ele, idx) {
                    log(ele)
                    if (ele.fileCode == 6004) {
                        file1.push(ele)
                    } else if (ele.fileCode == 6005) {
                        file2.push(ele)
                    }
                })
                
                orFileData['postFileBtnEcho'] = file1
                orFileData['postFileBtn1Echo'] = file2

                // initTable("fileListTable", file1, fileCol1)
                // initTable("fileListTable1", file2, fileCol2)
                log(orFileData['postFileBtnEcho'])
                  // 上传附件
                fileUploader({
                    btn: 'postFileBtn',
                    data: file1,
                    tabId: 'fileListTable',
                    col: fileCol1,
                    other: {
                        fileType: {
                            title: 'fileType',
                            extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                            mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                        }
                    }
                })
                // 上传附件
                fileUploader({
                    btn: 'postFileBtn1',
                    data: file2,
                    tabId: 'fileListTable1',
                    col: fileCol2,
                    other: {
                        fileType: {
                            title: 'fileType',
                            extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                            mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                        }
                    }
                })
            }
        })
    }
        
})

var fileCol1 = [
    {
        field: 'fileName',
        title: '文件名称',
        'class': ' tab_fileName',
        width: '900'
    }, {
        field: 'fileSize',
        title: '文件大小',
        width: '100',
        formatter: function (a, b) {
            return a || initFileSize(b.projectFileSize)
        }
    }, {
        title: '操作',
        'class': '',
        width: '100',
        formatter: function (a, b) {
            if(b.id){
                return '<a class="cancelFileBtn m_red" name="' + b.eleName + '" title= "">删除</a><a class="downLoadFile" download="download" href="">' + '下载' + '</a>'
        
            }else {
                return '<a class="cancelFileBtn m_red" name="' + b.eleName + '" title= "">删除</a><a class="noEdit"  href="">' + '下载' + '</a>'
        
            }
            }
    }
]
var fileCol2 = [
    {
        field: 'fileName',
        title: '文件名称',
        'class': ' tab_fileName',
        width: '900'
    }, {
        field: 'fileSize',
        title: '文件大小',
        width: '100',
        formatter: function (a, b) {
            return a || initFileSize(b.projectFileSize)
        }
    }, {
        title: '操作',
        'class': '',
        width: '100',
        formatter: function (a, b) {
            if(b.id){
                return '<a class="cancelFileBtn m_red" name="' + b.eleName + '" title= "">删除</a><a class="downLoadFile" download="download" href="">' + '下载' + '</a>'
        
            }else {
                return '<a class="cancelFileBtn m_red" name="' + b.eleName + '" title= "">删除</a><a class="noEdit"  href="">' + '下载' + '</a>'
        
            }
            }
    }
]