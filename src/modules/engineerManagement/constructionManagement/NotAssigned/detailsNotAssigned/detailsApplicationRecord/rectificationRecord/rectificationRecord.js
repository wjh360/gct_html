$(function(){
    var taskForm = storage("taskForm")
    


    $http({
        url: '/gct-web/applyRecord/getChangeFinishInfo',
        data: {
            formId:taskForm.formId
        },
        success: function (r) {
            getAuditList()
            if( !r.data) return false
            var getData = r.data.taskFinish
            $(".createTime").html(initDate(getData.createTime))
            $(".taskEnd").html(initDate(getData.taskEnd))
            $(".dateSum").html(getData.dateSum)
            $(".changeContent").html(getData.content)
            var str = ""
            if(!r.data.taskFiles) return false
            $.each(r.data.taskFiles, function (i, val) {
                str += '<img class="imgView" src="' + baseFileUrl + val.thumbnailUrl + '" data_file="' + val.projectFileUrl + '" alt="">'
            })
            $(".taskFileListLog.finshImg").html(str)
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