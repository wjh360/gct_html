$(function () {
    //回显框架合同list
    var col = [
        {
            field: 'contractName',
            title: '请选择',
            width: '30',
            'class': '',
            formatter: function (a) {
                return '<span class="checkBox"  name="radio"></span>'
            }
        }, {
            field: 'contractName',   //1.阅读了    2.未阅读
            title: '合同名称',
            width: '420'
        }
    ]
    $http({
        url: '/gct-web/constructContract/beforeAdd',
        success: function (r) {
            if (!r.data.fcList) return false;
            initTable("constructionTable", r.data.fcList, col)
            $("#constructionTable").find("thead").hide()
        }
    })
    var postObj = {
        contractName: "合同名称",
        contractNo: "合同编号",
        secondParty: "合同乙方",
        startTime: "合同周期开始时间",
        endTime: "合同周期结束时间",
        paymentMode: "付款方式",
        balanceMode: "结算方式",
        // isAdvance: 1         //有无预付：1-有；2-无
        // creditCode: "统一社会信用代码", 
        // person: "负责人",
        // tel: "联系电话", 
        accountNum: "收款账号",
        openBank: "开户行"
        // frameContractId:1         //框架合同ID
        // fileStr:”***”         //合同文件
    }
    fileUploader({
        btn: 'postFileBtn',
        data: [],
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
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            'content': '确定提交吗？',
            'confirm': function () {
                addPost()
            }
        })
    })
    function addPost() {
        var newPostObj = {
            creditCode: $(".creditCode").val(),        //"统一社会信用代码", 
            person: $(".person").val(),       //"负责人",
            tel: $(".tel").val()        //"联系电话", 
        }
        for (var k in postObj) {
            newPostObj[k] = $("." + k).val()
            if (!newPostObj[k]) return $.popInfo(postObj[k] + '错误！请确认')
        }
        newPostObj.isAdvance = $("input[name='isAdvance']:checked").val()
        if (!tabObj['constructionTable'].tab_select_ids || !tabObj['constructionTable'].tab_select_ids.length) return $.popInfo('请选择框架合同')
        newPostObj.frameContractId = tabObj['constructionTable'].tab_select_ids.join()
        if (!orFileData['postFileBtn'].length) return $.popInfo('合同附件至少上传一张！')
        newPostObj.fileStr = JSON.stringify(orFileData['postFileBtn'])
        $http({
            url: '/gct-web/constructContract/doAdd',
            data: newPostObj,
            success: function (r) {
                submitSuccess('提交成功', function () {
                    goBack()
                })
            }
        })
    }

})