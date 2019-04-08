$(function () {
    var postMsg = {
        name: "货物或服务名称",
        adress: "外出经营地点",
        amountS: "金额",
        start: "合同有效期",
        end: "合同有效期"
    }
    //生成新的 货物或服务
    createSer()
    $('body').on('click', '.addSer', function () {
        createSer()
    })
    var proCtiyCountyLen = 1  //项目地区数量
    $("body").on("click", '.addCounty', function () {
        proCtiyCountyLen++;
        if (proCtiyCountyLen > 20) {
            proCtiyCountyLen = 20
            return $.popInfo("最多允许添加20个外出经营地址")
        }
        var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
            '<span class="nameId f_l" style="width:120px;height:34px;"></span>' +
            '<span class="f_l">' +
            '<div id="biddingCounty' + proCtiyCountyLen + '" class="proCtiyCounty"></div>' +
            '</span>' +
            '<span class="delProCity"></span>'
        '</div>'
        $(".addcountyMore").append(str)
        creatCityDiv('biddingCounty' + proCtiyCountyLen)
    })
    $('body').on('click', '.delProCity', function () {
        var idx = parseInt($(this).parents(".RoleDiv").attr("index"))
        $(this).parents(".RoleDiv").remove()
        for (var i = idx + 1; i <= proCtiyCountyLen; i++) {
            $("#biddingCounty" + i).attr("id", "biddingCounty" + (i - 1)).parents(".RoleDiv").attr("index", i - 1)
        }
        proCtiyCountyLen--
    })
    $('body').on('click', '.postBtn', function () {
        var postObj = {}
        var proCtiyCountyArr = []
        for (var i = 1; i <= proCtiyCountyLen; i++) {
            var eleData = getCodeSub('biddingCounty' + i)
            if (eleData['county']) proCtiyCountyArr.push(eleData)
            // else return $.popInfo("请完整选择外出经营地址")
        }
        postObj.outRegionJson = JSON.stringify(proCtiyCountyArr)

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
        postObj.outGoodsJson = JSON.stringify(arr)

        $.popConfirm({
            'title': '',
            'content': '确定提交吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/external/getExternalInsert',
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
        '<input placeholder="" class="name" type="text" maxlength="100" style="width: 493px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="width: 120px;"><i>*</i>外出经营地点：</span>' +
        '<span class="nameCon ">' +
        '<input placeholder="" class="adress" type="text" maxlength="100" style="width: 493px;">' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv" style="margin-bottom: 0;">' +
        '<span class="nameId" style="width: 120px;"><i>*</i>合同有效期：</span>' +
        '<span class="nameCon">' +
        '<div class="jeinpbox f_l" style="width: 230px">' +
        '<input type="text" class="jeinput start" id="start'+ serLen +'" placeholder="" />' +
        '<span class="jeinput_icons"></span>' +
        '</div>' +
        '<span class="f_l" style="margin-left:10px;margin-right:10px;">至</span>' +
        '<div class="jeinpbox f_l" style="width: 230px">' +
        '<input type="text" class="jeinput end" id="end'+ serLen +'" placeholder="" />' +
        '<span class="jeinput_icons"></span>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '<div class="RoleDiv">' +
        '<span class="nameId" style="vertical-align:top;width: 120px;"><i>*</i>金额：</span>' +
        '<span class="nameCon" style="width: 400px;">' +
        '<input placeholder="" class="amountS money" type="text" maxlength="13" style="width: 300px;">元' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $(".serList").append(str)
}