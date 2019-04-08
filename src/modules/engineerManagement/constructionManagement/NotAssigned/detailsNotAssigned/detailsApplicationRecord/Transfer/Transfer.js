$(function(){
    var taskForm = storage("taskForm")
    $http({
        url: '/gct-web/applyRecord/getTurnInfo',
        data: {
            formId:taskForm.formId
        },
        success: function (r) {
            // log(r)
            if( !r.data) return false
            $(".auditName").html(r.data.receiveUser)
            $(".applyTime").html(initDate(r.data.turnTime,'s'))
            $(".applyName").html(r.data.turnUser)
        }
    })
})