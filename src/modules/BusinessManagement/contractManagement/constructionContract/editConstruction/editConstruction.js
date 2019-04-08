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
        // frameContractId:1         //框架合同ID
        // fileStr:”***”         //合同文件
    }
    var constructContractId = storage("constructContractId")  //施工合同id
    //回显框架合同list
    var col = [
        {
            field: 'contractName',
            title: '',
            width: '30',
            'class': '',
            formatter: function (a, b) {
                if (b.picthOn > -1) return '<span class="checkBox checkBoxTrue" name="radio"></span>'
                return '<span class="checkBox " name="radio"></span>'
            }
        }, {
            field: 'contractName',   //1.阅读了    2.未阅读
            title: '合同名称',
            width: '420'
        }
    ]
    $http({
        url: '/gct-web/constructContract/beforeUpdate',
        data: {
            constructContractId: constructContractId
        },
        success: function (r) {
            if (!r.data.constructContract) return false;
            eachData(postObj, r.data.constructContract)
            if (r.data.constructContract && r.data.constructContract.isAdvance) $("[name = isAdvance][value = " + r.data.constructContract.isAdvance + "]").attr("checked", "checked")
            if (!r.data.fcList) return false;
            initTable("constructionTable", r.data.fcList, col)
            $("#constructionTable").find("thead").hide()
            if (!r.data.fileList) return false;
            orFileData['postFileBtnEcho'] = r.data.fileList
            fileUploader({
                btn: 'postFileBtn',
                data: orFileData['postFileBtnEcho'],
                tabId: 'fileListTable',
                col: fileCol,
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
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            'content': '确定提交吗？',
            'confirm': function () {
                addPost()
            }
        })
    })
    function addPost() {
        getTableSelectId('constructionTable')
        var newPostObj = {}
        for (var k in postObj) {
            newPostObj[k] = $("." + k).val()
            if (!newPostObj[k] && (k != 'creditCode' && k != 'person' && k != 'tel')) return $.popInfo(postObj[k] + '错误！请确认')
        }
        newPostObj.isAdvance = $("input[name='isAdvance']:checked").val()
        if (!tabObj['constructionTable'].tab_select_ids || !tabObj['constructionTable'].tab_select_ids.length) return $.popInfo('请选择框架合同')
        newPostObj.frameContractId = tabObj['constructionTable'].tab_select_ids.join()
        if (checkFileList('postFileBtn')) return $.popInfo('合同附件至少上传一张！')
        newPostObj.fileStr = JSON.stringify(orFileData['postFileBtn'])
        newPostObj.fileUrlDel = delFileObjUrlList.join(",");//路径
        newPostObj.ids = delFileIdList.join(",");//提交状态
        newPostObj.id = constructContractId
        $http({
            url: '/gct-web/constructContract/doUpdate',
            data: newPostObj,
            success: function (r) {
                submitSuccess('提交成功', function (params) {
                    goBack()
                })
            }
        })
    }
})