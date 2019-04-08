
var strList = {}, //部门名称 数据序列
    selectedDepId = [],  //选中部门的id
    companyTreeObj = {}  //公司树对象
var newDownSelectIdx = 0;  //新建的单位下拉
$(function () {
    var frameContractId = storage("frameContractId") //框架合同id
    var postObj = {
        bidName: "投标名称",
        contractName: "合同名称",
        contractNo: "合同编号",
        contractAmount: "合同金额",
        startTime: "合同周期开始时间",
        endTime: "合同周期结束时间",
        companyName: "建设单位",
        paymentMode: "付款方式",
        balanceMode: "结算方式",
        // isAdvance:"",            //有无预付：1-有；2-无
        bondAmount: "保证金金额",
        bondBackAmount: "投标保证金回款",
        discount: '折扣'
        // depIdStr:"项目部部门ID", 
        // fileStr:"文件", 
    }
    $http({
        url: '/gct-web/frameContract/info',
        data: {
            frameContractId: frameContractId
        },
        success: function (r) {
            if (!r.data.frameContract) return false;
            eachData(postObj, r.data.frameContract)
            //投标名称不存在，隐藏
            if (!r.data.bidName) $(".bidName").parent().hide()
            if (r.data.frameContract && r.data.frameContract.isAdvance) $(".isAdvance").html(r.data.frameContract.isAdvance == 2 ? '无' : '有')
            if (!r.data.fcdList) return false;
            $.each(r.data.fcdList, function (i, val) {
                var companyId = val.company.id
                strList[companyId] = strList[companyId] ? strList[companyId] : {
                    companyName: val.company.companyName,
                    depList: []
                }
                strList[companyId]['depList'].push(val.depName)
                selectedDepId.push(val.depId)
            })
            showSelectedDep()
            // fileObjList =
            if (!r.data.fileList) return false;
            getFileList(r.data.fileList)
        }
    })
    function showSelectedDep() {
        var str = ""
        $(".Selected_dep_list").html("")
        for (var k in strList) {
            if (strList[k]['depList'].length) {
                str += '<li >' +
                    '<p class="company_name">' + strList[k].companyName + '</p>' +
                    '<p class="dep_name">' +
                    strList[k]['depList'].join("、 ") +
                    '</p>' +
                    '</li>'
            }
        }
        $(".Selected_dep_list").append(str)
    }

    function getFileList(arr) {
        initTable("fileListTable", arr, fileColDetail)
    }


})