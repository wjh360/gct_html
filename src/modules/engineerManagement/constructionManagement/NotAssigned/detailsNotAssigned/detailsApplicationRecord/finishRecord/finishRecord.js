$(function(){
    var taskForm = storage("taskForm")
    


    $http({
        url: '/gct-web/applyRecord/getFinishInfo',
        data: {
            formId:taskForm.formId
        },
        success: function (r) {
            getAuditList()
            if( !r.data) return false
            var getData = r.data.taskFinish
            $(".finishContent").html(getData.content)
            $(".dateSum").html(getData.dateSum)
            $(".taskEnd").html(initDate(getData.taskEnd))
            $(".startTime").html(initDate(r.data.startTime))
            var str1 = ""
            if(!r.data.taskFiles1) return false
            $.each(r.data.taskFiles1, function (i, val) {
                str1 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            // log(str1)
            $(".taskFileListLog.finshImg").html(str1)

            var str2 = ""
            if(!r.data.taskFiles2) return false
            $.each(r.data.taskFiles1, function (i, val) {
                str2 += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            // log(str2)
            $(".taskFileListLog.finshSketch").html(str2)
            
        }
    })

    //获取审核记录


    function getAuditList(){
        $http({
            url: '/gct-web/audit/recordInfo',
            data: {
                id:taskForm.id
            },
            success: function (r) {
                initTable('taskFormAudit_listCol', r.data, taskFormAudit_listCol)
            }
        })
    }


})