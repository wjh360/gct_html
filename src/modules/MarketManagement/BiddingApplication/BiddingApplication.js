$(function () {
    var col = [{
        field: 'bidNo',
        title: '编号',
        width: '150',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'bidName',
        title: '投标名称',
        width: '200'
    }, {
        field: 'bidUnit',
        title: '发标单位',
        width: '150'
    }, {
        field: 'typeName',
        title: '项目类型',
        width: '150',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }

    }, {
        field: 'bidDate',
        title: '预计投标时间',
        width: '100',
        formatter: function (a) {
            return initDate(a)
        }
    }, {
        field: 'inviteAmount',
        title: '招标金额（元）',
        width: '150',
        formatter: function (a) {
            if (!a) return '0'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:150px;">' + a + '</span>'
        }
    }, {
        field: 'status',
        title: '状态',
        width: '100',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="tit overf_Ec" style="display:inline-block; max-width:100px;">' + a + '</span>'
        }
    }, {
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        title: '操作',
        width: '100',
        'class': '',
        formatter: function (a, b) {
            if (b.status == '已保存') return '<a data_power="Edit-tender-application-operation" class="editBidding" title= "">编辑</a><a data_power="Removal-of-tender-application-operation" class="delBidding m_red" title= "">删除</a>'
            if (b.status == '未过审') return '<a data_power="Edit-tender-application-operation" class="editBidding" title= "">编辑</a><a data_power="Removal-of-tender-application-operation" class="m_red delBidding" title= "">删除</a>'
            else return '<a data_power="Edit-tender-application-operation" class="noEdit" title= "">编辑</a><a data_power="Removal-of-tender-application-operation" class="noEdit" title= "">删除</a>'
            // <a class="del_Bidding m_red" title= "">弃标</a>
        }
    }]
    //初始化  项目类型下拉框
    ProjectTypeList()
    function ProjectTypeList() {
        $http({
            url: '/gct-web/bidApply/getProjectTypeEcho',
            success: function (r) {
                getDownSelect("type", '请选择项目类型', r.data.list, 'id', 'typeName')
            },
        })
    }
    //初始化 投标申请列表
    //    limit          //每页显示条数  数字
    //    current        //当前页  数字
    //    bidName        //投标名称  字符串
    //    bidUnit        //投标单位  字符串
    //    type           //项目类型ID  数字
    //    status         //状态  数字  (1.保存 3.审核中 4.未过审 7.已弃标)
    initBidApplyList()
    function initBidApplyList() {
        bidName = $(".bidName").val() || $(".searchVal").val()
        bidUnit = $(".bidUnit").val()
        type = $(".type").attr("index")
        sts = $(".statusType").attr("index")
        $http({
            url: '/gct-web/bidApply/getBidApplyPage',
            data: {
                limit: 10,
                bidName: bidName,
                bidUnit: bidUnit,
                type: type,
                status: sts
            },
            success: function (r) {
                initTable("biddingListTable", r.data, col, {
                    total: r.data,
                })
            },
        })
    }
    // 简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initBidApplyList()
    })
    // 高级搜索
    $("body").on("click", '.advanceInquBtn', function () {
        initBidApplyList()
    })
    //点击删除投标记录
    function getBidApplyDel() {
        $http({
            url: '/gct-web/bidApply/getBidApplyDel',
            data: {
                id: tab_rowData.id //人员ID 数字
            },
            success: function (r) {
                submitSuccess('', function () {
                    initBidApplyList()
                })
            }
        })
    }
    // 删除
    $("body").on("click", '.delBidding', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定删除当前操作的内容吗？</div>",
            confirm: function () {
                getBidApplyDel()
            }
        })
    })
    //点击弃权
    // $("body").on("click", '.del_Bidding', function () {
    //     // log()
    //     $http({
    //         url: '/gct-web/bidApply/getBidApplyDiscard',
    //         data: {
    //             id: tab_rowData.id //人员ID 数字
    //         },
    //         success: function (r) {
    //             submitSuccess('', function () {
    //                 initBidApplyList()
    //             })
    //         }
    //     })
    // })
    // 点击添加
    $("body").on("click", '.addBidding', function () {
        storage("auditItem", 1001, 'addBidding') //事项编码  添加投标页面
        goNewPage("./BiddingApplication/addBidding.html")
    })
    //点击编辑
    $("body").on("click", '.editBidding', function () {
        storage("auditItem", 1001, 'editBidding') //事项编码  编辑投标页面
        storage("BiddingId", tab_rowData.id, 'editBidding') //投标id  编辑投标页面
        goNewPage("./BiddingApplication/editBidding.html")
    })
    //点击详情
    $("body").on("click", '#biddingListTable tbody tr', function () {
        storage("BiddingId", tab_rowData.id, 'detailsBidding') //投标id 人员详情
        goNewPage("./BiddingApplication/detailsBidding.html")
    })
})
