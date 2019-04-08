$(function(){

    //回显工单list
    var safeTestId = storage('safeTestId') ;

    //默认检测事项都为0
    var testAttrObj = {
        papers:'0',           
        tips:'0',         
        tools:'0',            
        fire:'0',         
        electricity:'0',          
        hoisting:'0',          
        well:'0',         
        buried:'0',           
        cold:'0',         
        instrument:'0',           
        line:'0',         
    }

    $http({
        url: '/gct-web/taskSafe/getSafeInfo',
        data:{
            id:safeTestId
        },
        success: function (r) {

           var getData = r.data && r.data.taskSafeVO ? r.data.taskSafeVO : {}

            for(var k in testAttrObj){
                var str = getData[k]
                $("." + k).html(str == 2 ? '不合格' : (str == 1 ? '合格' : '未检查'))
            }
            $(".conclusion").html(getData.conclusion)

            $(".taskName").html(getData.taskName)
            $(".projectName").html(getData.projectName)
            $(".trueName").html(getData.trueName)
            $(".createName").html(getData.createName)
            initTable("fileListTable",getData.fileList , fileColDetail)
        }
    })

})