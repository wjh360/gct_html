
//获取工单详情
function getTaskDetails(tId) {
    var taskId = storage("taskId")  //工单id
    $http({
        url: '/gct-web/task/getTaskInfo',
        data: {
            id: taskId
        },
        success: function (r) {
            if (!r.data && !r.data.obj) return false
            var getData = r.data.obj
            eachData(postObjData, getData)
            initTable("workSheetMaterial", getData.matterVOList, workSheetMaterialDetailsCol)
            initTable("workTaskHides", getData.taskHides, workLog_hideListCol)
            getFileList(getData.taskFileList)
            attribute = getData.attribute
            attribute == 1 || $(".stationDemand").show().prev('.lineDemand').hide()
            for (var k in getData.projectRangeList[0]) {
                if ($(".taskDemand").find('.' + k).length) {
                    $(".taskDemand").find('.' + k).html(getData.projectRangeList[0][k])
                }
            }
        }
    })
}
var postObjData = {
    "projectName": "",   //项目名称
    "taskName": "",      //工单名称
    "typeName": "",   //工单类型名称
    "categoryName": "",    //工单类别名称
    "startDate": "",   //计划开始日期
    "endDate": "",  //计划结束日期
    "hours": "",        //计划周期
    "estimate": "",   //施工造价估算
    "userName": "",   //施工队长名字
    "taskCommit": "",   //说明
    "provinceName": "",  //省名称
    "cityName": "",   //市名称
    "countyName": "",   //县名称
    "taskRegion": "",     //详细地址
}
//生成文件列表
function getFileList(arr) {
    initTable("fileListTable", arr, fileColDetail)
}