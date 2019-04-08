$(function () {
    var auditItem,
        logType,
        parameter;
    var msgToAuditObj = {    //前往审核列表
        '1001': {
            'status': '0'         //当前列表的状态
        },          //市场审核
        '1002': {
            'status': '0'         //当前列表的状态
        },
        '1003': {
            'status': '0'         //当前列表的状态
        },
        '1004': {
            'status': '0'         //当前列表的状态
        },
        '2001': {
            'status': '1'         //当前列表的状态
        },          //项目审核
        '2002': {
            'status': '1'         //当前列表的状态
        },
        '2003': {
            'status': '1'         //当前列表的状态
        },
        '3001': {
            'status': '2'         //当前列表的状态
        },          //工单审核
        '3002': {
            'status': '2'         //当前列表的状态
        },
        '3003': {
            'status': '2'         //当前列表的状态
        },
        '3004': {
            'status': '2'         //当前列表的状态
        },
        '4001': {
            'status': '5'         //当前列表的状态
        },          //成本审核
        '5001': {
            'status': '4'         //当前列表的状态
        },          //采购审核
        '6001': {
            'status': '3'         //当前列表的状态
        },          //财务审核
        '6002': {
            'status': '3'         //当前列表的状态
        },
        '6003': {
            'status': '3'         //当前列表的状态
        },
        '6004': {
            'status': '3'         //当前列表的状态
        },
        'listPage': '/modules/Auditlist/Auditedlist.html',
        'back_iden': '/modules/financialManagement/ReimbursementMsg.html'
    }
    var msgPassObj = {    //前往申请列表
        '1001': {            //市场审核
            'passPage': '/modules/MarketManagement/BidApplication.html'    //投标申请
        },
        '1002': {
            'passPage': '/modules/MarketManagement/DepositApplication.html'        //标书购买
        },
        '1003': {
            'passPage': '/modules/MarketManagement/DepositApplication.html'    //保证金
        },
        '1004': {
            'passPage': '/modules/MarketManagement/BusinessApplication.html'      //业务费用
        },
        '2001': {            //项目审核
            'passPage': '/modules/engineerManagement/projectManagement.html',      //立项申请
            'status': '1'
        },
        '2002': {
            'passPage': '/modules/engineerManagement/projectManagement.html',      //项目完工申请
            'status': '1'
        },
        '2003': {
            'passPage': '/modules/engineerManagement/projectManagement.html',      //项目变更申请
            'status': '1'
        },
        '3001': {            //工单审核  status:2  2未接 3已接 4施工中5整改 8完成
            'passPage': '/modules/engineerManagement/constructionManagement.html'     //物料变更
        },
        '3002': {
            'passPage': '/modules/engineerManagement/constructionManagement.html'     //设计变更
        },
        '3003': {
            'passPage': '/modules/engineerManagement/constructionManagement.html'     //工单完工申请
        },
        '3004': {
            'passPage': '/modules/engineerManagement/constructionManagement.html'     //工单整改完工申请
        },
        '4001': {            //成本审核
            'passPage': '/modules/CostControl/ExpenseReimbursement.html'      //报销申请
        },
        '5001': {            //采购审核
            'passPage': '/modules/purchasingManagement/procurementPlan.html'      //采购计划
        },
        '6001': {            //财务审核
            'passPage': '/modules/financialManagement/ExternalPermitMsg.html',     //外管证
            'status': '1'
        },
        '6002': {
            'passPage': '/modules/financialManagement/InvoiceMsg.html',    //开票申请
            'status': '1'
        },
        '6003': {
            'passPage': '/modules/financialManagement/Appropriation.html'     //工程款拨付
        },
        '6004': {
            'passPage': '/modules/financialManagement/Appropriation.html'    //工程款拨付申请记录
        },
        '7001': {
            'passPage': '/modules/CreditManagement/InvoicePoolManagement.html'    //工程款拨付申请记录
        }
    }
    var msgToEditObj = {    //前往不通过
        '1001': {       //投标申请  //市场审核
            'editPage': '/modules/MarketManagement/BiddingApplication/editBidding.html',
            'attrName': 'id',
            'id': 'BiddingId'
        },
        '1002': {       //标书购买
            'editPage': "/modules/MarketManagement/BidApplication/editBid.html",
            'attrName': ['id', 'docId'],
            'docId': 'DocId',
            'id': 'BiddingId'
        },
        '1003': {       //保证金
            'editPage': "/modules/MarketManagement/DepositApplication/editDeposit.html",
            'attrName': ['id', 'bondId'],
            'bondId': 'BondId',
            'id': 'BiddingId'
        },
        '1004': {       //业务费用
            'editPage': "/modules/MarketManagement/BusinessApplication/BusinessList/editBusiness.html",
            'attrName': 'id',
            'id': 'BusinessId'
        },
        '2001': {       //立项申请          //项目审核
            'editPage': "/modules/engineerManagement/projectManagement/projectUpdate.html",
            'attrName': 'projectId',
            'projectId': 'projectId'
        },
        '2002': {       //项目完工申请
            'editPage': "/modules/engineerManagement/projectManagement/completeAppliy.html",
            'attrName': 'projectId',
            'projectId': 'projectId'
        },
        '2003': {       //项目变更申请
            'editPage': "/modules/engineerManagement/projectManagement/projectChange.html",
            'attrName': 'projectId',
            'projectId': 'projectId'
        },
        '3001': {       //物料变更
            'editPage': "/modules/engineerManagement/constructionManagement.html"
        },          //工单审核
        '3002': {       //设计变更
            'editPage': "/modules/engineerManagement/constructionManagement.html",
        },
        '3003': {       //工单完工申请
            'editPage': "/modules/engineerManagement/constructionManagement.html",
            'status': '3'
        },
        '3004': {       //工单整改完工申请
            'editPage': "/modules/engineerManagement/constructionManagement.html",
            'status': '3'
        },
        '4001': {       //报销申请
            'editPage': "/modules/CostControl/ExpenseReimbursement/editReimbursement.html",
            'attrName': 'formId',
            'formId': 'MoneyId'
        },          //成本审核
        '5001': {       //采购计划
            'editPage': "/modules/purchasingManagement/procurementPlan/procurementUpdate.html",
            'attrName': 'formId',
            'formId': 'procursePlanId'
        },          //采购审核
        '6001': {       //外管证
            'editPage': "/modules/financialManagement/ExternalPermitMsg/ExternalApplication/editExternalApplication.html",
            'attrName': 'formId',
            'formId': 'ExternalPermitMsgId'
        },          //财务审核
        '6002': {       //开票申请
            'editPage': "/modules/financialManagement/InvoiceMsg/InvoiceApplication/editInvoiceApplication.html",
            'attrName': 'formId',
            'formId': 'InvoiceId'
        },
        '6003': {       //工程款拨付
            'editPage': "/modules/financialManagement/Appropriation/editAppropriation.html",
            'attrName': 'formId',
            'formId': 'contractId'
        },
        '6004': {       //工程款拨付申请记录
            'editPage': "/modules/financialManagement/Appropriation/RecordAppropriation/editRecordAppropriation.html",
            'attrName': 'formId',
            'formId': 'contractRecordId'
        }
    }

    $("body").on("click", "#workMsgTable tbody tr", function () {
        initLogotype(tab_rowData)
        var menuIden = auditItem + '_' + logType

        isCheckInfo({
            menuIden: menuIden,
            parameter: JSON.stringify(parameter),
            id: tab_rowData.id
        })
        getRead(1, tab_rowData.id, this)
    })
    //初始化 需要的 的status 和标识
    function initLogotype(data) {
        if (!data.menuIden) return false
        var str = data.menuIden.split("_")
        auditItem = str[0]
        logType = str.slice(1).join('_')
        parameter = JSON.parse(data.parameter)
    }
    //获取工单下标
    function initTaskIdx(status) {
        var strIdx = "";    //status:2  2未接 3已接 4施工中 5整改 8完成
        switch (status) {
            case 2:
                strIdx = '1'
                break;
            case 3:
                strIdx = '2'
                break;
            case 4:
                strIdx = '3'
                break;
            case 5:
                strIdx = '4'
                break;
            case 8:
                strIdx = '5'
                break;
            default:
                break;
        }
        return storage('nav_idx', strIdx, 'constructionManagement')
    }
    //初始化 前往页面的 页面名称 
    function initCurPage(str) {
        return str.slice(str.lastIndexOf("/") + 1, str.lastIndexOf(".html"))
    }
    //处理多参数数据
    function initMoreAttr(arr) {
        $.each(arr, function (index, eleVal) {
            storage(msgToEditObj[auditItem][eleVal], parameter[eleVal], initCurPage(msgToEditObj[auditItem]['editPage']))
        })
    }
    //校验消息
    function isCheckInfo(data) {
        if (logType == 'pass') {   //已通过
            if (msgPassObj[auditItem]['status']) storage('nav_idx', msgPassObj[auditItem]['status'], initCurPage(msgPassObj[auditItem]['passPage']))
            else if (auditItem > 3000 && auditItem < 4000) initTaskIdx(parameter.status)
            getRead(1, tab_rowData.id) //设置为已读
            goNewPage(msgPassObj[auditItem]['passPage'])
            return false
        }
        $http({
            url: "/gct-web/audit/isCheckInfo",
            data: data,
            success: function (r) {
                if (logType == 'to_audit') {    //去审核
                    storage('nav_idx', msgToAuditObj[auditItem]['status'], 'Auditedlist')
                    goNewPage(msgToAuditObj['listPage'])
                } else if (logType == 'no_pass') { //被驳回
                    if (auditItem == '6004') {
                        if (parameter.isLog == 2) {
                            auditItem = '6003'
                            msgToEditObj[auditItem]['attrName'] = 'id'
                            msgToEditObj[auditItem]['id'] = 'contractId'
                        }
                    }
                    storage('auditItem', auditItem, initCurPage(msgToEditObj[auditItem]['editPage']))
                    if (parameter.auditId) storage('auditId', parameter.auditId, initCurPage(msgToEditObj[auditItem]['editPage']))
                    if (msgToEditObj[auditItem]['status']) {
                        storage('nav_idx', msgToEditObj[auditItem]['status'], initCurPage(msgToEditObj[auditItem]['editPage']))
                    } else if (auditItem == 3001 || auditItem == 3002) initTaskIdx(parameter.status)
                    if (msgToEditObj[auditItem]['attrName']) {
                        if ($.isArray(msgToEditObj[auditItem]['attrName'])) {
                            initMoreAttr(msgToEditObj[auditItem]['attrName'])
                        } else {
                            storage(msgToEditObj[auditItem][msgToEditObj[auditItem]['attrName']], parameter[msgToEditObj[auditItem]['attrName']], initCurPage(msgToEditObj[auditItem]['editPage']))
                        }
                    }
                    goNewPage(msgToEditObj[auditItem]['editPage'])
                } else if (logType == 'iden') {
                    goNewPage(msgToAuditObj['back_iden'])
                }
            }
        })
    }
})