$(function () {
    var personData = {
        "trueName": "",         //姓名	
        "sex": "",               //性别
        "depName": "",           //部门名称
        "tel": "",       //电话
        "email": "",    //联系邮箱
        "idCard": "",             //身份证
        "address": "",              //地址
        "addressInfo": "",       //详细地址
        "roleName": "",             //账号角色
        "userName": "",    //账号
    }
    $http({
        url: '/gct-web/user/getUser',
        success: function (r) {
            eachData(personData, r.data ? r.data : {})
        }
    })
})