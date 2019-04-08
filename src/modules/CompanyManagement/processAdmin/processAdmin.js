

var colorArr = ['#acd598', '#7ecef4', '#f8b551']  //区分颜色
var listAuditItem = {};  //下拉 集合
var baseCode = 0;   //防止重复
var auditItem = ""  //事项编码
$(function () {


    getList()
    function getList() {
        baseCode++;
        var current = arguments[0] ? arguments[0] : 1
        var limit = 5
        $http({
            url: '/gct-web/auditProcess/list',
            data: {
                auditItem: auditItem,
                limit: limit,
                current: current
            },
            success: function (r) {

                if (!r.dataOthers) return false
                $(".processContent_list").html("")
                $.each(r.dataOthers, function (i, val) {
                    listAuditItem[val.id] = val.list
                })
                if (baseCode == 1) {
                    getDownSelect("matterType", r.dataOthers[0].moduleName, r.dataOthers, "id", "moduleName")
                    $(".matterType").attr('index', r.dataOthers[0].id)
                    getDownSelect("matterCate", r.dataOthers[0].list[0].itemName, r.dataOthers[0].list, "itemCode", "itemName")
                    $(".matterCate").attr('index', r.dataOthers[0].list[0].itemCode)
                    auditItem = r.dataOthers[0].list[0].itemCode
                }

                getPage('processContent_listPage', Math.ceil(r.total / limit), current, getList) //分页


                var list = r.data // 流程列表
                var str = ""
                if (!list) return false
                //isEdit：1  //0可以修改 1不可以修改
                //isDel：1  //0可以删除 1不可以删除
                $.each(list, function (i, val) {

                    var auditTxt = Reprocessing(val.audit || "", colorArr[i % 3])  //审核人 //区别颜色
                    var curProcessIdx = current * limit - (limit - 1) + i
                    var isEdit = !val.isEdit && curPowerObj['Edit-process-operation'] ?  '<span class="editProcess f_l" index="' + val.id + '"><span class="edit_process"></span> </span>':""
                    var isDel = !val.isDel && curPowerObj['Delete-process-operation'] ?  '<span class="cancelProcess f_l" index="' + val.id + '"><span class="cancel_process"></span> </span>':""
                    
                    
                    
                    val.apply = val.apply ? val.apply.replace(/,/g, "") : ""  //申请人
                    val.apply = val.apply.replace(/、$/ig,"")
                    str += '<li class="clearfix" index="' + val.id + '">' +
                        '<div class="listOne f_l" style="background:' + colorArr[i % 3] + ';"> 流程' + curProcessIdx + ' </div>' +
                        '<div class="listTwo f_l">' +
                        '<div class="listTwo_top clearfix">' +
                        '<span class="ns_Id f_l"> 申请人 </span>' +
                        '<span class="nd_sp_s nd_sp f_l overf_E">' + val.apply + '</span>' +
                        '</div>' +
                        '<div class="listTwo_bottom">' +
                        '<span class="ns_Id f_l"> 审核人 </span>' +
                        '<span class="nd_sp_s1 nd_sp f_l overf_Ec">' +
                        auditTxt +
                        '</span>' +
                        '</div>' +
                        '</div>' +
                        '<div class="listFour f_l clearfix">' +
                        isEdit +
                        isDel +
                        '</div>' +
                        '</li>'
                })
                $(".processContent_list").append(str)

                $(".processContent_list li").each(function (i, el) {
                    var hei = parseFloat($(el).find('.nd_sp_s').css('height')) + parseFloat($(el).find('.nd_sp_s1').css('height'))
                    hei = hei >= 83 ? hei : 83
                    $(el).css('height', hei).css("line-height", hei + 'px')
                })
            }
        })
    }


    function Reprocessing(str, cor) {
        var arr = str.split(",")
        $.each(arr, function (i, v) {
            arr[i] = '<span>' + v + '</span>'
        })
        var str = arr.join('<span style="color:' + cor + ';"> —— </span>')

        return str

    }
    //添加流程
    $("body").on("click", '.addProcess', function () {
        if (!auditItem) return false
        storage("auditItem", auditItem, 'addprocess') //事项分类  添加流程页面
        goNewPage("./processAdmin/addprocess.html")
    })

    // 第一个下拉 选择
    $("body").on("click", '#matterType li', function () {
        var idx = $(this).attr("index")

        getDownSelect("matterCate", listAuditItem[idx][0].itemName, listAuditItem[idx], "itemCode", "itemName")
        $(".matterCate").attr('index', listAuditItem[idx][0].itemCode)
        auditItem = listAuditItem[idx][0].itemCode
        getList()
    })

    // 第二个下拉 选择
    $("body").on("click", '#matterCate li', function () {
        auditItem = $(this).attr("index")
        getList()
    })

    //删除流程
    $('body').on('click', '.cancelProcess', function () {
        var processId = $(this).attr("index")
        $.popConfirm({
            content: '确定删除该流程吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/auditProcess/del',
                    data: {
                        id: processId
                    },
                    success: function (r) {
                        $.popInfo(r.data)
                        getList()
                    }
                })
            }
        })
    });

    //编辑流程
    $('body').on('click', '.editProcess', function () {
        var processId = $(this).attr("index")
        storage("processId", processId, 'editprocess')   //流程id  编辑流程页面
        storage("auditItem", auditItem, 'editprocess') //事项分类  编辑流程页面
        goNewPage("./processAdmin/editprocess.html")
    });


    //查看详情
    $('body').on('click', '.processContent_list li', function (r) {
        var tar = r.target
        if ($(tar).hasClass('cancelProcess') || $(tar).hasClass("editProcess") || $(tar).parents('.cancelProcess').length || $(tar).parents(".editProcess").length) return false
        var processId = $(this).attr("index")
        storage("processId", processId, 'processDetail')   //流程id  流程详情页面
        goNewPage("./processAdmin/processDetail.html")
    });

})