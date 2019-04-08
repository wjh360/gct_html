
$(function () {
    //当前工单状态  小于3  施工前工单  大于等于3 施工  施工后工单
    var taskStatus = parseFloat(storage("taskTypes") || 0)
    var attribute = 1;  //工单类型  线路类 1  基站类 2
    switch (taskStatus) {
        case 0: //未派
            $(".tabHeader").find(".constructionDetails").remove()    //施工详情
            $(".tabHeader").find(".ApplicationRecord").remove()      //操作详情
            break;
        case 1: //未接
            $(".tabHeader").find(".constructionDetails").remove()    //施工详情
            break;
        case 2: // 已接
            $(".tabHeader").find(".constructionDetails").remove()    //施工详情
            break;
        case 3: //施工
            $(".ConstructionDetails_nav ").find('.Rectify_Record').remove()     //整改详情
            $(".ConstructionDetails_nav ").find('.Completed_Information').remove() //完工详情
            break;
    }
    $(".tabHeader").show()
    //tab切换点击事件
    $("body").on("click", '.first_nav.nav-tabs li', function () {
        nav_idx = $(this).attr("data_index")
        storage("nav_idx", nav_idx) //页面 显示
        // 
        if (switchTab) switchTab()
    })
    //二级tab切换点击事件
    $("body").on("click", '.twos_nav.nav-tabs li', function () {
        nav_twos_idx = $(this).attr("data_index")
        storage("nav_twos_idx", nav_twos_idx) //页面 显示
        if (switchTab) switchTab()
    })
    switchTab()
    function switchTab() {
        taskId = storage('taskId')         //工单id
        projectId = storage("projectId")  //项目id
        nav_idx = parseFloat(nav_idx)
        switch (nav_idx) {
            case 0:
                projectInfo()
                break;
            case 1:
                getTaskDetails()
                break;
            case 2:
                // getTaskDetails ()
                nav_twos_idx = parseFloat(nav_twos_idx)
                switch (nav_twos_idx) {
                    case 0:
                        getBeforEcho()
                        break;
                    case 1:
                        getConstructLogDate()
                        break;
                    case 2:
                        getChangeLogDate()
                        break;
                    case 3:
                        getFinishInfo()
                        break;
                }
                break;
            case 3:
                TaskRecord()
                break;
        }
    }
    //点击 拥有施工记录的日期 回显 数据
    // $("body").on("click", '.work_day_log .work_Date', function () {
    //     log($(this).attr("name"))
    // })
    // 操作记录
    function TaskRecord() {
        $http({
            url: '/gct-web/audit/pageTaskRecord',
            data: {
                id: taskId
            },
            success: function (r) {
                initTable("ApplicationRecordTable", r.data, TaskRecord_ListCol)
            }
        })
    }
    $("body").on("click", '#ApplicationRecordTable tr', function () {
        if (tab_rowData) {
            var obj = {
                '3001': "changeRecord",         // '工单物料变更申请', 
                '3002': "designRecord",         // '工单设计变更申请', 
                '3003': "finishRecord",         // '工单完工申请', 
                '3004': "rectificationRecord",         // '工单整改完工申请',
                '10000': "Transfer"         //'转派'
            }
            storage("taskForm", tab_rowData, obj[tab_rowData.itemCode])   //工单记录对象  操作详情 
            goNewPage("./detailsNotAssigned/detailsApplicationRecord/" + obj[tab_rowData.itemCode] + '.html')
        }
    })
})
