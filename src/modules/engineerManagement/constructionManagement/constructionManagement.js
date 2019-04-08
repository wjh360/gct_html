
$(function () {
    var postObjData = {
        TaskCode: "",     //工单编号  字符串
        taskName: "",       //工单名称 字符串
        projectName: "",   //项目名称 字符串
        companyName: ""    //公司名称 字符串
    }
    switchTab()
    function switchTab() {
        postObjData = {
            TaskCode: "",     //工单编号  字符串
            taskName: "",       //工单名称 字符串
            projectName: "",   //项目名称 字符串
            companyName: ""    //公司名称 字符串
        }
        if ($(".searchBtn").hasClass("serActive")) {
            postObjData.taskName = $(".searchVal").val()
        } else if ($(".advancedBox").hasClass("active")) {
            postObjData.taskCode = $(".searchList").find(".TaskCode").val()
            postObjData.taskName = $(".searchList").find(".taskName").val()
            postObjData.projectName = $(".searchList").find(".projectName").val()
            postObjData.companyName = $(".searchList").find(".companyName").val()
        }
        // log(nav_idx)
        var n = parseFloat(nav_idx)
        switch (n) {
            case 0:
                getTaskNoPage()
                break;
            case 1:
                getTaskSendPage()
                break;
            case 2:
                getTaskMeetPage()
                break;
            case 3:
                getTaskConstructionInPage()
                break;
            case 4:
                getTaskChangePage()
                break;
            case 5:
                getTaskFinishPage()
                break;
            case 6:
                getTaskInvolvedPage()
                break;
            case 7:
                getTaskListPage()
                break;
            default:
                break;
        }
    }
    //搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { switchTab() })
    //tab切换点击事件
    $("body").on("click", '.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        if (switchTab) switchTab()
    })
    //未派工单
    function getTaskNoPage() {
        $http({
            url: '/gct-web/task/getTaskNoPage',
            data: postObjData,
            success: function (r) {
                initTable("NotAssignedTable", r.data, constructionManagement_getTaskNoPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //未接工单
    function getTaskSendPage() {
        $http({
            url: '/gct-web/task/getTaskSendPage',
            data: postObjData,
            success: function (r) {
                initTable("getTaskSend", r.data, constructionManagement_getTaskSendPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //已接工单
    function getTaskMeetPage() {
        $http({
            url: '/gct-web/task/getTaskMeetPage',
            data: postObjData,
            success: function (r) {
                initTable("getTaskMeet", r.data, constructionManagement_getTaskSendPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //施工工单
    function getTaskConstructionInPage() {
        $http({
            url: '/gct-web/task/getTaskConstructionInPage',
            data: postObjData,
            success: function (r) {
                initTable("getTaskConstructionIn", r.data, constructionManagement_getTaskConstructionInPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //整改工单
    function getTaskChangePage() {
        $http({
            url: '/gct-web/task/getTaskChangePage',
            data: postObjData,
            success: function (r) {
                initTable("getTaskChange", r.data, constructionManagement_getTaskConstructionInPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //完工工单
    function getTaskFinishPage() {
        $http({
            url: '/gct-web/task/getTaskFinishPage',
            data: postObjData,
            success: function (r) {
                var col = constructionManagement_getTaskConstructionInPage
                col[col.length - 1].formatter = function (a, b) {
                    // log(b) 
                    if (b.taskType == 1) {
                        if(b.taskStatus=='直接完工') return '<a class="m_grey"  data_power="Equipment-position">施工轨迹</a><a class="m_grey">催单记录</a>'
                        else return '<a class="EquipmentPosition"  data_power="Equipment-position">施工轨迹</a><a class="reminderRecord">催单记录</a>'
                    }
                    else {
                        if(b.taskStatus=='直接完工') return '<a class="m_grey"  data_power="Construction-track">设备位置</a><a class="m_grey">催单记录</a>'
                        else return '<a class="DeviceLocation" data_power="Construction-track">设备位置</a><a class="reminderRecord">催单记录</a>' }
                }
                initTable("getTaskFinish", r.data, constructionManagement_getTaskConstructionInPage)
                if (r.dataOthers == 0) {
                    $(".disUnit").hide()
                }
            }
        })
    }
    //我参与的工单
    function getTaskInvolvedPage() {
        $http({
            url: '/gct-web/task/getIAmInvolvedPage',
            data: postObjData,
            success: function (r) {

                initTable("getTaskInvolved", r.data, constructionManagement_getTaskInvolvedPage)
            }
        })
    }
    //工单列表
    function getTaskListPage() {
        $http({
            url: '/gct-web/task/getTaskPage',
            data: postObjData,
            success: function (r) {
                initTable("getTaskList", r.data, constructionManagement_getTaskInvolvedPage)
            }
        })
    }
    // 查看工单详情
    $("body").on("click", '.table tbody tr', function () {
        var taskId = tab_rowData ? tab_rowData.id : ""
        if (!taskId) return false
        var str = $(".nav-tabs").find(".active").attr("data_index")
        if (str == 7 || str == 6) {
            var arr = {
                "1": "未接",
                "2": "已接",
                "3": "施工中",
                "4": "整改中",
                "4": "整改审核中",
                "4": "整改未过审",
                "5": "完工",
                "5": "完工审核中"
            }
            $.each(arr, function (index, eleVal) {
                if (eleVal == tab_rowData.taskStatus) {
                    str = index
                }
            })
        }
        storage("taskId", taskId, 'detailsNotAssigned')   //工单id 详情页面
        storage("taskTypes", str, 'detailsNotAssigned')   //
        storage("projectId", tab_rowData.projectId, 'detailsNotAssigned')   //项目id 详情页面
        goNewPage("./constructionManagement/NotAssigned/detailsNotAssigned.html")
    })

    //查看施工轨迹
    $("body").on("click", ".EquipmentPosition", function () {
        var taskId = tab_rowData ? tab_rowData.id : ""
        if (!taskId) return false
        storage('taskId', taskId, 'TaskTrajectory');
        goNewPage("/modules/mapManagement/TaskTrajectory.html",true);
    })



    // 编辑工单
    $("body").on("click", '.editTask', function () {
        var taskId = tab_rowData.id
        if (!taskId) return false
        storage("taskId", taskId, 'editNotAssigned')      //工单id 编辑页面
        goNewPage("./constructionManagement/NotAssigned/editNotAssigned.html")
    })
    // 删除工单
    $("body").on("click", '.delTask', function () {
        var taskId = tab_rowData.id
        if (!taskId) return false
        $.popConfirm({
            'content': '确定删除吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/task/getTaskDel',
                    data: { id: taskId },
                    success: function (r) {
                        switchTab()
                    }
                })
            }
        })
    })
    //催单
    $('body').on('click', 'tbody .reminder', function () {

        $.popConfirm({
            'title': '催单',
            'content': '<div class="">' +
                '<textarea class="reminder_content" name="" id="" maxlength="200" placeholder="请输入催单内容" style="width: 100%;min-height: 78px;border-radius:3px;border: 1px solid #efe4e4;"></textarea>' +
                '</div>',
            confirm: function () {
                var str = $(".reminder_content").val()
                if (!str) {
                    $.popInfo("催单内容不能为空！")
                    $(".reminder_content").addClass('redBorder')
                    return false
                } else {
                    $(".reminder_content").removeClass('redBorder')
                }
                $http({
                    url: '/gct-web/task/getTaskReminder',
                    data: {
                        taskId: tab_rowData.id,
                        content: str
                    },
                    success: function (r) {
                        $.popInfo("催单成功！")
                        // switchTab()
                    }
                })
            }
        })
    })

    //催单记录

    $('body').on('click', 'tbody .reminderRecord', function () {
        var taskId = tab_rowData.id
        if (!taskId) return false
        storage("taskId", taskId, 'Reminder')      //工单id 催单记录
        goNewPage("./constructionManagement/UnansweredTable/Reminder.html")
    })

    // 设备位置

    $('body').on('click', 'tbody .DeviceLocation', function () {
        var taskId = tab_rowData.id
        if (!taskId) return false
        storage("taskId", taskId, 'DeviceLocation')      //工单id 设备位置
        goNewPage("./constructionManagement/UnansweredTable/DeviceLocation.html")
    })

//    点击撤单
    $("body").on("click",'.cancelTask',function () {
        if(!tab_rowData.id) return false;
        $.popConfirm({
            'title': '撤单',
            'content': '确定要撤回所选工单吗？',
            confirm: function () {
                $http({
                    url: '/gct-web/task/getTaskWithdraw',
                    data: {
                        id: tab_rowData.id
                    },
                    success: function (r) {
                       submitSuccess('',function () {
                           switchTab()
                       })
                    }
                })
            }
        })
    })

})