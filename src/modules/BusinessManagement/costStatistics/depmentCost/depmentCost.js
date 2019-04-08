var departmentId = storage('departmentId')
var year = storage('year')
var depCost;
var perCapitaCost;
$(function () {
    depCostDetailByPage()
    // 部门审核
    function depCostDetailByPage() {
        $http({
            url: '/gct-web/costStatistics/depCostDetailByPage',
            data: {
                depId: departmentId,
                year: year
            },
            success: function (r) {
                depCost = r.dataOthers && r.dataOthers.depCost ? r.dataOthers.depCost : '0';
                perCapitaCost = r.dataOthers && r.dataOthers.perCapitaCost ? r.dataOthers.perCapitaCost : '0';
                $(".depCost").html(depCost)
                $(".perCapitaCost").html(perCapitaCost)
                if (!$("canvas").length) costDetail()
                initTable("depmentCostTable", r.data, depmentCostCol)
            }
        })
    }
    function costDetail() {
        $http({
            url: '/gct-web/costStatistics/costDetail',
            data: {
                depId: departmentId,
                year: year,
                icon: 1//标识：1-部门成本；2-项目成本
            },
            success: function (r) {
                //    如果
                datashow(r.data)
            }
        })
    }
    var myChart = echarts.init(document.getElementById('echartShowBox'));
    function datashow(data) {
        var legendArr = []
        var chatArr = []
        $.each(data, function (k, v) {
            legendArr.push(v.typeName)
            chatArr.push({
                name: v.typeName,
                value: v.applyAmount,
                indexEchart: k,
                label: {
                    normal: {
                        position: v.applyAmount < (depCost / 10) ? 'outside' : 'inside'
                    }
                }
            })
        })
        var option = {
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
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    position: [10, 10],
                    formatter: function (a) {
                        if (a.name.length <= 10) return a.name
                        else return ''
                    }
                }
            },
            series: [
                {
                    type: 'pie',
                    minAngle: '0.1',
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
    $('body').on('click', '.export_depment1', function () {
        var exportData = {}
        exportData.depId = departmentId;
        exportData.year = year;
        exportData.depCost = depCost;
        exportData.perCapitaCost = perCapitaCost;
        exportTable('/gct-web/costStatistics/exportDepCostDetail', exportData, this)
    })
})
var depmentCostCol = [
    {
        field: 'applyUserName',
        title: '申请人',
        width: '250'
    },
    {
        field: 'typeName',
        title: '费用类型',
        width: '250'
    },
    {
        field: 'applyAmount',
        title: '费用金额（元）',
        width: '200'
    },
    {
        field: 'auditTime',
        title: '审批时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
