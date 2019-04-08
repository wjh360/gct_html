$(function () {
    initfinanceApplyPage()

    //简单搜索
    $("body").on("click", '.searchBtn.serActive,.advanceInquBtn', function () {
        initfinanceApplyPage()
    })

    //点击添加报销，调用接口，看是否能进入页面
    $("body").on("click",'.addExpense',function () {
         isYesProcess(4001,function () {
             goNewPage("./ExpenseReimbursement/addReimbursement.html")
         })
    })

    // 点击编辑
    $("body").on("click", '.editMoney', function () {
        if(!tab_rowData.id) return false;
        isYesProcess(4001,function () {
            storage("MoneyId", tab_rowData.id, 'editReimbursement') //报销申请id 报销申请编辑
            goNewPage("./ExpenseReimbursement/editReimbursement.html")
        })

    })

    // 点击详情
    $("body").on("click", '#Reimbursement tbody tr', function () {
        if(!tab_rowData.id) return false;
        storage("MoneyId", tab_rowData.id, 'detailsReimbursement') //报销申请id 报销申请编辑详情
        goNewPage("./ExpenseReimbursement/detailsReimbursement.html")
    })


//    点击删除
    $("body").on("click",'.delete_Money',function () {
        if(!tab_rowData.id) return false;
        $.popConfirm({
            content:'确定要删除该报销吗？',
            confirm:function () {
                repayApplyDelete(tab_rowData.id)
            }
        })
    })



})

//初始化
//   projectName:”项目名称”
//   type:1  类型
//   companyName:“公司名称”
var appListData={}
function initfinanceApplyPage() {
    appListData={
        projectName:'',
        companyName:'',
        type:'',
        status:''
    }
    if ($(".searchBtn").hasClass("serActive")) {
        appListData.projectName = $(".searchVal").val()
    } else if ($(".advancedBox").hasClass("active")) {
        appListData.projectName = $(".projectName").val()
        appListData.companyName = $(".companyName").val()
        appListData.type = $(".type").attr("index")
        appListData.status = $(".statusType").attr("index")
    }

    $http({
        url: '/gct-web/repayApply/page',
        data: appListData,
        success: function (r) {
           if(!$(".type").attr("index")){
               if(!r.dataOthers)return false;
               r.dataOthers.unshift({
                   costName:'请选择',
                   id:''
               })
               getDownSelect("type", '请选择费用类型', r.dataOthers, 'id', 'costName')
           }
            initTable("ReimbursementTable", r.data, col)
        }
    })
}

//我参与的操作和报销状态去掉
// 费用报销初始化列表
var col = [
    {
        field: 'repayNo',
        title: '报销编号',
        width: '150'
    },{
        field: 'typeName',
        title: '费用类型',
        width: '150'
    },{
        field: 'projectName',
        title: '项目名称',
        width: '150'
    },{
        field: 'sumAmount',
        title: '总费用金额（元）',
        width: '100',
        formatter: function (a) {
            if (!a) return ''
            return '<span class="overf_Ec"  style="display:inline-block; max-width:100px;">'+a+'</span>'
        }
    },{
        field: 'status',
        title: '报销状态',
        width: '100',
        'class': 'myPartictarLi',
        formatter: function (a, b) {
            if (b.status == '3') return '报销审核中'
            else if (b.status == '4') return '报销未过审'
            else if (b.status == '5') return '报销已过审'

        }
    },{
        field: 'companyName',
        title: '创建单位',
        width: '150'
    },{
        field: 'trueName',
        title: '创建人',
        width: '150'
    },{
        field: 'createTime',
        title: '创建时间',
        width: '150',
        formatter: function (a) {
            return initDate(a,'s')
        }
    },{
        title: '操作',
        width: '100',
        'class': 'operatorBox',
        formatter: function (a, b) {
            // log(b)
             if(b.status == 4)return '<a data_power="Edit-reimbursement-operation" class="editMoney" title= "">编辑</a><a data_power="Delete-reimbursement-operation" class="delete_Money" style="color: #ff5454" title= "">删除</a>'
            else return '<a data_power="Edit-reimbursement-operation" class="noEdit" title= "">编辑</a><a data_power="Delete-reimbursement-operation" class="noEdit" title= "">删除</a>'

        }
    }

]


function repayApplyDelete(data) {
    $http({
        url: '/gct-web/repayApply/del',
        data: {
            id:data
        },
        success: function (r) {
            submitSuccess('',function () {
                initfinanceApplyPage()
            })
        }
    })
}

