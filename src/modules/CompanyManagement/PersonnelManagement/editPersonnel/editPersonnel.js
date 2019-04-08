$(function () {
    
    var personId = storage("personId") //人员id
    var departmentId = storage("departmentId"); //部门id
    var userData = {
        trueName: "",
        depName: "",
        tel: "",
        email: "",
        idCard: "",
        addressInfo: "",
        userName: ""
    }
    $http({
        url: '/gct-web/sysUser/getSysUserInfo',
        data: {
            id: personId
        },
        success: function (r) {
            var getData = r.data ? r.data.user : ""
            if (!getData) return false
            $("[name = sex][value = " + getData.sex + "]").attr("checked", "checked") //性别
            $("[name = depRole][value = " + getData.leader + "]").attr("checked", "checked") //性别
            if(getData.leader != '领导'){
                $(".noLeader").show()
            }
            eachData(userData, getData) //循环回显
            getCodeEcho('proCtiyCounty', getData.province, getData.city, getData.county) //省市区
            getRoleAll('roleAllList',getData.roleId)
            postFiles('addPersonImg',true,{ echoImg:'1' })
            var sImg = getData.fileList && getData.fileList[0] ? getData.fileList[0].projectFileUrl : ""
            if(!sImg) return false
            $("#addPersonImg").find("img").attr("src", baseFileUrl + sImg)
        }
    })
//需提交 对象
    var userPostData = { //注释部分为非必传项
        trueName: "姓名",
        // sex: "性别(男或女)",
        // depId: "部门ID",
        // tel: "电话",
        // email: "邮箱",
        // idCard: "身份证",
        // province: "省",
        // city: "市",
        // county: "县",
        // address: "详情地址",
        roleId: "账号角色",
        userName: "账号"
    }
    //提交人员添加
    function addSysUserInsert() {
        // log()
        var postObj = {
            id:personId,
            province: getCodeSub('proCtiyCounty').province,
            city: getCodeSub('proCtiyCounty').city,
            sex: $("input[name='sex']:checked").val(),
            county: getCodeSub('proCtiyCounty').county,
            tel: $(".tel").val(),
            email: $(".email").val(),
            idCard: $(".idCard").val(),
            address: $(".address").val(),
            depRole: $("input[name='depRole']:checked").attr('index'),
        }
        for (var k in userPostData) {
            val = $("." + k).val()
            if (k == 'roleId') val = $(".roleAllList ").attr("index")
            if (!val) return $.popInfo( '请填写' + userPostData[k])
            postObj[k] = val
        }
        // if(!postObj.county) return $.popInfo('请选择联系地址！')
        // if(!postObj.address) return $.popInfo('请填写详细地址！')
        if(orFileData["addPersonImg"].length){
            var str = orFileData["addPersonImg"][orFileData["addPersonImg"].length-1]
            delete str['waterPath']
            postObj['fileJson'] = JSON.stringify([str])
        }
        $.popConfirm({
            'title':'',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/sysUser/getSysUserUpdate',
                    data: postObj,
                    success: function (r) {
                        submitSuccess('操作成功', function(){
                            goBack()
                        })
                    }
                })
            }
        })
    }
    //提交
    $("body").on("click", '.postBtn', function () {
        addSysUserInsert()
    })
})
