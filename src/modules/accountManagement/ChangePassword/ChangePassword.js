$(function() {
    var passData = {
        oldPassword:'原密码',
        newPassword:'新密码',
        confirmPassword:'确认密码'
    }
    function changePassWord() {
        var obj = {},val = "";
        for(var k in passData){
            val = $("." + k).val()
            if(!val) return $.popInfo(passData[k] + '输入错误，请确认！')
            else obj[k] = val
        }
        $http({
            url:'/gct-web/user/getUpdatePassword',
            data:obj,
            success:function(r){
                $.popInfo(r.message)
                goNewPage('/login.html')
            }
        })
    }
    $("body").on("click",'.postBtn',function(){
        changePassWord()
    })
})