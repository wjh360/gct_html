var projectId = storage("projectId")
$(function () {
    // tab页面切换函数
    switchTab()
    function switchTab() {
        nav_idx = parseFloat(nav_idx)
        if (nav_idx == 0) { marketData() }
        else if (nav_idx == 1) { projectInfo() }
        else if (nav_idx == 2) {
            nav_twos_idx = parseFloat(nav_twos_idx)
            if (nav_twos_idx == 0) { taskStatistice() }
            else if (nav_twos_idx == 1) { matertailsStatistice() }
            else if (nav_twos_idx == 2) { projectWorkload() }
        }
        else if (nav_idx == 3) { operationRecord() }
    }
    //tab切换点击事件
    $("body").on("click", '.first_nav li', function () {
        nav_idx = $(this).attr("data_index")
        nav_twos_idx?nav_twos_idx:0
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
        if (nav_idx == 2 && nav_twos_idx != 0) $(".twos_nav").find("li").eq(nav_twos_idx).addClass('active').siblings().removeClass('active')
    })
    //二级tab切换点击事件
    $("body").on("click", '.twos_nav li', function () {
        nav_twos_idx = $(this).attr("data_index")
        storage("nav_twos_idx", nav_twos_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //    点击操作事项进入详情
    $("body").on("click", '#operatorTable tbody tr', function () {
        //操作记录Id
        if (!tab_rowData.id) return false;
        storage("operationRecordId", tab_rowData.id, 'applyRecordDetails')
        storage("applyName", tab_rowData.applyName, 'applyRecordDetails')
        storage("applyTime", tab_rowData.applyTime, 'applyRecordDetails')
        goNewPage("./applyRecordDetails.html")
    })
    //    点击导出
    $("body").on("click", '.export_Table', function () {
        if (!projectId) return false;
        var exportData = {
            projectId: projectId
        }
        exportTable('/gct-web/project/exportTaskStatisticsList', exportData, this)
    })
    //市场资料的
    function marketData() {
        $http({
            url: '/gct-web/project/marketData',
            data: {
                projectId: projectId
            },
            success: function (r) {
                //如果返回的数据对象为空的话，市场这一列直接不显示
                if (!r.data || $.isEmptyObject(r.data)) {
                    //   如果市场没东西
                    $("#markMaterial").hide()
                } else {
                    $("#markMaterial").show()
                    dataShowMark(r.data);//市场的基本信息的回显
                    //市场 文件回显
                    if(!r.data.fileList)return;
                    var fileCode2001 = []
                    var fileCode2002 = []
                    var fileCode2003 = []
                    $.each(r.data.fileList, function (k, v) {
                        if (v.fileCode == 2001) {
                            fileCode2001.push(v)
                        } else if (v.fileCode == 2002) {
                            fileCode2002.push(v)
                        } else if (v.fileCode == 2003) {
                            fileCode2003.push(v)
                        }
                    })
                    if (fileCode2001.length == 0) $(".markerTableTender").hide()
                    else { initTable("markerTableTender", fileCode2001, fileColDetail) }
                    if (fileCode2002.length == 0) $(".markerTableBuy").hide()
                    else { initTable("markerTableBuy", fileCode2002, fileColDetail) }
                    if (fileCode2003.length == 0) $(".markerTableMargin").hide()
                    else { initTable("markerTableMargin", fileCode2003, fileColDetail) }
                }
            }
        })
    }
})
//市场资料的数据回显
function dataShowMark(r) {
    if (r.bidName) $(".bidName").html(r.bidName);//投标名称
    else $(".bidName").parent().hide();
    if (r.bidUnit) $(".bidUnit").html(r.bidUnit);//发标单位
    else $(".bidUnit").parent().hide();
    if (r.person) $(".bidPerson").html(r.person);//联系人
    else $(".bidPerson").parent().hide();
    if (r.tel) $(".bidTel").html(r.tel);//联系方式
    else $(".bidTel").parent().hide();
    //项目地区==有可能多个
    if (r.bidApplyRegionVOList) {
        var projectAddress = ''
        $.each(r.bidApplyRegionVOList, function (k, v) {
            if (k != r.bidApplyRegionVOList.length - 1) {
                projectAddress += v.bidApplyRegion + '<br>'
            } else {
                projectAddress += v.bidApplyRegion
            }
        })
        $(".bidProjectAddress").html(projectAddress);
    }
    else $(".bidProjectAddress").parent().hide();
    if (r.projectTypeInfo && r.projectTypeInfo.typeName) $(".bidTypeName").html(r.projectTypeInfo.typeName);//项目类型
    else $(".bidTypeName").parent().hide();
    if (r.inviteAmount) $(".inviteAmount").html(r.inviteAmount + ' 元');//招标金额
    else $(".inviteAmount").parent().hide();
    if (r.bidAmount) $(".bidAmount").html(r.bidAmount + ' 元');//预计中标金额
    else $(".bidAmount").parent().hide();
    if (r.bidOrice) $(".bidOrice").html(r.bidOrice);//预计投标价格
    else $(".bidOrice").parent().hide();
    if (r.bidDate) $(".bidDate").html(initDate(r.bidDate));//预计投标日期
    else $(".bidDate").parent().hide();
    if (r.inviteDescr) $(".inviteDescr").html(r.inviteDescr);//招标简介
    else $(".inviteDescr").parent().hide();
    if (r.remark) $(".bidRemark").html(r.remark);//备注
    else $(".bidRemark").parent().hide();
    if (r.projectPerson) $(".bidProjectPerson").html(r.trueName);//项目发起人
    else $(".bidProjectPerson").parent().hide();
    //表述购买申请
    if (r.bidDocApply) {
        if (r.bidDocApply.purchaseAmount) $(".purchaseAmount").html(r.bidDocApply.purchaseAmount + '元');//标书购买费用
        else $(".purchaseAmount").parent().hide();
        if (r.bidDocApply.remark) $(".bidDocApplyRemark").html(r.bidDocApply.remark);//备注
        else $(".bidDocApplyRemark").parent().hide();
    } else {
        $(".bidDocApplyBox").parent().hide();
    }
    //    保证金
    if (r.bondApply) {
        if (r.bondApply.bondUnit) $(".bondUnit").html(r.bondApply.bondUnit);//保证金收款单位
        else $(".bondUnit").parent().hide();
        if (r.bondApply.openBank) $(".openBank").html(r.bondApply.openBank);//收款单位开户行
        else $(".openBank").parent().hide();
        if (r.bondApply.bankAccount) $(".bankAccount").html(r.bondApply.bankAccount);//银行账户
        else $(".bankAccount").parent().hide();
        if (r.bondApply.perforAmount) $(".perforAmount").html(r.bondApply.perforAmount);//保证金金额
        else $(".perforAmount").parent().hide();
        if (r.bondApply.bondDate) $(".bondDate").html(initDate(r.bondApply.bondDate));//保证金缴纳日期
        else $(".bondDate").parent().hide();
        if (r.bondApply.remark) $(".bidApplyRemark").html(r.bondApply.remark);//备注
        else $(".bidApplyRemark").parent().hide();
    } else {
        $(".bondApplyBox").parent().hide();
    }
}
//项目详情
function projectInfo() {
    $http({
        url: '/gct-web/project/info',
        data: { projectId: projectId },
        success: function (r) {
            if (!r.data || !r.data.project) return false
            //项目的基本信息的回显
            if (r.data.project && r.data.projectCompanyList) {
                dataShowProject(r.data.project, r.data.projectCompanyList)
            }
            //项目需求分析数据

            if (r.data.projectRangeList && r.data.projectRangeList.length>0){
                if (r.data.project&&r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 1) initTable("projectTableRequire", r.data.projectRangeList, project_LineTable)
                else if (r.data.project&&r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 2) initTable("projectTableRequire", r.data.projectRangeList, project_equipmentTable)

            }
            else {
                $("#projectTableRequire").parents(".fileTable_White").hide()
             }

            //文件回显
            if (r.data.projectFileList && r.data.projectFileList.length > 0) {
                var constructArr = []
                var designArr = []
                //1合同 2开工报告
                $.each(r.data.projectFileList, function (k, v) {
                    if (v.fileType == 1) { constructArr.push(v); }
                    else if (v.fileType == 2) { designArr.push(v) }
                })
                if (constructArr.length == 0) $("#projectTableContruct").parents(".fileTable_White").hide()
                else initTable("projectTableContruct", constructArr, fileColDetail)
                if (designArr.length == 0) $("#projectTableRecord").parents(".fileTable_White").hide()
                else initTable("projectTableRecord", designArr, fileColDetail)
            } else {
                $("#projectTableContruct").parents(".fileTable_White").hide()
                $("#projectTableRecord").parents(".fileTable_White").hide()

            }
            //       完工申请
            if (r.data.project.projectStatus == 5 || r.data.project.projectStatus == 6 || r.data.project.projectStatus == 7) {
                if (r.data.apply) {
                    if(r.data.apply.applyName)$(".applyName").html(r.data.apply.applyName)
                    if(r.data.apply.applyTime)$(".applyTime").html(initDate(r.data.apply.applyTime,'s'))
                    if (r.data.project.finishApply) $(".finishApply").html(r.data.project.finishApply)
                    else $(".finishApply").parent().hide()
                } else {
                    if(r.data.project.applyUser)$(".applyName").html(r.data.project.applyUser)
                    if(r.data.project.applyTime)$(".applyTime").html(initDate(r.data.project.applyTime,'s'))
                    if (r.data.project.finishApply) $(".finishApply").html(r.data.project.finishApply)
                    else $(".finishApply").parent().hide()
                }
            }
            else {
                $(".outApply").parent().hide()
            }
        }
    })
}
//项目详情的数据回显
function dataShowProject(r, projectCompanyList) {
    if (r.frameContract && r.frameContract.contractName) {
        $(".contractName").html(r.frameContract.contractName)
        $(".contractNo").html(r.frameContract.contractNo)
        $(".frameContractTime").html(initDate(r.frameContract.startDate) + '至' + initDate(r.frameContract.endDate))
        $(".contractDiscount").html(r.frameContract.discount + '%')
    }
    else {
        $(".contractName").parent().hide()
        $(".contractNo").parent().hide()
        $(".frameContractTime").parent().hide()
        $(".contractDiscount").parent().hide()
    }
    $(".projectName").html(r.projectName)
    if (r.projectCode) $(".projectCode").html(r.projectCode)
    else $(".projectCode").parent().hide()
    if (r.projectAmount) $(".projectAmount").html(r.projectAmount + '元')
    else $(".projectAmount").parent().hide()
    if (!r.sateAmount && !r.serveAmount) {
        $(".sateAmount").parent().hide()
    } else {
        if (r.sateAmount) $(".sateAmount").html(r.sateAmount + '元')
        else $(".sateAmount").hide().prev().hide()
        if (r.serveAmount) $(".serveAmount").html(r.serveAmount + '元')
        else $(".serveAmount").hide().prev().hide()
    }
    if (!r.guiAmount && !r.tax) {
        $(".guiAmount").parent().hide()
    } else {
        if (r.guiAmount) $(".guiAmount").html(r.guiAmount + '元')
        else $(".guiAmount").hide().prev().hide()
        if (r.tax) $(".tax").html(r.tax + '元')
        else $(".tax").hide().prev().hide()
    }
    if (r.planStartDate) $(".planStartDate").html(initDate(r.planStartDate))
    else $(".planStartDate").parent().hide()
    if (r.planEndDate) $(".planEndDate").html(initDate(r.planEndDate))
    else $(".planEndDate").parent().hide()
    if (r.projectType) $(".projectType").html(r.projectTypeInfo.typeName)
    else $(".projectType").parent().hide()
    if (r.projectCycle) $(".projectCycle").html(r.projectCycle + '天')
    else $(".projectCycle").parent().hide()
    var constructType = ['包工包料', '包工不包料', '清包工']
    if (r.constructType) $(".constructType").html(constructType[r.constructType - 1])
    else $(".constructType").parent().hide()
    if (r.province) {
        $(".projectAddress").html(getCodeTxt(r.province, r.city, r.county) + (r.projectRegion ? r.projectRegion : ''))
    }
    else $(".projectAddress").parent().hide()
    //    建设单位
    if (r.operatorCompanyName) {
        $(".operatorCompanyName").html(r.operatorCompanyName + (r.operatorPerson ? ('——' + r.operatorPerson) : '') + (r.operatorTel ? ('——' + r.operatorTel) : ''))
    } else $(".operatorCompanyName").parent().hide()
    //    监理单位
    if (r.isParticipate == 0) {
        //companyType:1            //公司类型 1设计 2监理
        var designUnit = []
        var constructUnit = []
        $.each(projectCompanyList, function (k, v) {
            if (v.companyType == 1) designUnit.push(v)
            else if (v.companyType == 2) constructUnit.push(v)
        })
        var constructStr = ''
        $.each(constructUnit, function (k, v) {
            if (k != constructUnit.length - 1) {
                constructStr += (v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : '')) + '<br>'
            } else {
                constructStr += (v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : ''))
            }
        })
        var designStr = ''
        $.each(designUnit, function (k, v) {
            if (k != designUnit.length - 1) {
                designStr += (v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : '')) + '<br>'
            } else {
                designStr += (v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : ''))
            }
        })
        $(".constructStr").html(constructStr)
        $(".designUnit").html(designStr)
    } else {
        $(".isParticipate").html('不参与')
        $(".constructStr").parent().hide()
        $(".designUnit").parent().hide()
    }
    //    设计单位
    //     施工单位
    $(".createCompanyName").html(r.createCompanyName + '——' + r.createrInfo.trueName + '——' + r.createrInfo.userName)
    if (r.remarks) $(".remarks").html(r.remarks)
    else $(".remarks").parent().hide()
}
//施工资料
function taskStatistice() {
    var taskProject = {
        projectId: projectId
    }
    $http({
        url: '/gct-web/project/taskStatisticsPage',
        data: taskProject,
        success: function (r) {
            initTable('MaterialTableTask', r.data, taskStatisticeCol)
            //   统计数据的回显
            if (r.dataOthers) {
                $(".totalTask").html(r.total);
                $(".saveTask").html(r.dataOthers.save ? r.dataOthers.save : 0);
                $(".sendTask").html(r.dataOthers.send ? r.dataOthers.send : 0);
                $(".meetTask").html(r.dataOthers.meet ? r.dataOthers.meet : 0);
                $(".constructionInTask").html(r.dataOthers.constructionIn ? r.dataOthers.constructionIn : 0);
                $(".changeAuditInTask").html(r.dataOthers.changeAuditIn ? r.dataOthers.changeAuditIn : 0);
                $(".changeInTask").html(r.dataOthers.changeIn ? r.dataOthers.changeIn : 0);
                $(".finishTask").html(r.dataOthers.finish ? r.dataOthers.finish : 0);
                $(".finishAuditTask").html(r.dataOthers.finishAudit ? r.dataOthers.finishAudit : 0);
                $(".roundFinishTask").html(r.dataOthers.finishDirect ? r.dataOthers.finishDirect : 0);
            }
        }
    })
}
var taskStatus = [
    '保存', '未接', '已接', '施工中', '整改中', '整改审核中', '整改未过审', '完工', '完工审核中','直接完工'
]
var taskStatisticeCol = [
    {
        field: 'taskCode',
        title: '工单编号',
        width: '100'
    },
    {
        field: 'taskName',
        title: '工单名称',
        width: '100'
    },
    {
        field: 'typeName',
        title: '工单类型',
        width: '100'
    },
    {
        field: 'planHours',
        title: '工单周期(天)',
        width: '50',
        formatter:function (a) {
            if(!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:50px;">' + a + '</span>'

        }
    },
    {
        field: 'actualHours',
        title: '执行周期(天)',
        width: '50',
        formatter:function (a) {
            if(!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:50px;">' + a + '</span>'

        }
    },
    {
        field: 'constructionUserName',
        title: '施工对长',
        width: '100'
    },
    {
        field: 'companyName',
        title: '创建单位',
        width: '100'
    },
    {
        field: 'createrName',
        title: '创建人',
        width: '100'
    },
    {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a, 's')
        }
    },
    {
        field: 'taskStatus',
        title: '工单状态',
        width: '150',
        formatter: function (a) {
            if (!a) return ''
            return taskStatus[a - 1]
        }
    }
]
//项目物料
function matertailsStatistice() {
    var taskProject = {
        projectId: projectId
    }
    $http({
        url: '/gct-web/project/projectMatterPage',
        data: taskProject,
        success: function (r) {
            initTable('MaterialTableMater', r.data, matertailsStatisticeCol)
            //   统计数据的回显
            if (r.data.length > 0) $(".totalMaterail").html(r.data[0].matterNumCount)
        }
    })
}
var matertailsStatisticeCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        width: '100'
    }, {
        field: 'matterName',
        title: '物料名称',
        width: '100'
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '100'
    }, {
        field: 'matterUnit',
        title: '单位',
        width: '50'
    }, {
        field: 'matterPrice',
        title: '单价(元)',
        width: '100',
        formatter:function (a) {
            if(!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '100'
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '100'
    }, {
        field: 'matterSupplier',
        title: '物料供应商',
        width: '100'
    }, {
        field: 'matterNum',
        title: '设计量',
        width: '100',
        formatter:function (a) {
            if(!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'useNum',
        title: '使用量',
        width: '100',
        formatter:function (a) {
            if(!a) return '0'
            return '<span class=" overf_Ec " style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }
]
//项目工作量
function projectWorkload() {
    var taskProject = {
        projectId: projectId
    }
    $http({
        url: '/gct-web/project/projectWorkloadPage',
        data: taskProject,
        success: function (r) {
            initTable('MaterialTableWork', r.data, projectWorkloadCol)
            //   统计数据的回显
            if (r.data.length > 0) $(".totalMaterail").html(r.data[0].matterNumCount)
        }
    })
}
var projectWorkloadCol = [
    {
        field: 'hideName',
        title: '名称',
        width: '600'
    }, {
        field: 'hideUnit',
        title: '单位',
        width: '200'
    }, {
        field: 'hideNum',
        title: '工作量',
        width: '200'
    }
]
//操作记录
//项目工作量
function operationRecord() {
    $http({
        url: '/gct-web/audit/pageProjectRecord',
        data: {
            id: projectId
        },
        success: function (r) {
            initTable('operatorTable', r.data, workOperatorCol)
        }
    })
}
var workOperatorCol = [
    {
        field: 'itemName',
        title: '操作事项',
        width: '400'
    }, {
        field: 'applyName',
        title: '操作人',
        width: '200'
    }, {
        field: 'applyTime',
        title: '操作时间',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '事项分类',
        width: '100',
        formatter: function (a, row) {
            // 3待审核  4驳回 5通过
            return '<span class="m_col">' + projectStatus[a - 3] + '</span>'
        }
    }
]
var projectStatus = ['审核中', '未通过', '完成']