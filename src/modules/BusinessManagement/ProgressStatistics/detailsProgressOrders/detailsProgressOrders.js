
$(function () {
    var frameContractId = storage("frameContractId")
    var OrderData = {
        id: frameContractId
    }
    getContractInfo()
    function getContractInfo() {
        $http({
            url: '/gct-web/statistics/getContractInfo',
            data: OrderData,
            success: function (r) {
                if (!$("canvas").length) {
                    dataEcharts(r.data.frameContractVO)
                }
                initTable("depmentCostTable", r.data.orderVOS, detailsProgressOrdersCol, {
                    total: Math.ceil((r.totalPage) / 10),
                })
                if (r.data.frameContractVOS && r.data.frameContractVOS.length > 0) {
                    var str = ''
                    $.each(r.data.frameContractVOS, function (k, v) {
                        str += '<div class="VOSTr"><i></i><span>' + v.yearCompletion + '年完成度：' + v.completionStatus + '</span>' +
                            '</div>'
                    })
                    $(".echartjD").html(str)
                }
            },
        })
    }
    //柱状图
    var myChart = echarts.init(document.getElementById('echartShowBox'));
    var option;
    function dataEcharts(data) {
        var chatArr = [data.contractAmount, data.amountAlreadySigned, data.amountOfInvoice, data.totalRefundYes]
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: 100
                // bottom:50
            },
            xAxis: {
                type: 'value',
                name: '元'
            },
            yAxis: {
                type: 'category',
                name: '款项',
                axisTick: {
                    show: false
                },
                data: ['框架合同金额', '已签订单金额', '开票金额', '回款总额']
            },
            series: [
                {
                    type: 'bar',
                    barWidth: 35,
                    barGap: 0,
                    barMinHeight: 3,
                    itemStyle: {
                        normal: {
                            color: '#6590ff'
                        }
                    },
                    data: chatArr
                }
            ]
        };
        myChart.setOption(option);
    }
    $('body').on('click', '.export_depment1', function () {
        exportTable('/gct-web/statistics/getContractInfoOrderExcel', OrderData, this)
    })
})
var detailsProgressOrdersCol = [
    {
        field: 'orderNo',
        title: '订单编号',
        width: '250'
    }, {
        field: 'orderName',
        title: '订单名称',
        width: '200'
    }, {
        field: 'projectName',
        title: '项目名称',
        width: '100'
    }, {
        field: 'orderAmount',
        title: '订单金额（元）',
        width: '100'
    }, {
        field: 'companyName',
        title: '建设单位',
        width: '100'
    }, {
        field: 'depName',
        title: '签订部门',
        width: '100'
    }, {
        field: 'createTime',
        title: '订单创建时间',
        width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    }
]
