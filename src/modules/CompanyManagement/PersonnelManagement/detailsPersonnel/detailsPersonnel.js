$(function(){
    var userData =  {
        "trueName": "",      //姓名
        "sex": "",          //性别
        "depName": "",     //部门名称
        "tel": "",   //电话
        "email": "",   //邮箱
        "idCard": "",     //身份证
        "address": "",         //省 市 县
        "addressInfo": "",      //详情地址
        "roleName": "",    //账号名称
        "userName": "",    //账号
        "leader":""
      }
    var personId = storage("personId") //人员id
    $http({
        url:'/gct-web/sysUser/getSysUserInfo',
        data:{
            id:personId
        },
        success:function(r){
           eachData(userData,r.data ? r.data.user : {})
           var sImg = r.data.user.fileList && r.data.user.fileList[0] ? r.data.user.fileList[0].projectFileUrl : ""
            if(!sImg) return false
            $("#addPersonImg").find("img").attr("src", baseFileUrl + sImg)
        }
    })
    
})