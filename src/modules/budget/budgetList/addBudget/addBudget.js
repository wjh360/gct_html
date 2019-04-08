
$(function () {
    getBudGetProjectSaveEcho()
    //点击建设单位下拉,如果点击的是集团下拉，第三个参数传0，否传1
    $("body").on("click", '.constructionUnit li', function () {
        //判断是否是第一个
        var comId =$(this).attr("index")

        var clickIndex = $(this).parents(".constructionUnit").attr("id").slice(15)
        //截取最后的个数，个数从0开始追加
        $(".constructionUnit").each(function (k, v) {
                if (k > clickIndex) {
                    $(v).remove()
            }
        })
        if (!comId) return
        var el='projectOperator'+(Number(clickIndex)+1);
        companyShow(comId,el,clickIndex)
    })

    $("body").on("click", '.saveBtn', function () {
        // 1.保存  2.提交
        $.popConfirm({
            content: '确定提交当前操作的内容吗?',
            confirm: function () {
                // 1-保存；2-提交
                getDataFrom(1)
                if (applyFalg) {
                    doBudget(submitSuccess('',function () {
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
})

function applyFn(data) {
    $.popConfirm({
        content: '提交成功，是否继续编辑概预算表信息?',
        confirm: function () {
            // 1-保存；2-提交
            if(!data) return false
            storage("budgetId",data, 'editQuota')
            goNewPage("./editQuota.html")
        },
        error:function () {
            goBack()
        }
    })
}

function getBudGetProjectSaveEcho() {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectSaveEcho',
        success: function (r) {
        //    项目类型
            var projectTypeList = r.data.projectTypeList?r.data.projectTypeList:[]
            getDownSelect('projectStatus','请选择',projectTypeList,'id','typeName')
        //第一个建设单位的
            var companyTypeList = r.data.companyTypeList?r.data.companyTypeList:[]

            if(companyTypeList.length){
                getCompListAll=r.data.companyList
                $(companyTypeList).each(function (k,v) {
                    $(getCompListAll).each(function (i,item) {
                        if(item.fatherId==0&&item.typeId==v.id){
                            v.Tid=item.id;
                            return false;
                        }
                    })
                })
                getDownSelect('projectOperator0','请选择',companyTypeList,'Tid','typeName')
                $(".projectOperator0").attr("index",companyTypeList[0].Tid).html(companyTypeList[0].typeName)
                companyShow(companyTypeList[0].Tid,'projectOperator1',0)
            }

        }
    })
}

//点击第一列请求
function companyShow(id,el,fatherID) {
    log(id)
//    id===当前选中的Id
//    如果父级为0的话，是第一个点击,这是通过id与所有的typeId比较，fatherId与0一样
//    如果父级不为0的话，id与farherid一一样的
    var comListArr=[]
    $(getCompListAll).each(function (k,v) {
            if(id==v.fatherId){
                comListArr.push(v)
            }

    })
    if(!comListArr.length) return
    comListArr.unshift({
        companyName: "请选择",
        id: ""
    })
    $(".bulidCompanyList").append('<div id="'+el+'" class="downSelect f_l clearfix constructionUnit" style="width:250px;margin: 5px;"></div>')
    getDownSelect(el,'请选择',comListArr,'id','companyName')
}
var  getCompListAll=[];//从第二列起的所有的建设单位

//提交
function doBudget(fn) {
    $http({
        url: '/gct-web/budgetProject/getBudGetProjectSave',
        data: applyObj,
        success: function (r) {
            fn(r.data)
        }
    })
}


