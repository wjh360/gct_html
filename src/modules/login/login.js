$(function () {
    if (Base64) var b = new Base64();
    storage()


    //账号登陆 与 app下载切换
    $("body").on("click", '.login_page', function () {
        $(".web_page").show().siblings(".dis_box").hide()
    })
    $("body").on("click", '.app_down', function () {
        $(".app_page").show().siblings(".dis_box").hide()
    })
    //点击忘记密码
    $("body").on("click", '.passMiss', function () {
        $(".forget_page").show().siblings(".dis_box").hide()
    })
    $("body").on("click", '.return_log', function () {
        $(".web_page").show().siblings(".dis_box").hide()
    })
    var account = storage("account")
    if (account) {
        //解密
        $(".logPhone").val(b.decode(account.phone))
        $(".logPwd").val(b.decode(account.password)).attr("type", $(".logPwd").attr("nameType"))
        $(".checkBox ").addClass("checkBoxTrue")
    }
    $("body").on("click", '.log_btn', function () {
        postLogin()
    })
    //登陆函数
    function postLogin() {
        var logPhone = $(".logPhone").val(),
            logPwd = $(".logPwd").val()
        if (!logPhone) return $.popInfo("请输入用户名！")
        if (!logPwd) return $.popInfo("请输入用户名！")
        $http({
            url: 'gct-web/loginWeb/getLogin',
            data: {
                userName: logPhone,
                password: randomP(10) + b.encode(b.encode(b.encode(logPwd)))
            },
            success: function (r) {
                if (!r.code) {
                    if ($(".remPwd span").hasClass("checkBoxTrue")) {
                        //加密 存储
                        storage("account", {
                            phone: b.encode(logPhone),
                            password: b.encode(logPwd)
                        })
                    } else {
                        storage("account", -1)
                    }
                    var powers = r.dataOthers[0];
                    if (!powers) return $.popInfo("没有权限！")
                    var newObjPower = {}
                    if (powers) {
                        for (var k in powers) {
                            newObjPower[k] = {}
                            if (powers[k].children) {
                                $.each(powers[k].children, function (index, eleVal) {
                                    newObjPower[k][eleVal.menuIden] = true
                                })
                            }
                        }
                        storage("curLoginName", r.dataOthers[1])
                    }
                    storage("superManagement", r.dataOthers[2])
                    storage("curUserPower", newObjPower)
                    goNewPage("/modules/accountManagement/MessageNotification.html")
                }
            }
        })
    }
    //回车登陆
    $("body").on("keydown", function (e) {
        if (e.keyCode == 13) {
            $.abortAll($.xhrPool)
            if ($(".showAlert").length) return $(".showAlert").remove()
            postLogin()
        }
    })
    //    忘记密码的获取验证码
    $("body").on("click", '.verCode', function () {
        var forget_phont = $(".forget_phont").val()
        if (!$.checkReg(forget_phont, 'phone')) return $.popInfo("请输入用户名")
        if (alreadyFalse) {
            getSMSPassword(forget_phont)
        }
    })
    $("body").on('blur change', '.passwordConfirmLogin', function (event) {
        if ($(this).val() !== $(".forgetPass").val()) {
            $.popInfo("两次密码不一致！");
            $(this).val('')
        }
    });
    $("body").on("click", '.forget_btn', function () {
        var loginObj = {
            iCode: $(".yzm_input").val(),
            tel: $(".forget_phont").val(),
            password: $(".forgetPass").val(),
            passwordConfirm: $(".passwordConfirmLogin").val()
        }
        if (!$.checkReg(loginObj.tel, 'phone')) return $.popInfo("请输入用户名")
        if (!$.checkReg(loginObj.iCode, 'noNull')) return $.popInfo("验证码错误，请重新输入")
        if (!$.checkReg(loginObj.password, 'pass')) return $.popInfo("密码不符合规则，请重新填写")
        if (loginObj.passwordConfirm != loginObj.password) return $.popInfo("两次输入密码不一致，请核对")
        getPassword(loginObj)
    })
    var timer;
    var alreadyFalse = true;
    function getSMSPassword(data) {
        $http({
            url: '/gct-web/loginWeb/getSMSPassword',
            data: {
                tel: data
            },
            success: function (r) {
                if (r.code == 0) {
                    var count = 60;
                    alreadyFalse = false;
                    timer = setInterval(function () {
                        count--;
                        $(".verCode").html('重新获取(' + count + 's )')
                        if (count <= 0) {
                            clearInterval(timer);
                            alreadyFalse = true;
                            $(".verCode").html('重新获取')
                        }
                    }, 1000)
                }
            }
        })
    }
    //提交
    function getPassword(data) {
        $http({
            url: '/gct-web/loginWeb/getPassword',
            data: data,
            success: function (r) {
                if (r.code == 0) {
                    $.popInfo("操作成功")
                    $(".web_page").show().siblings(".dis_box").hide()
                }
            }
        })
    }
})
