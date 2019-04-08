$(function () {
    var ids;
    function getData(data) {
        $http({
            url: "/gct-web/finance/backAddEcho",
            data: data,
            success: function (r) {
                if (!r.data) return false
                $(".objectList").html("")
                if (r.data.dataArr && !r.data.dataArr.length) return $.popInfo("未查询到收款对象!")
                if (r.data.dataArr && r.data.dataArr.length) {
                    $(".objectList").parents(".commonCon").show()
                    $.each(r.data.dataArr, function (index, eleVal) {
                        var tableId = 'fileListTable' + index
                        var str = '<div class="page uploader_Table" style="padding:10px;">' +
                            '<p class="objectTitle">' + r.data.title[index] + '</p>' +
                            '<table id="' + tableId + '"></table>' +
                            '</div>'
                        $(".objectList").append(str)

                        var col = cols 
                        initTable(tableId, eleVal, col, { iscollect: true })
                    })
                } else $(".objectList").parents(".commonCon").hide()
                $(".msgObjectList").html("")
                if (r.data.notice && r.data.notice.length) {
                    $(".msgObjectList").parents(".commonCon").show()
                    $.each(r.data.notice, function (index, eleVal) {
                        $(".msgObjectList").append('<li style="padding:10px 20px;">' + eleVal + '</li>')
                    })
                } else $(".msgObjectList").parents(".commonCon").hide()
                ids = r.data.ids
            }
        })
    }
    $("body").on("click", ".queryObjectBtn", function () {
        var data = {
            name: $(".fName").val(),                  //”付款方名称”
            amount: $(".amount").val()                    //32  到款金额 
        }
        getData(data)
    })
    $("body").on("click", ".postBtn", function () {
        // log(123)
        var applyIds = [];
        $('td.iscollectIds').each(function (i, el) {
            applyIds.push($(el).html())
        })
        if (!applyIds.length) return $.popInfo("暂无收款对象，请查询收款对象！")
        if (!ids) return $.popInfo("暂无通知对象，请联系收款执行部门！")
        if (!$(".bidTimeStr").val()) return $.popInfo("请选择到账日期！")
        $http({
            url: "/gct-web/finance/backAdd",
            data: {
                ids: ids,             //："28,29,52,54,55,56,74,75"
                name: $(".fName").val(),                //:”付款方名称”
                amount: $('.amount').val(),              //：32  到款金额 
                date: $(".bidTimeStr").val(),               //：“2018-01-01” 到款日期
                applyIds: applyIds.join()                //：“1，2，3” 付款申请ID
            },
            success: function (r) {
                submitSuccess('提交成功', function () {
                    goBack()
                })
            }
        })
    })
})
var cols = [
    {
        field: 'projectName',
        title: '项目名称',
        width: '200'
    }, {
        field: 'companyName',
        title: '建设单位',
        width: '200'
    }, {
        field: 'orderName',
        title: '订单名称',
        width: '200'
    }, {
        field: 'createTime',
        title: '付款申请时间',
        width: '200',
        formatter: function (a, b) {
            return initDate(a, 's')
        }
    }, {
        field: 'applyAmount',
        title: '付款申请金额(元)',
        width: '200'
    }
]
