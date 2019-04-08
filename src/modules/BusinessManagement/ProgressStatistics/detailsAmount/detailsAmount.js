var AmountgetData = {}
downDatasLen = []
var d = new Date();
var str = d.getFullYear();
$(function () {
    // alert(str)
    var projectId = storage("projectId")
    getConstructionAmountEcho()
    function getConstructionAmountEcho() {
        var d = new Date();
        var str = d.getFullYear();
        $http({
            url: '/gct-web/statistics/getConstructionAmountEcho',
            data: {
                id: projectId,
            },
            success: function (r) {
                getDownSelect("type", str, r.data.taskVOS, 'id', 'yearSelect', ['yearConstructionAmount', 'constructionAmount'])
                $.each(r.data.taskVOS, function (index, el) {
                    $(".constructionAmount").html(el.constructionAmount + "元") //施工额
                    $(".yearConstructionAmount").html(el.yearConstructionAmount + "元") //年施工额
                })
                getConstructionAmountPage()
            }
        })
    }
    // 根据年份回显列表
    $(document).on("mouseup", "#type li", function (event) {
        event.stopPropagation();
        var year = $(this).text();
        // alert(year)
        // alert(year)
        // getConstructionAmountPage();
        $(".constructionAmount").html($(this).attr("morepar_constructionamount") + "元") //施工额
        $(".yearConstructionAmount").html($(this).attr("morepar_yearconstructionamount") + "元") //年施工额
        getConstructionAmountPage1();
        function getConstructionAmountPage1() {
            AmountgetData.id = projectId
            AmountgetData.year = year
            $http({
                url: '/gct-web/statistics/getConstructionAmountPage',
                data: AmountgetData,
                success: function (r) {
                    initTable("detailsAmountTable", r.data, detailsAmountTableCol, {
                        total: r.data,
                    })
                }
            })
        }
    });
    function getConstructionAmountPage() {
        AmountgetData.id = projectId
        AmountgetData.year = str
        $http({
            url: '/gct-web/statistics/getConstructionAmountPage',
            data: AmountgetData,
            success: function (r) {
                initTable("detailsAmountTable", r.data, detailsAmountTableCol, {
                    total: r.data,
                })
            }
        })
    }
    $("body").on("click", ".Amount_exportBtn", function () {
        exportTable('/gct-web/statistics/getConstructionAmountExcel', AmountgetData, this)
    })
})
var detailsAmountTableCol = [
    {
        field: 'taskName',
        title: '工单名称',
        width: '200'
    },
    {
        field: 'constructEstimate',
        title: '施工造价估算',
        width: '100'
    },
    {
        field: 'companyName',
        title: '施工单位',
        width: '200',
    },
    {
        field: 'userName',
        title: '施工队长',
        width: '200',
    },
    {
        field: 'actualEndDate',
        title: '实际完工日期',
        width: '200',
        formatter: function (a) {
            return initDate(a)
        }
    }
]