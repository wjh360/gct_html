var appilObj = {};//提交数据
var applyFalg = true;
var auditItem = 2002;
var projectId = storage("projectId")
$(function () {
    //    当项目状态为6：完工未过审调用
    projectInfoinfo()
    $("body").on("click", '.postBtn', function () {
        var thisHtm = $(this).html()
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // ：1-提交；2-提交审核
                if (thisHtm == '提交') getDataFrom(1)
                else getDataFrom(2)
                if (applyFalg) {
                    applyDate()
                }
            }
        })
    })
})
//项目详情
function projectInfoinfo() {
    $http({
        url: '/gct-web/project/info',
        data: { projectId: projectId },
        success: function (r) {
            if (r.data.project.projectStatus == 6) {
                noPassRemark()
                $("#completeTextarea").val(r.data.apply.applyRemark)
            }
        }
    })
}
//审核意见
function noPassRemark() {
    $http({
        url: ' /gct-web/audit/noPassRemark',
        data: {
            formId: projectId,
            auditItem: auditItem
        },
        success: function (r) {
            if (r.data.auditName) {
                $(".auditName").html(r.data.auditName)
                $(".auditTime").html(initDate(r.data.auditTime, 's'))
                $(".auditRemark").html(r.data.auditRemark)
                $(".auditSuggest").show()
            }
        }
    })
}
//校验
function getDataFrom(flag) {
    applyFalg = true;
    appilObj.icon = flag
    appilObj.projectId = projectId
    appilObj.auditOpinion = $("#completeTextarea").val();//名称
    if (!$.checkReg(appilObj.auditOpinion, 'noNull')) { applyFalg = false; $.popInfo("请填写完工说明"); return false }
}
//提交数据
function applyDate() {
    $http({
        url: '/gct-web/project/completeApply',
        data: appilObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}
