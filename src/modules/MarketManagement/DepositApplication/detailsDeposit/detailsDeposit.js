$(function () {
    //     // 招标信息回显1
    var BiddingId = storage("BiddingId") //投标申请id
    var BondId = storage("BondId")  ////保证金id
    var statuShhow = storage("statuShhow")//状态
    log(statuShhow)
    if(statuShhow == '已回执'){
       $(".iconshow").show()
    }
    // 回显提交内容
    getBidAddlyInfo()
    function getBidAddlyInfo() {
        $http({
            url: '/gct-web/bidApply/getBidAddlyInfo',
            data: {
                id: BiddingId  //投标申请id
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".bidName").html(a.bidName) //投标名称
                $(".bidUnit").html(a.bidUnit) //投标单位
                $(".person").html(a.person) //联系人
                $(".tel").html(a.tel) //联系电话
                $(".bidDate").html(initDate(a.bidDate)) //预计投标日期
                $(".inviteAmount").html((a.inviteAmount ? a.inviteAmount : '0') + '元') //招标金额
                $(".bidAmount").html((a.bidAmount ? a.bidAmount : '0') + "元") //预计中标金额
                $(".bidOrice").html(a.bidOrice) //预计中标价格
                $(".inviteDescr").html(a.inviteDescr) //招标简介
                $(".remark_details").html(a.remark) //备注
                $(".projectPerson").html(a.projectPerson) //项目发起人
                // 回显地区
                if (a.regionList) {
                    $.each(a.regionList, function (index, eleVal) {
                        createProCity(eleVal)
                    })
                }
                $(".typeName").html(a.typeName)//项目类型
                getFileList(r.data.obj.fileList)
                getBondApplyInfo()
            }
        })
        //生成附件列表
        function getFileList(arr) {
            initTable("fileListTable", arr, fileColDetail)
        }
    }
    // 提交信息回显（详情）
    function getBondApplyInfo() {
        $http({
            url: '/gct-web/bondApply/getBondApplyInfo',
            data: {
                bondId: BondId     //保证金id
            },
            success: function (r) {
                if (!r.data.obj) return false
                var a = r.data.obj
                $(".bondUnit").html(a.bondUnit)//保证金收款单位
                $(".openBank").html(a.openBank)//收款单位开户行
                $(".bankAccount").html(a.bankAccount)//银行账户
                $(".perforAmount").html((a.perforAmount ? a.perforAmount : '0') + "元")//履约保证金
                $(".bondAmount").html((a.bondAmount ? a.bondAmount : '0') + "元")//保证金金额
                $(".bondBackAmount").html((a.bondBackAmount ? a.bondBackAmount : '0') + "元")//投标保证金
                $(".perforBackAmount").html((a.perforBackAmount ? a.perforBackAmount : '0') + "元")//履约保证金金额
                $(".bondDate").html(initDate(a.bondDate))//保证金缴纳日期
                $(".remark").html(a.remark)//备注
                getFileList1(r.data.obj.fileList)
            }
        })
    }
    //生成文件列表
    function getFileList1(arr) {
        initTable("fileListTable1", arr, fileColDetail)
    }
})
// var proCtiyCountyLen = 0  //项目地区数量
// var proCtiyCountyLen = 0  //项目地区数量
// function createProCity(data) {
//     proCtiyCountyLen++;
//     var str = ""
//     if (proCtiyCountyLen > 1) {
//         str = '<span class="nameId f_l" style="width:100px;height:34px;"></span>'
//     } else {
//         str = '<span class="nameId">项目地区：</span>'
//     }
//     var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
//         str +
//         '<span >' +
//         '<span style="padding:0 10px;text-indent:2em;">' + (data.provinceName?data.provinceName:'') + '</span>' +
//         '<span style="padding:0 10px;">' +(data.cityName?data.cityName:'') + '</span>' +
//         '<span style="padding:0 10px;">' + (data.countyName?data.countyName:'') + '</span>'
//     '</span>' +
//         '<span class="delProCity"></span>'
//     '</div>'
//     $(".addcountyMore").append(str)
// }