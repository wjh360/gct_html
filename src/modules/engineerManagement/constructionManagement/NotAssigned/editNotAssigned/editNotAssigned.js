$(function () {
    var taskId = storage("taskId") //工单id
    var taskType;       //工单类型
    var attribute;      //项目类型  线路  和 基站
    var companyId;      //公司id
    var depId;          //部门id
    var projectId;         //项目id
    $http({
        url: '/gct-web/task/getTaskInfo',
        data: {
            id: taskId
        },
        success: function (r) {
            if (!r.data || !r.data.obj) return false
            var getData = r.data.obj
            attribute = getData.attribute;
            $(".proJectType").html(getData.typeName)
            var obj = postObj
            obj.taskCommit = ""
            eachData(postObj, getData)
            orFileData['workSheetMaterialFile'] = [{ list: getData.matterVOList }]
            taskType = getData.taskType
            initTable("workSheetMaterial", getData.matterVOList, workSheetMaterialCol)
            companyId = getData.companyId
            depId = getData.depId
            $(".taskCompany").attr("index", companyId).html(getData.companyName)
            $(".taskDep").attr("index", depId).html(getData.depName)
            $(".user").attr("index", getData.userId).html(getData.userName)
            orFileData['postFileBtnEcho'] = r.data.obj.taskFileList
            fileUploader({
                btn: 'postFileBtn',
                data: orFileData['postFileBtnEcho'],
                tabId: 'fileListTable',
                col: fileCol,
                other: {
                    isMore: true,
                    fileType: {
                        title: 'fileType',
                        extensions: 'jpg,png,txt,doc,docx,xls,xlsx,pdf,rar,zip',
                        mimeTypes: '.jpg,.png,.txt,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip'
                    }
                }
            })
            //需求列表
            projectId = getData.projectId
            // log(getData.projectRangeList[0].id)
            getProList(getData.projectId, getData.taskCategory, getData.projectRangeList[0].id)
        }
    })
    function getProList(proId, taskCategory, demend) {
        $http({
            url: '/gct-web/task/getProjectEcho',
            success: function (r) {
                downSelectEcho({
                    el: 'projectId',
                    data: r.data.list,
                    ratioName: 'id',
                    ratio: proId,
                    idx: 'id',
                    txt: 'projectName',
                    type: '==',
                    more: ['projectType', 'typeName', 'attribute']
                })
                // log(proId)
                //工单类型
                $http({
                    url: '/gct-web/task/getTaskCategoryEcho',
                    success: function (r) {
                        downSelectEcho({
                            el: 'taskCategory',
                            data: r.data.list,
                            ratioName: 'id',
                            ratio: taskCategory,
                            idx: 'id',
                            txt: 'categoryName',
                            type: '=='
                        })
                        getProjectRangeEcho(demend)
                    }
                })
            }
        })
    }
    //施工队长三级联动
    function getCompanyDepUserEcho(data, type, getV) { //公司ID  数字 //部门Id   数字
        $http({
            url: '/gct-web/task/getCompanyDepUserEcho',
            data: data,
            success: function (r) {
                var isGet = getV || false
                if (isGet) $("#" + type).html("")
                switch (type) {
                    case 'user':
                        getDownSelect(type, isGet ? getV.txt : '请选择', r.data.userList, 'id', 'trueName', ['depId'])
                        break;
                    case 'taskDep':
                        !isGet || getDownSelect(type, isGet ? getV.txt : '请选择', r.data.departmentList, 'id', 'depName', ['companyId'])
                        isGet || getDownSelect("user", '请选择', r.data.userList, 'id', 'trueName')
                        break;
                    case 'taskCompany':
                        !isGet || getDownSelect(type, isGet ? getV.txt : '请选择', r.data.companyList, 'id', 'companyName')
                        isGet || getDownSelect("taskDep", '请选择', r.data.departmentList, 'id', 'depName', ['companyId'])
                        isGet || getDownSelect("user", '请选择', [], 'id', 'trueName')
                        break;
                }
                if (isGet) $("." + type).attr("index", getV.id).addClass("downSetOpen").next("ul").show()
            }
        })
    }
    //根据公司id  获取部门
    $("body").on("click", '#taskCompany li', function () {
        getCompanyDepUserEcho({ 'companyId': $(this).attr("index") }, 'taskCompany')
    })
    //获取所有公司
    $("body").on("click", '#taskCompany .getView', function () {
        getCompanyDepUserEcho({}, 'taskCompany', { id: $(this).attr("index"), txt: $(this).html() })
    })
    //获取所有部门
    $("body").on("click", '#taskDep .getView', function () {
        getCompanyDepUserEcho({ companyId: companyId }, 'taskDep', { id: $(this).attr("index"), txt: $(this).html() })
    })
    //根据部门id  获取人员
    $("body").on("click", '#taskDep li', function () {
        getCompanyDepUserEcho({ companyId: $(this).attr("morepar_companyid"), depId: $(this).attr("index") }, 'taskDep')
    })
    //根据部门id  获取人员
    $("body").on("click", '#user .getView', function () {
        getCompanyDepUserEcho({ companyId: companyId, depId: depId }, 'user', { id: $(this).attr("index"), txt: $(this).html() })
    })

    //点击下载模板
    $("body").on("click", '.downlown_template', function () {
        download("物料模版.xls", '物料模版.xls', this)

    })
    // 获取需求列表

    function getProjectRangeEcho(demned) {
        // log(demned)
        $http({
            url: '/gct-web/task/getProjectRangeEcho',
            data: {
                projectId: projectId
            },
            success: function (r) {
                if (r.data && r.data.list) {
                    $("#ProjectRange").parents('.page').html('<table id="ProjectRange"></table>')
                    var acol = attribute == 1 ? line_listOfRequirements : station_listOfRequirements
                    acol[0].formatter = function (a, b) {
                        if (b.id == demned) return '<span class="checkBoxTrue" name="radio"></span>'
                        return '<span class="checkBox" name="radio"></span>'
                    }
                    initTable("ProjectRange", r.data.list, acol)
                }
            }
        })
    }
    //点击项目列表 更换 需求列表
    $("body").on("click", '#projectId li', function () {
        projectId = $(this).attr("index")
        taskType = $(this).attr("morepar_projecttype")
        attribute = $(this).attr("morepar_attribute")
        $(".proJectType").html($(this).attr("morepar_typename"))
        getProjectRangeEcho()
    })
    // initTable("workSheetMaterial",[],workSheetMaterialCol)
    // postFiles("workSheetMaterialFile", true, {
    //     fileType : {
    //         title: 'fileType',
    //         extensions: 'xls,xlsx',
    //         mimeTypes: '.xls,.xlsx'
    //     },
    //     url: '/gct-web/task/getMatterImportExcel',
    //     isMore:'true',
    //     init:initWorkSheetMaterialFileList
    // })
    var otherData = {
        fileType: {
            title: 'fileType',
            extensions: 'xls,xlsx',
            mimeTypes: '.xls,.xlsx'
        },
        url: '/gct-web/task/getMatterImportExcel',
        isMore: 'true'
    }
    fileUploader({
        btn: 'workSheetMaterialFile',
        tabId: 'workSheetMaterial',
        col: workSheetMaterialCol,
        other: otherData
    })
    // fileUploader ('workSheetMaterialFile',[],'workSheetMaterial',workSheetMaterialCol)
    // function initWorkSheetMaterialFileList (arr){
    //     arr = orFileData['workSheetMaterialFile']
    //     arr = arr.length  ? arr[arr.length-1].list : ""
    //     if(!arr) return false
    //     initTable("workSheetMaterial", arr, workSheetMaterialCol)
    // }
    // function getFileList(arr) {
    //     $.each(arr,function(i,val){
    //         if(!val.init) {
    //             val.init = getFileList
    //             val.eleName= 'postFileBtn'
    //         }
    //     })
    //     initTable("fileListTable", arr, fileCol)
    // }
    // // getFileList()
    // postFiles("postFileBtn", true, {
    //     init:getFileList
    // })
    var newPostObj = {}
    //派单
    $("body").on("click", '.postBtn', function () {
        getPostData(2)
    })
    function getPostData(status) {
        getTableSelectId('ProjectRange', 'id')
        newPostObj = {
            taskType: taskType,
            status: status,
            id: taskId,
            fileUrlDel: delFileObjUrlList.join(),
            fileIds: delFileIdList.join()
        }
        var adrss = getCodeSub('workAdrss')
        // delete newPostObj.taskCommit
        for (var k in postObj) {
            if ($("." + k).parents(".downSelect").length) {
                newPostObj[k] = $("." + k).attr("index")
            } else {
                if (k == 'province' || k == 'city' || k == 'county') {
                    newPostObj[k] = adrss[k]
                } else {
                    newPostObj[k] = $("." + k).val() || $("." + k).html()
                }
            }
            if (k != 'commit' && !newPostObj[k] && k != 'hours' && k != 'taskCommit') {
                return $.popInfo(postObj[k] + '错误！请确认！')
            }
        }
        if (tabObj['ProjectRange'].tab_select_ids.length != 1) return $.popInfo("请选择项目建设列表！")
        newPostObj['rangeId'] = tabObj['ProjectRange'].tab_select_ids[0]
        var arr = orFileData['workSheetMaterialFile'] || [{}]
        arr = arr[arr.length - 1].list || []
        // if(!arr) return $.popInfo("请上传工单物料！")
        var taskMatterJson = []
        $.each(arr, function (i, val) {
            var obj = {
                matterCode: val['matterCode'] || "",   //编号
                matterName: val['matterName'] || "",     //名称
                matterSpec: val['matterSpec'] || "",     //规格
                matterUnit: val['matterUnit'] || "",    //单位
                matterNum: val['matterNum'] || "",     //数量
                matterPrice: val['matterPrice'] || "", //单价
                matterType: val['matterType'] || "", //类型
                matterSource: val['matterSource'] || "",  //供方属性
                matterSupplier: val['matterSupplier'] || "",  //物料供应商
            }
            taskMatterJson.push(obj)
        })
        newPostObj.matterVOJson = JSON.stringify(taskMatterJson)
        if (checkFileList('postFileBtn')) return $.popInfo("请上传设计文件！")
        newPostObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        // log(newPostObj)
        $.popConfirm({
            content: '确定' + (status == 1 ? '保存' : '派单') + '吗?',
            confirm: function () {
                $http({
                    url: '/gct-web/task/getTaskUpdate',
                    data: newPostObj,
                    success: function (r) {
                        submitSuccess('操作成功', function () {
                            goBack()
                        })
                    }
                })
            }
        })
    }
    //保存
    $("body").on("click", '.saveBtn', function () {
        getPostData(1)
    })
})
var postObj = {
    projectId: "项目",   //项目Id  数字
    taskName: "工单名称",
    // taskType:"工单类型",    //工单类型  数字
    taskCategory: "工单类别",  //工单类别  数字
    startDate: "计划开工日期",
    endDate: "计划完工日期",
    hours: "计划周期",          //计划周期   数字
    estimate: "施工造价估算",       //施工造价估算 字符串
    province: "施工地点所在省",       //数字  省ID
    city: "施工地点所在市",           //数字 市ID
    county: "施工地点所在区/县",        //县ID  数字
    // status       //操作状态  1.保存  2.派单 数字
    taskRegion: "详细地址",  //详细地址  字符串
    user: "施工队长",         //施工队长   数字
    commit: "说明"      //说明   字符串
    // fileJson[   //设计文件附件JSON字符串
    //     {
    //         fileName   //文件名称
    //      suffixName   //文件后缀
    //      projectFileUrl  //路径
    //      projectFileSize  //大小
    //      thumbnailUrl   //所列图
    //     }
    // ]
    // ranges         //项目建设列表ID 字符串(需求只能传一个)
    // taskMatterJson[    //工单物料JSON字符串
    //     {
    //         matterCode  //编号
    //         matterName  //名字
    //         matterSpec  //规格
    //         matterUnit   //单位
    //         matterNum   //计划数字
    //         matterSource //物料来源
    //         matterSupplier  //物料供应商
    //     }
    // ]
}


window.jedateClick = function (a) {


    var end = $(".endTime").val();

    var start = $(".startTime").val()

    var date = new Date(end);
    var times1 = date.getTime()

    var date1 = new Date(start);
    var times2 = date1.getTime()


    var count = Math.floor(((times1 - times2) / 86400000)) + 1
    if (count < 1) {
        $.popInfo("工单周期最少一天！")
        $(".jsShiJianCha").html("")
        return $(".endTime").val("")
    }
    $(".jsShiJianCha").html(count)

}
