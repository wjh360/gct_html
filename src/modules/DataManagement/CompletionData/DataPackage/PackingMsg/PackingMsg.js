$(function () {
    // 初始化打包资料列表
    var PackingCol = [{
            title: '',
            'class': "",
            width: '50',
            formatter: function () {
                return '<span class="checkBox"></span>'
            }
        }, 
        {
            field: 'taskCode',
            title: '工单编号',
            width: '200'
        }, 
        {
            field: 'taskName',
            title: '工单名称',
            width: '200'
        }, 
        {
            field: 'cost',
            title: '工单成本（元）',
            width: '200',
        }, 
        {
            field: 'constructEstimate',
            title: '施工造价估算（元）',
            width: '200',
        },
        {
            field: 'finalValue',
            title: '决算值（元）',
            width: '200',
        }, 
        {
            field: 'constructionUserName',
            title: '施工队长',
            width: '200',
        }, 
        {
            field: 'companyName',
            title: '创建单位',
            width: '200',
        }, 
        {
            field: 'createrName',
            title: '创建人',
            width: '200',
        }, 
        {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a,'s')
            }
        }]
    var projectId = storage("projectId")
    initFinalValuePage()
    function initFinalValuePage() {
        $http({
            url: '/gct-web/order/finalValuePage',
            data: {
                projectId: projectId
            },
            success: function (r) {
                initTable("PackingTable", r.data, PackingCol, {
                    total: r.data,
                })
            }
        })
    }
    // 获取提交数据
    var postData = {
        datumName: "技术文件名称",
    }
    var projectId = storage("projectId")
    //添加
    function PackingMsg() {
        var postObj = {
            projectId: projectId,
            ids: tabObj['PackingTable'].tab_select_ids.join(',')
        }
        for (var k in postData) {
            val = $("." + k).val()
            if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
            postObj[k] = val
        }
        $http({
            url: '/gct-web/order/finshDatumPack',
            data: postObj,
            success: function (r) {
                submitSuccess('',function () {
                    goBack()
                })
            }
        })
    }

    //提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                PackingMsg()
            }
        })
    })

    $('body').on("click", '.all_Select_Private', function () {
        checkAllFun('PackingTable')
        // tabObj['PackingTable']
    })
    $('body').on("click", '.all_Cancel_Private', function () {
        removecheckAllFun('PackingTable')
        // tabObj['PackingTable']
    })
})