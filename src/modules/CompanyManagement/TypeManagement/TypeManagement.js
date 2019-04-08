$(function () {
    // 初始化表格
    var col = [{
        field: 'costName',
        title: '类型名称',
        "class": "roleTr",
        width: '250'

    }, {
        field: 'costAbbr',
        title: '类型缩写',
        width: '150'
    }, {
        field: 'costType',
        title: '类型属性',
        width: '100',
        formatter: function (a) {
            if (a == 1) {
                return "直接费用"
            } else {
                return "间接费用"
            }
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        title: '操作',
        width: '100',
        'class': 'caozuo',
        formatter: function (a, b) {
            // log(b)
            return '<span data_power="Edit-cost-type-operation" class = "editcostType m_col">编辑</span><span data_power="Delete-cost-type-operation" class = "deletecostType m_red">删除</span>'
        }
    }]
    //初始化 费用类型列表
    //    id:1  
    //    costName：“类型名称”
    //    costAbbr“缩写”
    //   costType:1      //费用类型 1直接成本 2间接成本
    //    createTime:创建时间
    //    trueName：“创建人’
    initcostList()
    function initcostList() {
        $http({
            url: '/gct-web/type/costPage',
            success: function (r) {
                initTable("typeListTable", r.data, col, {
                    total: r.total,
                })
            },
        })
    }
    //添加类型
    $('body').on('click', '.addcostType', function () {

        $.popConfirm({
            'title': '添加类型',
            'content': '<div class="Role-noticeCon">' +
                '<div class="RoleDiv"style="margin-bottom: 5px">' +
                '<span class="nameId">类型名称：</span>' +
                '<span class="nameCon clearfix">' +
                '<input  class="costName"maxlength="20" type="text"style="width: 300px;">' +
                '</span>' +
                ' </div>' +
                ' <div class="RoleDiv"style="margin-bottom: 5px">' +
                '<span class="nameId">类型缩写：</span>' +
                '<span class="nameCon"><input  class="costAbbr" type="text" style="width: 300px;"  maxlength="20" ></span>' +
                '</div>' +
                '<div class="RoleDiv"style="margin-bottom: 5px">' +
                ' <span class="nameId">类型属性：</span> ' +
                '<span class="nameCon"> <span><input class="costType f_l zhijie" type="radio" name="attr" index="1" value="直接费用">' +
                '<span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">直接费用</span>' +
                '<input class="costType jianjie f_l" type="radio" name="attr" index="2" class="f_l" style="margin-left: 20px;" value="间接费用">' +
                ' <span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">间接费用</span></span></span></div></div>',
            confirm: function () {
                var costName = $(".costName").val()
                var costAbbr = $(".costAbbr").val()
                var costType = $("input[name='attr']:checked").attr('index')
                var a = /[^a-zA-Z]/g;

                if (!costName) {
                    $.popInfo("类型名称不能为空！")
                    return false
                }
                if (!costAbbr) {
                    $.popInfo("类型缩写不能为空！")
                    return false
                }
                if (!costType) {
                    $.popInfo("请选择类型属性！")
                    return false
                }
                // if (costName == costAbbr) {
                //     $.popInfo("内容不允许重复！")
                //     return false
                // }
                if (costAbbr.length != costAbbr.replace(a, "").length) {
                    $.popInfo("类型缩写允许输入英文，20个字母")
                    return false
                } else {
                    costAdd()
                    function costAdd() {
                        $http({
                            url: '/gct-web/type/costAdd',
                            data: {
                                costName: costName, //名称
                                costAbbr: costAbbr, //缩写
                                costType: costType
                            },
                            success: function (r) {
                                submitSuccess('', function () {
                                    initcostList()
                                })
                            }
                        })
                    }
                }
            }
        })
    })

    // 点击编辑弹出框
    // $("body").on("click", '.editcostType', function () {
    //     initcostType()
    //     $.popConfirm({
    //         title: "编辑类型",
    //         content: "<div class='Role-noticeCon'><div class='RoleDiv'style='margin-bottom: 5px'><span class='nameId'>类型名称：</span> <span class='nameCon'><input  class='costName'maxlength='20' type='text' style='width: 300px;'></span></div><div class='RoleDiv'style='margin-bottom: 5px'><span class='nameId'>类型缩写：</span> <span class='nameCon'><input  class='costAbbr' type='text' style='width: 300px;'  maxlength='20'></span></div><div class='RoleDiv'style='margin-bottom: 5px'><span class='nameId'>类型属性：</span> <span class='nameCon'> <span><input class='attr f_l zhijie' type='radio' name='attr' index='1' value='直接费用'>&nbsp;<span style=''>直接费用</span><input class='attr jianjie' type='radio' name='attr' index='2'  style='margin-left: 20px;' value='间接费用'>&nbsp;间接费用</span></span></div></div>",
    //         confirm: function () {
    //             costEdit()
    //         }
    //     })
    // })
    $('body').on('click', '.editcostType', function () {
        initcostType()

        $.popConfirm({
            'title': '编辑类型',
            'content': '<div class="Role-noticeCon">' +
                '<div class="RoleDiv"style="margin-bottom: 5px">' +
                '<span class="nameId">类型名称：</span>' +
                '<span class="nameCon clearfix">' +
                '<input  class="costName"maxlength="20" type="text"style="width: 300px;">' +
                '</span>' +
                ' </div>' +
                ' <div class="RoleDiv"style="margin-bottom: 5px">' +
                '<span class="nameId">类型缩写：</span>' +
                '<span class="nameCon"><input  class="costAbbr" type="text" style="width: 300px;"  maxlength="20" ></span>' +
                '</div>' +
                '<div class="RoleDiv"style="margin-bottom: 5px">' +
                ' <span class="nameId">类型属性：</span> ' +
                '<span class="nameCon"> <span><input class="costType f_l zhijie" type="radio" name="attr" index="1" value="直接费用">' +
                '<span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">直接费用</span>' +
                '<input class="costType jianjie f_l" type="radio" name="attr" index="2" class="f_l" style="margin-left: 20px;" value="间接费用">' +
                ' <span class="f_l" style="line-height:34px;height: 100%;padding-left: 5px;">间接费用</span></span></span></div></div>',
            confirm: function () {
                var costName = $(".costName").val()
                var costAbbr = $(".costAbbr").val()
                var costType = $("input[name='attr']:checked").attr('index')
                var b = /[^a-zA-Z]/g;

                if (!costName) {
                    $.popInfo("类型名称不能为空！")
                    return false
                }
                if (!costAbbr) {
                    $.popInfo("类型缩写不能为空！")
                    return false
                }
                if (!costType) {
                    $.popInfo("请选择类型属性！")
                    return false
                }
                // if (costName == costAbbr) {
                //     $.popInfo("内容不允许重复！")
                //     return false
                // }
                if (costAbbr.length != costAbbr.replace(b, "").length) {
                    $.popInfo("类型缩写允许输入英文，20个字母")
                    return false
                } else { //onkeyup="this.value=this.value.replace(/[^a-zA-Z]/g,"")"
                    costEdit()
                    function costEdit() {
                        $http({
                            url: '/gct-web/type/costUpdate',
                            data: {
                                id: tab_rowData.id,
                                costName: costName, //名称
                                costAbbr: costAbbr, //缩写
                                costType: costType
                            },
                            success: function (r) {
                                submitSuccess('', function () {
                                    initcostList()
                                })
                            }
                        })
                    }       
                }
            }
        })
    })
    // checked=''
    // 编辑回显
    function initcostType() {
        $http({
            url: '/gct-web/type/updateEcho',
            data: {
                id: tab_rowData.id
            },
            success: function (r) {
                //    log(r)
                $(".costName").val(r.data.costName)
                $(".costAbbr").val(r.data.costAbbr)
                if (r.data.costType == '1') {
                    $(".zhijie").attr("checked", 'true')
                }
                if (r.data.costType == '2') {
                    $(".jianjie").attr("checked", 'true')
                }
            },
        })
    }
    // 点击删除
    $("body").on("click", '.deletecostType', function () {
        $.popConfirm({
            title: "提示",
            content: "确定要删除所选类型吗？",
            confirm: function () {
                costDel()
            }
        })
    })
    function costDel() {
        $http({
            url: '/gct-web/type/costDel',
            data: {
                id: tab_rowData.id
            },
            success: function (r) {
                submitSuccess('', function () {
                    initcostList()
                })
            },
        })
    }
})