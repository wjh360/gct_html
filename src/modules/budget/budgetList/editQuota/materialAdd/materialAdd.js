

$(function () {

    // 获取 单位 list
    var meterageIdList = []
    $http({
        url: "/gct-web/tableThreeNail/equipmentAddEcho",
        success: function (r) {
            meterageIdList = r.data || []
            getDownSelect('measuringUnit1', '请选择', meterageIdList, 'id', 'name')
        }
    })





    //  点击添加费用append内容
    $("body").on("click", '.addMaterail', function () {
        var str_con = "";
        var ind = $(".materailSum").length + 1;
        if (ind == 11) return false;
        str_con += '<div class="commonCon materailSum">\n' +
            '                <div class="inforHeader clearfix">\n' +
            '                    <div class="verHang f_l"></div>\n' +
            '                    <div class="headerText f_l">材料<span class="reimIndex">' + ind + '</span></div>\n' +
            '                    <div class="pic_delete_page f_r"><img src="./../../../../img/money_delete.png" style="width: 40px;height: 40px" alt=""></div>\n' +
            '                </div>\n' +
            '                <!--内容区-->\n' +
            '                <div class="Role-noticeCon">\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>材料名称：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="允许输入100个字，允许重复" class="matterName" type="text" maxlength="100" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>材料类型：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <div id="materialType' + ind + '" class="downSelect f_l clearfix materialType" style="width:170px;margin: 5px;">\n' +
            '                                <span class="materialType' + ind + 'List downSet overf_Ec type" index="" fl_val="请选择"><a\n' +
            '                                        href="javascript:void(0);" style="color:#666;">请选择</a></span>\n' +
            '                                <ul>\n' +
            '                                    <li class="overf_E" index="" title="请选择">请选择</li>\n' +
            '                                    <li class="overf_E" index="1" title="光缆">光缆</li>\n' +
            '                                    <li class="overf_E" index="2" title="电缆">电缆</li>\n' +
            '                                    <li class="overf_E" index="3" title="塑料及塑料制品">塑料及塑料制品</li>\n' +
            '                                    <li class="overf_E" index="4" title="木材及木制品">木材及木制品</li>\n' +
            '                                    <li class="overf_E" index="5" title="水泥及水泥构件">水泥及水泥构件</li>\n' +
            '                                    <li class="overf_E" index="6" title="其他">其他</li>\n' +
            '                                </ul>\n' +
            '                            </div>\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top">规格程式：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="" class="specFormat" type="text" maxlength="100" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>单位：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <div id="measuringUnit' + ind + '" class="downSelect measuringUnit" style="margin-top: 3px;width: 150px;">\n' +
            '                                </div>\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>单价：</span>\n' +
            '                        <span class="nameCon ">\n' +
            '                               <input placeholder="" class="money price" type="text" maxlength="13" style="width: 350px;"> 元\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>数量：</span>\n' +
            '                        <span class="nameCon ">\n' +
            '                               <input placeholder="" class="money num" type="text" maxlength="13" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top">备注：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                                <input placeholder="允许输入20个字" class="remark" type="text" maxlength="20" style="width: 350px;">\n' +
            '                            </span>\n' +
            '                    </div>\n' +
            '\n' +
            '                </div>\n' +
            '            </div>'
        $(".reimburseMent").append(str_con)
        getDownSelect("measuringUnit" + ind, '请选择', meterageIdList, 'id', 'name')
        if (ind == 10) $(".addMaterail").hide()
        // if (!buyMoneyList) return false;
        // getDownSelect("type" + ind, '请选择费用类型', buyMoneyList, 'id', 'costName')//消费类型

    })

    //    点击删除
    $("body").on("click", '.pic_delete_page', function () {
        $(this).parents(".materailSum").remove()
        var ind = $(".materailSum").length;
        if (ind < 10) $(".addMaterail").show();

    })


    $("body").on("click", ".postBtn", function () {
        var postObj = {}
        var strMaterial = []
        var isError = 0
        $(".reimburseMent").children().each(function (index, eleVal) {
            var elObj = {}
            elObj.name = $(eleVal).find('.matterName').val()
            if (!elObj.name) {
                isError = 1
                $.popInfo("请填写【材料" + $(eleVal).find('.reimIndex').text() + "】材料名称")
            }

            elObj.type = $(eleVal).find('.type').attr('index')
            if (!elObj.type) {
                isError = 1
                $.popInfo("请选择【材料" + $(eleVal).find('.reimIndex').text() + "】材料类型")
            }
            elObj.specFormat = $(eleVal).find('.specFormat').val()
            // log($(eleVal).find('.measuringUnit').find('span'))
            elObj.meterageId = $(eleVal).find('.measuringUnit').find('span').attr('index')
            if (!elObj.meterageId) {
                isError = 1
                $.popInfo("请选择【材料" + $(eleVal).find('.reimIndex').text() + "】单位")
            }

            elObj.price = $(eleVal).find('.price').val()
            if (!elObj.price) {
                isError = 1
                $.popInfo("请填写【材料" + $(eleVal).find('.reimIndex').text() + "】单价")
            }

            elObj.num = $(eleVal).find('.num').val()
            if (!elObj.num) {
                isError = 1
                $.popInfo("请填写【材料" + $(eleVal).find('.reimIndex').text() + "】数量")
            }

            elObj.remark = $(eleVal).find('.remark').val()
            strMaterial.push(elObj)
        })
        if (isError) return false

        postObj.budgetId = storage('budgetId')
        postObj.type = storage('addMatterType')
        postObj.strMaterial = JSON.stringify(strMaterial)


        $.popConfirm({
            'title': '',
            'content': '确定提交当前操作内容吗？',
            'confirm': function () {
                $http({
                    url: "/gct-web/tableThreeNail/equipmentAdd",
                    data: postObj,
                    success: function (r) {
                        // log(r)
                        submitSuccess('提交成功', function () {
                            goBack()
                        })
                    }
                })
            }
        })


    })

})