$(function () {
    var taskType;       //工单类型
    var attribute;      //项目类型  线路  和 基站
    $http({
        url: '/gct-web/task/getProjectEcho',
        success: function (r) {
            getDownSelect("projectId", '请选择项目', r.data.list, 'id', 'projectName', ['projectType', 'typeName', 'attribute'])
            //工单类型
            $http({
                url: '/gct-web/task/getTaskCategoryEcho',
                success: function (r) {
                    getDownSelect("taskCategory", r.data.list[0].categoryName, r.data.list, 'id', 'categoryName')
                    $(".taskCategory").attr("index", r.data.list[0].id)
                    getCompanyDepUserEcho()
                }
            })
        }
    })
    //点击下载模板
    $("body").on("click", '.downlown_template', function () {
        download("物料模版.xls", '物料模版.xls', this)

    })
    //施工队长三级联动
    function getCompanyDepUserEcho(data, type, isEcho) { //公司ID  数字 //部门Id   数字
        $http({
            url: '/gct-web/task/getCompanyDepUserEcho',
            data: data,
            success: function (r) {
                if (!data) {
                    downSelectEcho({
                        el: 'taskCompany',
                        data: r.data.companyList,
                        ratioName: 'id',
                        ratio: r.data.companyId,
                        idx: 'id',
                        txt: 'companyName',
                        type: '=='
                    })
                    getCompanyDepUserEcho({ 'companyId': r.data.companyId }, 'companyId', true)
                } else if (!type) {
                    getDownSelect("taskCompany", '请选择', r.data.companyList, 'id', 'companyName')
                } else if (type == 'companyId') {

                    if (isEcho) {
                        downSelectEcho({
                            el: 'taskDep',
                            data: r.data.departmentList,
                            ratioName: 'id',
                            ratio: r.data.depId,
                            idx: 'id',
                            txt: 'depName',
                            type: '==',
                            more: ['companyId']
                        })
                        getCompanyDepUserEcho({
                            companyId: r.data.companyId,
                            depId: r.data.depId
                        }, 'depId')
                    } else {
                        getDownSelect("taskDep", '请选择', r.data.departmentList, 'id', 'depName', ['companyId'])

                    }
                    getDownSelect("user", '请选择', [], 'id', 'trueName')
                } else {

                    getDownSelect("user", '请选择', r.data.userList, 'id', 'trueName', ['depId'])
                }
            }
        })
    }
    //根据公司id  获取部门
    $("body").on("click", '#taskCompany li', function () {
        getCompanyDepUserEcho({ 'companyId': $(this).attr("index") }, 'companyId')
    })
    //根据部门id  获取人员
    $("body").on("click", '#taskDep li', function () {
        getCompanyDepUserEcho({
            companyId: $(this).attr("morepar_companyid"),
            depId: $(this).attr("index")
        }, 'depId')
    })
    //需求列表 默认无数据
    initTable("ProjectRange", [], attribute == 1 ? line_listOfRequirements : station_listOfRequirements)
    var projectId;
    function getProjectRangeEcho() {
        // log(id)
        $http({
            url: '/gct-web/task/getProjectRangeEcho',
            data: {
                projectId: projectId
            },
            success: function (r) {
                if (r.data && r.data.list) {
                    // log(attribute)
                    $("#ProjectRange").parents('.page').html('<table id="ProjectRange"></table>')
                    initTable("ProjectRange", r.data.list, attribute == 1 ? line_listOfRequirements : station_listOfRequirements)
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
        data: [],
        tabId: 'workSheetMaterial',
        col: workSheetMaterialCol,
        other: otherData
    })
    fileUploader({
        btn: 'postFileBtn',
        data: [],
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
    var newPostObj = {}
    //派单
    $("body").on("click", '.SendSingle', function () {
        // 1.普通新增  2.直接完工
        getPostData(2, 1)
    })
    function getPostData(status, isFinish) {
        newPostObj = {
            isFinish: isFinish,
            taskType: taskType,
            status: status,
            fileUrlDel: delFileObjUrlList.join()
        }
        var adrss = getCodeSub('workAdrss')
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
            if (k != 'commit' && !newPostObj[k] && k != 'hours') {
                return $.popInfo(postObj[k] + '错误！请确认！')
            }
        }
        if (tabObj['ProjectRange'].tab_select_ids.length != 1) return $.popInfo("请选择项目建设列表！")
        newPostObj['rangeId'] = tabObj['ProjectRange'].tab_select_ids[0]

        var arr = orFileData['workSheetMaterialFile']
        arr = arr.length ? arr[arr.length - 1].list : []
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
        if (isFinish == 2) var str = '提交'
        else if (status == 1) var str = '保存'
        else if (status == 2) var str = '派单'

        $.popConfirm({
            content: '确定' + str + '吗?',
            confirm: function () {
                $http({
                    url: '/gct-web/task/getTaskInsert',
                    data: newPostObj,
                    success: function (r) {
                        $.popInfo(r.message)
                        goBack()
                    }
                })
            }
        })
    }
    //保存
    $("body").on("click", '.saveTask', function () {
        getPostData(1, 1)
    })

    //   提交
    $("body").on("click", '.submitTask', function () {
        getPostData(1, 2)
    })
})


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
