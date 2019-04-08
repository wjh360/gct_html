var projectId = storage("projectId")
// 获取
var auditItem = 2001;
$(".boxTd_right_box").css({
    "width": ($(".project_First").eq(1).width() - 150) + 'px'
})
var newDownSelectIdx = 1;  //新建的单位下拉
var projectTypeAttrId;
var projectTypeBefore;
$(function () {
    initData()
    //点击项目类型的下拉
    $("body #projectStatus").on("click", 'li', function () {
        var liIndex = $(this).attr("index")
        if (!liIndex) {
            $(".uploaderShade").show()
            return
        }
        $(".uploaderShade").hide()
        $.each(projectTypeBefore, function (k, v) {
            if (v.id == liIndex) {
                projectTypeAttrId = v.attribute
                //需求
                //1.线路，2，基站
                projectRequire(projectTypeAttrId, [])
                return;
            }
        })
    })
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
        arr = orFileData['postFileBtn1']
        if (projectTypeAttrId == 1) {
            $(".tempXian").show().siblings(".tempJiZhan").hide();
            $("#projectRequirementsZhanTable").parent().hide();
            $("#projectRequirementsXianTable").parent().show();
            initTable('projectRequirementsXianTable', arr, project_LineTable)
        }
        else if (projectTypeAttrId == 2) {
            $(".tempJiZhan").show().siblings(".tempXian").hide();
            $("#projectRequirementsXianTable").parent().hide();
            $("#projectRequirementsZhanTable").parent().show();
            initTable('projectRequirementsZhanTable', arr, project_equipmentTable)
        }
    }
    $("body").on("click", '.uploaderShade', function () {
        $.popInfo("请选择项目类型")
    })
    //点击框架合同下拉，请求接口，接口成功
    $("body #kj_contract").on("click", 'li', function () {
        if (!$(this).attr("index")) return
        contractAjax($(this).attr("index"))
    })
    //点击建设单位下拉,如果点击的是集团下拉，那么数据只传第一个companyTypeId，如果点击的是公司，那么传2个参数
    $("body").on("click", '.constructionUnit li', function () {
        //判断是否是第一个
        if (!$(this).attr("index")) return
        var operDate = {}
        var clickIndex = $(this).parents(".constructionUnit").attr("id").slice(15)
        if (clickIndex == 0) {
            operDate.companyTypeId = $(this).attr("index");//集团
            operDate.companyId = '';//公司
        } else {
            operDate.companyTypeId = $(".projectOperator0").attr("index");//集团
            operDate.companyId = $(this).attr("index");//公司
        }
        //截取最后的个数，个数从0开始追加
        $(".constructionUnit").each(function (k, v) {
            if (clickIndex == 0) {
                if (k > 1) $(v).remove()
            } else {
                if (k > clickIndex) {
                    $(v).remove()
                }
            }
        })
        getCompanyByTypeId(operDate, clickIndex)
    })
    //参与项目，如果是1，不参与，如对勾，如果0，参与，有对勾
    $("body").on("click", '.participate_Project', function () {
        if ($(this).hasClass("checkBoxTrue")) {
            $(".participate_Toggle").show()
        } else {
            $(".participate_Toggle").hide()
            $(".deleteUnitOper").trigger("click")
        }
    })
    // 监理单位，建设单位的添加删除的数据处理
    // 添加新单位，当单位已填写，可以追加，没有填写，提示
    $("body").on("click", '.addUnitOper', function () {
        var indexUnit = $(this).attr("index");//判断是监理单位还是设计单位
        //    1.获取输入框的内容
        if (indexUnit == 2) {
            var thisLen = $(".supervisionUnit").eq($(".supervisionUnit").length - 1)
        } else {
            var thisLen = $(".designUnits").eq($(".designUnits").length - 1)
        }
        var unitObj = {
            unit_Name: thisLen.find(".unit_Name").val(),
            unit_person: thisLen.find(".unit_person").val(),
            unit_phone: thisLen.find(".unit_phone").val()
        }
        if (!$.checkReg(unitObj.unit_Name, 'noNull')) {
            $.popInfo("请填写单位名称");
            return
        }
        if ($.checkReg(unitObj.unit_phone, 'noNull') && !$.checkReg(unitObj.unit_phone, 'phone')) {
            $.popInfo("负责人手机号格式不对");
            return
        }
        if (indexUnit == 2) var unitStr = ' <div class="supervisionUnit afterUnitBox f_l clearfix">'
        else if (indexUnit == 1) var unitStr = ' <div class="designUnits afterUnitBox f_l clearfix">'
        unitStr += '  <input type="text" maxlength="100" class="f_l inputOrgan unit_Name" style="width: 230px;margin-right: 10px" placeholder="请填写单位名称" >\n' +
            '              <input type="text" maxlength="10" class="f_l inputOrgan unit_person" style="width: 230px;margin-right: 10px" placeholder="请填写负责人" >\n' +
            '              <input type="text" maxlength="11" class="f_l inputOrgan unit_phone" style="width: 230px" placeholder="请填写负责人手机号" >\n' +
            '              <div class="f_l operatorUnit deleteUnitOper m_red">\n' +
            '                    <span class="deleteUnit"></span>删除\n' +
            '             </div>\n' +
            '         </div>'
        if (indexUnit == 2) {
            $(".super_First_Unit").append(unitStr);
        }
        else if (indexUnit == 1) {
            $(".design_First_Unit").append(unitStr);
        }
    })
    //    点击删除，
    $("body").on("click", '.deleteUnitOper', function () {
        $(this).parent().remove()
    })
    //    获取数据
    //    点击提交
    var placeSearch = new AMap.PlaceSearch();  //构造地点查询类
    $("body").on("click", '.postBtn', function () {
        var thisHtm = $(this).html()
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // 1-保存；2-提交审核；4-提交
                if (thisHtm == '提交') getDataFrom(4)
                else getDataFrom(2)
                if (applyFalg) {
                    var address = getCodeTxt(applyObj.province, applyObj.city, applyObj.county) + applyObj.projectRegion;
                    placeSearch.search(address, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            var poiArr = result.poiList.pois;
                            applyObj.projectLng = poiArr[0].location.lng;
                            applyObj.projectLat = poiArr[0].location.lat;
                            doUpdateProject()
                        } else {
                            $.popInfo("项目区域描述地址在地图上不存在")
                            return false
                        }
                    });
                }
            }
        })
    })
    $("body").on("click", '.saveBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // 1-保存；2-提交审核；4-提交
                getDataFrom(1)
                if (applyFalg) {
                    doUpdateProject()
                }
            }
        })
    })

    //点击下载模板
    $("body").on("click",'.downlown_template',function () {
        if(!projectTypeAttrId){
            var funTar = arguments.callee.caller
            var e = funTar.arguments[0]
            //如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.preventDefault) e.preventDefault();   //阻止默认浏览器动作(W3C)
            else window.event.returnValue = false;   //IE中阻止函数器默认动作的方式
            $.popInfo("请选择项目类型")
            return false;

        }else{

            if(projectTypeAttrId==1) download("线路类需求列表模板.xlsx",'线路类需求列表模板.xlsx', this)
            else if(projectTypeAttrId==2) download("设备类需求列表模板.xlsx",'设备类需求列表模板.xlsx', this)

        }
    })
    //初始数据===回显数据
    function initData() {
        $http({
            url: '/gct-web/project/beforeUpdate',
            data: {
                projectId: projectId,
                status:2//1是变更回显，2是编辑回显
            },
            success: function (r) {
                if (r.data.project.projectStatus == 3) {
                    auditNoPassRemark(projectId, auditItem)
                    //    未过审的的编辑，数据只能有提交审核，没有保存按钮。
                    $(".saveBtn").remove();
                    $(".postBtn").addClass("f_l").removeClass("middle_Btn")
                }
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
            $(".kj_contract_show").eq(0).find(".details_Text").html(r.data.project.frameContract.contractNo)
            $(".kj_contract_show").eq(1).find(".details_Text").html(initDate(r.data.project.frameContract.startDate) + ' 至 ' + initDate(r.data.project.frameContract.endDate))
            $(".kj_contract_show").eq(2).find(".details_Text").html(r.data.project.frameContract.discount + '%')
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
        //项目类型下拉
        projectTypeBefore = r.data.ptList?r.data.ptList:[]
        if (r.data.project.projectType) {
            getDownSelect('projectStatus', '', r.data.ptList, 'id', 'typeName')
            $.each(r.data.ptList, function (k, v) {
                if (v.pitchOn != -1) {
                    $(".projectStatus").html(v.typeName)
                    $(".projectStatus").attr("index", v.id)
                    return;
                }
            })
        }
        else {
            getDownSelect('projectStatus', '请选择', r.data.ptList, 'id', 'typeName')
        }

        //建设单位第一级的数据回显
        if(r.data.companyTypeList&&r.data.companyTypeList.length){
            if(r.data.companyType&&r.data.companyType.id){
                getDownSelect('projectOperator0', r.data.companyType.typeName, r.data.companyTypeList, 'id', 'typeName')
                $(".projectOperator0").attr("index", r.data.companyType.id);

            }else{
                getDownSelect('projectOperator0', r.data.companyTypeList[0].typeName, r.data.companyTypeList, 'id', 'typeName')
                $(".projectOperator0").attr("index", r.data.companyTypeList[0].id);
            }

            //没有选择建设单位，只有一级的
            if (!r.data.project.operatorCompany) {
                //   建设单位的二级默认
                if(r.data.companyType&&r.data.companyType.id){
                    var operDate = {}
                    operDate.companyTypeId = r.data.companyType.id;//集团
                    operDate.companyId = ''
                    getCompanyByTypeId(operDate,0)
                }

            } else {
                if (r.data.lists) {
                    viewBuildCompany(r.data.lists)
                    if(r.data.companyType&&r.data.companyType.id){
                        var operDate = {}
                        operDate.companyTypeId = r.data.companyType.id;//集团
                        operDate.companyId = r.data.project.operatorCompany;//公司
                        getCompanyByTypeId(operDate,r.data.lists.length+1)
                    }

                }

                //
            }

        }

        //    建设单位的负责人和负责人电话
        $(".operatorPerson").val(r.data.project.operatorPerson)
        $(".operatorTel").val(r.data.project.operatorTel)
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
        getCodeEcho('unitAddress', r.data.project.province, r.data.project.city, r.data.project.county)
        $(".projectRegion").val(r.data.project.projectRegion)
        $("#projectDescription").val(r.data.project.remarks)
        //    施工负责人
        //   施工单位的回显
        $(".constructionCompany").find(".details_Text").eq(0).html(r.data.project.createCompanyName)
        $(".constructionCompany").find(".details_Text").eq(1).html(r.data.project.createrInfo.trueName)
        $(".constructionCompany").find(".details_Text").eq(2).html(r.data.project.createrInfo.userName)
        applyObj.constructCompany = r.data.project.constructCompany
        //    是否参与 //运营商是否参与    0：参与；1：不参与
        if (r.data.project.isParticipate == 0) {
            $(".participate_Project").addClass("checkBoxTrue");
            $(".participate_Toggle").show()
            var designCompanyArr = []
            var supervisionCompanyArr = []
            if (r.data.projectCompanyList && r.data.projectCompanyList.length > 0) {
                $.each(r.data.projectCompanyList, function (k, v) {
                    if (v.companyType == 2) {
                        supervisionCompanyArr.push(v)
                    }
                    else if (v.companyType == 1) {
                        designCompanyArr.push(v)
                    }
                })
                addUnitFnShow(supervisionCompanyArr, 2)
                addUnitFnShow(designCompanyArr, 1)
            }
        }
        //    项目需求列表
        //     如果项目类型已经存在，可以上传。如果没有，不能上传，提示
        if (r.data.project.projectTypeInfo && r.data.project.projectTypeInfo.attribute) {
            projectTypeAttrId = r.data.project.projectTypeInfo.attribute;//项目需求属性类型(1,2)
            orFileData['postFileBtn1'] = r.data.projectRangeList
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
    //建设单位的施工单位，设计单位的回显
    function addUnitFnShow(arr, type) {
        if(arr.length==0) return
        $.each(arr, function (k, v) {
            if (k == 0) {
                if (type == 2) {
                    $(".super_First_Unit").find(".unit_Name").val(v.companyName)
                    $(".super_First_Unit").find(".unit_person").val(v.person)
                    $(".super_First_Unit").find(".unit_phone").val(v.tel)
                }
                else if (type == 1) {
                    $(".design_First_Unit").find(".unit_Name").val(v.companyName)
                    $(".design_First_Unit").find(".unit_person").val(v.person)
                    $(".design_First_Unit").find(".unit_phone").val(v.tel)
                }
            } else {
                if (type == 2) var unitStr = ' <div class="supervisionUnit afterUnitBox f_l clearfix">'
                else if (type == 1) var unitStr = ' <div class="designUnits afterUnitBox f_l clearfix">'
                unitStr += '  <input type="text" maxlength="100" class="f_l inputOrgan unit_Name" style="width: 230px;margin-right: 10px" placeholder="请填写单位名称" value="' + v.companyName + '">\n' +
                    '              <input type="text" maxlength="10" class="f_l inputOrgan unit_person" style="width: 230px;margin-right: 10px" placeholder="请填写负责人" value="' + v.person + '">\n' +
                    '              <input type="text" maxlength="11" class="f_l inputOrgan unit_phone" style="width: 230px" placeholder="请填写负责人手机号" value="' + v.tel + '">\n' +
                    '              <div class="f_l operatorUnit deleteUnitOper m_red">\n' +
                    '                    <span class="deleteUnit"></span>删除\n' +
                    '             </div>\n' +
                    '         </div>'
                if (type == 2) {
                    $(".super_First_Unit").append(unitStr);
                }
                else if (type == 1) {
                    $(".design_First_Unit").append(unitStr);
                }
            }
        })
    }
    //项目需求的回显
    function projectRequire(projectType, arr) {
        $(".uploaderShade").hide()
        orFileData['postFileBtn1'] = arr;
        if (projectType == 1) {
            $(".tempXian").show().siblings(".tempJiZhan").hide();
            $("#projectRequirementsZhanTable").parent().hide();
            $("#projectRequirementsXianTable").parent().show();
            initTable('projectRequirementsXianTable', arr, project_LineTable)
        }
        else if (projectType == 2) {
            $(".tempJiZhan").show().siblings(".tempXian").hide();
            $("#projectRequirementsXianTable").parent().hide();
            $("#projectRequirementsZhanTable").parent().show();
            initTable('projectRequirementsZhanTable', arr, project_equipmentTable)
        }
        var formData1 = {
            'flag': projectType
        }
        orFileObj['postFileBtn1Uploader'].options.formData = formData1
        orFileData['postFileBtn1'] = arr;
    }
    //建设单位下拉的回显
    function viewBuildCompany(list) {
        if(list.length==0)return;
        $.each(list, function (i, val) {
            var strId = ""
            if (i == 0) {
                strId = 'projectOperator1'
                // getDownSelect("operatorList", '请选择', r.data, "id", "companyName")
            } else {
                newDownSelectIdx = i + 1
                strId = 'projectOperator' + newDownSelectIdx
                $(".afterOperatorSelect").before('<div id="' + strId + '" class="downSelect f_l constructionUnit" style="width: 300px"></div>')
            }
            downSelectEcho({
                el: strId,
                data: val,
                ratioName: 'pitchOn',
                ratio: -1,
                idx: 'id',
                txt: 'companyName'
            })
        })
    }
    //回显 下拉
    function downSelectEcho(data) {
        data = {
            el: data.el,                //元素id
            data: data.data,            //数据
            ratioName: data.ratioName,   // 需要比值的 键名
            ratio: data.ratio,           // 需要比值的 基准值
            idx: data.idx,               // 需要区分的键名 唯一标识
            txt: data.txt,               // 中文名字 所在的键名
            type: data.type              //比值类型  '==' 的情况下 数据 val[data.ratioName] == 基准值  否则  就是 ！=
        }
        var NewName = "请选择"
        var NewId = ""
        $.each(data.data, function (index, val) {
            if (data.type == '==') {
                if (val[data.ratioName] == data.ratio) {
                    NewId = val[data.idx]
                    NewName = val[data.txt]
                }
            } else {
                if (val[data.ratioName] != data.ratio) {
                    NewId = val[data.idx]
                    NewName = val[data.txt]
                }
            }
        })
        data.data.unshift({
            companyName: "请选择",
            id: ""
        })
        getDownSelect(data.el, NewName, data.data, data.idx, data.txt)
        $("." + data.el).attr('index', NewId)
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
                    $(".kj_contract_show").eq(0).find(".details_Text").html(r.data.frameContract.contractNo)
                    $(".kj_contract_show").eq(1).find(".details_Text").html(initDate(r.data.frameContract.startDate) + ' 至 ' + initDate(r.data.frameContract.endDate))
                    $(".kj_contract_show").eq(2).find(".details_Text").html(r.data.frameContract.discount + '%')
                    $(".kj_contract_show").show()
                }
                $(".constructionUnit").each(function (k, v) {
                    if (k == 0) {
                        //建设单位集团
                        getDownSelect('projectOperator0', "", r.data.companyTypeList, 'id', 'typeName')
                        $(r.data.companyTypeList).each(function (k, v) {
                            if (v.pitchOn != -1) {
                                $(".projectOperator0").html(v.typeName);
                                $(".projectOperator0").attr("index", v.id);
                                return;
                            }
                        })
                        r.data.lists[0].unshift({
                            companyName:'请选择',
                            id:''
                        })
                        // 建设单位公司
                        getDownSelect('projectOperator1', '请选择', r.data.lists[0], 'id', 'companyName')
                    }
                    else if (k > 1) {
                        $(v).remove()
                        //    第一个下拉中的东西重新渲染，第二个置为空
                    }
                })
            }
        })
    }
    function getCompanyByTypeId(data, clickIndex) {
        $http({
            url: '/gct-web/project/getCompanyByTypeId',
            data: data,
            success: function (r) {
                if (r.data.length > 0) {
                    if (clickIndex != '0') {
                        var len = $(".constructionUnit").length;
                        var selectId = 'projectOperator' + len;
                        var str = '<div id="' + selectId + '" class="downSelect f_l constructionUnit" style="width: 300px"></div>'
                        $(".afterOperatorSelect").before(str)
                        getDownSelect(selectId, '请选择', r.data, 'id', 'companyName')
                    } else {
                        getDownSelect('projectOperator1', '请选择', r.data, 'id', 'companyName')
                    }
                }
            }
        })
    }
})
var applyObj = {}
var applyFalg = true;
function getDataFrom(flag) {
    applyFalg = true;
    applyObj.projectStatus = flag;//提交状态
    applyObj.fileUrlDel = delFileObjUrlList.join(",");//路径
    applyObj.ids = delFileIdList.join(",");//提交状态
    applyObj.id = projectId;//提交状态
    applyObj.contractId = $(".kj_contract").attr("index");//框架合同id
    applyObj.projectName = $(".projectName").val();//项目名称
    applyObj.projectCode = $(".projectCode").val();//项目编号
    applyObj.projectAmount = $(".projectAmount").val();//合同金额
    applyObj.sateAmount = $(".sateAmount").val();//安全生产费
    applyObj.serveAmount = $(".serveAmount").val();//施工服务费
    applyObj.guiAmount = $(".guiAmount").val();//规费
    applyObj.tax = $(".tax").val();//税金
    applyObj.startDate = $("#startTime").val();
    applyObj.endDate = $("#endTime").val();//计划完工时间
    applyObj.projectType = $(".projectStatus").attr("index");//项目类型
    applyObj.projectCycle = $(".projectCycle").val();//项目周期
    applyObj.constructType = $(".constructionType").find(".radioActive").attr("index");//施工类型
    var address = getCodeSub('unitAddress');//地址
    applyObj.province = address.province;//地址
    applyObj.city = address.city;//地址
    applyObj.county = address.county;//地址
    applyObj.projectRegion = $(".projectRegion").val();//详细地址
    applyObj.typeId = $("#projectOperator0").find("span").attr("index");//建设单位的集团的单位
    applyObj.operatorCompany=0;//建设单位ID
    $(".constructionUnit").each(function (k, v) {
        if (k != 0 && $(v).find("span").attr("index")) {
            applyObj.operatorCompany = $(v).find("span").attr("index")
        }
    })
    applyObj.operatorPerson = $(".operatorPerson").val();//建设单位负责人
    applyObj.operatorTel = $(".operatorTel").val();//建设单位负责人电话
    applyObj.isParticipate = $(".participate_Project").hasClass("checkBoxTrue") ? '0' : '1'; //运营商是否参与    0：参与；1：不参与
    // 如果参与，有监理单位，设计单位
    applyObj.remarks = $("#projectDescription").val()//项目说明
    if (applyObj.isParticipate == 0) {
        var designCompanyArr = []
        var supervisionCompanyArr = []
        //监理单位
        $(".supervisionUnit").each(function (k, v) {
            if ($(v).find(".unit_Name").val()) {
                supervisionCompanyArr.push({
                    companyName: $(v).find(".unit_Name").val(),
                    person: $(v).find(".unit_person").val(),
                    tel: $(v).find(".unit_phone").val(),
                    companyType: 2
                })
            } else {
                $.popInfo("监理单位的单位名称不能为空，请删除")
                applyFalg = false;
                return;
            }
        })
        //设计
        $(".designUnits").each(function (k, v) {
            if ($(v).find(".unit_Name").val()) {
                designCompanyArr.push({
                    companyName: $(v).find(".unit_Name").val(),
                    person: $(v).find(".unit_person").val(),
                    tel: $(v).find(".unit_phone").val(),
                    companyType: 1
                })
            } else {
                $.popInfo("设计单位的单位名称不能为空，请删除")
                applyFalg = false;
                return;
            }
        })
    }
    //保存时只校验项目名称，其余时都校验
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

    if (flag != 1) {
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
        if (applyObj.projectType == '') {
            applyFalg = false;
            $.popInfo("请选择项目类型，项目类型不能为空");
            return false
        }
        if (applyObj.constructType == '') {
            applyFalg = false;
            $.popInfo("请选择施工类型，施工类型不能为空");
            return false
        }
        if (applyObj.province == '') {
            applyFalg = false;
            $.popInfo("请选择项目区域的省份，省份不能为空");
            return false
        }
        if ($(".projectOperator1").attr("index") == '') {
            applyFalg = false;
            $.popInfo("请选择建设单位，最少选择至省级单位");
            return false
        }
        if (applyObj.isParticipate == 0) {
            //监理单位
            if (supervisionCompanyArr.length == 0) {
                applyFalg = false;
                $.popInfo("请填写监理单位");
                return false
            }
            if (designCompanyArr.length == 0) {
                applyFalg = false;
                $.popInfo("请填写监理单位");
                return false
            }
            applyObj.supervisionCompanyStr = JSON.stringify(supervisionCompanyArr)
            applyObj.designCompanyStr = JSON.stringify(designCompanyArr)
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
        $.each(orFileData['postFileBtn2'], function (k, v) {
            v.fileType = 1
        })
        $.each(orFileData['postFileBtn3'], function (k, v) {
            v.fileType = 2
        })
        applyObj.projectRangeStr = JSON.stringify(orFileData['postFileBtn1'])///项目需求列表
        applyObj.contractFileStr = JSON.stringify(orFileData['postFileBtn2'])//项目合同
        applyObj.reportFileStr = JSON.stringify(orFileData['postFileBtn3'])//开工报告
    } else {
        if (applyObj.projectAmount&&!Number(applyObj.projectAmount)) {
            applyFalg = false;
            $.popInfo("请填写项目金额，项目金额不能为空");
            return false
        }
        if (applyObj.sateAmount&&!Number(applyObj.sateAmount)) {
            applyFalg = false;
            $.popInfo("请填写安全生产费，安全生产费不能为空");
            return false
        }
        if (applyObj.serveAmount&&!Number(applyObj.serveAmount)) {
            applyFalg = false;
            $.popInfo("请填写施工服务费，施工服务费不能为空");
            return false
        }
        if (applyObj.guiAmount&&!Number(applyObj.guiAmount)) {
            applyFalg = false;
            $.popInfo("请填写规费，规费不能为空");
            return false
        }
        if (applyObj.tax&&!Number(applyObj.tax)) {
            applyFalg = false;
            $.popInfo("请填写税金，税金不能为空");
            return false
        }
        if ($.checkReg(applyObj.projectCycle, 'noNull') && !$.checkReg(applyObj.projectCycle, 'age')) {
            applyFalg = false;
            $.popInfo("请填写项目周期，允许输入10位整数");
            return false
        }
        if (applyObj.isParticipate == 0) {
            applyObj.supervisionCompanyStr = JSON.stringify(supervisionCompanyArr)
            applyObj.designCompanyStr = JSON.stringify(designCompanyArr)
        }
        $.each(orFileData['postFileBtn2'], function (k, v) {
            v.fileType = 1
        })
        $.each(orFileData['postFileBtn3'], function (k, v) {
            v.fileType = 2
        })
        applyObj.projectRangeStr = JSON.stringify(orFileData['postFileBtn1'])///项目需求列表
        applyObj.contractFileStr = JSON.stringify(orFileData['postFileBtn2'])//项目合同
        applyObj.reportFileStr = JSON.stringify(orFileData['postFileBtn3'])//开工报告
    }
}
//提交
function doUpdateProject() {
    $http({
        url: '/gct-web/project/doUpdate',
        data: applyObj,
        success: function (r) {
            submitSuccess('',function () {
                goBack()
            })
        }
    })
}