$(function () {
    var departmentName = storage('departmentName')  //部门名称
    var departmentId = storage("departmentId") //部门id
    $(".departmentName").html(departmentName)
    var typePerson = storage('curDepPersonListLen') <= 0 ? true : false
    if(typePerson){
        $(".depRole[index = 1]").attr("checked",'checked')
    }
    // log(departmentId)
    var userData = {    //注释部分为非必传项
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
        userName: "账号",
        password: "密码",
        passwordConfirm: "确认密码"
    }
    //获取角色list
    getRoleAll('roleAllList')
    //提交人员添加
    function addSysUserInsert() {
        // log()
        var postObj = {
            depId: departmentId,
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
        for (var k in userData) {
            val = $("." + k).val()
            if (k == 'roleId') val = $(".roleAllList ").attr("index")
            if (!val) return $.popInfo('请填写' + userData[k])
            postObj[k] = val
        }
        if (orFileData["addPersonImg"].length) {
            var str = orFileData["addPersonImg"][orFileData["addPersonImg"].length - 1]
            delete str['waterPath']
            postObj['fileJson'] = JSON.stringify([str])
        }
        // if (!postObj.county) return $.popInfo('请选择联系地址！')
        // if (!postObj.address) return $.popInfo('请填写详细地址！')
        $.popConfirm({
            'title': '',
            'content': '确定提交当前内容吗？',
            'confirm': function () {
                $http({
                    url: '/gct-web/sysUser/getSysUserInsert',
                    data: postObj,
                    success: function (r) {
                        submitSuccess('操作成功', function () {
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
    postFiles('addPersonImg', true, { echoImg: '1' })
})
