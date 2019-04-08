$(function () {
    var postMsg = {
        name: "货物或服务名称",
        num: "数量",
        amount: "金额",
        matterSpec: "规格",
        matterUnit: "单位"
    }
    var postObjMsg = {
        name: '请填写付款方名称',
        idNumber: '请填写纳税人识别号',
        tel: '请填写地址、电话',
        account: '请填写开户行及账号'
    }
    //生成新的 货物或服务
    createSer()
    $('body').on('click', '.addSer', function () {
        createSer()
    })
    $('body').on('click', '.postBtn', function () {
        var postObj = {
            type: $('[name  = invoice]:checked').attr("index")
        }
        for (var k in postObjMsg) {
            postObj[k] = k == 'name' ? $(".paymentName").val() : $("." + k).val()
            if (!postObj[k]) return $.popInfo('请填写' + postObjMsg[k])
        }
        postObj.name = postObj.name
        var arr = []
        for (var i = 1; i <= serLen; i++) {
            var ele = $('.reimburseMent' + i)
            var obj = {}
            for (var k in postMsg) {
                obj[k] = ele.find('.' + k).val()
                if (!obj[k]) return $.popInfo('请填写[ 货物或服务' + i + ' ]' + postMsg[k])
            }
            arr.push(obj)
        }
        postObj.invoiceJson = JSON.stringify(arr)
        $.popConfirm({
            'title': '',
            'content': '确定提交吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/invoice/getInvoiceInsert',
                    data: postObj,
                    success: function (r) {
                        submitSuccess('提交成功', function () {
                            goBack()
                        })
                    }
                })
            }
        })
    })
    $('body').on('click', '.delSer', function () {
        var idx = parseInt($(this).parents(".reimburseMent").attr("index"))
        $(this).parents(".reimburseMent").remove()
        for (var i = idx + 1; i <= serLen; i++) {
            $(".reimburseMent" + i).removeClass("reimburseMent" + i)
                .addClass("reimburseMent" + (i - 1))
                .attr("index", i - 1)
                .find(".reimIndex").html(i - 1)
        }
        serLen--
    })
})
var serLen = 0  //服务下标
function createSer() {
    serLen = serLen + 1
    if (serLen > 20) {
        serLen = 20
        return $.popInfo("最多允许添加20个货物或服务")
    }
    var str = '<div class="reimburseMent reimburseMent' + serLen + '" index="' + serLen + '">' +
        '<div class="commonCon ">' +
        '<div class="inforHeader clearfix">' +
        '<div class="verHang f_l"></div>' +
        '<div class="headerText f_l">货物或服务<span class="reimIndex">' + serLen + '</span></div>' +
        '<span class="' + (serLen > 1 ? 'delSer' : "") + '"> </span></div>' +
        '<div class="Role-noticeCon">' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="width: 120px;"><i>*</i>货物或服务名称：</span>' +
        '<span class="nameCon ">' +
        '<input placeholder="" class="name" type="text" maxlength="100" style="width: 550px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="width: 120px;"><i>*</i>规格：</span>' +
        '<span class="nameCon ">' +
        '<input placeholder="" class="matterSpec" type="text" maxlength="100" style="width: 550px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;"><i>*</i>单位：</span>' +
        '<span class="nameCon"style="width: 120px;">' +
        '<input placeholder="" class="matterUnit" type="text" maxlength="13" style="width: 300px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;"><i>*</i>数量：</span>' +
        '<span class="nameCon"style="width: 120px;">' +
        '<input placeholder="" class="num money" type="text" maxlength="13" style="width: 300px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;"><i>*</i>金额：</span>' +
        '<span class="nameCon"style="width: 400px;">' +
        '<input placeholder="" class="amount money" type="text" maxlength="13" style="width: 300px;">元' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".serList").append(str)
}