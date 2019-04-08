
var auditId = storage('auditId')
var projectId = storage('projectId')
$(function () {
    // tab页面切换函数
    projectInfo()
})
//项目详情
function projectInfo() {
    $http({
        url: '/gct-web/project/info',
        data: { projectId: projectId },
        success: function (r) {
            if (!r.data.project) return false;
            if (r.data.project.projectStatus == 3) auditNoPassRemark(projectId, 2001)
            if (r.data.projectCompanyList) dataShowProject(r.data.project, r.data.projectCompanyList)
            if (r.data.projectRangeList && r.data.projectRangeList.length > 0) {
                if (r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 1) initTable("projectTableRequire", r.data.projectRangeList, project_LineTable)
                else if (r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute == 2) initTable("projectTableRequire", r.data.projectRangeList, project_equipmentTable)
            }
            else {
                $("#projectTableRequire").parents(".fileTable_White").hide()
            }
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

        }
    })
}
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
