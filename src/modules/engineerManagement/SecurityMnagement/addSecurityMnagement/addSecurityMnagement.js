$(function () {
    //回显工单list
    var taskId;
    $http({
        url: '/gct-web/taskSafe/getSafeInsertEcho',
        success: function (r) {
            $(".trueName").html(r.data.trueName)
            getDownSelect('taskList', '请选择工单', r.data.taskList, 'id', 'taskName', ['projectName', 'userName'])
        }
    })
    // 根据工单 回显对应 的 施工队长 和项目
    $('body').on('click', '#taskList li', function () {
        $('.projectName').html($(this).attr("morepar_projectName"))
        $('.userName').html($(this).attr("morepar_userName"))
        taskId = $(this).attr("index")
    })
    //默认检测事项都为0
    var testAttrObj = {
        papers: '0',
        tips: '0',
        tools: '0',
        fire: '0',
        electricity: '0',
        hoisting: '0',
        well: '0',
        buried: '0',
        cold: '0',
        instrument: '0',
        line: '0',
    }
    var isTrueClick;
    $('body').on('click', '.valTest .clickW', function () {
        isTrueClick = true
        $(this).siblings().removeClass('activeBlue')
        $(this).addClass("activeBlue")
        var attrV = $(this).parent().attr("class")
        testAttrObj[attrV] = $(this).attr("index")
        // testAttrObj[]
        // log(testAttrObj)
    })
    fileUploader({
        btn: 'postFileBtn',
        data: [],
        tabId: 'fileListTable',
        col: fileCol,
        other: {
            isMore: true,
            fileType: {
                title: 'fileType',
                extensions: 'jpg,png',
                mimeTypes: '.jpg,.png'
            },
            fileNumLimit: 20
        }
    })
    function getPostData() {
        if (!taskId) return $.popInfo('请选择要检查的工单！')
        if (!isTrueClick) return $.popInfo('请至少给出一项安全检查结果！')

        var newPostObj = testAttrObj
        newPostObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        newPostObj.fileUrlDel = delFileObjUrlList.join(",");//路径
        newPostObj.taskId = taskId
        newPostObj.conclusion = $(".conclusion").val()
        $.popConfirm({
            'title': '',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/taskSafe/getSafeInsert',
                    data: newPostObj,
                    success: function (r) {
                        submitSuccess("提交成功", function () {
                            goBack()
                        })
                    }
                })
            }
        })

    }
    $('body').on('click', '.postBtn', function () {
        getPostData()
    })
})