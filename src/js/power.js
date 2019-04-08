var strPath = ""
var ConfigPower = {
    env: "dev",
    baseUrl: "",
    menuConfig: {
        HighestPagePower: [
            {       //审核列表
                chinese: "审核列表",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl audited_sider1",
                power: "",
                children: [
                    {
                        chinese: "待审核列表",
                        directory: "/Auditlist",
                        url: "/Auditedlist.html",
                        cssName: "icon fl",
                        power: "Audit-management_list-to-be-audited",
                        children: [
                            {
                                chinese: "投标申请",
                                directory: "/Auditlist/Auditedlist/MarketAudit",
                                url: "/BiddingApplicationAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "标书购买申请",
                                directory: "/Auditlist/Auditedlist/MarketAudit",
                                url: "/BidApplicationAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "保证金申请",
                                directory: "/Auditlist/Auditedlist/MarketAudit",
                                url: "/DepositApplicationAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "业务费用申请",
                                directory: "/Auditlist/Auditedlist/MarketAudit",
                                url: "/BusinessApplicationAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工单完工申请",
                                directory: "/Auditlist/Auditedlist/taskAudited",
                                url: "/taskCompleteAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "外管证申请",
                                directory: "/Auditlist/Auditedlist/financialAudited",
                                url: "/financialDeatails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "开票申请",
                                directory: "/Auditlist/Auditedlist/financialAudited",
                                url: "/invoiceDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工程款拨付申请",
                                directory: "/Auditlist/Auditedlist/financialAudited",
                                url: "/AppropriationDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工程款拨付记录申请",
                                directory: "/Auditlist/Auditedlist/financialAudited",
                                url: "/contractRecordDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "设计变更申请",
                                directory: "/Auditlist/Auditedlist/taskAudited",
                                url: "/designChangeAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "物料变更申请",
                                directory: "/Auditlist/Auditedlist/taskAudited",
                                url: "/materialChangeAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "整改完成申请",
                                directory: "/Auditlist/Auditedlist/taskAudited",
                                url: "/rectificationCompleteAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "立项申请",
                                directory: "/projectAudited",
                                url: "/noProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "项目变更申请",
                                directory: "/projectAudited",
                                url: "/changeProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "项目完工申请",
                                directory: "/projectAudited",
                                url: "/doneProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "费用报销申请",
                                directory: "/costAudited",
                                url: "/costAuditedDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "采购计划申请",
                                directory: "/payAudited",
                                url: "/payAuditedDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "概预算申请",
                                directory: "/Auditlist/Auditedlist/budgetA/",
                                url: "/budgetAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "审核历史列表",
                        directory: "/Auditlist",
                        url: "/AuditHistorylist.html",
                        cssName: "icon fl",
                        power: "Audit-Management_Audit-History-list",
                        children: [
                            {
                                chinese: "投标申请",
                                directory: "/Auditlist/AuditHistorylist/MarketHistoryAudit",
                                url: "/BiddingApplicationHistoryAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "标书购买申请",
                                directory: "/Auditlist/AuditHistorylist/MarketHistoryAudit",
                                url: "/BidApplicationHistoryAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "保证金申请",
                                directory: "/Auditlist/AuditHistorylist/MarketHistoryAudit",
                                url: "/DepositApplicationHistoryAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "业务费用申请",
                                directory: "/Auditlist/AuditHistorylist/MarketHistoryAudit",
                                url: "/BusinessApplicationHistoryAudited.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "外管证申请",
                                directory: "/Auditlist/AuditHistorylist/financialAudited",
                                url: "/financialHistoryDeatails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "开票申请",
                                directory: "/Auditlist/AuditHistorylist/financialAudited",
                                url: "/invoiceHistoryDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工程款拨付申请",
                                directory: "/Auditlist/AuditHistorylist/financialAudited",
                                url: "/AppropriationHistoryDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工程款拨付记录申请",
                                directory: "/Auditlist/AuditHistorylist/financialAudited",
                                url: "/contractRecordHistoryDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "设计变更申请",
                                directory: "/Auditlist/AuditHistorylist/taskAuditHistory",
                                url: "/designChangeHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "物料变更申请",
                                directory: "/Auditlist/AuditHistorylist/taskAuditHistory",
                                url: "/materialChangeHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "整改完成申请",
                                directory: "/Auditlist/AuditHistorylist/taskAuditHistory",
                                url: "/rectificationCompleteHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工单完工申请",
                                directory: "/Auditlist/AuditHistorylist/taskAuditHistory",
                                url: "/taskCompleteHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "立项申请",
                                directory: "/projectHistoryAudited",
                                url: "/noHisProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "项目完工申请",
                                directory: "/projectHistoryAudited",
                                url: "/doneHisProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "项目变更申请",
                                directory: "/projectAudited",
                                url: "/changeHisProject.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "费用报销申请",
                                directory: "/costHisAudited",
                                url: "/costHisAuditedDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "采购计划申请",
                                directory: "/payHisAudited",
                                url: "/payHisAuditedDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "概预算申请",
                                directory: "/Auditlist/AuditHistorylist/budgetHistoryAudited/",
                                url: "/budgetAuditHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }
                ]
            }, {    //市场管理
                chinese: "市场管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl MarketManagement_sider2",
                power: "",
                children: [
                    {
                        chinese: "投标申请",
                        directory: "/MarketManagement",
                        url: "/BiddingApplication.html",
                        cssName: "icon fl",
                        power: "Market-administration_tender-application",
                        children: [
                            {
                                chinese: "添加投标申请",
                                directory: "/MarketManagement/BiddingApplication",
                                url: "/addBidding.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑投标申请",
                                directory: "/MarketManagement/BiddingApplication",
                                url: "/editBidding.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "投标申请详情",
                                directory: "/MarketManagement/BiddingApplication",
                                url: "/detailsBidding.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "标书购买申请",
                        directory: "/MarketManagement",
                        url: "/BidApplication.html",
                        cssName: "icon fl",
                        power: "Market-Management_bid-purchase-Application",
                        children: [
                            {
                                chinese: "添加标书购买申请",
                                directory: "/MarketManagement/BidApplication",
                                url: "/addBid.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑标书购买申请",
                                directory: "/MarketManagement/BidApplication",
                                url: "/editBid.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "标书购买申请详情",
                                directory: "/MarketManagement/BidApplication",
                                url: "/detailsBid.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "保证金申请",
                        directory: "/MarketManagement",
                        url: "/DepositApplication.html",
                        cssName: "icon fl",
                        power: "Market-Management_margin-Application",
                        children: [
                            {
                                chinese: "添加保证金申请",
                                directory: "/MarketManagement/DepositApplication",
                                url: "/addDeposit.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑保证金申请",
                                directory: "/MarketManagement/DepositApplication",
                                url: "/editDeposit.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "保证金申请详情",
                                directory: "/MarketManagement/DepositApplication",
                                url: "/detailsDeposit.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "业务费用申请",
                        directory: "/MarketManagement",
                        url: "/BusinessApplication.html",
                        cssName: "icon fl",
                        power: "Market-management_business-expenses-application",
                        children: [
                            {
                                chinese: "费用列表",
                                directory: "/BusinessApplication",
                                url: "/BusinessList.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "添加业务费用申请",
                                        directory: "/MarketManagement/BusinessApplication/BusinessList",
                                        url: "/addBusiness.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑业务费用申请",
                                        directory: "/MarketManagement/BusinessApplication/BusinessList",
                                        url: "/editBusiness.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "业务费用申请详情",
                                        directory: "/MarketManagement/BusinessApplication/BusinessList",
                                        url: "/detailsBusiness.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {    //商务管理
                chinese: "商务管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl BusinessManagement_sider3",
                power: "",
                children: [
                    {
                        chinese: "合同管理",
                        directory: "/BusinessManagement",
                        url: "/contractManagement.html",
                        cssName: "icon fl",
                        power: "Business-administration_contract-management",
                        children: [
                            {
                                chinese: "添加框架合同",
                                directory: "/FrameworkContract",
                                url: "/addFramework.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑框架合同",
                                directory: "/FrameworkContract",
                                url: "/editFramework.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "框架合同详情",
                                directory: "/FrameworkContract",
                                url: "/detailsFramework.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "添加施工合同",
                                directory: "/contractManagement",
                                url: "/addConstruction.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑施工合同",
                                directory: "/contractManagement",
                                url: "/editConstruction.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "施工合同详情",
                                directory: "/contractManagement",
                                url: "/detailsConstruction.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "成本统计",
                        directory: "/BusinessManagement",
                        url: "/costStatistics.html",
                        cssName: "icon fl",
                        power: "Business-administration_cost-statistics",
                        children: [
                            {
                                chinese: "费用明细",
                                directory: "/costStatistics",
                                url: "/projectCost.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "费用明细",
                                directory: "/costStatistics",
                                url: "/depmentCost.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "收入统计",
                        directory: "/BusinessManagement",
                        url: "/RevenueStatistics.html",
                        cssName: "icon fl",
                        power: "Business-administration_income-statistics",
                        children: [
                            {
                                chinese: "回款明细",
                                directory: "/RevenueStatistics",
                                url: "/detailsRevenueStatistics.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "进度统计",
                        directory: "/BusinessManagement",
                        url: "/ProgressStatistics.html",
                        cssName: "icon fl",
                        power: "Business-administration_progress-statistics",
                        children: [
                            {
                                chinese: "施工额明细",
                                directory: "/ProgressStatistics",
                                url: "/detailsAmount.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "开票明细",
                                directory: "/ProgressStatistics",
                                url: "/details_Invoice.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工程款拨付明细",
                                directory: "/ProgressStatistics",
                                url: "/detailsProjectFunds.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "合同进度及订单明细",
                                directory: "/ProgressStatistics",
                                url: "/detailsProgressOrders.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }

                        ]
                    }, {
                        chinese: "项目经营分析",
                        directory: "/BusinessManagement",
                        url: "/projectManagementAnalysis.html",
                        cssName: "icon fl",
                        power: "Business-administration_Project-management-analysis-statistics",
                        children: []
                    }
                ]
            }, {    //工程管理
                chinese: "工程管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl engineerManagement_sider4",
                power: "",
                children: [
                    {
                        chinese: "项目管理",
                        directory: "/engineerManagement",
                        url: "/projectManagement.html",
                        cssName: "icon fl",
                        power: "Project-management_project-management",
                        children: [
                            {
                                chinese: "添加项目",
                                directory: "/projectManagement",
                                url: "/projectAdd.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑项目",
                                directory: "/projectManagement",
                                url: "/projectUpdate.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "变更项目",
                                directory: "/projectManagement",
                                url: "/projectChange.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "项目详情",
                                directory: "/projectManagement",
                                url: "/projectDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "操作记录详情",
                                        directory: "/projectManagement",
                                        url: "/applyRecordDetails.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }, {
                                chinese: "完工申请",
                                directory: "/projectManagement",
                                url: "/completeAppliy.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "施工管理",
                        directory: "/engineerManagement",
                        url: "/constructionManagement.html",
                        cssName: "icon fl",
                        power: "Engineering-management_construction-management",
                        children: [
                            {
                                chinese: "添加工单",
                                directory: "/constructionManagement/NotAssigned",
                                url: "/addNotAssigned.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            },{
                                chinese: "添加完工工单",
                                directory: "/constructionManagement/NotAssigned",
                                url: "/addCompletionTask.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑工单",
                                directory: "/constructionManagement/NotAssigned",
                                url: "/editNotAssigned.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "工单详情",
                                directory: "/constructionManagement/NotAssigned",
                                url: "/detailsNotAssigned.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "申请记录详情（设计）",
                                        directory: "/constructionManagement/NotAssigned/detailsNotAssigned/detailsApplicationRecord",
                                        url: "/designRecord.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "申请记录详情（完工）",
                                        directory: "/constructionManagement/NotAssigned/detailsNotAssigned/detailsApplicationRecord",
                                        url: "/finishRecord.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "申请记录详情（物料变更）",
                                        directory: "/constructionManagement/NotAssigned/detailsNotAssigned/detailsApplicationRecord",
                                        url: "/changeRecord.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "申请记录详情（整改完成）",
                                        directory: "/constructionManagement/NotAssigned/detailsNotAssigned/detailsApplicationRecord",
                                        url: "/rectificationRecord.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "申请记录详情（转派）",
                                        directory: "/constructionManagement/NotAssigned/detailsNotAssigned/detailsApplicationRecord",
                                        url: "/Transfer.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }, {
                                chinese: "催单记录",
                                directory: "/constructionManagement/UnansweredTable",
                                url: "/Reminder.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "设备位置",
                                directory: "/constructionManagement/UnansweredTable",
                                url: "/DeviceLocation.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "查看图片位置",
                                directory: "/constructionManagement/UnansweredTable",
                                url: "/seePicPosition.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "质量管理",
                        directory: "/engineerManagement",
                        url: "/QualityAssurance.html",
                        cssName: "icon fl",
                        power: "Engineering-management_quality-management",
                        children: [
                            {
                                chinese: "添加质量管理",
                                directory: "/DataManagement",
                                url: "/addQualityAssurance.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "质量管理详情",
                                directory: "/DataManagement",
                                url: "/detailsQualityAssurance.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "安全管理",
                        directory: "/engineerManagement",
                        url: "/SecurityMnagement.html",
                        cssName: "icon fl",
                        power: "Engineering-management_safety-management",
                        children: [
                            {
                                chinese: "添加安全检查",
                                directory: "/DataManagement",
                                url: "/addSecurityMnagement.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "安全检查详情",
                                directory: "/DataManagement",
                                url: "/detailsSecurityMnagement.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }
                ]
            }, {    //资料管理
                chinese: "资料管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl DataManagement_sider5",
                power: "",
                children: [
                    {
                        chinese: "竣工资料",
                        directory: "/DataManagement",
                        url: "/CompletionData.html",
                        cssName: "icon fl",
                        power: "Data-management_completion-data",
                        children: [
                            {
                                chinese: "决算值管理",
                                directory: "/CompletionData/DataPackage",
                                url: "/Estimation.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "添加决算值",
                                        directory: "/DataPackage/Estimation",
                                        url: "/addEstimation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑决算值",
                                        directory: "/DataPackage/Estimation",
                                        url: "/editEstimation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "决算值详情",
                                        directory: "/DataPackage/Estimation",
                                        url: "/detailsEstimation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }, {
                                chinese: "打包资料",
                                directory: "/CompletionData/DataPackage",
                                url: "/PackingMsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "竣工技术文件详情",
                                directory: "/CompletionData/DataTechnical",
                                url: "/detailsDataTechnical.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "订单管理",
                        directory: "/DataManagement",
                        url: "/OrderManagement.html",
                        cssName: "icon fl",
                        power: "Data-management_order-management",
                        children: [
                            {
                                chinese: "添加订单",
                                directory: "/OrderManagement",
                                url: "/addOrder.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑订单",
                                directory: "/OrderManagement",
                                url: "/editOrder.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "订单详情",
                                directory: "/OrderManagement",
                                url: "/detailsOrder.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "竣工技术文件详情",
                                        directory: "/detailsOrder/",
                                        url: "/details_DataTechnical.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    },
                                    {
                                        chinese: "添加验收证书",
                                        directory: "/detailsOrder/",
                                        url: "/addAcceptance.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    },
                                    {
                                        chinese: "添加采购订单",
                                        directory: "/detailsOrder/PurchaseOrder/",
                                        url: "/addPurchaseOrder.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑采购订单",
                                        directory: "/detailsOrder/PurchaseOrder/",
                                        url: "/editPurchaseOrder.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "添加审定值",
                                        directory: "/detailsOrder/AuditInformation/",
                                        url: "/addAuditInformation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    },
                                    {
                                        chinese: "编辑审定值",
                                        directory: "/detailsOrder/AuditInformation/",
                                        url: "/editAuditInformation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    },
                                    {
                                        chinese: "审定值详情",
                                        directory: "/detailsOrder/AuditInformation/",
                                        url: "/detailsAuditInformation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "添加发票",
                                        directory: "/detailsOrder/Invoice/",
                                        url: "/addInvoice.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑发票",
                                        directory: "/detailsOrder/Invoice/",
                                        url: "/editInvoice.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "发票详情",
                                        directory: "/detailsOrder/Invoice/",
                                        url: "/detailsInvoice.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    },
                                    {
                                        chinese: "添加付款申请",
                                        directory: "/detailsOrder/PaymentApplication/",
                                        url: "/addPaymentApplication.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑付款申请",
                                        directory: "/detailsOrder/PaymentApplication/",
                                        url: "/editPaymentApplication.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "付款申请详情",
                                        directory: "/detailsOrder/PaymentApplication/",
                                        url: "/detailsPaymentApplication.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {    //信贷管理
                chinese: "信贷管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl CreditManagement_sider6",
                power: "",
                children: [
                    {
                        chinese: "资金管理",
                        directory: "/CreditManagement/FinancialApplication",
                        url: "/FinancialApplication.html",
                        cssName: "icon fl",
                        power: "Banking-management_Banking-applications",
                        children: [
                            {
                                chinese: "添加融资申请",
                                directory: "FinancialApplication/Financing",
                                url: "/addFinancing.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "融资申请详情",
                                directory: "FinancialApplication/Financing",
                                url: "/detailsFinancing.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "添加理财申请",
                                directory: "FinancialApplication/Transactions",
                                url: "/addTransactions.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "理财申请详情",
                                directory: "FinancialApplication/Transactions",
                                url: "/detailsTransactions.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "添加提款申请",
                                directory: "FinancialApplication/Drawing",
                                url: "/addDrawing.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "提款申请详情",
                                directory: "FinancialApplication/Drawing",
                                url: "/detailsDrawing.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "提款申请详情",
                                directory: "FinancialApplication/Drawing",
                                url: "/details_Drawing.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    },
                    {
                        chinese: "发票池管理",
                        directory: "/CreditManagement",
                        url: "/InvoicePoolManagement.html",
                        cssName: "icon fl",
                        power: "Financial-management_Invoice-pool-management",
                        children: [
                            {
                                chinese: "添加发票池",
                                directory: "/InvoicePoolManagement",
                                url: "/InvoicePoolAdd.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑发票池",
                                directory: "/InvoicePoolManagement",
                                url: "/InvoicePoolUpdate.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "发票池详情",
                                directory: "/InvoicePoolManagement",
                                url: "/InvoicePoolList.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "发票池信息",
                                        directory: "",
                                        url: "/InvoicePoolDetails.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "添加发票",
                                        directory: "",
                                        url: "/invoiceAdd.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "添加发票",
                                        directory: "",
                                        url: "/invoiceAdd.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "订单详情",
                                        directory: "",
                                        url: "/poolOrderDetails.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: [
                                            {
                                                chinese: "工单信息",
                                                directory: "",
                                                url: "/poolTaskDetails.html",
                                                cssName: "icon fl",
                                                power: "",
                                                children: [
                                                    {
                                                        chinese: "决算值详情",
                                                        directory: "",
                                                        url: "/poolFinalAccountDetails.html",
                                                        cssName: "icon fl",
                                                        power: "",
                                                        children: []
                                                    }
                                                ]
                                            }, {
                                                chinese: "审定值详情",
                                                directory: "",
                                                url: "/poolAuthorValueDetails.html",
                                                cssName: "icon fl",
                                                power: "",
                                                children: []
                                            }, {
                                                chinese: "发票详情",
                                                directory: "",
                                                url: "/poolInvoiceDetails.html",
                                                cssName: "icon fl",
                                                power: "",
                                                children: []
                                            }, {
                                                chinese: "付款申请详情",
                                                directory: "",
                                                url: "/poolPayRequestDetails.html",
                                                cssName: "icon fl",
                                                power: "",
                                                children: []
                                            }, {
                                                chinese: "验收证书详情",
                                                directory: "",
                                                url: "/seeAcceptCertificate.html",
                                                cssName: "icon fl",
                                                power: "",
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {    //财务管理
                chinese: "财务管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl financialManagement_sider7",
                power: "",
                children: [
                    {
                        chinese: "回款管理",
                        directory: "/financialManagement",
                        url: "/ReimbursementMsg.html",
                        cssName: "icon fl",
                        power: "Financial-Management_Received-payments-management",
                        children: [
                            {
                                chinese: "添加回款管理",
                                directory: "/ReimbursementMsg",
                                url: "/addReimbursementMsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "回款管理详情",
                                directory: "/ReimbursementMsg",
                                url: "/detailsReimbursementMsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "外管证管理",
                        directory: "/financialManagement",
                        url: "/ExternalPermitMsg.html",
                        cssName: "icon fl",
                        power: "Financial-management_External-permit-management",
                        children: [
                            {
                                chinese: "添加外管证申请",
                                directory: "/ExternalPermitMsg/ExternalApplication",
                                url: "/addExternalApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑外管证申请",
                                directory: "/ExternalPermitMsg/ExternalApplication",
                                url: "/editExternalApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "外管证申请详情",
                                directory: "/ExternalPermitMsg/ExternalApplication",
                                url: "/detailsExternalApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "外管证详情",
                                directory: "/ExternalList/detailsExternalList",
                                url: "/detailsExternalList.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "开票管理",
                        directory: "/financialManagement",
                        url: "/InvoiceMsg.html",
                        cssName: "icon fl",
                        power: "Financial-management_Invoice-application-management",
                        children: [
                            {
                                chinese: "添加开票管理",
                                directory: "/InvoiceMsg/InvoiceApplication",
                                url: "/addInvoiceApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑开票管理",
                                directory: "/ExternalPermitMsg/ExternalApplication",
                                url: "/editInvoiceApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "开票管理详情",
                                directory: "/ExternalPermitMsg/ExternalApplication",
                                url: "/detailsInvoiceApplication.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "开票列表详情",
                                directory: "/InvoiceList/detailsInvoiceList",
                                url: "/detailsInvoiceList.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "工程款拨付",
                        directory: "/financialManagement",
                        url: "/Appropriation.html",
                        cssName: "icon fl",
                        power: "Financial-Management_Project-payment",
                        children: [
                            {
                                chinese: "添加工程款拨付",
                                directory: "/Appropriation",
                                url: "/addAppropriation.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑工程款拨付",
                                directory: "/Appropriation",
                                url: "/editAppropriation.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "拨付记录",
                                directory: "/Appropriation",
                                url: "/RecordAppropriation.html",
                                cssName: "icon fl",
                                power: "",
                                children: [
                                    {
                                        chinese: "添加拨付记录",
                                        directory: "/RecordAppropriation",
                                        url: "/addRecordAppropriation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "编辑拨付记录",
                                        directory: "/RecordAppropriation",
                                        url: "/editRecordAppropriation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }, {
                                        chinese: "拨付记录详情",
                                        directory: "/RecordAppropriation",
                                        url: "/detailsRecordAppropriation.html",
                                        cssName: "icon fl",
                                        power: "",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, {    //采购管理
                chinese: "采购管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl purchasingManagement__sider8",
                power: "",
                children: [
                    {
                        chinese: "采购计划",
                        directory: "/purchasingManagement",
                        url: "/procurementPlan.html",
                        cssName: "icon fl",
                        power: "Purchase-management_Purchase-plan",
                        children: [
                            {
                                chinese: " 添加采购计划",
                                directory: "/procurementPlan",
                                url: "/procurementAdd.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑采购计划",
                                directory: "/procurementPlan",
                                url: "/procurementUpdate.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "采购计划详情",
                                directory: "/procurementPlan",
                                url: "/procurementDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "采购计划入库",
                                directory: "/procurementPlan",
                                url: "/purchasePut.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "供应商管理",
                        directory: "/purchasingManagement",
                        url: "/supplierManagement.html",
                        cssName: "icon fl",
                        power: "Procurement-management_supplier-management",
                        children: [
                            {
                                chinese: " 采购历史",
                                directory: "/purchaseHistory",
                                url: "/purchaseHistory.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "库存管理",
                        directory: "/purchasingManagement",
                        url: "/inventoryManagement.html",
                        cssName: "icon fl",
                        power: "Procurement-management_inventory-management",
                        children: [
                            {
                                chinese: " 添加一级库房",
                                directory: "/inventoryManagement",
                                url: "/warehouseFirstAdd.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 物料详情",
                                directory: "/inventoryManagement",
                                url: "/materialDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 物料使用详情",
                                directory: "/inventoryManagement",
                                url: "/materialUseDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 入库",
                                directory: "/inventoryManagement",
                                url: "/storagePut.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 调拨",
                                directory: "/inventoryManagement",
                                url: "/transfers.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 领料单详情",
                                directory: "/inventoryManagement",
                                url: "/detailsMateriaLRequisition.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 发送领料单",
                                directory: "/inventoryManagement",
                                url: "/sendMaterialRequisition.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 退料单详情",
                                directory: "/inventoryManagement",
                                url: "/returnOrderDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: " 库房操作记录详情",
                                directory: "/inventoryManagement",
                                url: "/warehouseRecordDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "  现场余量详情",
                                directory: "/inventoryManagement",
                                url: "/siteMarginDetails.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }
                ]
            }, {    //成本管理
                chinese: "成本管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl CostControl_sider9",
                power: "",
                children: [
                    {
                        chinese: "费用报销",
                        directory: "/CostControl",
                        url: "/ExpenseReimbursement.html",
                        cssName: "icon fl",
                        power: "Cost-management_expense-reimbursement",
                        children: [
                            {
                                chinese: "添加报销",
                                directory: "/CostControl/ExpenseReimbursement",
                                url: "/addReimbursement.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑报销",
                                directory: "/CostControl/ExpenseReimbursement",
                                url: "/editReimbursement.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "报销详情",
                                directory: "/CostControl/ExpenseReimbursement",
                                url: "/detailsReimbursement.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }
                ]
            }, {
                chinese: "概预算管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl Buget_sider12",
                power: "",
                children: [
                    {
                        chinese: "概预算列表",
                        directory: "/budget",
                        url: "/budgetList.html",
                        cssName: "icon fl",
                        power: "Budget-estimate-management_Budget-estimates",
                        children: [
                            {
                                chinese: "添加概预算项目",
                                directory: "/budget/budgetList",
                                url: "/addBudget.html",
                                cssName: "icon fl",
                                power: "noPower",
                                children: []

                            }, {
                                chinese: "编辑概预算项目",
                                directory: "/budget/budgetList",
                                url: "/editBudget.html",
                                cssName: "icon fl",
                                power: "noPower",
                                children: []
                            }, {
                                chinese: "概预算项目详情",
                                directory: "/budget/budgetList",
                                url: "/quotaDetails.html",
                                cssName: "icon fl",
                                power: "noAttrPower",
                                children: []

                            }, {
                                chinese: "编辑定额",
                                directory: "/budget/budgetList",
                                url: "/editQuota.html",
                                cssName: "icon fl",
                                power: "noAttrPower",
                                children: [
                                    {
                                        chinese: "添加定额项目",
                                        directory: "/editQuota",
                                        url: "/quotaItemAdd.html",
                                        cssName: "icon fl",
                                        power: "noAttrPower",
                                        children: []

                                    },
                                    {
                                        chinese: "添加材料",
                                        directory: "/editQuota",
                                        url: "/materialAdd.html",
                                        cssName: "icon fl",
                                        power: "noAttrPower",
                                        children: []

                                    },
                                    {
                                        chinese: "添加设备",
                                        directory: "/editQuota",
                                        url: "/equipmentAdd.html",
                                        cssName: "icon fl",
                                        power: "noAttrPower",
                                        children: []

                                    },
                                    {
                                        chinese: "编辑设备",
                                        directory: "/editQuota",
                                        url: "/equipmentUpdate.html",
                                        cssName: "icon fl",
                                        power: "noAttrPower",
                                        children: []

                                    }
                                ]

                            }
                        ]
                    }
                ]
            }, {    //公司管理
                chinese: "公司管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl CompanyManagement_sider10",
                power: "",
                children: [
                    {
                        chinese: "角色管理",
                        directory: "/CompanyManagement",
                        url: "/RoleManagement.html",
                        cssName: "icon fl",
                        power: "Corporate-management_role-management",
                        children: [
                            {
                                chinese: "添加角色",
                                directory: "/CompanyManagement/RoleManagement",
                                url: "/addRole.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑角色",
                                directory: "/CompanyManagement/RoleManagement",
                                url: "/editRole.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "角色详情",
                                directory: "/CompanyManagement/RoleManagement",
                                url: "/detailsRole.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "人员管理",
                        directory: "/CompanyManagement",
                        url: "/PersonnelManagement.html",
                        cssName: "icon fl",
                        power: "Company-management_personnel-management",
                        children: [
                            {
                                chinese: "添加人员",
                                directory: "/CompanyManagement/PersonnelManagement",
                                url: "/addPersonnel.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑人员",
                                directory: "/CompanyManagement/PersonnelManagement",
                                url: "/editPersonnel.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "人员详情",
                                directory: "/CompanyManagement/PersonnelManagement",
                                url: "/detailsPersonnel.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "下级单位管理",
                        directory: "/CompanyManagement",
                        url: "/LowunitManagement.html",
                        cssName: "icon fl",
                        power: "Company-management_subordinate-unit-management",
                        children: [
                            {
                                chinese: "添加下级单位",
                                directory: "/CompanyManagement/LowunitManagement",
                                url: "/addLowmsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑下级单位",
                                directory: "/CompanyManagement/LowunitManagement",
                                url: "/editLowmsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "下级单位详情",
                                directory: "/CompanyManagement/LowunitManagement",
                                url: "/detailsLowmsg.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "流程管理",
                        directory: "/CompanyManagement",
                        url: "/processAdmin.html",
                        cssName: "icon fl",
                        power: "Corporate-management_process-management",
                        children: [
                            {
                                chinese: "添加流程",
                                directory: "/CompanyManagement/processAdmin",
                                url: "/addprocess.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "编辑流程",
                                directory: "/CompanyManagement/processAdmin",
                                url: "/editprocess.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }, {
                                chinese: "流程详情",
                                directory: "/CompanyManagement/processAdmin",
                                url: "/processDetail.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }
                        ]
                    }, {
                        chinese: "类型管理",
                        directory: "/CompanyManagement",
                        url: "/TypeManagement.html",
                        cssName: "icon fl",
                        power: "Corporate-management_type-management",
                        children: []
                    }
                ]
            }, {    //账号管理
                chinese: "账号管理",
                directory: "/modules",
                url: "javascript:void(0);",
                cssName: "icon fl accountManagement_sider11",
                power: "",
                children: [
                    {
                        chinese: "单位信息",
                        directory: "/accountManagement",
                        url: "/UnitInformation.html",
                        cssName: "icon fl",
                        power: "",
                        children: []
                    }, {
                        chinese: "个人信息",
                        directory: "/accountManagement",
                        url: "/PersonalInformation.html",
                        cssName: "icon fl",
                        power: "",
                        children: []
                    }, {
                        chinese: "消息通知",
                        directory: "/accountManagement",
                        url: "/MessageNotification.html",
                        cssName: "icon fl",
                        power: "",
                        children: [
                            {
                                chinese: "通知详情",
                                directory: "accountManagement/MessageNotification",
                                url: "/detailsNotice.html",
                                cssName: "icon fl",
                                power: "",
                                children: []
                            }]
                    }, {
                        chinese: "修改密码",
                        directory: "/accountManagement",
                        url: "/ChangePassword.html",
                        cssName: "icon fl",
                        power: "",
                        children: []
                    }
                ]
            }
        ]
    }
}
var curUserPower = storage("curUserPower") || {},  //当前用户所有的权限
    curPowerObj = {}, //当前权限 所属对象    //当前页面的权限
    isSuperManagement = storage("superManagement", "", 'login') == 2 ? true : false
/*
 * 生成一级菜单、二级菜单、三级菜单，配置高亮，思路为：
 * 1、从session中取出roleId，根据roleID获取菜单数据结构
 * 2、获取地址栏的URL的最后一项
 * 3、根据URL的最后一项、菜单数据结构，获取应当高亮的一二三级菜单
 * 4、生成一级菜单
 * 5、生成一级二级三级菜单
 * 6、填充面包屑
 * 7. 后台传输权限的数据结构
 * powerObj {
 *   a: { 二级权限 判断左侧菜单二级菜单是否存在
 *       children: [    list 页面具体功能权限
 *           {
 *               menuIden:""
 *           }
 *       ],
 *       menuIden:""
 *   }
 *   ...
 * }
 * */















var config = ConfigPower.menuConfig['HighestPagePower'] //根据roleID获取菜单数据结构
var url = getUrlLastElement() //2、获取地址栏的URL的最后一项如待立项/particulars.html
var urlHash = {};
if (url === '/') url = '/modules/CompanyManagement/RoleManagement.html';
var navContentLastObj = {};  //末级菜单对象
(function ($) {
    if ($windowCurPathName && $windowCurPathName != 'login') {
        //3、根据URL的最后一项、菜单数据结构，获取应当高亮的一二三级菜单
        var highLight = findHighLightItems(config);
        //4、生成菜单
        getFirstMenu(config, highLight);
        //6、填充面包屑
        setBreadCrumbs(highLight);
    }
})(jQuery);
//生成一级菜单

function getFirstMenu(arr, highLight) {
    var _liStr = '<ul class="navContentUl">';
    var _className = "";
    var _classNameDown = "";
    $('#navContent').append('<div class="navContentBefore"></div>')
    $.each(arr, function (k, v) {
        if (v) {
            //判断是否高亮
            if (highLight[0]) {
                _className = (v.chinese === highLight[0].chinese) ? "firstActive" : "";
                _classNameDown = (v.chinese === highLight[0].chinese) ? "openAsider" : "";
            }
            //拼接字符串 secondList 为二级菜单 所有二级页面都存在权限判断
            var secondList = creatSecondMenu(v.children, v.directory, highLight)
            // 如果当前 secondList 有值说明当前一级下的二级菜单存在权限 反之 则不需要append 一级菜单
            if (secondList) {
                navContentLastObj[k] = secondList || ""
                // log(navContentLastObj, k, secondList)
                _liStr +=
                    '<li class="' + _className + ' clearfix sider_fist_Line" index="' + k + '">' +
                    '   <h4 class="firstPageBtn ' + _classNameDown + '">' +
                    '   <div class="' + v.cssName + '"></div>' +
                    '   <a href="javascript:void(0);">' + v.chinese + '</a>' +
                    '   <div class="arrowhead"></div>' +
                    '   </h4>' +
                    // secondList +
                    '</li>';
            }

        }
    });
    _liStr += "</ul>"
    $('#navContent').append(_liStr);
}
function creatSecondMenu(arr, directory, highLight) {
    var _ul = '<ul class="list-nav ">', _href2 = "", _arrowDown = ''
    if (arr) {
        var _li = ""
        $.each(arr, function (index, el) {
            var chinese = el && el.chinese || "", _className2 = "";
            if (highLight[1]) {
                if (chinese === highLight[1].chinese) {
                    curPowerObj = curUserPower[el.power] || {}
                    _className2 = "secordActive"
                }
            }
            if (!el) el = {}
            _href2 = ConfigPower.baseUrl + directory + getHref(arr[index], 0);
            if (curUserPower[el.power] || el.directory.has('accountManagement') || window.noAttrPower) {
                //  || el.directory.has('budget')
                var str =
                    '<li class="' + _className2 + '">' +
                    // '   <div class="realDot"></div>' +
                    '   <a href="' + _href2 + '">' + chinese + '</a>' + _arrowDown +
                    '</li>';
                if (chinese == '个人信息' && isSuperManagement) str = ""
                _li += str
            }
        });
        if (_li) return _ul + _li + '</ul>'
        return false
    }
}
//一级菜单点击事件
// $("body").on('click', '.firstPageBtn', function (event) {
//     event.preventDefault();
//     var curUl = $(this).siblings('ul')
//     $(".openUrl").not(this).slideUp(500).removeClass('openUrl')
//     $(".firstPageBtn").removeClass("openAsider") //用来处理箭头
//     $(this).parents("li").siblings().find('ul').slideUp(500)
//     if (!curUl.children().length) return false
//     if (curUl.css("display") == 'none') {
//         $(this).addClass("openAsider")
//         curUl.slideDown(500).addClass('openUrl')
//     } else {
//         $(this).removeClass("openAsider")
//         curUl.slideUp(500).removeClass('openUrl');
//     }
// });
//二级菜单点击事件
$("body").on('click', '.list-nav li', function (event) {
    event.preventDefault();
    if ($(this).hasClass("secordActive") && $(this).find('a').attr('href') == location.pathname) return false
    clearSession()
    clearIdx()
    goNewPage($(this).find('a').attr('href'))
});
//填充面包屑
function setBreadCrumbs(arr) {
    if (arr[0] && arr[0].chinese !== "第一页") {
        var str = ""
        if (arr.length > 2) {
            strPath = ""
            $.each(arr, function (index, eleVal) {
                if (index < arr.length - 1) {
                    strPath += eleVal.directory
                    if (index == arr.length - 2) {
                        strPath += eleVal.url
                    }
                }
            })
            str = "<ol class='breadcrumb clearfix '><li class='breadCrumdBtn' data_href='" + strPath + "'><span>返回</span></li>| <li>当前位置：</li>"
        } else {
            str = '<ol class="breadcrumb clearfix "><li>当前位置：</li>'
        }
        $.each(arr, function (index, el) {
            if (arr[index] !== undefined) {
                if (el.directory == '/modules') {
                    str += '<li><a href="javascript:void(0);">  ' + el.chinese + '</a></li>'
                } else {
                    str += '<li><span style="min-width: 16px;font-size: 12px;color: #6f7b91;padding: 0 2px;" class="glyphicon glyphicon-menu-right" aria-hidden="true"></span><a res_url="' + el.url + '" res_path="' + el.directory + '" href="javascript:void(0);">' + el.chinese + '</a></li>'
                }
            }
            if (index == arr.length - 1) {
                document.title = el.chinese;
            }
        });
        str += '</ol>'
        $("#curHtmlPath").append(str)
    }
}
//面包屑点击事件
// $("body").on('click', '#curHtmlPath li', function (event) {
//     if ($(this).index() <= 1 || $(this).index() == $(this).parent().children().length - 1) return false
//     var srcPath = $(this).find('a').attr('res_path')
//     var pathLen = srcPath.length
//     var pathUrl = $(this).find('a').attr('res_url')
//     var url = location.pathname.slice(0, location.pathname.indexOf(srcPath) + pathLen) + pathUrl
//     storage('nav_idx', -1)
//     storage('nav_twos_idx', -1)
//     goNewPage(url)

// });
//面包屑 返回清除当前页的session后返回历史上页

$("body").on("click", ".breadCrumdBtn", function () {
    storage('nav_idx', -1)
    storage('nav_twos_idx', -1)
    goNewPage($(this).attr("data_href"), '', true)
})
function breadCrumbsBack(data) {
    // console.info(data)

    // goBack()
}
//解析数据结构，生成哈希表，其中：key = 每个页面对应的url地址，value = 每个页面的是菜单的第几项
function makeHash(config, hashKey) {
    $.each(config, function (key, val) {
        if (val) {
            if ((val.url !== undefined) && (val.url !== "")) {
                $.each(val.url.split(","), function () {
                    if (hashKey !== undefined) {
                        urlHash[this] = hashKey;
                    } else {
                        urlHash[this] = key;
                    }
                });
            }
            var second = val.children ? val.children : [];
            if (second.length) {
                if (hashKey !== undefined) {
                    makeHash(second, hashKey);
                } else {
                    makeHash(second, key);
                }
            }
        }
    });
}
//解析地址栏中的地址，获取地址栏的URL的最后一项
function getUrlLastElement(url) { //解析地址栏中的地址
    url = url || location.pathname;
    var _index = url.lastIndexOf('\/');
    if (_index !== -1) {
        url = url.slice(_index, url.length);
    }
    return url;
}
//生成高亮数组
function findHighLightItems(arr) {
    var result1 = [];
    while (arr.length) {
        urlHash = {};
        makeHash(arr);
        result1.push(arr[urlHash[url]]);
        if (arr[urlHash[url]] && arr[urlHash[url]].url.indexOf(url) > -1) break;
        arr = arr[urlHash[url]] ? arr[urlHash[url]].children : [];
    }
    return result1;
}
//递归获取菜单的href
function getHref(arr, deep) {
    if (arr) {
        arr.children = arr.children ? arr.children : []
        if (arr.children.length && deep > 0) {
            return arr.directory + getHref(arr.children[0], deep--);
        } else {
            return arr.directory + arr.url;
        }
    }
}


var navTimer;
$("#navContent .navContentBefore").hover(function () {
    if ($("#navContent").css('width') != '180px') {
        navTimer = setTimeout(function () {
            $(".navContentUl").stop().animate({ width: '180px' });
            $("#navContent").stop().animate({ width: '180px' });
            $(".navContentLast").remove()
        },400)
    }

}, function () {
    clearTimeout(navTimer)
})

$("#navContent").hover(function () { }, function () {
    $(this).stop().animate({ width: '50px' });
})
$("#navContent .navContentUl li").hover(function () {
    var idx = $(this).attr('index')
    navTimer = setTimeout(function () {
        $("#navContent").stop().animate({ width: '300px' });
        if (!$(".navContentLast").length) $("#navContent").append("<div class='navContentLast'></div>")
        $(".navContentLast").html(navContentLastObj[idx])
    },300)
}, function () {
    clearTimeout(navTimer)
})