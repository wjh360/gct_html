var budgetId = storage("budgetId")
$(function () {
    applyObj.id = budgetId
    getBudGetProjectSaveEcho()
    //点击建设单位下拉,如果点击的是集团下拉，第三个参数传0，否传1
    $("body").on("click", '.constructionUnit li', function () {
        //判断是否是第一个
        var comId = $(this).attr("index")

        var clickIndex = $(this).parents(".constructionUnit").attr("id").slice(15)
        //截取最后的个数，个数从0开始追加
        $(".constructionUnit").each(function (k, v) {
            if (k > clickIndex) {
                $(v).remove()
            }
        })
        if (!comId) return
        var el = 'projectOperator' + (Number(clickIndex) + 1);
        companyShow(comId, el, clickIndex)
    })

    $("body").on("click", '.saveBtn', function () {
        // 1.保存  2.提交
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // 1-保存；2-提交
                getDataFrom(1)
                if (applyFalg) {
                    doBudget(submitSuccess('', function () {
                        goBack()
                    }))
                }
            }
        })
    })
    $("body").on("click", '.postBtn', function () {
        // 1.保存  2.提交
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // 1-保存；2-提交
                getDataFrom(2)
                if (applyFalg) {
                    doBudget(applyFn)
                }
            }
        })
    })

    function applyFn() {
        $.popConfirm({
            content: '提交成功，是否继续编辑概预算表信息?',
            confirm: function () {
                // 1-保存；2-提交
                storage("budgetId", budgetId, 'editQuota')
                goNewPage("./editQuota.html")
            },
            error: function () {
                goBack()
            }
        })
    }
})

function getBudGetProjectSaveEcho() {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectSaveEcho',
        success: function (r) {
            //    项目类型
            if (!r.data) return
            getCompListAll = r.data.companyList
            //建设单位第一个集团数组
            companyTypeList = r.data.companyTypeList ? r.data.companyTypeList : []


            initData(r.data)
        }
    })
}

//详情数据回显
function initData(budgetObj) {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectInfo',
        data: {id: budgetId},
        success: function (r) {
            if (!r.data) return
            dataShow(r.data, budgetObj)
        }
    })
}

var companyTypeList;

function dataShow(data, budgetObj) {
    $(".projectName").val(data.name);//项目名称
    $(".projectCode").val(data.no);//项目编号
    $(".projectSingle").val(data.single); //单项工程名称
    getCodeEcho('listProCtiyCounty', data.province, data.city, data.county)
    $(".projectDistance").val(data.distance);//施工距离
    $(".saleRate").val(data.saleRate);//施工消项税率
    $(".nailRate").val(data.nailRate);//甲供材料采购税率
    $(".deviceRate").val(data.deviceRate);//设备采购税率
    $(".discount").val(data.discount);//折扣系数
    $(".orderName").val(data.orderName);//订单名称
    $(".orderNo").val(data.orderNo);//订单编号
    $(".orderAmount").val(data.orderAmount);//订单金额
    //施工环境
    if (data.environment == 1) $("#environment").removeClass("checkBox").addClass("checkBoxTrue")
    if (data.isCity == 1) $("#isCity").removeClass("checkBox").addClass("checkBoxTrue")
    $(".supervisor").val(data.supervisor);//监理单位
    $(".projectPerson").val(data.person);//工程负责人
    //项目类型
    var projectTypeList = budgetObj.projectTypeList ? budgetObj.projectTypeList : []
    getDownSelect('projectStatus', '请选择', projectTypeList, 'id', 'typeName')
    if (data.projectType && data.projectTypeName) $(".projectStatus").attr("index", data.projectType).html(data.projectTypeName)


//    特殊地区
    if (data.specialArea) $(".specialArea").attr("index", data.specialArea).html(specialAreaArr[data.specialArea - 1])
//    数据递归处理

//  根据Id（放入id为Id的放入数组），获取id获取他的子集（即fatherId为Id的数组，放入数组）

    digetCompList(data.unitId)
//  数组处理完


    $(downComList).each(function (k, v) {
        if (!v.length) return
        var el = 'projectOperator' + (k + 1)
        $(".bulidCompanyList").append('<div id="' + el + '" class="downSelect f_l clearfix constructionUnit" style="width:250px;margin: 5px;"></div>')
        v.unshift({
            companyName: "请选择",
            id: ""
        })
        getDownSelect(el, '请选择', v, 'id', 'companyName')
        if (diGetIdArr[k + 1]) $("." + el).attr("index", diGetIdArr[k + 1].id).html(diGetIdArr[k+1].companyName)

    })
//    第一个数据
    $(companyTypeList).each(function (k, v) {
        $(getCompListAll).each(function (i, item) {
            if (item.fatherId == 0 && item.typeId == v.id) {
                v.Tid = item.id;
                return false;
            }
        })
    })

    getDownSelect('projectOperator0', '请选择', companyTypeList, 'Tid', 'typeName')
    $(companyTypeList).each(function (k, v) {
        if (diGetIdArr[0].typeId == v.id) {
            $(".projectOperator0").attr("index", v.Tid).html(v.typeName)
        }
    })

}


//数据递归处理
var diGetIdArr = [];//存放选中的数据[用于回显选中]
var downComList = [];//存放二维数组
function digetCompList(cId) {
    if (cId == 0) {
        return
    } else {
        $(getCompListAll).each(function (k, v) {
            if (v.id == cId) {
                diGetIdArr.unshift(v)
                var diGetIdArrPne = []
                $(getCompListAll).each(function (i, item) {
                    if (v.id == item.fatherId) {
                        diGetIdArrPne.push(item)
                    }
                })
                downComList.unshift(diGetIdArrPne)
                return digetCompList(v.fatherId)
            }
        })
    }


}


var specialAreaArr = ['2000米以上海拔地区', '3000米以上海拔地区', '4000米以上海拔地区', '原始森林（室外）地带', '沼泽地区', '非固定沙漠地带', '化工地区和工业地区', '山区无人值守站地区', '否']

//点击第一列请求
function companyShow(id, el, fatherID) {
//    如果父级为0的话，是第一个点击,这是通过id与所有的typeId比较，fatherId与0一样
//    如果父级不为0的话，id与farherid一一样的
    var comListArr = []
    $(getCompListAll).each(function (k, v) {

        if (id == v.fatherId) {
            comListArr.push(v)
        }

    })
    if (!comListArr.length) return
    comListArr.unshift({
        companyName: "请选择",
        id: ""
    })

    $(".bulidCompanyList").append('<div id="' + el + '" class="downSelect f_l clearfix constructionUnit" style="width:250px;margin: 5px;"></div>')
    getDownSelect(el, '请选择', comListArr, 'id', 'companyName')
}

var getCompListAll = [];//从第二列起的所有的建设单位

//提交
function doBudget(fn) {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectUpdate',
        data: applyObj,
        success: function (r) {
            fn()
        }
    })
}










