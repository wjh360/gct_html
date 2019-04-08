var projectId = storage('projectId')
var projectCost;
var projectOrderAmount;
$(function () {
    projectCostDetailByPage()
    // 部门审核
    function projectCostDetailByPage() {
        $http({
            url: '/gct-web/costStatistics/projectCostDetailByPage',
            data: {
                projectId: projectId,
            },
            success: function (r) {
                projectOrderAmount = r.dataOthers.projectOrderAmount ? r.dataOthers.projectOrderAmount : '0';
                projectCost = r.dataOthers.projectCost ? r.dataOthers.projectCost : '0';
                $(".projectOrderCost").html(projectOrderAmount)
                $(".projectCost").html(projectCost)
                if (!$("canvas").length) costDetail()
                initTable("depmentCostTable", r.data, projectCostCol)
            }
        })
    }
    function costDetail() {
        $http({
            url: '/gct-web/costStatistics/costDetail',
            data: {
                projectId: projectId,
                icon: 2//标识：1-部门成本；2-项目成本
            },
            success: function (r) {
                //如果
                datashow(r.data)
            }
        })
    }
    var myChart = echarts.init(document.getElementById('echartShowBox'));
    var option;
    var chatArr = []
    function datashow(data) {
        var legendArr = []
        $.each(data, function (k, v) {
            legendArr.push(v.typeName)
            chatArr.push({
                name: v.typeName,
                value: v.applyAmount,
                indexEchart: k,
                label: {
                    normal: {
                        position: v.applyAmount < (projectCost / 10) ? 'outside' : 'inside'
                    }
                }
            })
        })
        option = {
            color: ['#facac0', '#9ab6ff', '#ffe2a0', '#c6bdf6', '#ffd573', '#97cfff', '#ffa8a8', '#b1db9e', '#facd89', '#8be0c7'],
            tooltip: {
                trigger: 'item',
                formatter: "{b} :<br/>{c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right: '5%',
                top: '10%',
                itemGap: 50,
                itemWidth: 14,
                data: legendArr,
                position: 'outside',
                formatter: function (name) {
                    // return echarts.format.truncateText(name, 120,'', '…');
                    return initText(name, 10);
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    backgroundColor: 'rgba(50,50,50,0.4)',
                    position: [10, 10],
                    formatter: function (a) {
                        if (a.name.length > 10) return a.name
                        else return ''
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    minAngle: '0.1',//最小角度
                    radius: '70%',
                    center: ['30%', '55%'],//扇形图的中心点
                    label: {
                        normal: {
                            show: true,
                            formatter: '{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                        },
                    },
                    data: chatArr
                }
            ]
        };
        myChart.setOption(option);
    }
    $('body').on('click', '.export_project1', function () {
        var exportData = {}
        exportData.projectId = projectId;
        exportData.projectCost = projectCost;
        exportData.projectOrderAmount = projectOrderAmount;
        exportTable('/gct-web/costStatistics/exportProjectCostDetail', exportData, this)
    })
})
var projectCostCol = [
    {
        field: 'typeName',
        title: '费用类型',
        width: '250'
    }, {
        field: 'applyAmount',
        title: '费用金额（元）',
        width: '200'
    }, {
        field: 'companyName',
        title: '创建单位',
        width: '200'
    }, {
        field: 'createName',
        title: '创建人',
        width: '200'
    }, {
        field: 'auditTime',
        title: '审批时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]