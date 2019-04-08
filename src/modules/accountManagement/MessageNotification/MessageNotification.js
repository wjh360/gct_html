// $(function () {
//消息列表 参数配置
var col = [
    {
        field: '',
        title: '',
        width: '30',
        'class': 'checkBox'
    }, {
        field: 'isRead',   //1.阅读了    2.未阅读
        title: '',
        width: '30',
        formatter: function (a) {
            if (a == 2) return '<span class="noRead"></span>'
            else return '<span class="read"></span>'
        }
    }, {
        field: 'title',
        title: '标题',
        width: '500',
        'class': 'content_detail'
    }, {
        field: 'createTime',
        title: '接收时间',
        width: '180',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
$("body").on('click', '.serActive', function () {
    switchTab()
})
//tab切换点击事件
$("body").on("click", '.nav-tabs li', function () {
    nav_idx = $(this).attr("data_index")
    storage("nav_idx", nav_idx)
    switchTab()
})
// tab页面切换函数
switchTab()
function switchTab() {
    if (nav_idx == 0) getWorkMsg()   //工作消息
    else getSysMsg()    //系统消息
}
//获取工作消息
function getWorkMsg() {
    $http({
        url: '/gct-web/sysUser/getJobNews',
        data: {
            title: $(".searchVal").val()
        },
        success: function (r) {
            initTable("workMsgTable", r.data, col)
        }
    })
}
//获取系统消息 
function getSysMsg(params) {
    $http({
        url: '/gct-web/sysUser/getSysNews',
        data: {
            title: $(".searchVal").val()
        },
        success: function (r) {
            initTable("sysMsgTable", r.data, col)
        }
    })
}

// 全部已读点击事件  // 1.系统消息   2.工作消息
$("body").on("click", '.readBtn', function () {
    if (nav_idx == 0) {
        $.popConfirm({
            'content': '确定要将所有未读工作消息标为已读吗？',
            'confirm': function () {
                getRead(2)
            }
        })
    }
    else {
        $.popConfirm({
            'content': '确定要将所有未读系统消息标为已读吗？',
            'confirm': function () {
                getRead(1)
            }
        })
    }

})
// 删除消息函数
function getSysUserDel(id) {
    $http({
        url: '/gct-web/sysUser/getNewsDel',
        data: {
            ids: id
        },
        success: function (r) {
            $.popInfo("删除成功")
            switchTab()
        }
    })
}
// 点击删除消息事件
$("body").on("click", '.msgCancel', function () {
    // log(nav_idx,tabObj)
    if (nav_idx == 0 && !tabObj['workMsgTable'].tab_select_ids.length) return $.popInfo("请勾选要删除得消息!")
    else if (nav_idx == 1 && !tabObj['sysMsgTable'].tab_select_ids.length) return $.popInfo("请勾选要删除得消息!")
    var arr = nav_idx == 0 ? tabObj['workMsgTable'].tab_select_ids : tabObj['sysMsgTable'].tab_select_ids
    $.popConfirm({
        'content': '确认要删除所选内容吗？',
        'confirm': function () {
            getSysUserDel(arr.join(","))
        }
    })
})
// 点击系统通知消息标题 进入详情页
$("body").on("click", '#sysMsgTable tbody tr', function () {
    if (nav_idx == 1) {
        getRead(2, tab_rowData.id, this)
        storage("sysMsgId", tab_rowData.id, 'detailsNotice')  //系统通知消息id  通知详情
        goNewPage("./MessageNotification/detailsNotice.html")
    }
})
$('html').append('<script src="./MessageNotification/MessageJump.js"></script>')
// })
// 标记消息已读函数
function getRead(type, ids, tar) {
    var data = {}
    data.type = type
    if (ids) data.ids = ids
    $http({
        url: '/gct-web/sysUser/getRead',
        data: data,
        success: function (r) {

            if (tar) {
                $(tar).find('.noRead').addClass("read")
            } else {
                switchTab()
            }
        }
    })
}