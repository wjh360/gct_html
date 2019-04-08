
$(function () {
    var col = [
        {
            field: 'taskName',
            title: '工单名称',
            width: 200
        },
        {
            field: 'projectName',
            title: '所属项目',
            width: 200
        },
        {
            field: 'trueName',
            title: '施工队长',
            width: 200
        },
        {
            field: 'createName',
            title: '检查人',
            width: 200
        },
        {
            field: 'result',
            title: '检查结果',
            width: 200
        },
        {
            field: 'createTime',
            title: '检查时间',
            width: 200,
            formatter: function (a) {
                return initDate(a, 's')
            }
        }
    ]
    //简单搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () { getSecurityList() })
    getSecurityList()
    function getSecurityList() {
        $http({
            url: '/gct-web/taskSafe/getSafePage',
            data: {
                startTime: $(".startTime").val(),               //开始时间
                endTime: $(".endTime").val(),                 //结束时间
                taskName: $(".taskName").val() || $(".searchVal").val(),                //工单名称
                projectName: $(".projectName").val(),             //项目名称
                status: $(".status").attr('index'),                  //1合格 2不合格
                trueName: $(".trueName").val(),               //姓名
            },
            success: function (r) {
                initTable('SecurityListTable', r.data, col)
            }
        })
    }
    $('body').on('click', '#SecurityListTable tbody tr', function () {
        storage('safeTestId', tab_rowData.id, 'detailsSecurityMnagement')
        goNewPage("./SecurityMnagement/detailsSecurityMnagement.html")
    })
})