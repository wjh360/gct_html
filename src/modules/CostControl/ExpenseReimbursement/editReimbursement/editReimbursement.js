var MoneyId = storage("MoneyId")
var auditItem = 4001;//报销
var appilObj = {};//提交数据
var applyFalg = true;
var buyMoneyList = []
$(function () {

    // 回显下拉框项目和费用类型下拉
    getBidAddlyInfo()

    //点击项目回显工单的下拉
    $("body").on("click", '#projectListBox li', function () {
        event.stopPropagation();
        listByProjectId($(this).attr("index"))
    })
    //  费用金额失去焦点时======芳芳姐确认要失去焦点时候计算费用总金额
    $("body").on('blur', '.applyAmount', function () {
        var sunMoney = 0;
        $(".applyAmount").each(function (k, v) {
            sunMoney = money_Add(sunMoney, $(v).val())
        })

        $(".sumAmount").html(sunMoney)
    })


    //费用报销添加
    function addReimbursement() {
        var postObj = {
            projectId: $(".projectType").attr("index"), //项目id
            taskId: $(".taskId").attr("index"), //工单id
            sumAmount: $(".sumAmount").val(), // 总费用
            info: infoArr, //费用信息
        }
        var infoArr = []
        var infoArr_obj = {
            dateS: $(".dateS").val(), // 日期
            type: $(".type").attr("index"), //类型
            applyAmount: $(".applyAmount").val(), //费用金额
            purpose: $(".purpose").val() //用途
        }
        infoArr.push(infoArr_obj);
        postObj.info = JSON.stringify(infoArr)
        $http({
            url: '/gct-web/repayApply/add',
            data: postObj,
            success: function (r) {
                goBack()
            }
        })

    }


    //  点击添加费用append内容
    $("body").on("click", '.addMoney', function () {
        var str_con = "";
        //通过reimburseMent的长度来判断后缀（消费几，删除（index='上传的id'），上传的id，消费日期,消费类型）
        var ind = $(".reimburseMent").length + 1;
        str_con += '<div class="reimburseMent"><div class="commonCon ">\n' +
            '                <div class="inforHeader clearfix">\n' +
            '                    <div class="verHang f_l"></div>\n' +
            '                    <div class="headerText f_l">费用<span class="reimIndex">' + ind + '</span></div>' +
            '                     <div class="pic_delete_page f_r" index="uploaderFile' + ind + '" ><img src="./../../../../img/money_delete.png" style="width: 40px;height: 40px" alt=""></div>' +
            '                </div>\n' +
            '                <!--内容区-->\n' +
            '                <div class="Role-noticeCon">\n' +
            '                    <div class="RoleDiv" style="margin-bottom: 0;">\n' +
            '                        <span class="nameId"><i>*</i>费用日期：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                            <div class="jeinpbox f_l" style="width: 230px">\n' +
            '                                <input type="text" class="jeinput dateS" id="bidTimeStr' + ind + '" placeholder="请选择费用日期" />\n' +
            '                                <span class="jeinput_icons"></span>\n' +
            '                            </div>\n' +
            '                        </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>费用类型：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                            <div id="type' + ind + '" class="downSelect buyMoneyType" style="margin-top: 3px;width: 150px;"> </div>\n' +
            '                        </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>费用金额：</span>\n' +
            '                        <span class="nameCon">\n' +
            '                            <input placeholder="" class="applyAmount money" type="text" maxlength="13" style="width: 350px;">元\n' +
            '                        </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>费用用途：</span>\n' +
            '                        <span class="nameCon ">\n' +
            '                            <input placeholder="" class="purpose" type="text" maxlength="100" style="width: 550px;">\n' +
            '                        </span>\n' +
            '                    </div>\n' +
            '                    <div class="RoleDiv">\n' +
            '                        <span class="nameId" style="vertical-align:top"><i>*</i>附件：</span>\n' +
            '                        <div class="picTr f_l clearfix">\n' +
            '                           <div class="nameCon" style="width: 100%">\n' +
            '                               最少上传一张，支持上传jpg、png格式文件，最多10张，支持多选上传。\n' +
            '                           </div>\n' +
            '                            <div class="picBigContainer f_l" style="width: 100%">\n' +
            '                                <div id="uploaderFile' + ind + '" class="uploaderFile"></div>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div></div>'
        $(".addMoney_con").append(str_con)
        postFiles("uploaderFile" + ind, true)//文件上传
        getDownSelect("type" + ind, '请选择费用类型', buyMoneyList, 'id', 'costName')//消费类型

    })


//   点击消费n的删除
    $("body").on("click", '.pic_delete_page', function () {
        //  1. 获取当前的index，图片删除
        //  2.消费记录字数改动reimIndex
        var upFileId = $(this).attr("index");//uploaderFile2
        if(orFileData[upFileId].length>0){
            $.each(orFileData[upFileId], function (k, v) {
                if (v.projectFileUrl) {
                    delFileObjUrlList.push(v.projectFileUrl)
                }     ///被删除的文件 url list
                if (v.thumbnailUrl) {
                    delFileObjUrlList.push(v.thumbnailUrl)
                }        //被删除的文件id list
            })
        }
        if(orFileData[upFileId+'Echo']&&orFileData[upFileId+'Echo'].length>0){
            $.each(orFileData[upFileId+'Echo'], function (k, v) {
                if (v.projectFileUrl) {
                    delFileObjUrlList.push(v.projectFileUrl)
                }     ///被删除的文件 url list
                if (v.thumbnailUrl) {
                    delFileObjUrlList.push(v.thumbnailUrl)
                }        //被删除的文件id list
            })
        }

        orFileData[upFileId] = []
        orFileData[upFileId+'Echo'] = []
        $(this).parents(".reimburseMent").html("")
        $(".reimIndex").each(function (k, v) {
            $(".reimIndex").eq(k).html(k + 1)
        })

    })

//    点击图片的删除
    $("body").on("click", '.delete_pic', function () {
        var upFileId = $(this).attr("name");//uploaderFile2
        var upFilefileIdx = $(this).attr("index");//文件的id（fileIdx）
        var upFilefileUrl = $(this).attr("data_index");//文件的路径，回显的图片，通过路径删除
        if(upFilefileIdx){
            for (var i = 0; i < orFileData[upFileId].length; i++) {
                if (orFileData[upFileId][i].fileIdx == upFilefileIdx) {
                    if (orFileData[upFileId][i].projectFileUrl) {
                        delFileObjUrlList.push(orFileData[upFileId][i].projectFileUrl)
                    }     ///被删除的文件 url list
                    if (orFileData[upFileId][i].thumbnailUrl) {
                        delFileObjUrlList.push(orFileData[upFileId][i].thumbnailUrl)
                    }        //被删除的文件id list
                    orFileObj[upFileId + 'Uploader'].removeFile(upFilefileIdx, true)
                    orFileData[upFileId].splice(i, 1)
                    break;
                }
            }
        }else if(upFilefileUrl){
            for (var i = 0; i < orFileData[upFileId+'Echo'].length; i++) {
                var b = orFileData[upFileId+'Echo'][i]
                if (b.projectFileUrl == upFilefileUrl) {
                    if (b.projectFileUrl) {
                        delFileObjUrlList.push(b.projectFileUrl)
                    }     ///被删除的文件 url list
                    if (b.thumbnailUrl) {
                        delFileObjUrlList.push(b.thumbnailUrl)
                    }        //被删除的文件id list
                    orFileData[upFileId+'Echo'].splice(i, 1)
                    break;
                }
            }
        }


        $(this).parent().remove()
        if ($('#' + upFileId).parents(".picBigContainer").find(".picUploader_box").length != 10) {
            $('#' + upFileId).show()
        }

    })

//    点击提交，获取数据
    $("body").on("click", '.postBtn', function () {
        $.popConfirm({
            content: "<div class='warnIcon'><i></i>确认提交当前操作吗?</div>",
            confirm: function () {
                applyVerify()
                if (applyFalg) {
                    doupdate()
                }
            }
        })
    })


})

//页面回显
function getBidAddlyInfo() {
    $http({
        url: '/gct-web/repayApply/updateEcho',
        data: {
            id: MoneyId //报销申请id
        },
        success: function (r) {
            auditNoPassRemark(MoneyId,auditItem)
            if(r.data.repayApplyVO){
                $(".sumAmount").html(r.data.repayApplyVO.sumAmount)
                getDownSelect("projectListBox", r.data.repayApplyVO.projectName, r.data.listProject, 'id', 'projectName')
                $(".projectListBox").attr("index", r.data.repayApplyVO.projectId)
                listByProjectId(r.data.repayApplyVO.projectId, r.data.repayApplyVO)
            }
            if(!r.data.listType) return false;
            buyMoneyList = r.data.listType;//费用类型
            //    数据回显
            if(!r.data.listInfo)return false;
            dataShow(r.data.listInfo)
        }
    })
}

function dataShow(listInfo) {
    $.each(listInfo, function (k, v) {
        var str = '<div class="reimburseMent">\n' +
            '                <div class="commonCon ">\n' +
            '                    <div class="inforHeader clearfix">\n' +
            '                        <div class="verHang f_l"></div><div class="headerText f_l">费用<span class="reimIndex">'+(k+1)+'</span></div>';
        //删除按钮
        if (k != 0) str += '<div class="pic_delete_page f_r" index="uploaderFile' + (k + 1) + '" ><img src="./../../../../img/money_delete.png" style="width: 40px;height: 40px" alt=""></div>';
        str += '</div>\n' +
            ' <!--内容区-->\n' +
            ' <div class="Role-noticeCon">\n' +
            '      <div class="RoleDiv" style="margin-bottom: 0;">\n' +
            '        <span class="nameId"><i>*</i>费用日期：</span>\n' +
            '         <span class="nameCon">\n' +
            '          <div class="jeinpbox f_l" style="width: 230px">\n' +
            '               <input type="text" class="jeinput dateS" id="bidTimeStr' + (k+1) + '" placeholder="请选择费用日期" value="'+initDate(v.date)+'" /><span class="jeinput_icons"></span>\n' +
            '           </div>\n' +
            '         </span>\n' +
            '        </div>\n' +
            '         <div class="RoleDiv">\n' +
            '             <span class="nameId" style="vertical-align:top"><i>*</i>费用类型：</span>\n' +
            '              <span class="nameCon">\n' +
            '                   <div id="type' + (k+1) + '" class="downSelect buyMoneyType" style="margin-top: 3px;width: 150px;"> </div>\n' +
            '              </span>\n' +
            '           </div>\n' +
            '           <div class="RoleDiv">\n' +
            '                <span class="nameId" style="vertical-align:top"><i>*</i>费用金额：</span>\n' +
            '                    <span class="nameCon">\n' +
            '                         <input placeholder="" class="applyAmount money" type="text" maxlength="13" value="'+v.applyAmount+'" style="width: 350px;">元\n' +
            '                    </span>\n' +
            '                 </div>\n' +
            '            <div class="RoleDiv">\n' +
            '                 <span class="nameId" style="vertical-align:top"><i>*</i>费用用途：</span>\n' +
            '                 <span class="nameCon ">\n' +
            '                      <input placeholder="" class="purpose" type="text" maxlength="100" value="'+v.purpose+'" style="width: 550px;">\n' +
            '                   </span>\n' +
            '             </div>\n' +
            '           <div class="RoleDiv">\n' +
            '              <span class="nameId" style="vertical-align:top"><i>*</i>附件：</span>\n' +
            '              <div class="picTr f_l clearfix">\n' +
            '                   <div class="nameCon" style="width: 100%">\n' +
            '                               最少上传一张，支持上传jpg、png格式文件，最多10张。\n' +
            '                    </div>\n' +
            '                     <div class="picBigContainer f_l" style="width: 100%">\n';
                    $.each(v.list,function (i,item) {
                     str+='<div class="picUploader_box"><img src="'+(baseFileUrl+item.projectFileUrl)+'" alt="">\n' +
                         '<div class="delete_pic" index="" data_index="'+(item.projectFileUrl)+'" name="uploaderFile'+(k+1)+'"></div> </div>'
                    })

            str+='                             <div id="uploaderFile' + (k+1) + '" class="uploaderFile"></div>\n' +
            '                     </div>\n' +
            '                </div>\n' +
            '          </div>\n' +
            '      </div>\n' +
            '  </div></div>'
        $(".addMoney_con").append(str)
        postFiles("uploaderFile"+(k+1), true)//文件上传
        getDownSelect("type"+(k+1), v.typeName,buyMoneyList, 'id', 'costName')//消费类型
        $(".type"+(k+1)).attr("index",v.type)
        orFileData['uploaderFile'+(k+1)+'Echo']=v.list;//存放原来的数据
        if(v.list.length==10){
            $("#uploaderFile"+(k+1)).hide()
        }

    })
}

// 通过项目的id，获取工单下拉
function listByProjectId(id, repayApplyVO) {
    $http({
        url: '/gct-web/task/listByProjectId',
        data: {
            projectId: id //项目名称
        },
        success: function (r) {
            if(!r.data) return false;
            r.data.unshift({
                id: '',
                taskName: '请选择'
            })
            getDownSelect("taskListBox", '请选择工单名称', r.data, 'id', 'taskName')
            if (repayApplyVO && repayApplyVO.taskId) {
                $(".taskListBox").html(repayApplyVO.taskName).attr("index", repayApplyVO.taskId)
            }
        }
    })

}

function applyVerify() {
    applyFalg=true;
    appilObj.id =MoneyId
    appilObj.projectId =$(".projectListBox").attr("index")
    appilObj.taskId =$(".taskListBox").attr("index")
    appilObj.sumAmount =$(".sumAmount").html()//总费用
    if (!appilObj.projectId) {applyFalg = false;$.popInfo("请选择项目名称");return false}
    if (appilObj.sumAmount<=0) {applyFalg = false;$.popInfo("请填写费用金额");return false}

    // 费用
    var reimburseMentInfo=[];
    var uploaderFileArr =[];
    $(".reimburseMent").each(function (k,v) {
        var  kIndex= k+1
        if($(v).html()!=''){
            var reimburseMentInfoObj={}
            reimburseMentInfoObj.dateS=$("#bidTimeStr"+kIndex).val()
            if(reimburseMentInfoObj.dateS==''){applyFalg = false;$.popInfo("请选择费用"+(reimburseMentInfo.length+1)+" 费用日期");return false}
            reimburseMentInfoObj.type=$(".type"+kIndex).attr("index")
            if(reimburseMentInfoObj.type==''){applyFalg = false;$.popInfo("请选择费用"+(reimburseMentInfo.length+1)+" 费用类型");return false}
            reimburseMentInfoObj.applyAmount=$(v).find(".applyAmount").val()
            if(!reimburseMentInfoObj.applyAmount){applyFalg = false;$.popInfo("请选择费用"+(reimburseMentInfo.length+1)+" 费用金额");return false}
            reimburseMentInfoObj.purpose=$(v).find(".purpose").val()
            if(!reimburseMentInfoObj.purpose){applyFalg = false;$.popInfo("请选择费用"+(reimburseMentInfo.length+1)+" 费用用途");return false}
            if($(v).find(".picUploader_box").length==0){applyFalg = false;$.popInfo("请选择费用"+(reimburseMentInfo.length+1)+"费用附件");return false}
            
            for(var i=0;i<orFileData['uploaderFile'+kIndex].length;i++){
                orFileData['uploaderFile'+kIndex][i].id=reimburseMentInfo.length+1
                uploaderFileArr.push(orFileData['uploaderFile'+kIndex][i])
            }
            if(orFileData['uploaderFile'+kIndex+'Echo']){
                for(var i=0;i<orFileData['uploaderFile'+kIndex+'Echo'].length;i++){
                    orFileData['uploaderFile'+kIndex+'Echo'][i].id=reimburseMentInfo.length+1
                    uploaderFileArr.push(orFileData['uploaderFile'+kIndex+'Echo'][i])
                }
            }


            reimburseMentInfo.push(reimburseMentInfoObj)
        }
    })


    appilObj.info=JSON.stringify(reimburseMentInfo)
    appilObj.files=JSON.stringify(uploaderFileArr)
    appilObj.urls=delFileObjUrlList.join(",")
    // orFileData是个对象


}

//提交
function doupdate() {
    $http({
        url: '/gct-web/repayApply/update',
        data:appilObj,
        success: function (r) {
            submitSuccess('',function () {
                goBack()
            })
        }
    })

}