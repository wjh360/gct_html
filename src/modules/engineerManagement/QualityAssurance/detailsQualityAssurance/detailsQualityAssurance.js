$(function () {
    //回显工单list
    var qualityTestId = storage('qualityTestId');
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
    $http({
        url: '/gct-web/taskQuality/getTaskQualityInfo',
        data: {
            id: qualityTestId
        },
        success: function (r) {
            var getData = r.data && r.data.taskQualityVO ? r.data.taskQualityVO : {}
            for (var k in testAttrObj) {
                var str = getData[k]
                $("." + k).html(str == 2 ? '不合格' : (str == 1 ? '合格' : '未检查'))
            }
            $(".conclusion").html(getData.conclusion)

            $(".taskName").html(getData.taskName)
            $(".projectName").html(getData.projectName)
            $(".trueName").html(getData.trueName)
            $(".createName").html(getData.createName)
            initTable("fileListTable", getData.fileList, fileColDetail)
        }
    })
})