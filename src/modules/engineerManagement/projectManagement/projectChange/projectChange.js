var projectId = storage("projectId")
// 获取
var auditItem = 2003;
var projectTypeAttrId;
var projectTypeBefore;
var  project_LineTableUpdate=[
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function (a, rows) {
            return '<span class="checkBox"></span>'
        }
    }
]
var deleteProjectRequirt=[];//删除的项目需求
var deleteContractFile=[];//删除的项目合同
var deleteReportFileS=[];//删除的开工报告
var applyObj = {}
var applyFalg = true;
$(function () {


    postFiles("postFileBtn1", true, {
        fileType: {
            title: 'fileType',
            extensions: 'xls,xlsx',
            mimeTypes: '.xls,.xlsx'
        },
        url: '/gct-web/project/getProjectRangeCreate',
        init: getProjectRange
    })
    //项目需求列表的数据回显
    function getProjectRange(arr) {
        orFileData["postFileBtn1Echo"]=arr;
        initTable('projectRequirementsXianTable', arr, project_LineTableUpdate)
    }
    //点击下载模板
    $("body").on("click",'.downlown_template',function () {
        if(projectTypeAttrId==1) download("线路类需求列表模板.xlsx",'线路类需求列表模板.xlsx', this)
        else if(projectTypeAttrId==2) download("设备类需求列表模板.xlsx",'设备类需求列表模板.xlsx', this)

    })

    //点击删除项目需求

    $("body").on("click",'.deleteProjectRequire',function () {
        var delteArr=[];//放着序号
        $("#projectRequirementsXianTable").find(".checkBoxTrue").each(function (k,v) {
            delteArr.push($(v).parents("tr").attr("data-index"))
        })

        // deleteProjectRequirt=deleteProjectRequirt.concat(deleArr)

        if(delteArr.length){

            deleteProjectRequirt=deleteProjectRequirt.concat( orFileData["postFileBtn1Echo"].filter(function (v,k) {
                return (delteArr.indexOf(k+'')!=-1&&v.id)
            }))
            orFileData["postFileBtn1Echo"] = orFileData["postFileBtn1Echo"].filter(function (v,k) {
                return delteArr.indexOf(k+'')==-1
            })

            initTable('projectRequirementsXianTable', orFileData["postFileBtn1Echo"], project_LineTableUpdate)
        }
    })

    //点击框架合同下拉，请求接口，接口成功
    $("body #kj_contract").on("click", 'li', function () {
        if (!$(this).attr("index")) return
        contractAjax($(this).attr("index"))
    })

    //    获取数据
    //    点击提交
    $("body").on("click", '.postBtn', function () {
        var thisHtm = $(this).html()=='提交审核'?2:1;

        getDataFrom(thisHtm)
        if(!applyFalg) return
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                getProjectChange()
            }
        })
    })


    //初始数据===回显数据
    function initData() {
        $http({
            url: '/gct-web/project/beforeUpdate',
            data: {
                projectId: projectId,
                status:1//1是变更回显，2是编辑回显
            },
            success: function (r) {

                auditNoPassRemark(projectId, auditItem)
                // 未过审的的编辑，数据只能有提交审核，没有保存按钮。

                projectShow(r)
            }
        })
    }
    //基本的数据回显
    function projectShow(r) {
        //框架合同的
        //先判断是否有框架合同，有渲染，没有请选择
        if(!r.data.project) return;
        if(!r.data.fcList) return false;
        if (r.data.project.contractId) {
            if(!r.data.project.frameContract) return false;
            $(".contractName").html(r.data.project.frameContract.contractNo)
            $(".contractTime").html(initDate(r.data.project.frameContract.startDate) + ' 至 ' + initDate(r.data.project.frameContract.endDate))
            $(".contractMoney").html(r.data.project.frameContract.discount + '%')
            $(".kj_contract_show").show()
            getDownSelect('kj_contract', '', r.data.fcList, 'id', 'contractName')
            //通过框架合同的id回显框架
            $.each(r.data.fcList, function (k, v) {
                if (v.id == r.data.project.contractId) {
                    $(".kj_contract").html(v.contractName)
                    $(".kj_contract").attr("index", v.id)
                    return
                }
            })
        }else{
            getDownSelect('kj_contract', '请选择', r.data.fcList, 'id', 'contractName')
        }
        //   施工单位的回显
        $(".constructionCompany").html((r.data.project.createCompanyName?r.data.project.createCompanyName:'') + (r.data.project.createrInfo.trueName?'——' + r.data.project.createrInfo.trueName:'') + (r.data.project.createrInfo.userName?'——' + r.data.project.createrInfo.userName:''))
        //建设单位
        $(".projectOperator").html((r.data.project.operatorCompanyName?r.data.project.operatorCompanyName:'') + (r.data.project.operatorPerson?'——' + r.data.project.operatorPerson:'') + (r.data.project.operatorTel?'——' + r.data.project.operatorTel:''))
        //监理单位和设计单位
        if (r.data.project.isParticipate == 0) {
            //companyType:1            //公司类型 1设计 2监理
            var designUnit = []
            var constructUnit = []
            $.each(r.data.projectCompanyList, function (k, v) {
                if (v.companyType == 1) designUnit.push(v)
                else if (v.companyType == 2) constructUnit.push(v)
            })
            var constructStr = ''
            $.each(constructUnit, function (k, v) {
                constructStr+='<div class=" details_Text ">'+(v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : ''))+'</div>'
            })
            var designStr = ''
            $.each(designUnit, function (k, v) {
                designStr+='<div class=" details_Text ">'+(v.companyName + (v.person ? ('——' + v.person) : '') + (v.tel ? ('——' + v.tel) : ''))+'</div>'
            })
            $(".constructStr").html(constructStr)
            $(".designUnit").html(designStr)
        } else {
            $(".isParticipate").html('不参与')
            $(".constructStr").parent().hide()
            $(".designUnit").parent().hide()
        }
        $(".projectRegion").html(getCodeTxt(r.data.project.province, r.data.project.city, r.data.project.county) + (r.data.project.projectRegion ? r.data.project.projectRegion : ''))
       if(r.data.project.projectTypeInfo) $(".project_Type").html(r.data.project.projectTypeInfo.typeName)
        $(".projectName").val(r.data.project.projectName)
        $(".projectCode").val(r.data.project.projectCode)
        $(".projectAmount").val(r.data.project.projectAmount)
        $(".sateAmount").val(r.data.project.sateAmount)
        $(".serveAmount").val(r.data.project.serveAmount)
        $(".guiAmount").val(r.data.project.guiAmount)
        $(".tax").val(r.data.project.tax)
        $("#startTime").val(initDate(r.data.project.planStartDate))
        $("#endTime").val(initDate(r.data.project.planEndDate))
        $(".projectCycle").val(r.data.project.projectCycle)
        if (r.data.project.constructType) {
            $(".constructionType").find(".radioClick").eq(r.data.project.constructType - 1).addClass("radioActive")
        }

        $("#projectDescription").val(r.data.project.remarks)


        //    项目需求列表
        //     如果项目类型已经存在，可以上传。如果没有，不能上传，提示
        if (r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute) {
            projectTypeAttrId = r.data.project.projectTypeInfo.attribute;//项目需求属性类型(1,2)
            orFileData['postFileBtn1Echo'] = r.data.projectRangeList
            projectRequire(projectTypeAttrId, r.data.projectRangeList)
        }
        //    项目合同
        orFileData['postFileBtn2Echo'] = []
        orFileData['postFileBtn3Echo'] = []
        $.each(r.data.projectFileList, function (k, v) {
            if (v.fileType == 1) {
                orFileData['postFileBtn2Echo'].push(v);
            }
            else if (v.fileType == 2) {
                orFileData['postFileBtn3Echo'].push(v)
            }
        })
        // postFileBtn2Echo中放的是原文件，postFileBtn2存的是新文件
        // 原文件删除一个postFileBtn2Echo中减少一个，即postFileBtn2Echo中是保留的文件
        //
        fileUploader({
            btn: 'postFileBtn2',
            data: orFileData['postFileBtn2Echo'],//放原来的文件，删除原来的文件，这里也删除orFileData['postFileBtn2']放新文件，删除，也删除
            tabId: 'projectContractTable',
            col: fileCol,
            other: {
                fileType: {
                    title: 'fileType',
                    extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                    mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                }
            }
        })
        fileUploader({
            btn: 'postFileBtn3',
            data: orFileData['postFileBtn3Echo'],
            tabId: 'workstartReports',
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

    //项目需求的回显
    function projectRequire(projectType, arr) {
        orFileData['postFileBtn1Echo'] = arr;
        if (projectType == 1) {
            project_LineTableUpdate=project_LineTableUpdate.concat(project_LineTable)
        }
        else if (projectType == 2) {
            project_LineTableUpdate=project_LineTableUpdate.concat(project_equipmentTable)

        }
        initTable('projectRequirementsXianTable', arr, project_LineTableUpdate)
        var formData1 = {
            'flag': projectType
        }
        orFileObj['postFileBtn1Uploader'].options.formData = formData1
        orFileData['postFileBtn1'] = arr;
    }


    //点击下拉请求框架合同的内容
    function contractAjax(data) {
        $http({
            url: '/gct-web/project/getOperator',
            data: {
                frameContractId: data
            },
            success: function (r) {
                //     1.合同编号等切换2，建设单位下拉只留2个。3.（注意：参与项目不变）
                if (r.data && r.data.frameContract) {
                    $(".contractName").html(r.data.project.frameContract.contractNo)
                    $(".contractTime").html(initDate(r.data.project.frameContract.startDate) + ' 至 ' + initDate(r.data.project.frameContract.endDate))
                    $(".contractMoney").html(r.data.project.frameContract.discount + '%')
                    $(".kj_contract_show").show()
                }

            }
        })
    }

//  点击删除
    $("body #projectContractTable").on("click",'.cancelFileBtn',function () {
        if(tab_rowData.id){
            tab_rowData.operation=2
            deleteContractFile.push(tab_rowData)
        }
    })
    $("body #workstartReports").on("click",'.cancelFileBtn',function () {
        if(tab_rowData.id){
            tab_rowData.operation=2
            deleteReportFileS.push(tab_rowData)
        }
    })

    initData()

})

function getDataFrom(flag) {

    applyFalg = true;
    applyObj.pType = flag;         //1.提交  2.提交审核
    applyObj.fileUrlDel = delFileObjUrlList.join(",");//路径
    applyObj.id = projectId;//项目id
    applyObj.cRemark = $("#cRemark").val();//变更说明
    applyObj.contractId = $(".kj_contract").attr("index");//框架合同id
    applyObj.projectName = $(".projectName").val();//项目名称
    applyObj.projectCode = $(".projectCode").val();//项目编号
    applyObj.projectAmount = $(".projectAmount").val();//合同金额
    applyObj.sateAmount = $(".sateAmount").val();//安全生产费
    applyObj.serveAmount = $(".serveAmount").val();//施工服务费
    applyObj.guiAmount = $(".guiAmount").val();//规费
    applyObj.tax = $(".tax").val();//税金
    applyObj.startDateStr = $("#startTime").val();
    applyObj.endDateStr = $("#endTime").val();//计划完工时间
    applyObj.projectCycle = $(".projectCycle").val();//项目周期
    applyObj.constructType = $(".constructionType").find(".radioActive").attr("index");//施工类型
    applyObj.remarks = $("#projectDescription").val()//项目说明

    //保存时只校验项目名称，其余时都校验
    if (!$.checkReg(applyObj.cRemark, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写项目变更说明");
        return false
    }
    if (!$.checkReg(applyObj.projectName, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写项目名称，项目名称不能为空");
        return false
    }
    if (!$.checkReg(applyObj.projectCode, 'noNull')) {
        applyFalg = false;
        $.popInfo("请填写项目编号，项目编号不能为空");
        return false
    }


        if (!$.checkReg(applyObj.contractId, 'noNull')) {
            applyFalg = false;
            $.popInfo("请选择框架合同，框架合同不能为空");
            return false
        }
        if (!Number(applyObj.projectAmount)) {
            applyFalg = false;
            $.popInfo("请填写项目金额，项目金额不能为空");
            return false
        }
        if (!Number(applyObj.sateAmount)) {
            applyFalg = false;
            $.popInfo("请填写安全生产费，安全生产费不能为空");
            return false
        }
        if (!Number(applyObj.serveAmount)) {
            applyFalg = false;
            $.popInfo("请填写施工服务费，施工服务费不能为空");
            return false
        }
        if (!Number(applyObj.guiAmount)) {
            applyFalg = false;
            $.popInfo("请填写规费，规费不能为空");
            return false
        }
        if (!Number(applyObj.tax)) {
            applyFalg = false;
            $.popInfo("请填写税金，税金不能为空");
            return false
        }
        if ($.checkReg(applyObj.projectCycle, 'noNull') && !$.checkReg(applyObj.projectCycle, 'age')) {
            applyFalg = false;
            $.popInfo("请填写项目周期，允许输入10位整数");
            return false
        }
        if (applyObj.constructType == '') {
            applyFalg = false;
            $.popInfo("请选择施工类型，施工类型不能为空");
            return false
        }
        if (orFileData['postFileBtn1'].length == 0) {
            applyFalg = false;
            $.popInfo("请上传项目需求列表");
            return false
        }
        if (checkFileList('postFileBtn2')) {
            applyFalg = false;
            $.popInfo("请上传项目合同");
            return false
        }
        if (checkFileList('postFileBtn3')) {
            applyFalg = false;
            $.popInfo("请上传开工报告");
            return false
        }

        //这里的是新增的orFileData['postFileBtn2']
        var pRangeJsonArr=[]
        if(deleteProjectRequirt.length){
            $(deleteProjectRequirt).each(function (k,v) {
               v.operation=2

            })
        }
        if(orFileData['postFileBtn1Echo'].length){
            $(orFileData['postFileBtn1Echo']).each(function (k,v) {
                if(!v.id){
                    v.operation=1
                    pRangeJsonArr.push(v)
                }
            })

        }else{
            applyFalg = false;
            $.popInfo("请上传项目需求列表");
            return false
        }
    pRangeJsonArr=pRangeJsonArr.concat(deleteProjectRequirt)
        var contractFileJsonArr=[]
        orFileData['postFileBtn2'].map(function (v) {
            v.operation=1
        })
    contractFileJsonArr=orFileData['postFileBtn2'].concat(deleteContractFile)
    var startFileJsonArr=[]
    orFileData['postFileBtn3'].map(function (v) {
        v.operation=1
    })
    startFileJsonArr=orFileData['postFileBtn3'].concat(deleteReportFileS)
        if(pRangeJsonArr.length)applyObj.pRangeJson = JSON.stringify(pRangeJsonArr)///项目需求列表
        if(contractFileJsonArr.length)applyObj.contractFileJson = JSON.stringify(contractFileJsonArr)//项目合同
        if(startFileJsonArr.length)applyObj.startFileJson = JSON.stringify(startFileJsonArr)//开工报告
}
//提交
function getProjectChange() {
    $http({
        url: '/gct-web/project/getProjectChange',
        data: applyObj,
        success: function (r) {
            submitSuccess('',function () {
                goBack()
            })
        }
    })
}