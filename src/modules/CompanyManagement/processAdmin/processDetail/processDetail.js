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
$(function () {
    //请求公司 结构
    $http({
        url: '/gct-web/auditProcess/updateEcho',
        data: {
            processId: processId
        },
        success: function (r) {

            //已选申请人 回显
            initData(r.data.listApply, applyPersonDataList, applyUserList)
            creatSelectedContent_list('apply_SelectedContent_list')
            //已选审核人 回显
            initData(r.data.listAudit, auditPersonDataList)
            auditUserList = r.data.listAudit
            creatSelectedContent_list('audit_SelectedContent_list', true)
        }
    })
    //序列化 数据
    function initData(arr, obj, userList) {
        $.each(arr, function (index, value) {
            if (userList) userList.push(value.userId.toString())
            var companyId = value.companyId
            var depId = value.depId
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
        log(obj)
        return obj
    }

    //目前写死的 共三级 
    function creatSelectedContent_list(elobj, isAudit) {
        var str = ""
        $("." + elobj).html("")
        if (isAudit) {
            $.each(auditUserList, function (i, val) {
                var dep = val.depName ? '——' + val.depName : ""
                str += '<p class="clearfix auditsel">' +
                    '<span class="sel_p f_l">' +
                    '<span class="sel_contnet overf_E">' + val.trueName + ' ( ' +
                    val.companyName +
                    dep
                    + ' ) </span>' +
                    '</p>'
            })
        } else {
            var dataList = applyPersonDataList, newObj = {}, ose = false
            // for (var k in dataList) {
            //     for (var dep in dataList[k]['depMent']) {
            //         if (dataList[k]['depMent'][dep].person && dataList[k]['depMent'][dep].person.length) {
            //             newObj[k] = {
            //                 companyName: dataList[k].companyName,
            //                 id: dataList[k].id,
            //                 depMent: {}
            //             }
            //             newObj[k]['depMent'][dep] = dataList[k]['depMent'][dep]
            //             ose = true
            //         }
            //     }
            // }
            // if (!ose) return false
            // dataList = newObj
            // applyPersonDataList = newObj
            // var sClass = 'com_cancel'
            for (var k in dataList) {      //公司
                str += '<div class="selected_company">' +
                    '<p>' +
                    '<span class="com_icon"></span><span class="sel_p"><span class="sel_contnet overf_E">' + dataList[k].companyName + '</span></span>' +
                    '</p>'
                for (var dep in dataList[k]['depMent']) { //部门
                    if (dataList[k]['depMent'][dep].person.length) {
                        str += '<div class="selected_dep">' +
                            '<p>' +
                            '<span class="dep_icon"></span><span class="sel_p"><span class="sel_contnet overf_E">' + dataList[k]['depMent'][dep].depName + '</span></span>' +
                            '</p>' +
                            '<div class="selected_person clearfix">'
                        $.each(dataList[k]['depMent'][dep].person, function (i, val) {
                            str += '<li class="f_l">' +
                                '<span class="sel_p"><span class="sel_contnet overf_E">' + val.name + '</span></span>' +
                                '</li>'
                        })
                        str += '</div></div>'
                    }
                }
                str += '</div>'
            }
        }
        $("." + elobj).append(str)
    }
})