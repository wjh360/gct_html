
$(function () {
    initData();//初始化数据，用于表格的回显

    //点击添加
    $("body").on("click", '.add_supplier', function () {
        var str = '<div style="margin-top: 17px"><span class="tan_text"><i class="m_red">*</i>供应商名称：</span><input class="inputOrgan sup_name" maxlength="100" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text"><i class="m_red">*</i>供应商地址：</span><input class="inputOrgan sup_address" maxlength="100" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text">供应商开户行：</span><input class="inputOrgan sup_openBank" maxlength="50" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text">供应商账户：</span><input class="inputOrgan sup_account" maxlength="50" style="width: 300px"></div>';
        $.popConfirm({
            title: '添加供应商',
            content: str,
            confirm: function () {
                var addObj = {
                    name: $(".sup_name").val(),
                    address: $(".sup_address").val(),
                    openBank: $(".sup_openBank").val(),
                    account: $(".sup_account").val()
                }
                if (addObj.name == '') { $.popInfo("请填写供应商名称"); return false; }
                if (addObj.address == '') { $.popInfo("请填写供应商地址"); return false; }
                supplierAdd(addObj)
            }
        })
        $(".box-content").css({
            'max-height': '500px'
        })
    })
    //点击编辑
    $("body").on("click", '.edit_supplier', function () {
        if (!tab_rowData.id) return false;
        var str = '<div style="margin-top: 17px"><span class="tan_text"><i class="m_red">*</i>供应商名称：</span><input class="inputOrgan sup_name" maxlength="100" value="' + tab_rowData.name + '" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text"><i class="m_red">*</i>供应商地址：</span><input class="inputOrgan sup_address" maxlength="100" value="' + tab_rowData.address + '" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text">供应商开户行：</span><input class="inputOrgan sup_openBank" maxlength="50" value="' + (tab_rowData.openBank ? tab_rowData.openBank : '') + '" style="width: 300px"></div>' +
            '<div style="margin-top: 17px"><span class="tan_text">供应商账户：</span><input class="inputOrgan sup_account" maxlength="50" value="' + (tab_rowData.account ? tab_rowData.account : '') + '" style="width: 300px"></div>';
        $.popConfirm({
            title: '编辑供应商',
            content: str,
            confirm: function () {
                var addObj = {
                    id: tab_rowData.id,
                    name: $(".sup_name").val(),
                    address: $(".sup_address").val(),
                    openBank: $(".sup_openBank").val(),
                    account: $(".sup_account").val()
                }
                if (addObj.name == '') { $.popInfo("请填写供应商名称"); return false; }
                if (addObj.address == '') { $.popInfo("请填写供应商地址"); return false; }
                supplierUpdate(addObj)
            }
        })
        $(".box-content").css({
            'max-height': '500px'
        })
    })
    //点击删除
    $("body").on("click", '.delete_supplier', function () {
        if (!tab_rowData.id) return false;
        $.popConfirm({
            content: '确定要删除该供应商吗？',
            confirm: function () {
                supplierDel(tab_rowData.id)
            }
        })
    })
    //点击采购订单
    $("body").on("click", '.buy_History', function () {
        if (!tab_rowData.id) return false;
        storage('supperlierId', tab_rowData.id, 'purchaseHistory')
        goNewPage('./supplierManagement/purchaseHistory.html')
    })
    //简单搜索
    $("body").on("click", '.searchBtn.serActive', function () {
        initData()
    })
    //    点击导出
    //    点击导出
    $("body").on("click", '.export_Btn', function () {
        exportTable('/gct-web/purchasePlan/exportSupplierList', appListData, this)
    })
})
var appListData;
function initData() {
    appListData = {
        name: '',     //单位名称
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.name = $(".searchVal").val();//简答搜索
    }
    $http({
        url: '/gct-web/purchasePlan/supplierPage',
        data: appListData,
        success: function (r) {
            initTable('LowListTable', r.data, col)
        }
    })
}
var col = [
    {
        field: 'name', title: '供应商名称', width: '150',
        formatter: function (a) {
            return '<span class="overf_Ec"  style="display:inline-block; max-width:150px;">'+a+'</span>'
        }
    },
    {
        field: 'address', title: '供应商地址', width: '150',
        formatter: function (a, row) {
            var address = getCodeTxt(row.province, row.city, row.county) + a;
            return '<span class="overf_Ec"  style="display:inline-block; max-width:150px;">'+address+'</span>'
        }
    },
    {
        field: 'openBank', title: '供应商开户行', width: '150',
        formatter: function (a, row) {
            if (!a) return '暂无'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:150px;">'+a+'</span>'
        }
    },
    {
        field: 'account', title: '供应商账户', width: '150',
        formatter: function (a, row) {
            if (!a) return '暂无'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:150px;">'+a+'</span>'
        }
    },
    {
        field: 'createTime', title: '创建时间', width: '200',
        formatter: function (a) {
            return initDate(a, 's')
        }
    },
    {
        title: '操作', "class": 'proListOper', width: '170',
        formatter: function (a, row) {
            var str = "";
            str += '<span data_power="Purchase-history-list" class = "buy_History m_col" >采购历史</span>'
            str += '<span data_power="Edit-supplier-operation" class = "edit_supplier m_col" >编辑</span>'
            str += '<span data_power="Delete-supplier-operation" class = "delete_supplier m_red" >删除</span>'
            return str
        }
    }
];
//添加
function supplierAdd(data) {
    $http(' /gct-web/purchasePlan/supplierAdd', data, function (r) {
        submitSuccess('', function () {
            initData()
        })
    })
}
//编辑
function supplierUpdate(data) {
    $http('/gct-web/purchasePlan/supplierUpdate', data, function (r) {
        submitSuccess('', function () {
            initData()
        })
    })
}
//删除
function supplierDel(data) {
    $http(' /gct-web/purchasePlan/supplierDel', {
        id: data
    }, function (r) {
        submitSuccess('', function () {
            initData()
        })
    })
}
