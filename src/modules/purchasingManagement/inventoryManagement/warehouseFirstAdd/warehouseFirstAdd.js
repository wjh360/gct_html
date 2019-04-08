var companyId = storage('companyId')
var depId = ''//选中部门的id
$(function () {
    initData()
    function initData() {
        $http({
            url: '/gct-web/inventory/beforeAdd',
            data: {
                companyId: companyId
            },
            success: function (r) {
                if (!r.data.length) return false
                createTree(r.data, $("#dep_trees"), 'dep_tree', {
                    check: true,
                    onCheck: depOnCheck,
                    chkStyle: 'radio'
                })
            }
        })
    }
    //部门点击事件
    function depOnCheck(a, b, c, d) {
        $(".radio_false_part").removeClass("radio_false_part").addClass('radio_false_full')
        $(".radio_true_part").removeClass("radio_true_part").addClass('radio_false_full')
        if (c.checked) depId = c.id
    }
    //   点击提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    inventoryAdd()
                }
            }
        })
    })
})
var applyFalg = true;
var appilObj = {};
//校验
function applyVerify() {
    applyFalg = true;
    appilObj.storageName = $(".storageName").val();//名称
    appilObj.storageAddr = $(".storageAddr").val();//职责
    appilObj.depId = depId
    if (!$.checkReg(appilObj.storageName, 'noNull')) { applyFalg = false; $.popInfo(" 请填写库房名称"); return false }
    if (!$.checkReg(appilObj.storageAddr, 'noNull')) { applyFalg = false; $.popInfo(" 请填写库房地址"); return false }
    if (!depId) { applyFalg = false; $.popInfo(" 请填写库房地址"); return false }
}
function inventoryAdd() {
    $http({
        url: '/gct-web/inventory/doAdd',
        data: appilObj,
        success: function (r) {
            submitSuccess('', function () {
                goBack()
            })
        }
    })
}