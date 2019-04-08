$(function () {
    var backInfoId = storage('backInfoId')
    $http({
        url: "/gct-web/finance/backInfo",
        data: {
            id: backInfoId
        },
        success: function (r) {

            if (!r.data) return false
            initData(r.data.payApplyList)
            if (r.data.userList && r.data.userList.length) {
                $.each(r.data.userList, function (index, eleVal) {
                    var str = eleVal.company.companyName + ' - ' + eleVal.department.depName + ' - ' + eleVal.trueName
                    $(".msgObjectList").append('<li style="padding:10px 20px;">' + str + '</li>')
                })
            } else $(".msgObjectList").parents(".commonCon").hide()
            if(!r.data.back) return false
            $(".fName").html(r.data.back.name)
            $(".amount").html(r.data.back.amount)
            $(".lisDate").html(initDate(r.data.back.date))
            $(".backTime").html(initDate(r.data.back.backTime, 's'))
            $(".backUser").html(r.data.backUser)
        }
    })
    function initData(data) {
        if (!data || !data.length) return $(".objectList").parents(".commonCon").hide()
        var dataObj = {}
        $.each(data, function (index, eleVal) {
            dataObj[eleVal.depId] = dataObj[eleVal.depId] || []
            dataObj[eleVal.depId].push(eleVal)
        })
        var index = 0
        for (var k in dataObj) {
            var tableId = 'fileListTable' + index
            var str = '<div class="page uploader_Table" style="padding:10px;">' +
                '<p class="objectTitle">' + dataObj[k][0].companyName + ' - ' + dataObj[k][0].depName + '</p>' +
                '<table id="' + tableId + '"></table>' +
                '</div>'
            $(".objectList").append(str)
            initTable(tableId, dataObj[k], col)
            index++;
        }
    }
})
var col = [
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
