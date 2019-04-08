$(function () {
    var editOrderCol = [
        {
            title: '',
            'class': "",
            width: '50',
            formatter: function (a,b) {
                if(b.checked) return '<span class=" checkBoxTrue"></span>'
                else return '<span class="checkBox"></span>'
            }
        }, 
        {
            field: 'datumName',
            title: '竣工技术文件名称',
            width: '200'
        }, 
        {
            field: 'projectName',
            title: '项目名称',
            width: '200'
        },
        {
            field: 'reportTrial',
            title: '报审值（元）',
            width: '200',
        }, 
        {
            field: 'companyName',
            title: '创建单位',
            width: '200',
        }, 
        {
            field: 'trueName',
            title: '创建人',
            width: '200',
        }, 
        {
            field: 'createTime',
            title: '创建时间',
            width: '200',
            formatter: function (a) {
                return initDate(a, 's')
            }
        }
    ]
    var orderId = storage("orderId")
    //回显
    initUpdatePackEcho()
    function initUpdatePackEcho() {
        $http({
            url: '/gct-web/order/updatePackEcho',
            data: {
                orderId: orderId
            },
            success: function (r) {
                $(".orderNo").val(r.data.order.orderNo)//订单编号
                $(".orderName").val(r.data.order.orderName)//订单名称
                // log(r)
                // 数据处理
                var arr1 = r.data.list;//选中
                var arr2 = r.data.listData; //未被选中
                $.each(arr1,function(index,el){
                    el.checked = true
                })
                var arr = arr1.concat(arr2);
                // log(arr)//[1,2,3,3,4,5]  //合并之后的
                // log(arr1)  //选中
                // log(arr2)  //未被选中
                initTable("editOrderTable", arr, editOrderCol, {
                    total: r.data,
                })
            }
        })
    }
    // 修改获取数据
    function updatePack() {
        $http({
            url: '/gct-web/order/updatePack',
            data: {
                id: orderId,
                orderName: $(".orderName").val(), //“订单名称”
                ids: tabObj['editOrderTable'].tab_select_ids.join(','), //工单id
                orderNo: $(".orderNo").val() //“订单编号”
            },
            success: function (r) {
                submitSuccess('', function () {
                    goBack()
                })
            }
        })
    }
    //提交
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
            confirm: function () {
                updatePack()
            }
        })
    })

    $('body').on("click", '.all_Select_Private', function () {
        $(".checkBox").addClass("checkBoxTrue")
        checkAllFun('editOrderTable')
        // tabObj['PackingTable']
    })
    $('body').on("click", '.all_Cancel_Private', function () {
        $(".checkBox").removeClass("checkBoxTrue")
        removecheckAllFun('editOrderTable')
        // tabObj['PackingTable']
    })
})