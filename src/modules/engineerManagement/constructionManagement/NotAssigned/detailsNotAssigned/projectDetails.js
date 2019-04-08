//项目详情

function projectInfo() {
    projectId = storage("projectId")  //工单id
    $http({
        url: '/gct-web/project/info',
        data: { projectId: projectId },
        success: function (r) {
            if (!r.data || !r.data.project) return false
            dataShowProject(r.data.project, r.data.projectCompanyList)
            if (!r.data.projectRangeList || r.data.projectRangeList.length == 0) $("#projectTableRequire").parents(".fileTable_White").hide()
            else {
                if (r.data.project && r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 1) {

                    initTable("projectTableRequire", r.data.projectRangeList, project_LineTable)
                }
                else if (r.data.project && r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 2) {

                    initTable("projectTableRequire", r.data.projectRangeList, project_equipmentTable)
                }
            }
            if (!r.data.projectFileList || r.data.projectFileList.length == 0) {
                $("#projectTableContruct").parents(".fileTable_White").hide()
                $("#projectTableRecord").parents(".fileTable_White").hide()
            } else {
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
            }
            //
            //       完工申请
            if (r.data.project.projectStatus == 5 || r.data.project.projectStatus == 6 || r.data.project.projectStatus == 7) {
                if (r.data.apply) {
                    $(".proApplyName").html(r.data.apply.applyName)
                    $(".proApplyTime").html(initDate(r.data.apply.applyTime))
                    if (r.data.project.finishApply) $(".proFinishApply").html(r.data.project.finishApply)
                    else $(".proFinishApply").parent().hide()
                } else {
                    $(".proApplyName").html(r.data.project.applyUser)
                    $(".proApplyTime").html(initDate(r.data.project.applyTime))
                    if (r.data.project.finishApply) $(".proFinishApply").html(r.data.project.finishApply)
                    else $(".proFinishApply").parent().hide()
                }
            }
            else { $(".outApply").hide() }
        }
    })
}
function dataShowProject(r, projectCompanyList) {

    if (r.frameContract && r.frameContract.contractName) {
        $(".proContractName").html(r.frameContract.contractName)
        $(".proContractNo").html(r.frameContract.contractNo)
        $(".proContractTime").html(initDate(r.frameContract.startDate) + '至' + initDate(r.frameContract.endDate))
        $(".proDiscount").html(r.frameContract.discount + '%')
    } else {
        $(".proContractName").parent().hide()
        $(".proContractNo").parent().hide()
        $(".proContractTime").parent().hide()
        $(".proDiscount").parent().hide()
    }
    $(".proProjectName").html(r.projectName)
    if (r.projectCode) $(".proProjectCode").html(r.projectCode)
    else $(".proProjectCode").parent().hide()
    if (r.projectAmount) $(".proProjectAmount").html(r.projectAmount + '元')
    else $(".proProjectAmount").parent().hide()
    if (!r.sateAmount && !r.serveAmount) {
        $(".proSateAmount").parent().hide()
    } else {
        if (r.sateAmount)$(".proSateAmount").html(r.sateAmount + '元')
        else $(".proSateAmount").hide().prev().hide()
        if (r.serveAmount) $(".proServeAmount").html(r.serveAmount + '元')
        else $(".proServeAmount").hide().prev().hide()
    }
    if (!r.guiAmount && !r.tax) {
        $(".proGuiAmount").parent().hide()
    } else {
        if (r.guiAmount) $(".proGuiAmount").html(r.guiAmount + '元')
        else $(".proGuiAmount").hide().prev().hide()
        if (r.tax) $(".proTax").html(r.tax + '元')
        else $(".proTax").hide().prev().hide()
    }
    if (r.planStartDate) $(".proPlanStartDate").html(initDate(r.planStartDate))
    else $(".proPlanStartDate").parent().hide()
    if (r.planEndDate) $(".proPlanEndDate").html(initDate(r.planEndDate))
    else $(".proPlanEndDate").parent().hide()
    if (r.projectType) $(".proProjectType").html(r.projectTypeInfo.typeName)
    else $(".proProjectType").parent().hide()
    if (r.projectCycle) $(".proProjectCycle").html(r.projectCycle)
    else $(".proProjectCycle").parent().hide()
    var constructType = ['包工包料', '包工不包料', '清包工']
    if (r.constructType) $(".proConstructType").html(constructType[r.constructType - 1])
    else $(".proConstructType").parent().hide()
    if (r.province) {
        $(".proProjectAddress").html(getCodeTxt(r.province, r.city, r.county) + (r.projectRegion ? r.projectRegion : ''))
    } else $(".proProjectAddress").parent().hide()
    //    建设单位
    if (r.operatorCompanyName) {
        $(".proOperatorCompanyName").html(r.operatorCompanyName + (r.operatorPerson ? ('——' + r.operatorPerson) : '') + (r.operatorTel ? ('——' + r.operatorTel) : ''))
    }
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
        $(".proConstructStr").html(constructStr)
        $(".proDesignStr").html(designStr)
    } else {
        $(".isParticipate").html('不参与')
        $(".proConstructStr").parent().hide()
        $(".proDesignStr").parent().hide()
    }
    //    设计单位
    //     施工单位
    $(".proCreateCompanyName").html(r.createCompanyName + '——' + r.createrInfo.trueName + '——' + r.createrInfo.userName)
    if (r.remarks) $(".proRemark").html(r.remarks)
    else $(".proRemark").parent().hide()
}