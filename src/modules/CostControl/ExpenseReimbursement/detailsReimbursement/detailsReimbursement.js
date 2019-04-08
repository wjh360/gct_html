var MoneyId = storage("MoneyId")

$(function () {
    getBidAddlyInfo()
    $("body").on("click",'.picUploader_box',function () {
        if($(this).attr("index")){
            viewBigImg($(this).attr("index"))
        }
    })
})

//页面回显
function getBidAddlyInfo() {
    $http({
        url: '/gct-web/repayApply/info',
        data: {
            id: MoneyId //报销申请id
        },
        success: function (r) {
            if(r.data.repayApplyVO){
               if(r.data.repayApplyVO.sumAmount) $(".sumAmount").html(r.data.repayApplyVO.sumAmount+'元')
                $(".projectName").html(r.data.repayApplyVO.projectName)
                if(r.data.repayApplyVO.taskName)$(".taskName").html(r.data.repayApplyVO.taskName)
                else $(".taskName").parent().hide()
               if(r.data.repayApplyVO.sumAmount) $(".moneySum").html(r.data.repayApplyVO.sumAmount+'元')
            }
            //    数据回显
            if(!r.data.listInfo)return false;
            dataShow(r.data.listInfo)
        //  审核数据的返现
            if(r.data.listApply&&r.data.listApply.length>0){
                dataAudit(r.data.listApply)
            }

        }
    })
}

function dataShow(listInfo) {
    $.each(listInfo, function (k, v) {
        var str='<div class="commonCon borderE9">\n' +
            '                <div class="inforHeader clearfix">\n' +
            '                        <div class="verHang f_l"></div>\n' +
            '                        <div class="headerText f_l">费用'+(k+1)+'</div>\n' +
            '                </div>  \n' +
            '                <!--内容区-->\n' +
            '              <div class="Role-noticeCon">\n' +
            '                <div class="RoleDiv"style="margin-bottom: 25px">\n' +
            '                 <span class="nameId">费用日期：</span>\n' +
            '                 <span class="nameCon">'+initDate(v.date)+'</span>\n' +
            '                </div>\n' +
            '                <div class="RoleDiv">\n' +
            '                  <span class="nameId"style="vertical-align:top">费用类型：</span>\n' +
            '                  <span class="nameCon">'+v.typeName+'</span>\n' +
            '                </div>\n' +
            '                <div class="RoleDiv">\n' +
            '                        <span class="nameId"style="vertical-align:top">费用金额：</span>\n' +
            '                        <span class="nameCon">'+v.applyAmount+'</span>元\n' +
            '                      </div>\n' +
            '                <div class="RoleDiv">\n' +
            '                    <span class="nameId"style="vertical-align:top">费用用途：</span>\n' +
            '                    <span class="nameCon">'+v.purpose+'</span>\n' +
            '                  </div>\n' +
            '                  <div class="RoleDiv">\n' +
            '                        <span class="nameId"style="vertical-align:top">附件：</span>\n' +
            '                      <div class="picTr f_l clearfix">\n' +
            '                          <div class="picBigContainer f_l" style="width: 100%">\n';
        $.each(v.list,function (i,item) {
            str+='<div class="picUploader_box" index="'+item.projectFileUrl+'"><img src="'+(baseFileUrl+item.thumbnailUrl)+'" alt=""></div>'
        })

            str+='                          </div>\n' +
            '                      </div>\n' +
            '                      </div>\n' +
            '              </div>\n' +
            '            </div>'

        $(".reimburse").append(str)
    })
}

function dataAudit(listApply) {
    $.each(listApply,function (k,v) {
        var str = ' <div class="borderE9Mar10">\n' +
            '            <div class="inforHeader clearfix">\n' +
            '                <div class="verHang f_l"></div>\n' +
            '                <div class="headerText f_l">申请人：'+v.applyName+' 申请时间：'+initDate(v.applyTime,'s')+'</div>\n' +
            '            </div>\n' +
            '            <div class="white_Page" style="max-height: 250px">\n' +
            '                <div class="page uploader_Table">\n' +
            '                    <table id="auditTable'+k+'"></table>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            \n' +
            '        </div>'
        $(".ExpenseBox").append(str)
        initTable("auditTable"+k, v.list, col)

    })

}

var col = [
    {
        field: 'auditName',
        title: '审核人',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:200px;">'+a+'</span>'
        }

    }, {
        field: 'auditTime',
        title: '审核时间',
        width: '150',
        formatter: function (a) {
            if (!a) return '暂无'
            return initDate(a,'s')
        }
    }, {
        field: 'status',
        title: '审核结果',
        width: '200',
        formatter: function (a) {
            if (!a) return '暂无'
            return projectStatus[a-3]
        }
    }, {
        field: 'auditRemark',
        title: '审核意见',
        width: '500',
        formatter: function (a) {
            if (!a) return '暂无'
            return '<span class="overf_Ec"  style="display:inline-block; max-width:500px;">'+a+'</span>'
        }
    }
]
var projectStatus =['审核中','未通过','完成']
