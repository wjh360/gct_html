$(function () {
    //回显工单list
    var taskId;
    $http({
        url: '/gct-web/taskQuality/getQualityInsertEcho',
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
        cultivate: "0",              //施工人员技术培训检查 （1代表合格 2代表不合格 未勾传0）
        mechanical: "0",              //施工机械、仪表状态检查
        material: "0",              //工程物料质量检查
        job: "0",                     //施工作业环境是否符合工程作业要求
        pipeline: "0",              //直埋、架空、管道光缆的布放工艺检查
        bracket: "0",              //光缆预留及预留架安装质量检查
        radius: "0",              //光缆布放的弯曲半径质量检查
        buried: "0",              //直埋光缆的埋深检查
        resistance: "0",              //直埋光缆的对地绝缘测试检查
        joint: "0",              //接头盒安装固定及密封检查
        hook: "0",              //架空线路光缆挂钩及吊线垂度质量检查
        box: "0",              //架空线路及光交箱的接地质量检查
        stud: "0",              //立杆及拉线土质夯实、安装、固定质量检查
        crossover: "0",              //架空线路与其他设施交越的安全间距检查
        guard: "0",              //人手孔内光缆保护措施质量检查
        welding: "0",              //光缆成端、接续时的纤序、衰耗质量检查
        quality: "0",              //中继段测试各项质量检查
        rack: "0",              //机架、设备安装固定质量检查
        cable: "0",              //线缆布放及标识质量检查
        ground: "0",              //接地线安装质量检查
        power: "0",              //电源设备、蓄电池安装测试质量检查
        antenna: "0",              //天线安装固定、方位角、俯仰角质量检查
        feeder: "0",              //室外馈线及电源线布放、接地、防水处理质量检查
        reserved: "0",              //室外光缆布放及盘留、标识质量检查
        splice: "0",              //光纤布放、插接工艺、光纤标识质量检查
        port: "0",              //光电口设备端口的收发测试检查
        groove: "0",              //管道沟槽处理质量检查
        concrete: "0",              //管道基础混凝土配比质量检查
        masonry: "0",              //人手孔砌筑及口圈、上覆的制作安装质量
        pave: "0",              //管道铺设及接续质量检查
        backfill: "0"             //回填土质量检查
    }
    var isTrueClick;
    $('body').on('click', '.valTest .clickW', function () {
        isTrueClick = true
        $(this).siblings().removeClass('activeBlue')
        $(this).addClass("activeBlue")
        var attrV = $(this).parent().attr("class")
        testAttrObj[attrV] = $(this).attr("index")
    })
    // 基本检查    baseTest
    // 线路工程检查    lineProTest
    // 设备安装工程检查    deviceTest
    // 管道工程检查    pipingTest
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
        if (!isTrueClick) return $.popInfo('请至少给出一项质量检查结果！')
        var newPostObj = testAttrObj
        newPostObj.fileJson = JSON.stringify(orFileData['postFileBtn'])
        newPostObj.fileUrlDel = delFileObjUrlList.join(",");//路径
        newPostObj.taskId = taskId
        newPostObj.conclusion = $(".conclusion").val()
        $.popConfirm({
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/taskQuality/getQualityInsert',
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
