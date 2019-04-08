//获取施工详情 
//==> 共前准备
var constructionDateList = []
function getBeforEcho() {

    $http({
        url: '/gct-web/task/getBeforEcho',
        data: {
            taskId: taskId
        },
        success: function (r) {
            if (!r.data.obj) return false
            for (var k in r.data.obj) {
                if ($("#Work_Ready").find("." + k).length) {
                    var str = isNaN(r.data.obj[k]) ? r.data.obj[k] : (r.data.obj[k] == 0 ? '是' : '否')
                    $("#Work_Ready").find("." + k).html(k.indexOf("Time") || k.indexOf('Date') ? initDate(str, 's') : str)
                }
            }
            var str = ""
            $.each(r.data.obj.taskFileList, function (i, val) {
                str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $(".taskFile").html(str)
        }
    })
}
//==>  施工记录
//获取指定月份的天数 
function mGetDate(year, month, str) {
    var d = new Date(year, month, 0);
    var dayLen = d.getDate();
    var s = ""
    for (var i = 1; i <= dayLen; i++) {
        var c = true;
        var curData = year + '-' + zeroFill(month) + '-' + zeroFill(i)
        $.each(str, function (index, val) {
            if (curData == val) {
                var cur = ""
                if (index == 0) cur = 'work_Date cur'
                var d = constructionDateList[index] ? '<div class="m_col">第' + constructionDateList[index] + '天</div>' : ""
                s += '<div class="clearfix fl" style="display:inline-block;text-align:center;height:100px;">' +
                    '<div class="w_day clickWorkDate ' + cur + '" name="' + curData + '">' + i + '</div>' +
                    d
                    + '</div>'
                c = false

            }
        })
        if (c) s += '<div class="clearfix fl" style="display:inline-block;text-align:center;height:100px;">' +
            '<div class="w_day " name="">' + i + '</div>' +
            '<div ></div>'
            + '</div>'
    }
    $(".work_day_log").html(s)
}
$("body").on("click", ".clickWorkDate", function () {
    // var data = $('.ConstructLogDate').val() + '-' + zeroFill($(this).html())
    if (!$(this).hasClass("work_Date")) {
        $(".work_Date").removeClass("work_Date")
        $(this).addClass("work_Date")
        var data = $(this).attr("name");
        if (!data) return
        if (nav_twos_idx == 1) getConstructLog(data)
        else getChangeLog(data)
    }

})
//施工记录日期回显
function getConstructLogDate(year, month) {
    $http({
        url: '/gct-web/task/getConstructLogDateEcho',
        data: {
            taskId: taskId,
            month: month,
            year: year
        },
        success: function (r) {
            var str = [], sp, sps;
            r.data.list = r.data.list || []
            $.each(r.data.list, function (i, val) {
                sp = initDate(val)
                if (i == 0) {
                    $("#ConstructLogDate").val(initDate(val, 'y'))
                    sps = initDate(val)
                }
                str.push(sp)
            })
            constructionDateList = r.data.listSum || []
            mGetDate(r.data.year, r.data.month, str)
            if (!str.length) { getConstructLog(r.data.year + '-' + zeroFill(r.data.month) + '-' + '01') }
            else getConstructLog(sps)
        }
    })
    window.jedateClick = function (a) {
        var st = a.split('-')
        getConstructLogDate(st[0], st[1])
    }
}
//施工记录
function getConstructLog(cDate) {
    $http({
        url: '/gct-web/task/getConstructLogInfoEcho',
        data: {
            taskId: taskId,
            cDate: cDate
        },
        success: function (r) {
            $("#Construct_Record .constructionMember").html(r.data.obj['constructionMember'])
            $("#Construct_Record .weather").html(r.data.obj['weather'])
            $("#Construct_Record .safeRemind").html(r.data.obj['safeRemind'])
            $("#Construct_Record .constructionLog").html(r.data.obj['constructionLog'])
            //安全照片
            var str = ""
            var strArr = r.data.obj.taskFileList1 || []
            $.each(strArr, function (i, val) {
                str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Construct_Record .taskFileListSafe").html(str)
            //施工过程照片
            var str1 = ""
            var str1Arr = r.data.obj.taskFileList2 || []
            $.each(str1Arr, function (i, val) {
                str1 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Construct_Record .taskFileListLog").html(str1)
            //当前用料  
            workSheetMaterialCol.push({
                field: 'useNum',
                width: '200',
                title: '使用量'
            })
            initTable('workLog_matterList', r.data.matterList, workSheetMaterialCol)
            //隐藏工作量    workLog_hideList
            initTable('workLog_hideList', r.data.taskHides, workLog_hideListCol)
        }
    })
}
//==> 整改记录
//整改记录日期回显
function getChangeLogDate(year, month) {
    $http({
        url: '/gct-web/task/getChangeLogDateEcho',
        data: {
            taskId: taskId,
            month: month,
            year: year
        },
        success: function (r) {
            var str = [], sp, sps;
            r.data.list = r.data.list || []
            $.each(r.data.list, function (i, val) {
                sp = initDate(val)
                if (i == 0) {
                    $("#changeLogDate").val(initDate(val, 'y'))
                    sps = initDate(val)
                }
                str.push(sp)
            })
            constructionDateList = r.data.listSum || []
            mGetDate(r.data.year, r.data.month, str)
            if (!str.length) getChangeLog(r.data.year + '-' + zeroFill(r.data.month) + '-' + '01')
            else getChangeLog(sps)
            window.jedateClick = function (a) {
                var st = a.split('-')
                getChangeLogDate(st[0], st[1])
            }
        }
    })
}
//整改记录
function getChangeLog(cDate) {
    $http({
        url: '/gct-web/task/getChangeLogInfoEcho',
        data: {
            taskId: taskId,
            cDate: cDate
        },
        success: function (r) {
            $("#Rectify_Record .constructionMember").html(r.data.obj['constructionMember'])
            $("#Rectify_Record .weather").html(r.data.obj['weather'])
            $("#Rectify_Record .safeRemind").html(r.data.obj['safeRemind'])
            $("#Rectify_Record .constructionLog").html(r.data.obj['constructionLog'])
            //安全照片
            var str = ""
            var strArr = r.data.obj.taskFileList1 || []
            $.each(strArr, function (i, val) {
                str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Rectify_Record .taskFileListSafe").html(str)
            //施工过程照片
            var str1 = ""
            var str1Arr = r.data.obj.taskFileList2 || []
            $.each(str1Arr, function (i, val) {
                str1 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Rectify_Record .taskFileListLog").html(str1)
        }
    })
}
// ==> 完工信息
var complateData = {
    actualStartDate: "",
    changeStart: "",
    changeCommit: "",
    commit: "",
    actualHours: "",
    planHours: "",
    changeCommit: "",
    changeEnd: "",
    planStartDate: "",
    planEndDate: "",
    actualEndDate: "",
    changeHours: ""
}
function getFinishInfo() {
    $http({
        url: '/gct-web/task/getFinishInfo',
        data: {
            taskId: taskId
        },
        success: function (r) {
            eachData(complateData, r.data)
            $(".changeEnd").html(initDate(r.data.changeEnd, 's'))
            $(".changeStart").html(initDate(r.data.changeStart, 's'))
            $("#Completed_Information").find(".applyName").html(r.data.applyUser)
            $("#Completed_Information").find(".applyDate").html(initDate(r.data.applyDate, 's'))
            //完工照片
            var str1 = ""
            var str1Arr = r.data.taskFiles1 || []
            $.each(str1Arr, function (i, val) {
                str1 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Completed_Information .finshImg").html(str1)
            //完工草图
            var str2 = ""
            var str2Arr = r.data.taskFiles2 || []
            $.each(str2Arr, function (i, val) {
                str2 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Completed_Information .finshSketch").html(str2)
            //整改过程照片
            var str3 = ""
            var str3Arr = r.data.taskFiles3 || []
            $.each(str3Arr, function (i, val) {
                str3 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $("#Completed_Information .finshChangeImg").html(str3)
        }
    })
}
