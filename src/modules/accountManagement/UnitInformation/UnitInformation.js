$(function () {

    var company = {
        "companyName": "",  //单位名称
        "companyAbbreviation": "",       //单位缩写
        "companyPerson": "",            //联系人
        "companyTel": "",               //单位电话
        "companyEmail": "",             //单位邮箱
        "companyAddress": "",           //单位地址
        "companyAddressInfo": "",        //单位详情地址
        "companyAccountExpirationDate": "",       //到期时间
        "userName": "",         //账号
        "trueName": ""            //用户名
    }
    $http({
        url: '/gct-web/user/getUnit',
        success: function (r) {
            eachData(company, r.data ? r.data.company : {})
            if (r.data.list) {
                var str = ''
                $.each(r.data.list, function (i, el) {
                    str += '<li class="f_l overf_E" >' + el + '</li>'
                })
                $(".buttList").append(str)
            }
        }
    })

})