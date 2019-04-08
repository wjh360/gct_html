var applyPersonDataList = {}        //已选中的申请人 数据
var curClickCompanyId = ""          //当前点击的公司id
var curClickDepMentId = ""          // 当前点击的部门id
var auditPersonDataList = {}        //已选中的申请人 数据
var curAuditClickCompanyId = ""          //当前点击的公司id
var curAuditClickDepMentId = ""          // 当前点击的部门id
var allUserList = []
var applyUserList = []
var auditUserList = []
var processId = storage("processId")    //流程id
var auditItem = storage("auditItem")    //事项分类
var onesPerson = []; //第一次进入的申请人
$(function () {
    //请求公司 结构
    $http({
        url: '/gct-web/auditProcess/updateEcho',
        data: {
            processId: processId
        },
        success: function (r) {
            createTree(r.data.listApplyCompany, $("#apply_comply_trees"), 'apply_comply_tree', {
                init: initDepMents,
                childName: 'companyName'
            })
            createTree(r.data.listAuditCompany, $("#audit_comply_trees"), 'audit_comply_tree', {
                init: initDepMents,
                childName: 'companyName'
            })
            //已选申请人 回显
            onesPerson = initData(r.data.listApply, applyPersonDataList, applyUserList)
            storage("onesPerson", onesPerson, 'editprocess')
            creatSelectedContent_list('apply_SelectedContent_list')
            //已选审核人 回显
            initData(r.data.listAudit, auditPersonDataList)
            auditUserList = r.data.listAudit
            creatSelectedContent_list('audit_SelectedContent_list', true)
        }
    })
    //序列化 数据
    function initData(arr, obj, userList) {
        // onesPerson = arr || []
        $.each(arr, function (index, value) {
            if (userList) userList.push(value.userId.toString())
            var companyId = value.companyId
            var depId = value.depId || 0

            obj[companyId] = obj[companyId] ? obj[companyId] : {
                companyName: value.companyName,
                id: companyId,
                depMent: obj[companyId] && obj[companyId]['depMent'] ? obj[companyId]['depMent'] : {}
            }
            obj[companyId]['depMent'][depId] = obj[companyId]['depMent'][depId] ? obj[companyId]['depMent'][depId] : {
                id: depId,
                depName: value.depName || '超级管理员',
                person: []
            }
            obj[companyId]['depMent'][depId]['person'].push({
                id: value.userId,
                name: value.trueName
            })
            value.id = value.userId
            allUserList.push(value.userId.toString())
        });
        return obj
    }
    // 申请人公司点击事件
    function initDepMents(a, b, c) {
        if (b == 'apply_comply_tree') {
            curClickCompanyId = c.id
        } else {
            curAuditClickCompanyId = c.id
        }
        $http({
            url: '/gct-web/dep/listByCompanyId',
            data: {
                companyId: c.id, //公司ID
            },
            success: function (r) {
                if (b == 'apply_comply_tree') {
                    applyPersonDataList[curClickCompanyId] = applyPersonDataList[c.id] ? applyPersonDataList[c.id] : {
                        companyName: c.companyName,
                        id: curClickCompanyId,
                        depMent: {}
                    }
                    $("#depMent_trees").html("")
                    createTree(r.data, $("#depMent_trees"), 'depMent_tree', {
                        init: initPersons,
                        childName: 'depName'
                    })
                    $(".applyPersonList").hide().prev(".apply_checkAllPersonP").hide()
                } else {
                    auditPersonDataList[curAuditClickCompanyId] = auditPersonDataList[c.id] ? auditPersonDataList[c.id] : {
                        companyName: c.companyName,
                        id: curAuditClickCompanyId,
                        depMent: {}
                    }
                    $("#audit_depMent_trees").html("")
                    createTree(r.data, $("#audit_depMent_trees"), 'audit_depMent_tree', {
                        init: initPersons,
                        childName: 'depName'
                    })
                    $(".auditPersonList").hide()
                }
            }
        })
    }
    // 申请人部门点击事件
    function initPersons(a, b, c) {
        // log(b)
        if (b == 'depMent_tree') {
            curClickDepMentId = c.id
            src = '/gct-web/auditProcess/listUserByDepId'

        } else {
            curAuditClickDepMentId = c.id
            src = '/gct-web/user/listByDepId'
        }
        $http({
            url: src,
            data: {
                depId: c.id, //部门ID
                auditItem: auditItem
            },
            success: function (r) {
                var getData = r.data ? r.data : []
                if (b == 'depMent_tree') {
                    var obj = applyPersonDataList[curClickCompanyId]['depMent'][curClickDepMentId]
                    applyPersonDataList[curClickCompanyId]['depMent'][curClickDepMentId] = obj ? obj : {
                        id: curClickDepMentId,
                        depName: c.depName,
                        person: []
                    }

                    var arrData = applyPersonDataList[curClickCompanyId]['depMent'][curClickDepMentId]['person']
                    var str = ""
                    // log(arrData)

                    try {
                        onesPerson = storage("onesPerson")[curClickCompanyId]['depMent'][curClickDepMentId]['person']
                    } catch (error) {
                        onesPerson = []
                    }
                    getData = getData.concat(onesPerson)
                    // $.each(arrData, function (index, v) {
                    //     $.each(getData, function (i, val) {
                    //         // if (val && v.id == val.id) getData.splice(i, 1)
                    //     })
                    // })
                    $.each(getData, function (i, val) {
                        if (val) {
                            val.trueName = val.name || val.trueName
                            var dis = allUserList.indexOf(val.id.toString()) == -1 ? "" : 'display:none;'
                            str += '<span class="overf_E applyPersonCheck allsort" style="' + dis + '"  index="' + val.id + '" >' + val.trueName + '</span>'
                        }
                    })
                    $(".applyPersonList").html("").prev(".apply_checkAllPersonP").hide().find(".checkBoxTrue").removeClass("checkBoxTrue").addClass("checkBox")
                    if (getData.length) $(".apply_checkAllPersonP").show()
                    $(".applyPersonList").append(str).attr("index", curClickDepMentId).attr("name_company", curClickCompanyId).show()
                } else {
                    var obj = auditPersonDataList[curAuditClickCompanyId]['depMent'][curAuditClickDepMentId]
                    auditPersonDataList[curAuditClickCompanyId]['depMent'][curAuditClickDepMentId] = obj ? obj : {
                        id: curAuditClickDepMentId,
                        depName: c.depName,
                        person: []
                    }
                    var arrData = auditPersonDataList[curAuditClickCompanyId]['depMent'][curAuditClickDepMentId]['person']
                    var str = ""
                    $.each(getData, function (i, val) {
                        if (val) {
                            var dis = allUserList.indexOf(val.id.toString()) == -1 ? "" : 'none;'
                            str += '<span class="overf_E auditPersonCheck allsort" style="display:' + dis + '"  index="' + val.id + '" >' + val.trueName + '</span>'
                        }
                    })
                    $.each(arrData, function (index, v) {
                        $.each(getData, function (i, val) { if (val && v.id == val.id) getData.splice(i, 1) })
                    })
                    $(".auditPersonList").html("").find(".checkBoxTrue").removeClass("checkBoxTrue")
                    $(".auditPersonList").append(str).attr("index", curAuditClickDepMentId).attr("name_company", curAuditClickCompanyId).show()
                }
            }
        })
    }
    //申请人全选
    $("body").on("click", '.checkAllPerson', function () {
        if ($(this).hasClass("checkBoxTrue")) {
            $(".applyPersonList").find(".applyPersonCheck").each(function (i, el) {
                if ($(el).isShow()) {
                    applyPersonDataList[curClickCompanyId]['depMent'][curClickDepMentId]['person'].push({
                        id: $(el).attr("index"),
                        name: $(el).html()
                    })
                    $(".allsort").each(function (index, ar) {
                        if ($(ar).attr('index') == $(el).attr("index")) {
                            $(ar).hide()
                        }
                    })
                    allUserList.push($(el).attr("index"))
                    applyUserList.push($(el).attr("index"))
                    $(el).hide()
                }
            })
            $(this).removeClass("checkBoxTrue").parents('.apply_checkAllPersonP').hide()
            creatSelectedContent_list('apply_SelectedContent_list')
        }
    })
    //申请人单选
    $("body").on("click", '.applyPersonCheck', function () {
        $(this).addClass("applyPersonCheckTrue").hide()
        applyPersonDataList[curClickCompanyId]['depMent'][curClickDepMentId]['person'].push({
            id: $(this).attr("index"),
            name: $(this).html()
        })
        var _that = this
        $(".allsort").each(function (i, el) {
            if ($(el).attr('index') == $(_that).attr("index")) {
                $(el).hide()
            }
        })
        applyUserList.push($(this).attr("index"))
        allUserList.push($(this).attr("index"))
        if ($(".applyPersonCheckTrue").length == $(".applyPersonCheck").length) {
            $(".checkAllPerson").parents('.apply_checkAllPersonP').hide()
        }
        creatSelectedContent_list('apply_SelectedContent_list')
    })
    //审核人单选
    $("body").on("click", '.auditPersonCheck', function () {
        $(this).hide()
        var _that = this;
        $(".allsort").each(function (index, el) {
            if ($(el).attr("index") == $(_that).attr("index")) {
                $(el).hide()
            }
        })
        allUserList.push($(this).attr("index"))
        auditUserList.push({
            companyId: auditPersonDataList[curAuditClickCompanyId].id,
            companyName: auditPersonDataList[curAuditClickCompanyId].companyName,
            depId: auditPersonDataList[curAuditClickCompanyId]['depMent'][curAuditClickDepMentId].id,
            depName: auditPersonDataList[curAuditClickCompanyId]['depMent'][curAuditClickDepMentId].depName,
            id: $(this).attr("index"),
            trueName: $(this).html()
        })
        creatSelectedContent_list('audit_SelectedContent_list', true)
    })
    //目前写死的 共三级 
    function creatSelectedContent_list(elobj, isAudit) {

        var str = ""
        $("." + elobj).html("")
        if (isAudit) {
            $.each(auditUserList, function (i, val) {
                if (i == 0) {
                    var sCl = 'dis'
                    var lCl = 'dds'
                    if (auditUserList.length == 1) {
                        var sCl = 'dis'
                        var lCl = 'dis'
                    }
                } else if (i == auditUserList.length - 1) {
                    var sCl = 'dds'
                    var lCl = 'dis'
                } else {
                    var sCl = ''
                    var lCl = ''
                }
                var dep = val.depName ? '——' + val.depName : ""
                str += '<p class="clearfix auditsel">' +
                    '<span class="audit_com_icon f_l">' +
                    '<span class="audit_last_com_icon ' + sCl + '" ></span>' +
                    '<span class="audit_first_com_icon ' + lCl + '" ></span>' +
                    '</span>' +
                    '<span class="sel_p f_l">' +
                    '<span class="sel_contnet overf_E">' + val.trueName + ' ( ' +
                    val.companyName +
                    dep
                    + ' ) </span>' +
                    '<span name="sel_company" data_comId="' + val.companyId + '" data_depId="' + val.depId + '" index="' + val.id + '" class="audit_com_cancel"></span>' +
                    '</span>' +
                    '</p>'
            })
        } else {
            var dataList = applyPersonDataList, newObj = {}, ose = false
            var sClass = 'com_cancel'
            // log(dataList)
            for (var k in dataList) {      //公司
                var str1 = ""
                str1 += '<div class="selected_company">' +
                    '<p>' +
                    '<span class="com_icon"></span><span class="sel_p"><span class="sel_contnet overf_E">' + dataList[k].companyName + '</span><span name="sel_company" index="' + dataList[k].id + '" class="' + sClass + '"></span></span>' +
                    '</p>'
                var depS = 0
                for (var dep in dataList[k]['depMent']) { //部门
                    if (dataList[k]['depMent'][dep].person.length) {
                        str1 += '<div class="selected_dep">' +
                            '<p>' +
                            '<span class="dep_icon"></span><span class="sel_p"><span class="sel_contnet overf_E">' + dataList[k]['depMent'][dep].depName + '</span><span name="sel_dep" index="' + dataList[k]['depMent'][dep].id + '" class="' + sClass + '"></span></span>' +
                            '</p>' +
                            '<div class="selected_person clearfix">'
                        $.each(dataList[k]['depMent'][dep].person, function (i, val) {
                            str1 += '<li class="f_l">' +
                                '<span class="sel_p"><span class="sel_contnet overf_E">' + val.name + '</span><span name="sel_person" index="' + val.id + '" class="' + sClass + '"></span></span>' +
                                '</li>'
                        })
                        str1 += '</div></div>'
                        depS = 1
                    }
                }
                depS ? str1 += '</div>' : str1 = ""
                str += str1
            }
        }
        $("." + elobj).append(str)
    }
    //申请人删除
    $("body").on("click", '.com_cancel', function () {
        var comId = $(this).parents('.selected_company').find('[name = sel_company]').attr("index")
        var depId = $(this).parents('.selected_dep').find('[name = sel_dep]').attr("index")
        var curId = $(this).attr("index")
        if ($(this).attr("name") == 'sel_person') {
            $.each(applyPersonDataList[comId]['depMent'][depId].person, function (i, val) {
                if (val) {
                    if (val.id == curId) applyPersonDataList[comId]['depMent'][depId].person.splice(i, 1)
                }
            })
            $(".allsort").each(function (index, el) {
                if ($(el).attr("index") == curId) {
                    $(el).show()
                }
            })
            allUserList.splice(allUserList.indexOf(curId), 1)
            applyUserList.splice(applyUserList.indexOf(curId), 1)
            creatSelectedContent_list('apply_SelectedContent_list')
            $(".applyCheck .applyPersonCheck").each(function (i, el) {
                if ($(el).attr("index") == curId) {
                    $(el).show()
                    if ($(".applyPersonList").find('.applyPersonCheck').length) {
                        $(".applyPersonList").prev('.apply_checkAllPersonP').show().find(".checkAllPerson").addClass("checkBox")
                    }
                }
            })
        } else if ($(this).attr("name") == 'sel_dep') {
            $.each(applyPersonDataList[comId]['depMent'][depId].person, function (i, val) {
                log(val)
                allUserList.splice(allUserList.indexOf(val.id + ""), 1)
                applyUserList.splice(applyUserList.indexOf(val.id + ""), 1)
                $(".allsort").each(function (index, el) {
                    if ($(el).attr("index") == val.id) {
                        $(el).show()
                        // allUserList.splice(allUserList.indexOf($(el).attr("index")), 1)
                        // applyUserList.splice(applyUserList.indexOf($(el).attr("index")), 1)
                    }
                })
            })
            applyPersonDataList[comId]['depMent'][depId].person = []
            creatSelectedContent_list('apply_SelectedContent_list')
            if ($(".applyPersonList").attr('index') == depId) {
                // $(".applyPersonList").find('.applyPersonCheck').show()
                if ($(".applyPersonList").find('.applyPersonCheck').length) {
                    $(".applyPersonList").prev('.apply_checkAllPersonP').show().find(".checkAllPerson").addClass("checkBox")
                }
            }
            // applyPersonDataList[comId]['depMent'][depId].person = []
        } else {
            var companyDep = applyPersonDataList[comId]['depMent']
            for (var k in companyDep) {
                $.each(companyDep[k]['person'], function (i, val) {
                    $(".allsort").each(function (index, el) {
                        if ($(el).attr("index") == val.id) {
                            $(el).show()

                        }
                    })
                    allUserList.splice(allUserList.indexOf(val.id + ""), 1)
                    applyUserList.splice(applyUserList.indexOf(val.id + ""), 1)
                })
                companyDep[k]['person'] = []
            }
            creatSelectedContent_list('apply_SelectedContent_list')
            if ($(".applyPersonList").attr('name_company') == curId) {
                if ($(".applyPersonList").find('.applyPersonCheck').length) {
                    $(".applyPersonList").prev('.apply_checkAllPersonP').show().find(".checkAllPerson").addClass("checkBox")
                }
            }
        }
    })
    //审核删除
    $("body").on("click", '.audit_com_cancel', function () {
        var curId = $(this).attr("index")
        $.each(auditUserList, function (i, val) {
            if (val) {
                if (val.id == curId) auditUserList.splice(i, 1)
            }
        })
        allUserList.splice(allUserList.indexOf(curId), 1)
        $(".allsort").each(function (index, el) {
            if ($(el).attr("index") == curId) {
                $(el).show()

            }
        })
        creatSelectedContent_list('audit_SelectedContent_list', true)
        $(".auditCheck .auditPersonCheck").each(function (i, el) {
            if ($(el).attr("index") == curId) {
                $(el).show()
            }
        })
    })
    //审核已选排序
    $("body").on('click', '.audit_com_icon', function (e) {
        var tar = e.target
        var curData = ""
        var curIdx = $(tar).parents('.auditsel').index()
        if ($(tar).hasClass("audit_first_com_icon")) {        //向下移动
            curData = auditUserList[curIdx]
            auditUserList[curIdx] = auditUserList[curIdx + 1]
            auditUserList[curIdx + 1] = curData
        } else {
            curData = auditUserList[curIdx]
            auditUserList[curIdx] = auditUserList[curIdx - 1]
            auditUserList[curIdx - 1] = curData
        }
        creatSelectedContent_list('audit_SelectedContent_list', true)
    })
    //提交
    $("body").on('click', '.postBtn', function () {
        if (!applyUserList.length) return $.popInfo("请选择申请人！")
        if (!auditUserList.length) return $.popInfo('请选择审核人！')
        var audit = []
        $.each(auditUserList, function (i, val) { audit.push(val.id) })
        $.popConfirm({
            'title': '',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/auditProcess/update',
                    data: {
                        processId: processId,                       //事项编码
                        apply: applyUserList.join(),               //申请人 //用户ID以逗号分隔
                        audit: audit.join()                        //审核人 //用户ID以逗号分隔，按照顺序给 
                    },
                    success: function (r) {
                        submitSuccess('编辑成功', goBack)
                    }
                })
            }
        })

    })
})


