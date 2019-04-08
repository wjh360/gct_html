//当前路径
var $windowPath = window.location.href;
//当前域名
var $windowHost = window.location.host;
//当前开发生产模式  true 开发 /false 生产
var $checkDevStatus = $windowHost.indexOf('localhost') != -1 ? true : false;
//当前页面名称
var $windowCurPathName = $windowPath.slice($windowPath.lastIndexOf("/") + 1, $windowPath.lastIndexOf(".html"));
//全局设置img 禁止拖动
$('body').on('mousedown', 'img', function (e) {
    e.preventDefault()
})
/*打印输出*/ //生产模式下 console.log 注册成空函数 防止报错
if (!$checkDevStatus) {
    log = function () { };
    window.console = {
        log: function () { }
    }
} else {
    window.log = window.console.log;
    window.console.log = null;
}
//判断当前浏览类型
var $bsType = browserType();
/*判断当前页面是否时指定页面*/
function checkcurPath(url) {
    if ($windowPath.indexOf(url) != -1) return true;
    else return false
}
//下拉框
function getDownSelect(el, txt, dataArr, dataIdx, dataName, morePar) {
    if (!dataArr) dataArr = []
    var strTxt = "",
        downStr = '<span class="' + el + ' downSet overf_Ec" index=""  fl_val="' + txt + '">' +
            '<a href="javascript:void(0);" style="color:#666;">' + txt + '</a>' +
            '</span>' +
            '<ul></ul>'
    var el = "#" + el
    $(el).addClass('clearfix')
    $.each(dataArr, function (i, v) {
        var moreParTxt = ""
        if (morePar && morePar.length) {
            $.each(morePar, function (index, txt) {
                moreParTxt += 'morepar_' + txt + '="' + v[txt] + '" '
            });
        }
        strTxt += '<li class="overf_E" index="' + v[dataIdx] + '"' + moreParTxt + ' title="' + v[dataName] + '" >' + v[dataName] + '</li>'
    })

    $(el).html("").append(downStr).find('ul').append(strTxt)
    // log($(el))
}
$("body").on('click', '.downSelect', function (e) {
    var tar = e.target;
    $(".nice-select_active").removeClass("nice-select_active")
    $('[name="nice-select"] ul').hide()
    $(".downSetOpen").removeClass('downSetOpen');
    $(this).find(".downSet").toggleClass('downSetOpen')
    $('.downSelect').not(this).find('ul').hide()
    if ($(this).find('ul').children().length < 1) return false
    $(this).find('ul').toggle();
    if ($(tar).parents('ul').length) {
        $(tar).addClass('activeSelect').siblings('li').removeClass('activeSelect')
        if ($(tar).attr('title')) {
            var attrButes = tar.attributes,
                morParObj = {};
            var re = /morepar/i;
            for (var k in attrButes) {
                if (typeof attrButes[k] != 'function' && typeof attrButes[k] != 'number') {
                    if (re.test(attrButes[k].name)) {
                        var newAttr = attrButes[k].nodeName.replace(/morepar/i, 'morepar')
                        morParObj[newAttr] = attrButes[k].nodeValue
                        //符合
                    }
                }
            }
            $(tar).parents('ul').prev('span').html($(tar).attr('title')).attr({
                "index": $(tar).attr("index"),
                'title': $(tar).attr('title')
            }).attr(morParObj)
                .addClass($(tar).parents('.downSelect').attr("id"));
        } else {
            $(tar).parents('ul').prev('span').html($(tar).text()).attr({
                "index": $(tar).attr("index"),
                'title': $(tar).attr('title')
            }).addClass($(tar).parents('.downSelect').attr("id"));
        }
    }
    e.stopPropagation();
})
$('body').click(function (e) {
    var tar = e.target;
    if ($(tar).parents('.downSelect').length <= 0 && $(tar).attr('class') !== 'downSelect') { $('.downSelect ul').hide(); $(".downSetOpen").removeClass("downSetOpen") }
});
//
//ajax 全局设置
var ajaxFlagDetails = true;
(function ($) {
    $.xhrPool = [];
    //ajax 防止重复提交
    $.abortAll = function (a) {
        $(a).each(function (idx, pos) {
            pos.abort()
        });
        a = [];
    };

    $.ajaxSetup({
        dataType: 'json', // 默认数据类型
        type: 'post', // 默认请求类型
        timeout: 30000000, // 请求超时时间
        complete: function (x, s) { //完成请求后触发。即在success或error触发后再触发

            if (s == "success") x.success(function (r) { //请求成功 但是返回值错误的处理

                // console.log(r)
                // if (r.code ) return false
                //获取验证码 和 获取 邀请码 拒绝 弹框
                // if(this.url == '/hbrs-web/region/getSMSCheckOutPassword' || this.url == '/hbrs-web/region/getInvitationCode') return
                if (r && r.code !== 0 && r.code && this.url.indexOf("getLogout") == -1) {
                    if (r.code == 401 && !checkcurPath('logon')) {
                        return $.popAlert({
                            'content': r.data ? r.data : r.message,
                            'confirm': function () {
                                storage()
                                goNewPage('/login.html')
                            }
                        })
                    } else {
                        //如果是项目
                        var alertStr = r.data ? r.data : r.message
                        if (alertStr.indexOf("<br>") != -1) return $.popAlert(alertStr)
                        else if (ajaxFlagDetails) return $.popInfo(alertStr)
                    }
                }
            })
        },
        error: function (x, s, e) { //请求失败遇到异常触发
            htmlDownRemove()
            if (s == "error" && x.status > 200 && $checkDevStatus && this.url.indexOf("getLogout") == -1) { //请求失败 并且时开发模式时弹出错误信息
                switch (x.status) {
                    case 400:
                        x.msg = '请求错误！(400)';
                        break;
                    case 401:
                        x.msg = '未授权，请重新登录！(401)';
                        break;
                    case 403:
                        x.msg = '拒绝访问！(403)';
                        break;
                    case 404:
                        x.msg = '请求出错！(404)';
                        break;
                    case 408:
                        x.msg = '请求超时！(408)';
                        break;
                    case 500:
                        x.msg = '服务器错误！(500)';
                        break;
                    case 501:
                        x.msg = '服务未实现！(501)';
                        break;
                    case 502:
                        x.msg = '网络错误！(502)';
                        break;
                    case 503:
                        x.msg = '服务不可用！(503)';
                        break;
                    case 504:
                        x.msg = '网络超时！(504)';
                        break;
                    case 505:
                        x.msg = 'HTTP版本不受支持！(505)';
                        break;
                    default:
                        x.msg = '连接出错(' + x.status + ')!'
                }
            } else x.msg = '网络繁忙!' //生产环境下 默认弹出
            if (x.msg && x.readyState == 4) {
                return $.popAlert({
                    'content': x.msg,
                    confirm: function () {
                        if (!checkcurPath("login")) goNewPage('/login.html')
                    }
                })
            }
        },
        //发送请求前触发  	//可以设置自定义标头  xhr.setRequestHeader('Content-Type', 'application/xml;charset=utf-8');
        beforeSend: function (x, pos) {
            $.xhrPool.push(x);
        }
    })
})(jQuery);
//ajax 封装
var $http = function (url, data, func) {
    var funTar = arguments.callee.caller || {}
    var fatherList = funTar.arguments || []
    if ($.isObject(url)) {
        var obj = url
        var loginOut = obj.url.has("login") || obj.url.has("login") || ""
        if (obj.url.has("Page") || obj.url.has("page") || $windowCurPathName == 'MessageNotification' && !obj.url.has("isCheckInfo")) {
            obj.data = obj.data ? obj.data : {}
            obj.data.current = fatherList[0] ? fatherList[0] : 1,
                obj.data.limit = fatherList[1] ? fatherList[1] : 10
        }
        htmlDown()
        $.ajax({
            url: obj.url ? obj.url : '', //登陆路径
            data: obj.data ? obj.data : {},
            success: function (r) {
                htmlDownRemove()
                if (obj.success && !r.code && (obj.url.has("Page") || obj.url.has("page") || $windowCurPathName == 'MessageNotification' && !obj.url.has("isCheckInfo"))) obj.success(r, obj.data.current, obj.data.limit, funTar, r.total)
                else if (obj.success && !r.code) obj.success(r)
                else if (loginOut) obj.success(r)
            }
            // complete:function(r){ if (cmp) cmp(r) }
        });
    } else {
        $.ajax({
            url: url, //登陆路径
            data: data ? data : {},
            success: function (r) {
                if (func && !r.code) func(r)
            }
            // complete:function(r){ if (cmp) cmp(r) }
        });
    }
}
// 阿拉伯数字转换为简写汉字
function num_to_chinese(Num) {
    for (i = Num.length - 1; i >= 0; i--) {
        Num = Num.replace(",", "") //替换tomoney()中的“,”
        Num = Num.replace(" ", "") //替换tomoney()中的空格
    }
    Num = Num.replace("￥", "") //替换掉可能出现的￥字符
    if (isNaN(Num)) { //验证输入的字符是否为数字
        // alert("请检查小写金额是否正确");
        return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    part = String(Num).split(".");
    newchar = "";
    //小数点前进行转化
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 12) {
            // alert("位数过大，无法计算");
            return;
        } //若数量超过拾亿单位，提示
        tmpnewchar = ""
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
        }
        switch (part[0].length - i - 1) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                break;
            case 2:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                break;
            case 3:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                break;
            case 4:
                tmpnewchar = tmpnewchar + "万";
                break;
            case 5:
                if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
                break;
            case 6:
                if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
                break;
            case 7:
                if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
                break;
            case 8:
                tmpnewchar = tmpnewchar + "亿";
                break;
            case 9:
                tmpnewchar = tmpnewchar + "拾";
                break;
            case 10:
                tmpnewchar = tmpnewchar + "佰";
                break;
            case 11:
                tmpnewchar = tmpnewchar + "仟";
                break;
        }
        newchar = tmpnewchar + newchar;
    }
    //小数点之后进行转化
    if (Num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            $.popInfo("小数点之后只能保留两位,系统将自动截取");
            part[1] = part[1].substr(0, 2)
        }
        for (i = 0; i < part[1].length; i++) {
            tmpnewchar = ""
            perchar = part[1].charAt(i)
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;
                    break;
            }
            if (i == 0) tmpnewchar = tmpnewchar + "角";
            if (i == 1) tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    //替换所有无用汉字
    while (newchar.search("零零") != -1)
        newchar = newchar.replace("零零", "零");
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零元", "");
    newchar = newchar.replace("零角", "");
    newchar = newchar.replace("零分", "");
    if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
        newchar = newchar + "整"
    return newchar;
}
function goNewPage(url, openNew, goBackFn) {
    if (url == 'javascript:void(0);') return false
    if (!isExistFile(url) && goBackFn) return window.history.go(-1)
    if (!isExistFile(url) && !goBackFn) return $.popInfo('页面不存在,确认路径！')
    if (!mathRandom && checkcurPath('?_')) {
        mathRandom = $windowPath.slice($windowPath.lastIndexOf('?_') + 1)
    }
    mathRandom = mathRandom.replace(/_/g, "")
    url = url + '?_' + mathRandom
    // return
    if (openNew) {
        window.open(url)
        window.history.go(0)
    }
    else window.location.href = url


}
// 单页面内跳转
function goNextBox() {
    window.location.href = window.location.href + '#'
}
//页面是否存在
function isExistFile(url) {
    var xmlHttp;
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    xmlHttp.open("get", url + '?' + randomPassword(), false);
    xmlHttp.send();
    // console.log(xmlHttp)
    if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) return true; //url存在
        else if (xmlHttp.status == 404) return false; //url不存在
        else return false; //其他状态
    }
    return false;
}
$("body").on('click', 'a', function (event) {
    var that = this
    if ($(that).attr("href") && $(that).attr("href").indexOf('html') != -1 && !$(that).parents('.list-nav').length) {
        event.preventDefault();
        goNewPage($(that).attr("href"))
    } else if (!$(that).attr("download")) {
        if (!$(that).attr("href")) return false
    }
});
//返回上一页
function goBack() {

    // if ($bsType == 'Safari') location.href = document.referrer;
    // else
    // window.history.go(-1)
    if (document.referrer && document.referrer.indexOf('accountManagement') != -1) {
        goNewPage('/modules/accountManagement/MessageNotification.html')
    } else {
        if ($(".breadCrumdBtn").length && $(".breadCrumdBtn").attr("data_href")) {
            if (!isExistFile($(".breadCrumdBtn").attr("data_href"))) goNewPage($(".breadCrumdBtn").attr("data_href"), '', 'true')
            else window.history.go(-1);
        } else {
            window.history.go(-1)
        }
    }
    // location.replace(document.referrer)
}
$("body").on('click', '.goBack', function (event) {
    event.preventDefault();
    goBack()
});
/*超出规定字符长度 以'...'显示
 *
 *
 * @str  	传入的字符
 *
 * @lenNum	需要传入规定的长度
 *
 * @ipt      是否是input显示
 *
 */
function initText(str, lenNum, ipt) {
    str += ''
    var newStr = '';
    if (!lenNum) lenNum = 8;
    if (!str || str.length <= lenNum || typeof str != 'string') return str
    if (ipt) newStr = str.slice(0, lenNum)
    else newStr = str.slice(0, lenNum) + '...'
    return newStr
}
/*初始化日期
 *
 *
 * @data 		时间戳
 *
 * @isNeedOther 	是否显示到秒  需要 's'  是否只显示到日 'd'  默认 '' 显示到月
 *
 */
function initDate(data, isNeedOther) {
    if (!data) return ""
    data += ""
    if (data.has("T") && data.has("+")) {
        data = data.replace(/-/ig, "/")
        data = data.replace(/T/ig, " ")
        data = data.replace(/\.000\+0000/ig, "")
        var now = chGMT(data)
    } else if (data.indexOf('.0') > -1) {
        data = data.slice(0, data.indexOf('.'))
        return data
    } else {
        if (isNaN(data)) return data
        data = parseInt(data)
        var now = new Date(data) * 1000;
    }
    now = new Date(now)
    var year = now.getFullYear(), //年
        month = now.getMonth() + 1, //月
        date = now.getDate(), //日
        hour = now.getHours(), //时
        minute = now.getMinutes(), //分
        second = now.getSeconds(); //秒
    var baseDay = 0
    if (isNeedOther === 'y') return baseDay + year + "-" + zeroFill(month) // 年月
    else if (!isNeedOther) return baseDay + year + "-" + zeroFill(month) + "-" + zeroFill(date) //年月日
    else if (isNeedOther == 's') {
        return baseDay + year + "-" + zeroFill(month) + "-" + zeroFill(date) + "  " //年月日时分秒
            +
            zeroFill(hour) + ":" + zeroFill(minute) + ":" + zeroFill(second)
    }
}
function chGMT(gmtDate) {
    var mydate = new Date(gmtDate);
    mydate.setHours(mydate.getHours() + 8);
    return mydate * 1
}
// 补零函数 @data  需要判断的number类型
function zeroFill(data) {
    if (data < 10) return '0' + data
    else return data
}
/**session 封装
 *
 * nam  键名
 *
 * val   键值
 *
 * 都传时，储存对应的键名与键值
 *
 * val不传时，获取键名所对应的键值
 *
 * val 全等于 -1 时删除指定键对应的值
 *
 * 都不传时 清除所有
 *
 */
(function ($) {
    window.mathRandom = ""
    if (!checkcurPath('?_')) {
        window.mathRandom = randomPassword()
        if ($windowPath.indexOf('login.html') == -1 && location.pathname == '/') goNewPage($windowPath + 'login.html')
        else goNewPage($windowPath)
    } else {
        window.mathRandom = $windowPath.slice($windowPath.indexOf('?_') + 1).replace(/#/g, '')
    }
})(jQuery);
//清除 当前页面 session
function clearSession() {
    for (k in sessionStorage) {
        var str = k.split(mathRandom)
        // log(str)
        if (str[0].indexOf($windowCurPathName) > -1) {
            var c = str[0].split($windowCurPathName + '_')
            // log(c)
            if (c.length > 1) { storage(c[1], -1) }
        }
    }
}
//清除其他页面的 idx
// clearIdx()
function clearIdx(params) {
    for (k in sessionStorage) {
        // log(str)
        if (k.indexOf('nav_idx') > -1) {
            var c = k.split('_nav_idx_')
            if (c.length > 1) {
                storage('nav_idx', -1, c[0])
            }
        } else if (k.indexOf('nav_twos_idx') > -1) {
            var c = k.split('_nav_twos_idx_')
            if (c.length > 1) {
                storage('nav_twos_idx', -1, c[0])
            }
        }
    }
}


function storage(name, val, toPath, local) {
    // log(name)
    if (name != 'curUserPower') {
        if (!toPath && name != 'account') { //当前页
            local = false
            var curHtmlName = getUrlLastElement()
            if (curHtmlName) {
                curHtmlName = curHtmlName.slice(1, curHtmlName.indexOf('.html')) + '_'
                name = curHtmlName + name + window.mathRandom
            }
        } else if (name) {
            local = name == 'account' ? true : false;
            if (!local) {
                name = toPath ? toPath + '_' + name + mathRandom : name + mathRandom
            }
        }
        var re = eval("/_/ig")
        // log(name)
        if (name != 'account' && name.match(re).length < 2) return false
    } else if (name) {
        name = name + window.mathRandom
    }
    if (!local) {
        if (val === -1) { return window.sessionStorage.removeItem(name) } //删除指定键对应的值
        else if (!arguments.length) {
            for (var k in sessionStorage) {
                var str = k.split(mathRandom)
                // log(str)
                if (str.length > 1) {
                    window.sessionStorage.removeItem(k)
                }
            }
        } //删除所有
        else if (!val) { return JSON.parse(window.sessionStorage.getItem(name) || '""'); } //获取指定键对应的值
        else return window.sessionStorage.setItem(name, JSON.stringify(val)); //设置指定键对应的值
    } else {
        if (val == -1) return window.localStorage.removeItem(name)                  //删除指定键对应的值
        else if (!name && !val) { window.localStorage.clear(); }                 //删除所有
        else if (!val) return JSON.parse(window.localStorage.getItem(name) || '""');  //获取指定键对应的值
        else return window.localStorage.setItem(name, JSON.stringify(val));          //设置指定键对应的值
    }
}
(function ($) {
    // $.each = function (a, b) {
    //     log(a,b)
    //     if (!a || !a.length) return false
    //     $.each(a, b)
    // }
    //判断参数是否是字符串
    $.isString = function (o) {
        return Object.prototype.toString.call(o) === "[object String]";
    }
    //判断参数是否是对象
    $.isObject = function (o) {
        return Object.prototype.toString.call(o) === "[object Object]";
    }
    //判断参数是否是json
    $.isJSON = function (str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str)
                return true
            } catch (e) {
                return false;
            }
        }
    }
    $.isImg = function (str) {
        var objReg = new RegExp("[.]+(jpg|jpeg|swf|gif)$", "gi");
        if (objReg.test(str)) {
            return true
        };
        return false;
    }
    //数组去重
    $.ArrDup = function (songs, name) {
        if (!songs || !isArray(songs)) return false
        var result = {};
        var finalResult = [];
        for (var i = 0; i < songs.length; i++) {
            if (typeof songs[i] == 'object') result[songs[i][name]] = songs[i];
            else {
                if ($.inArray(songs[i], finalResult) == -1) finalResult.push(songs[i]);
            }
        }
        for (var item in result) {
            finalResult.push(result[item]);
        }
        return finalResult
    }
    // 字符串去除空格
    $.emptyTrim = function (a, all) {
        if (!$.isString(a)) return false
        if (all) return a.replace(/ /g, "")
        else return $.trim(a)
    }
    //判断目标值是否为空 undefined, null, '', false, 0, [], {} 均返回true，否则返回false
    $.empty = function (v) {
        switch (typeof v) {
            case 'undefined':
                return true;
            case 'string':
                if ($.trim(v).length == 0) return true;
                break;
            case 'boolean':
                if (!v) return true;
                break;
            case 'number':
                if (0 === v) return true;
                break;
            case 'object':
                if (null === v) return true;
                if (undefined !== v.length && v.length == 0) return true;
                for (var k in v) {
                    return false;
                }
                return true;
                break;
        }
        return false;
    }
    //深度拷贝
    $.arrCopy = function (p, c) {
        var c = c || {};
        for (var i in p) {
            if (i != 'removeAttr') {
                if (typeof p[i] === 'object' && p[i] !== null) {
                    c[i] = (p[i].constructor === Array) ? [] : {};
                    arrCopy(p[i], c[i]);
                } else {
                    c[i] = p[i];
                }
            }
        }
        return c;
    }

    // 判断元素是否显示
    $.fn.isShow = function () {
        if ($(this).css('display') !== 'none') return true //显示
        else return false //隐藏
    }
})(jQuery)

// 图片查看大图。视频
//关闭大图
$("body").on("click", '.imgBgDiv', function () {
    $(".imgBgDiv").remove()
    window.LogTop = undefined
    document.body.removeEventListener('touchmove', bodyScroll, false);
    removeUnScroll()
})
//查看大图
// $("body").on("click", '.viewBigImg', function (imgSrc) {
//     if (!imgSrc) {
//         imgSrc = $(this).attr('src')
//     }
//     if (imgSrc && imgSrc.indexOf("mp4Show") != -1) {
//         watchVideo(imgSrc)
//     } else if (imgSrc) {
//         viewBigImg(imgSrc)
//     }
// })
function viewBigImg(imgSrc) {
    imgSrc = baseFileUrl + imgSrc
    var bgDiv = '<div class="imgBgDiv"><img src="' + imgSrc + '"></div>'
    $("body").append(bgDiv)
    window.LogTop = Math.ceil($(window).scrollTop()) ? Math.ceil($(window).scrollTop()) : true; //滚动条高度
    document.body.addEventListener('touchmove', bodyScroll, false);
    unScroll()
}
function unScroll() {
    var top = $(document).scrollTop();
    $(document).on('scroll.unable', function (e) {
        $(document).scrollTop(top);
    })
}
function removeUnScroll() {
    $(document).unbind("scroll.unable");
}
$(window).on('mousewheel DOMMouseScroll', function (ev) {
    var photoH = parseFloat($(".imgBgDiv img").css('height'))
    var magTop = parseFloat($(".imgBgDiv img").css('margin-top'))
    var count = ev.originalEvent.wheelDelta ? ev.originalEvent.wheelDelta : -ev.originalEvent.detail
    if (window.LogTop && magTop <= 120) {
        var str = magTop + count
        if (str < -photoH + 120) str = -photoH + 120
        else if (str > 120) str = 120
        $(".imgBgDiv img").css('margin-top', str)
    }
    if ($(".imgBgDiv").length) return false
});
function bodyScroll(event) { }
$("body").on("mouseover", '.showVideoFalsh', function (e) {
    $(".closeVideo").show()
})
$("body").on("mouseleave", '.showVideoFalsh', function (e) {
    $(".closeVideo").hide()
})
//关闭视频
$("body").on("click", '.closeVideo', function (e) {
    $(".showVideoFalsh").hide().remove();
    $(".showVideo").remove()
})
$("body").on("click", '.showVideo', function (e) {
    if ($bsType == 'ie8') {
        $(".showVideoFalsh").hide().remove();
        $(".showVideo").remove()
    }
})
function watchVideo(shan) {
    var mp3snd = bUrl + shan;
    var str = '<div class="showVideo">'
    if ($bsType == 'ie8') {
        str += '<span class="closeVideo glyphicon glyphicon-remove" style="display: none" aria-hidden="true" ></span>'
        str += '<object class="showVideoFalsh" data="' + mp3snd + '" type="application/x-mplayer2" height="480px" width="500px">'
        str += '<param name="filename" value="' + mp3snd + '">'
        str += '<param name="autostart" value="1">'
        str += '<embed height="2" width="2" src="' + mp3snd +
            '" pluginspage="http://www.apple.com/quicktime/download/" type="video/quicktime" ' +
            'controller="false" controls="false" autoplay="true" autostart="true" loop="true" bgcolor=""><br>'
        str += '</embed></object>'
    } else {
        str += '<div class="showVideoFalsh" style="background:#000;max-width: 500px;margin:100px auto;position:relative;">'
        str += '<span class="closeVideo glyphicon glyphicon-remove" style="display: none" aria-hidden="true" ></span>'
        str += '<video type="video/mp4" controls="controls" src="' + mp3snd + '" autoplay="true" loop="true" height="500px" width="500px"></video>'
        str += '</div>'
    }
    str += '</div>'
    $("body").append(str)
    $(".showVideo").css({
        "filter": "progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000,endColorstr=#88000000);" //ie8 下 背景颜色
    })
}
/*初始化分页
 *
 *
 *
 * @attr         //当前分页id == 根据表格id + 'Page' 生成
 *
 * @pageNo	 	//当前页
 *
 * @totalPage    //总页码
 *
 * @initData     //初始表格函数
 *
 */
function getPage(attr, totalPage, pageNo, initData, selectedIdx) {
    // log(selectedIdx)
    // return
    // log(attr, totalPage, pageNo, initData,selectedIdx)
    $('#' + attr).paging({
        pageNo: pageNo,
        totalPage: totalPage,
        callback: initData,
        selectedIdx: selectedIdx ? selectedIdx : ""
    })
    if ($('#' + attr).children().length) $('#' + attr).show()
    else $('#' + attr).hide()
}
//生成随机标识
function randomPassword(sizes) {
    if (window.mathRandom) return window.mathRandom
    if (!sizes) sizes = 10
    var seed = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'l', 'j', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'); //数组
    var seedlength = seed.length; //数组长度
    var createPassword = '';
    for (var i = 0; i < sizes; i++) {
        var j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    // alert(createPassword)
    return createPassword;
}
// 正则验证
(function ($) {
    var is = function (reg) {
        return function (o) {
            return reg.test(o);
        };
    };
    var regObj = {
        noNull: is(/\S/),//不能为空
        noSpeclice: is(/^[a-zA-Z0-9_]+$/),//数字，字母，下划线
        pass: is(/^[0-9A-Za-z_]{6,20}$/),//密码校验
        isParseInt: is(/^[\d]+$/), //数字
        age: is(/^[1-9]+\d*$/), //数字,最高位不能为0
        money: is(/\d+\.?\d{0,2}?$/), //整数或者小数
        password: is(/^[a-zA-Z0-9][a-zA-Z0-9_]{5,17}$/), //密码验证
        isCn: is(/^[\u4e00-\u9fa5]$/), //汉字
        email: is(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/), //邮箱
        tel: is(/^(\d{3,4})-(\d{7,8})/), //电话
        phone: is(/^1[3456789]\d{9}$/), //手机
        phone1: is(/^\d{11}$/), //手机
        isDate: is(/^\d{4}(\-|\/|\.)\d{1,2}\1\d{1,2}$/) //匹配日期
    }
    $.checkReg = function (val, type) {
        if (type == 'account') return regObj['phone'](val) || regObj['email'](val)
        return regObj[type](val)
    }
})(jQuery)
// 元素溢出部分以...展示 默认加title
$("body").on('mouseenter', '.overf_E,.node_name', function (event) {
    event.preventDefault();
    // log(this)
    var str = $(this).contents().filter(function () {
        return this.nodeType == 3;
    })
    // log(str)
    str = str[0] ? str[0].nodeValue : $(this).val()
    if ($(this).children().length > 0) return false
    if (!$(this).attr('title')) return $(this).attr('title', str)
    return false
});
// 元素溢出部分以...展示 默认加title
$("body").on('mouseenter', '.overf_Ec', function (event) {
    event.preventDefault();
    // log()
    str = $(this).text()
    // if ($(this).children().length > 0) return false
    if (!$(this).attr('title')) return $(this).attr('title', str)
    return false
});
//判断 字符串中是否存在目标元素
String.prototype.has = function (a) {
    if (this.indexOf(a) !== -1) return true
    return false
}
//搜索框
//
$(function () {
    if (!$(".searchBtn").length) creatSearchBox()
})
function creatSearchBox(callback) {
    var $tar = $('.searchBox')
    if ($tar.length <= 0) return false
    var attr = $('.searchBox').attr('attr') ? $('.searchBox').attr('attr') : ""
    var placeholderVal = $tar.attr('val')
    var str = ""
    if (attr.has('easy') && attr.has('high')) {
        //简单搜索
        str = '<div class="simpleSearch f_l clearfix">' +
            '<span class="cancelBtn1 f_l" style="display: none;" title="取消搜索"></span>' +
            '<input type="text" class="searchVal f_l" maxlength="100" placeholder="' + placeholderVal + '" style="margin:0 5px; display: none;margin-top:18px;    background: none;">' +
            '<span class="searchBtn f_l" title="展开搜索框"></span>' +
            '</div>' +
            '<span class="verticalBOx f_l"></span>' +
            '<div class="advancedBox f_l" title="展开高级搜索框">' +
            '<span>高级查询</span>' +
            '<span class="xia"></span>' +
            '</div>' +
            '<span class="btn btn-primary advanceInquBtn " style="display: none;margin:0 5px !important;width:60px;text-algin:center;padding:1px;">查询</span>'
    } if (!attr.has('easy') && attr.has('high')) {
        str = '<div class="advancedBox f_l" title="展开高级搜索框">' +
            '<span>高级查询</span>' +
            '<span></span>' +
            '</div>' +
            '<span class="btn btn-primary advanceInquBtn " style="display: none;margin:0 5px !important;width:60px;text-algin:center;padding:1px;">查询</span>'
    } else if (attr.has('easy') && !attr.has('high')) {
        str = '<div class="simpleSearch f_l clearfix">' +
            '<span class="cancelBtn1 f_l" style="display: none;" title="取消搜索"></span>' +
            '<input type="text" class="searchVal f_l" maxlength="100" placeholder="' + placeholderVal + '" style="display: none;margin-top:18px;    background: none;">' +
            '<span class="searchBtn f_l" title="展开搜索框"></span>' +
            '</div>'
    }
    $tar.append(str)
    //点击展开高级搜索
    $("body").on("click", '.advancedBox', function () {
        clearSearchIpt()
        clearSearchTxt()
        resetFields()
    })
    //点击高级搜索按钮
    // $("bdoy").on("click", '.', function () {
    //     if (callback) callback()
    // })
    //鼠标浮上高级搜索
    $("body").on("mouseover", '.advancedBox', function () {
        $(this).attr("title", $(this).hasClass("active") ? '取消高级搜索' : '展开高级搜索')
    })
    //简单搜索的鼠标title
    $("body").on("mouseover", '.searchBtn', function () {
        $(this).attr("title", $(this).hasClass("serActive") ? '搜索' : '展开搜索')
    })
    //简单搜索，变亮serActive，出现叉号和搜索框
    $("body").on("click", '.searchBtn', function (e, flag) {
        // $(".searchList").hide()
        if (!$(this).hasClass("serActive")) {
            $(".searchBtn").addClass("serActive");
            $(".cancelBtn1").show();
            $(".searchVal").show().val("");
            //高级搜搜收起
            if ($(".advancedBox").hasClass("active")) clearSearchTxt()
            resetFields()
        } else {
            // 方法
            if (flag == 1) return
            if (callback) {
                setTimeout(function () {
                    callback()
                })
            }
        }
    })
    //取消简单搜索
    $("body").on("click", '.cancelBtn1', function (e, flag) {
        clearSearchIpt()
        if (flag == 1) return
        if (callback) {
            setTimeout(function () {
                callback()
            })
        }
    })
}
//清除高级搜索内容
function clearSearchTxt(ar) {
    if (ar) {
        $(".searchList").hide()
        $(".advanceInquBtn").hide()
        $(".advancedBox").removeClass("active")
    } else {
        $(".advanceInquBtn").toggle();
        if ($(".searchList").length > 1) {
            var curActive = $(".nav-tabs").find(".active").attr("data_index")
            $(".searchList").each(function (i, el) {
                if ($(el).attr("data_index") == curActive) {
                    $(el).toggle()
                }
            })
        } else {
            $(".searchList").toggle()
        }
        $(".advancedBox").toggleClass("active")
    }
    $(".searchList input").val('')
    $('.searchList .downSet').each(function (i, el) {
        // log(el)
        $(el).html('<a href="javascript:void(0);">' + $(el).attr("fl_val") + '</a>').attr("title", $(el).attr("fl_val")).attr("index", "")
    })
}
//清除简单搜索
function clearSearchIpt() {
    $(".searchBtn").removeClass("serActive"); //置灰
    $(".cancelBtn1").hide(); //置灰
    $(".searchVal").hide().val(""); //置灰
    $(".simpleSearch").find('.inputSpan').hide()
}
$("body").on("click", '.nav-tabs li', function () {
    if ($(this).hasClass('avtive')) return false
    //
    clear_tab_twos_idx(this)
    clearSearchTxt('ar')
    clearSearchIpt()
    //  creatSearchBox()
})
//当前页面 清除二级 tab de idx
function clear_tab_twos_idx(that) {
    // log($(this))
    if (!$(that).parents(".twos_nav").length) {
        if (storage("nav_twos_idx")) {
            storage("nav_twos_idx", -1)  //  一级tab 点击时 先清除 二级tab 的 idx
            $(".twos_nav").find('.active').removeClass("active").parents('.twos_nav').children().eq(0).addClass('active')
            $(".twos_nav_box").find('.tab-pane.fade.active.in').removeClass('active').removeClass("in").hide().parents(".twos_nav_box")
                .children().eq(0).addClass('active').addClass("in").show()
        }

    }
}
//下载文件
$("body").on('click', '.downLoadFile', function () {
    // log(tab_rowData)
    download(tab_rowData.projectFileUrl, tab_rowData.fileName, this)
})
function resetFields(whichform) {
    if (!('placeholder' in document.createElement('input'))) {
        for (var i = 0; i < $('input').length; i++) {
            var elem = $('input')[i];
            // if(elem.input == "submit") continue; //如果是按钮 跳过
            var check = elem.placeholder || elem.getAttribute("placeholder");
            if (!check) continue; //检查是否有placeholder属性
            elem.onfocus = function () {
                fourss(this)
            }
            elem.onblur = function () {
                blurs(this)
            }
            elem.onblur();//立即调用失去焦点事件
        }
    }
}
$(function () {
    setTimeout(function () {
        //仅在不支持 placeholder 的时候执行
        if (!('placeholder' in document.createElement('input'))) {
            resetFields()
        }
    }, 800)
})
$('body').on('blur', '.pasPlace', function () {
    // if()
    blurs(this)
})
$('body').on('focus', '.pasPlace', function () {
    // if()
    fourss(this)
})
function blurs(that) {
    if (that.value == "") {
        var txt = $(that).attr("placeholder");
        // log(txt)
        // that.className = "placeholders";
        $(that).addClass("placeholders")
        if ($(that).attr("type") == 'passWord' || $(that).attr("type") == 'password' || $(that).attr("nameType") == 'password' || $(that).attr("nameType") == 'passord') {
            // setTimeout(function(){
            var ipt = $("<input>")
            $(ipt).attr("type", 'text').attr("nameType", 'passWord').attr('class', $(that).attr("class")).attr("placeholder", $(that).attr("placeholder")).addClass("pasPlace")
            ipt.val(txt)
            $(that).after(ipt)
            $(that).remove()
            // },500)
        }
        // that.value = txt;
        $(that).val(txt)
    }
}
function fourss(that) {
    // log('sasa')
    var text = $(that).attr("placeholder");
    if (text == that.value) {
        that.value = "";
        // that.className = "";
        $(that).removeClass("placeholders")
        if ($(that).attr("nameType") == 'passWord') {
            // $(that).attr("type", 'passWord').attr("nameType", 'passWord')
            var ipt = $("<input>")
            $(ipt).attr("type", 'passWord').attr('class', $(that).attr("class")).attr("placeholder", $(that).attr("placeholder")).addClass("pasPlace")

            // ipt.val(txt)
            $(that).after(ipt)
            $(that).remove()
            $(ipt).focus()
        }
    }
}

//判断当前浏览器类型
function browserType() {
    var userAgent = navigator.userAgent, //取得浏览器的userAgent字符串
        isOpera = userAgent.indexOf("Opera") > -1, //判断是否Opera浏览器
        isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera || userAgent.match(/(Trident)\/([\d.]+)/); //判断是否IE浏览器
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var IeVersion = parseFloat(RegExp["$1"]);
        if (IeVersion <= 7) return $bsType = 'ie7'
        else if (IeVersion == 8) return $bsType = 'ie8'
        else if (IeVersion == 9) return $bsType = 'ie9'
        else return $bsType = 'ie'
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf('Version') > -1) {
        return "Safari";
    }
}
//弹出框 $.popAlert()  $.popAlert()  $.popInfo()
(function ($) {
    if ($bsType == 'ie7') return alert("浏览器版本过低！建议更新浏览器！")
    jQuery.Pop = jQuery.Pop || {};
    jQuery.Pop = function (Html, Type, Callback, Callback1, tt) {
        var BoxId = id_(),
            PopType = {
                alert: {
                    Title: Type.title ? Type.title : '提示：',
                    Btn: {
                        yes: {
                            vla: "确定",
                            ope: function () {
                                if (Callback) {
                                    Callback();
                                    Close()
                                } else Close()
                            }
                        }
                    }
                },
                confirm: {
                    Title: Type.title ? Type.title : '提示：',
                    Btn: {
                        yes: {
                            vla: "确定",
                            ope: function () {
                                if (Callback) {
                                    Callback();
                                    Close()
                                } else Close()
                            }
                        },
                        no: {
                            vla: "取消",
                            cls: "btn btn-secondary",
                            ope: function () {
                                if (Callback1) {
                                    Callback1();
                                    Close()
                                } else Close()
                            }
                        }
                    }
                }
            },
            IType;
        if (Type && typeof Type == 'object') IType = Type.type
        else if (Type && PopType[Type]) IType = PopType[Type]
        else IType = {} // var IType = Type ? Type instanceof Object ? Type : PopType[Type] || {} : {};
        var Config = $.extend(true, {
            Title: Type.title ? Type.title : '提示：',
            Close: true,
            Animation: "layerFadeIn",
            BoxBg: true,
            BoxDrag: true,
            BoxBgopacity: 0.6,
            ZIndex: 99999,
            Class: true,
            Btn: {
                yes: {
                    vla: "确定",
                    cls: "btn btn-primary",
                    ope: function () {
                        if (Callback) {
                            if (Callback() !== false) {
                                Close()
                            }
                        } else Close()

                    }
                },
                no: Type == "alert" || Type.type == "alert" ? "" : {
                    vla: "取消",
                    cls: "btn btn-currency",
                    ope: function () {
                        if (Callback1) {
                            Callback1();
                            Close()
                        } else Close()

                    }
                }
            }
        }, IType);
        var $Box = $("<div>").addClass("alertBox").addClass(Config.Class),
            $BoxTitle = $("<div>").addClass("box-title"),
            $BoxClose = $("<i>").html("×").attr("title", '关闭'),
            $BoxHtml = $("<div>").addClass("box-content"),
            $BoxBtn = $("<div>").addClass("box-button"),
            $BoxBg = $("<div>").css({
                "position": "fixed",
                "left": 0,
                "top": 0,
                "width": "100%",
                "height": "100%",
                "z-index": Config.ZIndex - 1,
                "background-color": "rgba(0,0,0," + Config.BoxBgopacity + ")",
                "filter": "progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000,endColorstr=#88000000);" //ie8 下 背景颜色
            }).attr("id", BoxId + "bg");
        Config.Close = Config.Close ? Config.Close : $BoxClose = $("");
        Config.BoxBg = Config.BoxBg ? Config.BoxBg : $BoxBg = $("");
        // if($("style[pop-style]").length<=0){$("head").append("<style pop-style=true>"+Style()+"</style>");}
        if ($("style[pop-animation]").length <= 0) {
            $("head").append("<style pop-animation=true>" + AnimationStyle() + "</style>");
        }
        $("body").append(
            $Box.append($BoxTitle.html(Config.Title) // 标题
                .append($BoxClose)) // 关闭按钮
                .append($BoxHtml.html(Html)) // 内容
                .append($BoxBtn.html(btn_()))).append($BoxBg); // 按钮以及事件
        $Box.css({
            "left": ($(window).width() * 0.5) - ($Box.width() * 0.5),
            "top": ($(window).height() * 0.5) - ($Box.height() * 0.5),
            "z-index": Config.ZIndex
        }).
            addClass("showAlert").attr("id", BoxId).attr("data-animation", Config.Animation);
        $BoxClose.click(Close);
        // console.log($Box)
        if (Config.BoxDrag) {
            $BoxTitle.mouseover(function () {
                $(this).css("cursor", "move");
            }).mousedown(function (e) {
                var i = true,
                    x = e.pageX - $(this).parent().offset().left + 1,
                    y = e.pageY - $(this).parent().offset().top + 1;
                $(document).mousemove(function (e) {
                    if (i) $Box.offset({
                        left: e.pageX - x,
                        top: e.pageY - y
                    });
                }).mouseup(function () {
                    i = false;
                });
            });
        }
        function Close() {
            $("#" + BoxId).removeClass("showAlert");
            $("#" + BoxId).addClass("hideAlert");
            $("#" + BoxId).find(".btn").off("click");//点击一次按钮之后，点击按钮事件取消
            if ($("#" + BoxId + "bg").length > 0) {
                $("#" + BoxId + "bg").fadeOut(0, function () {
                    $(this).remove()
                })
            }
            setTimeout(function () {
                removeUnScroll()
                $("#" + BoxId).remove()
            }, 0);
        }
        function id_() {
            var i = "pop_" + (new Date()).getTime() + parseInt(Math.random() * 100000);
            if ($("#" + i).length > 0) return id_()
            else return i
        }
        function btn_() {
            var $i = $("<div>"),
                b = Config.Btn;
            if (b.yes) {
                $i.append($("<span>").addClass(b.yes.cls).html(b.yes.vla).click(b.yes.ope))
            }
            if (b.no) {
                $i.append($("<span>").addClass(b.no.cls).html(b.no.vla).click(b.no.ope))
            }
            return $i; // if(b.cancel){$i.append($("<span>").addClass(b.cancel.cls).html(b.cancel.vla).click(b.cancel.ope))}// if(b.bnt1){$i.append($("<span>").addClass(b.bnt1.cls).html(b.bnt1.vla).click(b.bnt1.ope))}// if(b.bnt2){$i.append($("<span>").addClass(b.bnt2.cls).html(b.bnt2.vla).click(b.bnt2.ope))}// if(b.bnt3){$i.append($("<span>").addClass(b.bnt3.cls).html(b.bnt3.vla).click(b.bnt3.ope))}// if(b.bnt4){$i.append($("<span>").addClass(b.bnt4.cls).html(b.bnt4.vla).click(b.bnt4.ope))}// if(b.bnt5){$i.append($("<span>").addClass(b.bnt5.cls).html(b.bnt5.vla).click(b.bnt5.ope))}
        }
        function AnimationStyle() {
            var css = "@charset 'utf-8';@keyframes slideFromTop{0%{top:0}100%{top:50%}}@-webkit-keyframes slideFromTop{0%{top:0}100%{top:50%}}@-moz-keyframes slideFromTop{0%{top:0}100%{top:50%}}@-ms-keyframes slideFromTop{0%{top:0}100%{top:50%}}@-o-keyframes slideFromTop{0%{top:0}100%{top:50%}}@keyframes hideFromTop{0%{top:50%}100%{top:0;opacity:0}}@-webkit-keyframes hideFromTop{0%{top:50%}100%{top:0;opacity:0}}@-moz-keyframes hideFromTop{0%{top:50%}100%{top:0;opacity:0}}@-ms-keyframes hideFromTop{0%{top:50%}100%{top:0;opacity:0;filter:Alpha(opacity=0)}}@-o-keyframes hideFromTop{0%{top:50%}100%{top:0;opacity:0}}@keyframes slideFromBottom{0%{top:80%}100%{top:50%}}@-webkit-keyframes slideFromBottom{0%{top:80%}100%{top:50%}}@-moz-keyframes slideFromBottom{0%{top:80%}100%{top:50%}}@-ms-keyframes slideFromBottom{0%{top:80%}100%{top:50%}}@-o-keyframes slideFromBottom{0%{top:80%}100%{top:50%}}@keyframes hideFromBottom{0%{top:50%}100%{top:80%;opacity:0}}@-webkit-keyframes hideFromBottom{0%{top:50%}100%{top:80%;opacity:0}}@-moz-keyframes hideFromBottom{0%{top:50%}100%{top:80%;opacity:0}}@-ms-keyframes hideFromBottom{0%{top:50%}100%{top:80%;opacity:0;filter:Alpha(opacity=0)}}@-o-keyframes hideFromBottom{0%{top:50%}100%{top:80%;opacity:0}}@keyframes showSweetAlert{0%{transform:scale(.5)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(.5)}45%{-webkit-transform:scale(1.05)}80%{-webkit-transform:scale(.95)}100%{-webkit-transform:scale(1)}}@-moz-keyframes showSweetAlert{0%{-moz-transform:scale(.5)}45%{-moz-transform:scale(1.05)}80%{-moz-transform:scale(.95)}100%{-moz-transform:scale(1)}}@-ms-keyframes showSweetAlert{0%{-ms-transform:scale(.5)}33%{-ms-transform:scale(1.05)}66%{-ms-transform:scale(.95)}100%{-ms-transform:scale(1)}}@-o-keyframes showSweetAlert{0%{-o-transform:scale(.5)}45%{-o-transform:scale(1.05)}80%{-o-transform:scale(.95)}100%{-o-transform:scale(1)}}@keyframes hideSweetAlert{0%{transform:scale(1)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(0);opacity:0}}@-webkit-keyframes hideSweetAlert{0%{-webkit-transform:scale(1)}45%{-webkit-transform:scale(1.05)}80%{-webkit-transform:scale(.95)}100%{-webkit-transform:scale(0);opacity:0}}@-moz-keyframes hideSweetAlert{0%{-moz-transform:scale(1)}45%{-moz-transform:scale(1.05)}80%{-moz-transform:scale(.95)}100%{-moz-transform:scale(0);opacity:0}}@-ms-keyframes hideSweetAlert{0%{-ms-transform:scale(1)}45%{-ms-transform:scale(1.05)}80%{-ms-transform:scale(.95)}100%{-ms-transform:scale(0);opacity:0;filter:Alpha(opacity=0)}}@-o-keyframes hideSweetAlert{0%{-o-transform:scale(1)}45%{-o-transform:scale(1.05)}80%{-o-transform:scale(.95)}100%{-o-transform:scale(0);opacity:0}}@keyframes layerFadeIn{0%{opacity:0;transform:scale(.5)}100%{opacity:1;transform:scale(1)}}@-webkit-keyframes layerFadeIn{0%{opacity:0;-webkit-transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1)}}@-moz-keyframes layerFadeIn{0%{opacity:0;-moz-transform:scale(.5)}100%{opacity:1;-moz-transform:scale(1)}}@-ms-keyframes layerFadeIn{0%{opacity:0;-ms-transform:scale(.5);filter:Alpha(opacity=0)}100%{opacity:1;-ms-transform:scale(1);filter:Alpha(opacity=100)}}@-o-keyframes layerFadeIn{0%{opacity:0;-o-transform:scale(.5)}100%{opacity:1;-o-transform:scale(1)}}@keyframes hideFadeIn{0%{opacity:1;transform:scale(1)}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes hideFadeIn{0%{opacity:1;-webkit-transform:scale(1)}100%{-webkit-transform:scale(.5);opacity:0}}@-moz-keyframes hideFadeIn{0%{opacity:1;-moz-transform:scale(1)}100%{-moz-transform:scale(.5);opacity:0}}@-ms-keyframes hideFadeIn{0%{opacity:1;-ms-transform:scale(1)}100%{-ms-transform:scale(.5);opacity:0;filter:Alpha(opacity=0)}}@-o-keyframes hideFadeIn{0%{opacity:1;-webkit-transform:scale(1)}100%{-webkit-transform:scale(.5);opacity:0}}@keyframes layer-fadeInUpBig{0%{opacity:0;transform:translateY(2000px)}100%{opacity:1;transform:translateY(0)}}@-webkit-keyframes layer-fadeInUpBig{0%{opacity:0;-webkit-transform:translateY(2000px);transform:translateY(2000px)}100%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}}@-moz-keyframes layer-fadeInUpBig{0%{opacity:0;-moz-transform:translateY(2000px);transform:translateY(2000px)}100%{opacity:1;-moz-transform:translateY(0);transform:translateY(0)}}@-ms-keyframes layer-fadeInUpBig{0%{opacity:0;-ms-transform:translateY(2000px);transform:translateY(2000px);filter:Alpha(opacity=0)}100%{opacity:1;-ms-transform:translateY(0);transform:translateY(0);filter:Alpha(opacity=100)}}@-o-keyframes layer-fadeInUpBig{0%{opacity:0;-o-transform:translateY(2000px);transform:translateY(2000px)}100%{opacity:1;-o-transform:translateY(0);transform:translateY(0)}}@keyframes hide-fadeInUpBig{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(2000px)}}@-webkit-keyframes hide-fadeInUpBig{0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-webkit-transform:translateY(2000px);transform:translateY(2000px)}}@-moz-keyframes hide-fadeInUpBig{0%{opacity:1;-moz-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-moz-transform:translateY(2000px);transform:translateY(2000px)}}@-ms-keyframes hide-fadeInUpBig{0%{opacity:1;-ms-transform:translateY(0);transform:translateY(0);filter:Alpha(opacity=100)}100%{opacity:0;-ms-transform:translateY(2000px);transform:translateY(2000px);filter:Alpha(opacity=0)}}@-o-keyframes hide-fadeInUpBig{0%{opacity:1;-o-transform:translateY(0);transform:translateY(0)}100%{opacity:0;-o-transform:translateY(2000px);transform:translateY(2000px)}}@-webkit-keyframes layer-rollIn{0%{opacity:0;-webkit-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}100%{opacity:1;-webkit-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}}@keyframes layer-rollIn{0%{opacity:0;transform:translateX(-100%) rotate(-120deg)}100%{opacity:1;transform:translateX(0) rotate(0)}}@-moz-keyframes layer-rollIn{0%{opacity:0;-moz-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}100%{opacity:1;-moz-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}}@-ms-keyframes layer-rollIn{0%{opacity:0;-ms-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg);filter:Alpha(opacity=0)}100%{opacity:1;-ms-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0);filter:Alpha(opacity=100)}}@-o-keyframes layer-rollIn{0%{opacity:0;-o-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}100%{opacity:1;-o-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}}@-webkit-keyframes hide-rollIn{0%{opacity:1;-webkit-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}100%{opacity:0;-webkit-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}}@keyframes hide-rollIn{0%{opacity:1;transform:translateX(0) rotate(0)}100%{opacity:0;transform:translateX(-100%) rotate(-120deg)}}@-moz-keyframes hide-rollIn{0%{opacity:1;-moz-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}100%{opacity:0;-moz-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}}@-ms-keyframes hide-rollIn{0%{opacity:1;-ms-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0);filter:Alpha(opacity=100)}100%{opacity:0;-ms-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg);filter:Alpha(opacity=0)}}@-o-keyframes hide-rollIn{0%{opacity:1;-o-transform:translateX(0) rotate(0);transform:translateX(0) rotate(0)}100%{opacity:0;-o-transform:translateX(-100%) rotate(-120deg);transform:translateX(-100%) rotate(-120deg)}}@keyframes layer-fadeIn{0%{opacity:0}100%{opacity:1}}@-webkit-keyframes layer-fadeIn{0%{opacity:0}100%{opacity:1}}@-moz-keyframes layer-fadeIn{0%{opacity:0}100%{opacity:1}}@-o-keyframes layer-fadeIn{0%{opacity:0}100%{opacity:1}}@-ms-keyframes layer-fadeIn{0%{opacity:0;filter:Alpha(opacity=0)}100%{opacity:1;filter:Alpha(opacity=100)}}@keyframes hide-fadeIn{0%{opacity:1}100%{opacity:0}}@-webkit-keyframes hide-fadeIn{0%{opacity:1}100%{opacity:0}}@-moz-keyframes hide-fadeIn{0%{opacity:1}100%{opacity:0}}@-o-keyframes hide-fadeIn{0%{opacity:1}100%{opacity:0}}@-ms-keyframes hide-fadeIn{0%{opacity:1}100%{opacity:0;filter:Alpha(opacity=0)}}@-webkit-keyframes layer-shake{0%,100%{-webkit-transform:translateX(0);transform:translateX(0)}10%,30%,50%,70%,90%{-webkit-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-webkit-transform:translateX(10px);transform:translateX(10px)}}@keyframes layer-shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}}@-moz-keyframes layer-shake{0%,100%{-moz-transform:translateX(0);transform:translateX(0)}10%,30%,50%,70%,90%{-moz-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-moz-transform:translateX(10px);transform:translateX(10px)}}@-ms-keyframes layer-shake{0%,100%{-ms-transform:translateX(0);transform:translateX(0)}10%,30%,50%,70%,90%{-ms-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-ms-transform:translateX(10px);transform:translateX(10px)}}@-o-keyframes layer-shake{0%,100%{-o-transform:translateX(0);transform:translateX(0)}10%,30%,50%,70%,90%{-o-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-o-transform:translateX(10px);transform:translateX(10px)}}@-webkit-keyframes hide-shake{0%,100%{-webkit-transform:translateX(10px);transform:translateX(10px)}10%,30%,50%,70%,90%{-webkit-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-webkit-transform:translateX(0);transform:translateX(0)}100%{opacity:0}}@keyframes hide-shake{0%,100%{transform:translateX(10px)}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(0)}100%{opacity:0}}@-moz-keyframes hide-shake{0%,100%{-moz-transform:translateX(10px);transform:translateX(10px)}10%,30%,50%,70%,90%{-moz-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-moz-transform:translateX(0);transform:translateX(0)}100%{opacity:0}}@-ms-keyframes hide-shake{0%,100%{-ms-transform:translateX(10px);transform:translateX(10px)}10%,30%,50%,70%,90%{-ms-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-ms-transform:translateX(0);transform:translateX(0)}100%{opacity:0;filter:Alpha(opacity=0)}}@-o-keyframes hide-shake{0%,100%{-o-transform:translateX(10px);transform:translateX(10px)}10%,30%,50%,70%,90%{-o-transform:translateX(-10px);transform:translateX(-10px)}20%,40%,60%,80%{-o-transform:translateX(0);transform:translateX(0)}100%{opacity:0}}@keyframes layer-spread{0%{transform:scaleX(0);opacity:0}100%{transform:scaleX(1);opacity:1}}@-webkit-keyframes layer-spread{0%{-webkit-transform:scaleX(0);opacity:0}100%{-webkit-transform:scaleX(1);opacity:1}}@-moz-keyframes layer-spread{0%{-moz-transform:scaleX(0);opacity:0}100%{-moz-transform:scaleX(1);opacity:1}}@-o-keyframes layer-spread{0%{-o-transform:scaleX(0);opacity:0}100%{-o-transform:scaleX(1);opacity:1}}@-ms-keyframes layer-spread{0%{-ms-transform:scaleX(0);opacity:0;filter:Alpha(opacity=0)}100%{-ms-transform:scaleX(1);opacity:1;filter:Alpha(opacity=100)}}@keyframes hide-spread{0%{transform:scaleX(1)}50%{transform:scaleX(.5)}100%{transformX:scaleX(0);opacity:0}}@-webkit-keyframes hide-spread{0%{-webkit-transform:scaleX(1)}50%{-webkit-transform:scaleX(.5)}100%{-webkit-transform:scaleX(0);opacity:0}}@-moz-keyframes hide-spread{0%{-moz-transform:scaleX(1)}50%{-moz-transform:scaleX(.5)}100%{-moz-transform:scaleX(0);opacity:0}}@-ms-keyframes hide-spread{0%{-ms-transform:scaleX(1)}50%{-ms-transform:scaleX(.5)}100%{-ms-transform:scaleX(0);opacity:0;filter:Alpha(opacity=0)}}.showAlert[data-animation=layerFadeIn]{animation:layerFadeIn .3s;-webkit-animation:layerFadeIn .3s;-moz-animation:layerFadeIn .3s;-ms-animation:layerFadeIn .3s;-o-animation:layerFadeIn .3s}.showAlert[data-animation=showSweetAlert]{animation:showSweetAlert .3s;-webkit-animation:showSweetAlert .3s;-moz-animation:showSweetAlert .3s;-ms-animation:showSweetAlert .3s;-o-animation:showSweetAlert .3s}.showAlert[data-animation=none]{animation:none;-webkit-animation:none;-moz-animation:none;-ms-animation:none;-o-animation:none}.showAlert[data-animation=slideFromTop]{animation:slideFromTop .3s;-webkit-animation:slideFromTop .3s;-moz-animation:slideFromTop .3s;-ms-animation:slideFromTop .3s;-o-animation:slideFromTop .3s}.showAlert[data-animation=slideFromBottom]{animation:slideFromBottom .2s;-webkit-animation:slideFromBottom .2s;-moz-animation:slideFromBottom .2s;-ms-animation:slideFromBottom .2s;-o-animation:slideFromBottom .2s}.showAlert[data-animation=layer-fadeInUpBig]{animation:layer-fadeInUpBig .2s;-webkit-animation:layer-fadeInUpBig .2s;-moz-animation:layer-fadeInUpBig .2s;-ms-animation:layer-fadeInUpBig .2s;-o-animation:layer-fadeInUpBig .2s}.showAlert[data-animation=layer-rollIn]{animation:layer-rollIn .3s;-webkit-animation:layer-rollIn .3s;-moz-animation:layer-rollIn .3s;-ms-animation:layer-rollIn .3s;-o-animation:layer-rollIn .3s}.showAlert[data-animation=layer-fadeIn]{animation:layer-fadeIn .3s;-webkit-animation:layer-fadeIn .3s;-moz-animation:layer-fadeIn .3s;-ms-animation:layer-fadeIn .3s;-o-animation:layer-fadeIn .3s}.showAlert[data-animation=layer-shake]{animation:layer-shake .3s;-webkit-animation:layer-shake .3s;-moz-animation:layer-shake .3s;-ms-animation:layer-shake .3s;-o-animation:layer-shake .3s}.showAlert[data-animation=layer-spread]{animation:layer-spread .2s;-webkit-animation:layer-spread .2s;-moz-animation:layer-spread .2s;-ms-animation:layer-spread .2s;-o-animation:layer-spread .2s}.hideAlert[data-animation=layer-spread]{animation:hide-spread .5s forwards;-webkit-animation:hide-spread .5s forwards;-moz-animation:hide-spread .5s forwards;-ms-animation:hide-spread .5s forwards;-o-animation:hide-spread .5s forwards}.hideAlert[data-animation=slideFromTop]{animation:hideFromTop .2s forwards;-webkit-animation:hideFromTop .2s forwards;-moz-animation:hideFromTop .2s forwards;-ms-animation:hideFromTop .2s forwards;-o-animation:hideFromTop .2s forwards}.hideAlert[data-animation=slideFromBottom]{animation:hideFromBottom .2s forwards;-webkit-animation:hideFromBottom .2s forwards;-moz-animation:hideFromBottom .2s forwards;-ms-animation:hideFromBottom .2s forwards;-o-animation:hideFromBottom .2s forwards}.hideAlert[data-animation=showSweetAlert]{animation:hideSweetAlert .2s forwards;-webkit-animation:hideSweetAlert .2s forwards;-moz-animation:hideSweetAlert .2s forwards;-ms-animation:hideSweetAlert .2s forwards;-o-animation:hideSweetAlert .2s forwards}.hideAlert[data-animation=layerFadeIn]{animation:hideFadeIn .2s forwards;-webkit-animation:hideFadeIn .2s forwards;-moz-animation:hideFadeIn .2s forwards;-ms-animation:hideFadeIn .2s forwards;-o-animation:hideFadeIn .2s forwards}.hideAlert[data-animation=layer-fadeIn]{animation:hide-fadeIn .2s forwards;-webkit-animation:hide-fadeIn .2s forwards;-moz-animation:hide-fadeIn .2s forwards;-ms-animation:hide-fadeIn .2s forwards;-o-animation:hide-fadeIn .2s forwards}.hideAlert[data-animation=layer-fadeInUpBig]{animation:hide-fadeInUpBig .2s forwards;-webkit-animation:hide-fadeInUpBig .2s forwards;-moz-animation:hide-fadeInUpBig .2s forwards;-ms-animation:hide-fadeInUpBig .2s forwards;-o-animation:hide-fadeInUpBig .2s forwards}.hideAlert[data-animation=layer-rollIn]{animation:hide-rollIn .2s forwards;-webkit-animation:hide-rollIn .2s forwards;-moz-animation:hide-rollIn .2s forwards;-ms-animation:hide-rollIn .2s forwards;-o-animation:hide-rollIn .2s forwards}.hideAlert[data-animation=layer-shake]{animation:hide-shake .2s forwards;-webkit-animation:hide-shake .2s forwards;-moz-animation:hide-shake .2s forwards;-ms-animation:hide-shake .2s forwards;-o-animation:hide-shake .2s forwards}";
            return css;
        }
        function Style() {
            return "";
        }
    }
    jQuery.popInfo = jQuery.Pro || {};
    jQuery.popInfo = function (Html, typeTime) {
        if ($(".proShow").length) return false
        typeTime = typeTime ? typeTime : 2000
        var Config = $.extend(true, {
            Img: false,
            ImgWh: "100*100",
            BoxBgopacity: 0.6,
            ZIndex: 99999,
            Time: 2,
            StartOn: false,
            EndOn: false,
            Class: false,
            auto: 'auto'
        }, typeTime);
        $Box = $("<div class= 'proShow'>").css({
            "user-select": "none",
            "font-family": "Microsoft YaHei', '微软雅黑', 'Lantinghei SC', 'Open Sans', Arial, 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', SimSun, sans-serif",
            "position": "fixed",
            "display": "inline-block",
            "left": "50%",
            "top": "50%",
            "max-width": "500px",
            "background-color": "rgba(0,0,0," + Config.BoxBgopacity + ")",
            "padding": "13px 18px",
            "color": "#fff",
            "filter": "progid:DXImageTransform.Microsoft.Gradient(startColorstr=#88000000,endColorstr=#88000000);", //ie8 下 背景颜色
            "border-radius": " 5px",
            "line-height": "30px",
            "font-size": "14px",
            "text-align": "center"
        }).addClass(Config.Class);
        $BoxHtml = $("<p>").css({
            width: "100%",
            "margin": "0",
            "padding": "0"
        }).html(Html);
        $("body").append($Box.append($BoxHtml));
        if (Config.Img) {
            $BoxImg = $("<img>").attr({
                "src": Config.Img
            })
            $Box.prepend($BoxImg)
            if (Config.ImgWh) {
                var i = Config.ImgWh.split("*");
                $BoxImg.attr({
                    "width": i[0],
                    "height": i[1]
                })
            }
        }
        $Box.css({
            "margin-left": -$Box.outerWidth() * 0.5,
            "margin-top": -$Box.outerHeight() * 0.5,
            "z-index": Config.ZIndex
        });
        if (Config.StartOn) Config.StartOn()
        if (Config.auto == 'auto') {
            setTimeout(function () {
                $Box.fadeOut("show", function () {
                    $.proHide()
                });
                if (Config.EndOn) Config.EndOn()
            }, typeTime)
        }
    };
    // 删除Pro
    $.proHide = function () {
        $(".proShow").remove()
    }
    /*
     *警告弹出框
     *
     *@action.title 		提示框title （选填）
     *
     *@action.content 	提示框内容 （必填）
     *
     *@action.confirm 	提示框确认回调 （选填  不填 默认直接关闭弹框）
     *
     */
    $.popAlert = function (action) {
        if ($(".showAlert").length) return false
        var str = action.content ? action.content : action,
            str1;
        if (str.length > 50 && str.indexOf("<br>") == -1) str1 = str.slice(0, 37) + '<br>' + str.slice(37)
        $.Pop(str1 ? str1 : str, {
            title: action.title ? action.title : "提示：", //标题
            type: 'alert'
        }, action.confirm);
        unScroll()
    }
    /*
     *确认取消弹出框
     *
     *@action 			对象（必填）
     *
     *@action.title 		提示框title （选填）
     *
     *@action.content 	提示框内容 （必填）
     *
     *@action.confirm 	提示框确认回调 （选填  不填 默认直接关闭弹框）
     *
     *@action.error 		提示框取消回调 （选填  不填 默认直接关闭弹框）
     *
     */
    $.popConfirm = function (action) {
        if ($(".showAlert").length) return false
        $.Pop(action.content, {
            title: action.title ? action.title : "提示：", //标题
            type: 'confirm'
        }, action.confirm, action.error);
        unScroll()
    }
})(jQuery);
//当页面存在弹出框时 回车默认点击确定按钮
$("body").on('keydown', function (e) {
    var tagName = e.target.tagName
    if ($(".showAlert").length && e.keyCode == 13 && tagName != 'INPUT' && tagName != 'TEXTAREA') {
        $(".showAlert .btn-primary").click()
    }
})
//日期控件
var jeDate = "";
(function (window, factory) {
    // window.jeDate = window.jeDate  ? window.jeDate  :""
    //amd
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        jeDate = factory();
    }
})
    (this, function () {
        var doc = document,
            win = window;
        var jet = {},
            doc = document,
            regymdzz = "YYYY|MM|DD|hh|mm|ss|zz",
            gr = /\-/g,
            regymd = "YYYY|MM|DD|hh|mm|ss|zz".replace("|zz", ""),
            parseInt = function (n) {
                return window.parseInt(n, 10);
            };
        var $Q = function (selector, content) {
            content = content || document;
            return selector.nodeType ? selector : content.querySelector(selector);
        };
        var jeDate = function (elem, options) {
            var opts = typeof (options) === "function" ? options() : options;
            return new jeDatePick(elem, opts);
        };
        //日期控件版本
        jeDate.dateVer = "V6.5.0";
        //用一个或多个其他对象来扩展一个对象，返回被扩展的对象
        jeDate.extend = jet.extend = function () {
            var options, name, src, copy, deep = false,
                target = arguments[0],
                i = 1,
                length = arguments.length;
            if (typeof (target) === "boolean") deep = target, target = arguments[1] || {}, i = 2;
            if (typeof (target) !== "object" && typeof (target) !== "function") target = {};
            if (length === i) target = this, --i;
            for (; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name], copy = options[name];
                        if (target === copy) continue;
                        if (copy !== undefined) target[name] = copy;
                    }
                }
            }
            return target;
        };
        //返回指定日期
        jeDate.nowDate = function (val, format) {
            format = format || 'YYYY-MM-DD hh:mm:ss';
            if (!isNaN(val)) val = {
                DD: val
            };
            return jet.parse(jet.getDateTime(val), format);
        };
        //日期转换
        jeDate.convert = function (obj) {
            obj.format = obj.format || 'YYYY-MM-DD hh:mm:ss';
            obj.addval = obj.addval || [];
            var mats = jet.reMatch(obj.format),
                objVal = {};
            jet.each(jet.reMatch(obj.val), function (i, cval) {
                objVal[mats[i]] = parseInt(cval);
            });
            var result = new DateTime(obj.addval, objVal),
                redate = {
                    YYYY: result.GetYear(),
                    MM: result.GetMonth(),
                    DD: result.GetDate(),
                    hh: result.GetHours(),
                    mm: result.GetMinutes(),
                    ss: result.GetSeconds()
                };
            return redate;
        };
        jeDate.valText = function (elem, value) {
            return jet.valText(elem, value);
        }
        //日期时间戳相互转换
        jeDate.timeStampDate = function (date, format) {
            format = format || 'YYYY-MM-DD hh:mm:ss';
            var dateTest = (/^(-)?\d{1,10}$/.test(date) || /^(-)?\d{1,13}$/.test(date));
            if (/^[1-9]*[1-9][0-9]*$/.test(date) && dateTest) {
                var vdate = parseInt(date);
                if (/^(-)?\d{1,10}$/.test(vdate)) {
                    vdate = vdate * 1000;
                } else if (/^(-)?\d{1,13}$/.test(vdate)) {
                    vdate = vdate * 1000;
                } else if (/^(-)?\d{1,14}$/.test(vdate)) {
                    vdate = vdate * 100;
                } else {
                    alert("时间戳格式不正确");
                    return;
                }
                var setdate = new Date(vdate);
                return jet.parse({
                    YYYY: setdate.getFullYear(),
                    MM: jet.digit(setdate.getMonth() + 1),
                    DD: jet.digit(setdate.getDate()),
                    hh: jet.digit(setdate.getHours()),
                    mm: jet.digit(setdate.getMinutes()),
                    ss: jet.digit(setdate.getSeconds())
                }, format);
            } else {
                //将日期转换成时间戳
                var arrs = jet.reMatch(date),
                    newdate = new Date(arrs[0], arrs[1] - 1, arrs[2], arrs[3] || 0, arrs[4] || 0, arrs[5] || 0),
                    timeStr = Math.round(newdate.getTime() / 1000);
                return timeStr;
            }
        };
        //获取年月日星期
        jeDate.getLunar = function (obj) {
            //如果为数字类型的日期对获取到日期的进行替换
            var lunars = jeLunar(obj.YYYY, parseInt(obj.MM) - 1, obj.DD);
            return {
                nM: lunars.lnongMonth, //农历月
                nD: lunars.lnongDate, //农历日
                cY: parseInt(lunars.solarYear), //阳历年
                cM: parseInt(lunars.solarMonth), //阳历月
                cD: parseInt(lunars.solarDate), //阳历日
                cW: lunars.inWeekDays, //汉字星期几
                nW: lunars.solarWeekDay //数字星期几
            };
        };
        //转换日期格式
        jeDate.parse = jet.parse = function (ymdhms, format) {
            return format.replace(new RegExp(regymdzz, "g"), function (str, index) {
                return str == "zz" ? "00" : jet.digit(ymdhms[str]);
            });
        }
        //返回日期
        function DateTime(arr, valObj) {
            var that = this,
                newdate = new Date(),
                narr = ["FullYear", "Month", "Date", "Hours", "Minutes", "Seconds"];
            var vb = jet.extend({
                YYYY: null,
                MM: null,
                DD: null,
                hh: newdate.getHours(),
                mm: newdate.getMinutes(),
                ss: newdate.getSeconds()
            }, valObj);
            var ND = valObj == undefined ? newdate : new Date(vb.YYYY, vb.MM, vb.DD, vb.hh, vb.mm, vb.ss);
            if ((arr || []).length > 0) jet.each(arr, function (i, par) {
                ND["set" + narr[i]](narr[i] == "Month" ? parseInt(par) - 1 : parseInt(par));
            });
            //返回一个数值相同的新DateTime对象
            that.reDate = function () {
                return new DateTime();
            };
            //返回此实例的Date值
            that.GetValue = function () {
                return ND;
            };
            //获取此实例所表示日期的年份部分。
            that.GetYear = function () {
                return ND.getFullYear();
            };
            //获取此实例所表示日期的月份部分。
            that.GetMonth = function () {
                return ND.getMonth() + 1;
            };
            //获取此实例所表示的日期为该月中的第几天。
            that.GetDate = function () {
                return ND.getDate();
            };
            //获取此实例所表示日期的小时部分。
            that.GetHours = function () {
                return ND.getHours();
            };
            //获取此实例所表示日期的分钟部分。
            that.GetMinutes = function () {
                return ND.getMinutes();
            };
            //获取此实例所表示日期的秒部分。
            that.GetSeconds = function () {
                return ND.getSeconds();
            };
        };
        jet.extend(jet, {
            isType: function (obj, type) {
                var firstUper = function (str) {
                    str = str.toLowerCase();
                    return str.replace(/\b(\w)|\s(\w)/g, function (m) {
                        return m.toUpperCase();
                    });
                }
                return Object.prototype.toString.call(obj) == "[object " + firstUper(type) + "]";
            },
            each: function (obj, callback, args) {
                var name, i = 0,
                    length = obj ? obj.length : 0,
                    iselem = (length === undefined || obj === "function");
                if (iselem) {
                    for (name in obj) {
                        if (callback.call(obj[name], name, obj[name]) === false) {
                            break
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.call(obj[i], i, obj[i++]) === false) {
                            break
                        }
                    }
                }
                return obj;
            },
            on: function (elm, type, fn) {
                if (elm.addEventListener) {
                    elm.addEventListener(type, fn, false); //DOM2.0
                    return true;
                } else if (elm.attachEvent) {
                    return elm.attachEvent("on" + type, fn); //IE5+
                } else {
                    elm["on" + type] = fn; //DOM 0
                }
            },
            isObj: function (obj) {
                for (var i in obj) {
                    return true;
                }
                return false;
            },
            trim: function (str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },
            reMatch: function (str) {
                var smarr = [],
                    maStr = "",
                    parti = /(^\w{4}|\w{2}\B)/g;
                if (jet.isNum(str)) {
                    maStr = str.replace(parti, "$1-");
                } else {
                    maStr = /^[A-Za-z]+$/.test(str) ? str.replace(parti, "$1-") : str;
                }
                jet.each(maStr.match(/\w+|d+/g), function (i, val) {
                    smarr.push(jet.isNum(val) ? parseInt(val) : val);
                });
                return smarr;
            },
            equals: function (arrA, arrB) {
                if (!arrB) return false;
                if (arrA.length != arrB.length) return false;
                for (var i = 0, l = arrA.length; i < l; i++) {
                    if (arrA[i] instanceof Array && arrB[i] instanceof Array) {
                        if (!arrA[i].equals(arrB[i])) return false;
                    } else if (arrA[i] != arrB[i]) {
                        return false;
                    }
                }
                return true;
            },
            docScroll: function (type) {
                type = type ? "scrollLeft" : "scrollTop";
                return document.body[type] | document.documentElement[type];
            },
            docArea: function (type) {
                return document.documentElement[type ? "clientWidth" : "clientHeight"];
            },
            //补齐数位
            digit: function (num) {
                // log(num)
                return num < 10 || !num ? "0" + (num | 0) : num;
            },
            //判断是否为数字
            isNum: function (value) {
                return /^[+-]?\d*\.?\d*$/.test(value) ? true : false;
            },
            //获取本月的总天数
            getDaysNum: function (y, m) {
                var num = 31,
                    isLeap = (y % 100 !== 0 && y % 4 === 0) || (y % 400 === 0);
                switch (parseInt(m)) {
                    case 2:
                        num = isLeap ? 29 : 28;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        num = 30;
                        break;
                }
                return num;
            },
            //获取月与年
            getYM: function (y, m, n) {
                var nd = new Date(y, m - 1);
                nd.setMonth(m - 1 + n);
                return {
                    y: nd.getFullYear(),
                    m: nd.getMonth() + 1
                };
            },
            //获取上个月
            prevMonth: function (y, m, n) {
                return jet.getYM(y, m, 0 - (n || 1));
            },
            //获取下个月
            nextMonth: function (y, m, n) {
                return jet.getYM(y, m, n || 1);
            },
            setCss: function (elem, obj) {
                for (var x in obj) elem.style[x] = obj[x];
            },
            html: function (elem, html) {
                return typeof html === "undefined" ? elem && elem.nodeType === 1 ? elem.innerHTML : undefined : typeof html !== "undefined" && html == true ? elem && elem.nodeType === 1 ? elem.outerHTML : undefined : elem.innerHTML = html;
            },
            // 读取设置节点文本内容
            text: function (elem, value) {
                var innText = document.all ? "innerText" : "textContent";
                return typeof value === "undefined" ? elem && elem.nodeType === 1 ? elem[innText] : undefined : elem[innText] = value;
            },
            //设置值
            val: function (elem, value) {
                if (typeof value === "undefined") {
                    return elem && elem.nodeType === 1 && typeof elem.value !== "undefined" ? elem.value : undefined;
                }
                // 将value转化为string
                value = value == null ? "" : value + "";
                elem.value = value;
            },
            attr: function (elem, value) {
                return elem.getAttribute(value);
            },
            hasClass: function (obj, cls) {
                return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
            },
            stopPropagation: function (ev) {
                (ev && ev.stopPropagation) ? ev.stopPropagation() : window.event.cancelBubble = true;
            },
            template: function (str, data) {
                var strCell = !/[^\w\-\.:]/.test(str) ? document.getElementById(str).innerHTML : str;
                var keys = function (obj) {
                    var arr = [];
                    for (arr[arr.length] in obj);
                    return arr;
                },
                    dataVar = function (obj) {
                        var vars = '';
                        for (var key in obj) {
                            vars += 'var ' + key + '= $D["' + key + '"];';
                        }
                        return vars;
                    },
                    compile = function (source, data) {
                        var code = "var $out='" + source.replace(/[\r\n]/g, '').replace(/^(.+?)\{\%|\%\}(.+?)\{\%|\%\}(.+?)$/g, function (val) {
                            return val.replace(/(['"])/g, '\\\$1');
                        }).replace(/\{\%\s*=\s*(.+?)\%\}/g, "';$out+=$1;$out+='").replace(/\{\%(.+?)\%\}/g, "';$1;$out+='") + "';return new String($out);";
                        var vars = dataVar(data),
                            Render = new Function('$D', vars + code);
                        return new Render(data) + '';
                    };
                return compile(strCell, data);
            },
            //判断元素类型
            isValDiv: function (elem) {
                return /textarea|input/.test(elem.tagName.toLocaleLowerCase());
            },
            valText: function (elem, value) {
                var cell = $Q(elem),
                    type = jet.isValDiv(cell) ? "val" : "text";
                if (value != undefined) {
                    jet[type](cell, value);
                } else {
                    return jet[type](cell);
                }
            },
            isBool: function (obj) {
                return (obj == undefined || obj == true ? true : false);
            },
            //获取返回的日期
            getDateTime: function (obj) {
                var result = new DateTime(),
                    objVal = jet.extend({
                        YYYY: null,
                        MM: null,
                        DD: null,
                        hh: 0,
                        mm: 0,
                        ss: 0
                    }, obj),
                    matArr = {
                        YYYY: "FullYear",
                        MM: "Month",
                        DD: "Date",
                        hh: "Hours",
                        mm: "Minutes",
                        ss: "Seconds"
                    };
                jet.each(["ss", "mm", "hh", "DD", "MM", "YYYY"], function (i, mat) {
                    if (!jet.isNum(parseInt(objVal[mat]))) return null;
                    var reVal = result.GetValue();
                    if (parseInt(objVal[mat]) || parseInt(objVal[mat]) == 0) {
                        reVal["set" + matArr[mat]](result["Get" + matArr[mat]]() + (mat == "MM" ? -1 : 0) + parseInt(objVal[mat]));
                    }
                });
                //获取格式化后的日期
                var redate = {
                    YYYY: result.GetYear(),
                    MM: result.GetMonth(),
                    DD: result.GetDate(),
                    hh: result.GetHours(),
                    mm: result.GetMinutes(),
                    ss: result.GetSeconds()
                };
                return redate;
            }
        });
        function jeDatePick(elem, options) {
            // console.log()
            // elx = elem
            var config = {
                language: {
                    name: "cn",
                    month: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
                    weeks: ["日", "一", "二", "三", "四", "五", "六"],
                    times: ["小时", "分钟", "秒数"],
                    timetxt: ["时间选择", "开始时间", "结束时间"],
                    backtxt: "返回日期",
                    clear: "清空",
                    today: "现在",
                    yes: "确定"
                },
                format: "YYYY-MM-DD hh:mm:ss", //日期格式
                minDate: "1800-01-01 00:00:00", //最小日期
                maxDate: "2099-12-31 23:59:59", //最大日期
                isShow: true, //是否显示为固定日历，为false的时候固定显示
                multiPane: true, //是否为双面板，为false是展示双面板
                onClose: true, //是否为选中日期后关闭弹层，为false时选中日期后关闭弹层
                range: false, //如果不为空且不为false，则会进行区域选择，例如 " 至 "，" ~ "，" To "
                trigger: "click", //是否为内部触发事件，默认为内部触发事件
                position: [], //自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
                valiDate: [], //有效日期与非有效日期，例如 ["0[4-7]$,1[1-5]$,2[58]$",true]
                isinitVal: false, //是否初始化时间，默认不初始化时间
                initDate: {}, //初始化时间，加减 天 时 分
                isTime: true, //是否开启时间选择
                isClear: true, //是否显示清空按钮
                isToday: true, //是否显示今天或本月按钮
                isYes: true, //是否显示确定按钮
                festival: false, //是否显示农历节日
                fixed: true, //是否静止定位，为true时定位在输入框，为false时居中定位
                zIndex: 2099, //弹出层的层级高度
                method: {}, //自定义方法
                theme: {}, //自定义主题色
                shortcut: [], //日期选择的快捷方式
                donefun: null, //选中日期完成的回调
                before: null, //在界面加载之前执行
                succeed: null, //在界面加载之后执行
                clearfun: null
            };
            this.$opts = jet.extend(config, options || {});
            this.valCell = $Q(elem);
            this.format = this.$opts.format;
            this.valCell != null ? this.init() : alert(elem + "  ID\u6216\u7C7B\u540D\u4E0D\u5B58\u5728!");
            jet.extend(this, this.$opts.method);
            delete this.$opts.method;
        }
        var searandom = function () {
            var str = "",
                arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
            for (var i = 0; i < 8; i++) str += arr[Math.round(Math.random() * (arr.length - 1))];
            return str;
        };
        // console.log(this)
        var jefix = "jefixed",
            ymdzArr = jet.reMatch(regymdzz),
            elx = "#jedate";
        jet.extend(jeDatePick.prototype, {
            init: function () {
                var that = this,
                    opts = that.$opts,
                    newDate = new Date(),
                    shortArr = [],
                    trigges = opts.trigger,
                    ndate = opts.initDate || [],
                    inVal, range = opts.range,
                    zIndex = opts.zIndex == undefined ? 10000 : opts.zIndex,
                    isShow = jet.isBool(opts.isShow),
                    isinitVal = (opts.isinitVal == undefined || opts.isinitVal == false) ? false : true;
                that.setDatas();
                opts.before && opts.before(that.valCell);
                //为开启初始化的时间设置值
                if (isinitVal && trigges && isShow) {
                    if (ndate[1]) {
                        var addval = jet.getDateTime(ndate[0]);
                        inVal = [{
                            YYYY: addval.YYYY,
                            MM: jet.digit(addval.MM),
                            DD: jet.digit(addval.DD),
                            hh: jet.digit(addval.hh),
                            mm: jet.digit(addval.mm),
                            ss: jet.digit(addval.ss)
                        }];
                    } else {
                        inVal = that.getValue(jet.isObj(ndate[0]) ? ndate[0] : {});
                    }
                    if (!range) that.setValue([inVal[0]], opts.format, true);
                }
                var getCurrValue = function () {
                    var mats = jet.reMatch(that.format),
                        isEmpty = that.getValue() != "",
                        curVal = [],
                        parmat = that.dlen == 7 ? "hh:mm:ss" : "YYYY-MM" + (that.dlen <= 2 ? "" : "-DD");
                    that.selectValue = [jet.parse(jet.getDateTime({}), parmat)];
                    if (isEmpty && isShow) {
                        var getVal = that.getValue().split(range);
                        jet.each(new Array(range ? 2 : 1), function (a) {
                            curVal[a] = {};
                            jet.each(jet.reMatch(getVal[a]), function (i, val) {
                                curVal[a][mats[i]] = parseInt(val);
                            });
                        });
                        if (range) that.selectValue = getVal;
                    } else {
                        var parr = that.getValue({})[0],
                            nmVal = jet.nextMonth(parr.YYYY, parr.MM || jet.getDateTime({}).MM),
                            narr = (that.dlen > 2 && that.dlen <= 6) ? {
                                YYYY: nmVal ? nmVal.y : "",
                                MM: nmVal ? nmVal.m : ""
                            } : {};
                        curVal = [parr];
                    }
                    that.selectDate = curVal;
                    return curVal;
                },
                    ymarr = [];
                that.minDate = "";
                that.maxDate = "";
                if (!isShow || !trigges) ymarr = getCurrValue();
                if (!isShow || !trigges) {
                    that.minDate = jet.isType(opts.minDate, "function") ? opts.minDate(that) : opts.minDate;
                    that.maxDate = jet.isType(opts.maxDate, "function") ? opts.maxDate(that) : opts.maxDate;
                    that.storeData(ymarr[0], ymarr[1]);
                    that.renderDate();
                    opts.succeed && opts.succeed(that.dateCell);
                } else {
                    if (trigges) {
                        jet.on(that.valCell, trigges, function () {
                            if (document.querySelectorAll(elx).length > 0) return;
                            var gvarr = getCurrValue();
                            that.minDate = jet.isType(opts.minDate, "function") ? opts.minDate(that) : opts.minDate;
                            that.maxDate = jet.isType(opts.maxDate, "function") ? opts.maxDate(that) : opts.maxDate;
                            that.storeData(gvarr[0], gvarr[1]);
                            that.renderDate();
                        });
                    }
                }
            },
            setDatas: function () {
                var that = this,
                    opts = that.$opts,
                    range = opts.range,
                    shortArr = [],
                    isShow = jet.isBool(opts.isShow),
                    multi = opts.multiPane;
                that.$data = jet.extend({
                    year: false,
                    month: false,
                    day: true,
                    time: false,
                    timebtn: false
                }, {
                        shortcut: [],
                        lang: opts.language,
                        yaerlist: [],
                        monthlist: [
                            [],
                            []
                        ],
                        ymlist: [
                            [],
                            []
                        ],
                        daylist: [
                            [],
                            []
                        ],
                        clear: opts.isClear,
                        today: range ? false : opts.isToday,
                        yes: opts.isYes,
                        pane: multi ? 1 : 2
                    });
                if (opts.shortcut.length > 0) {
                    jet.each(opts.shortcut, function (i, short) {
                        var tarr = [],
                            shval = jet.isType(short.val, "function") ? short.val() : short.val;
                        if (jet.isType(shval, "object")) {
                            for (var s in shval) tarr.push(s + ':' + shval[s]);
                            shortArr.push(jet.extend({}, {
                                name: short.name,
                                val: "{" + tarr.join('#') + "}"
                            }));
                        }
                    });
                    that.$data.shortcut = shortArr;
                }
                that.dlen = (function () {
                    var mats = jet.reMatch(that.format),
                        marr = [];
                    jet.each(ymdzArr, function (i, val) {
                        jet.each(mats, function (m, mval) {
                            if (val == mval) marr.push(mval);
                        });
                    });
                    var matlen = marr.length,
                        lens = (marr[0] == "hh") && matlen <= 3 ? 7 : matlen;
                    return lens;
                })();
                that.$data.dlen = that.dlen;
                that.timeInspect = false;
                if (that.dlen == 1) {
                    jet.extend(that.$data, {
                        year: true,
                        day: false
                    });
                } else if (that.dlen == 2) {
                    jet.extend(that.$data, {
                        month: true,
                        day: false
                    });
                } else if (that.dlen > 3 && that.dlen <= 6) {
                    that.$data.timebtn = true;
                } else if (that.dlen == 7) {
                    jet.extend(that.$data, {
                        day: false,
                        time: true
                    });
                }
                if (!isShow) {
                    that.$data.clear = false;
                    that.$data.yes = false;
                }
            },
            renderDate: function () {
                var that = this,
                    opts = that.$opts,
                    isShow = jet.isBool(opts.isShow),
                    elxID = !isShow ? elx + searandom() : elx,
                    setzin = {
                        "zIndex": (opts.zIndex == undefined ? 10000 : opts.zIndex)
                    };
                if (that.dateCell == undefined) {
                    that.dateCell = document.createElement("div");
                    that.dateCell.id = elxID.replace(/\#/g, "");
                    that.dateCell.className = elx.replace(/\#/g, "") + " " + (opts.shortcut.length > 0 ? " leftmenu" : "");
                    that.dateCell.setAttribute("author", "chen guojun");
                }
                jet.html(that.dateCell, jet.template(that.dateTemplate(), that.$data));
                //自定义主题色
                if (jet.isObj(opts.theme)) {
                    var userAent = $bsType
                    if (userAent !== 'ie8' && userAent !== 'ie7') {
                        var styleDiv = document.createElement("style"),
                            stCell = ".jedate" + searandom(),
                            t = opts.theme,
                            BG = "background-color:#6499FF",
                            WC = "color:" + (t.color == undefined ? "#FFFFFF" : t.color),
                            OTH = (t.pnColor == undefined ? "" : "color:" + t.pnColor + ";");
                        that.dateCell.className = that.dateCell.className + " " + stCell.replace(/^./g, "");
                        styleDiv.setAttribute("type", "text/css");
                        styleDiv.innerHTML = stCell + " .jedate-menu p:hover{" + BG + ";" + WC + ";}" + stCell + " .jedate-header em{" + WC + ";}" +
                            stCell + " .jedate-content .yeartable td.action span," + stCell + " .jedate-content .monthtable td.action span," +
                            stCell + " .jedate-content .yeartable td.action span:hover," + stCell + " .jedate-content .monthtable td.action span:hover{" + BG + ";border:1px " + t.bgcolor + " solid;" + WC + ";}" + stCell + " .jedate-content .daystable td.action," + stCell + " .jedate-content .daystable td.action:hover," +
                            stCell + " .jedate-content .daystable td.action .lunar," + stCell + " .jedate-header," + stCell + " .jedate-time .timeheader," +
                            stCell + " .jedate-time .hmslist ul li.action," + stCell + " .jedate-time .hmslist ul li.action:hover," +
                            stCell + " .jedate-time .hmslist ul li.disabled.action," + stCell + " .jedate-footbtn .timecon," + stCell + " .jedate-footbtn .btnscon span{" + BG + ";" + WC + ";}" +
                            stCell + " .jedate-content .daystable td.other," + stCell + " .jedate-content .daystable td.other .nolunar," + stCell + " .jedate-content .daystable td.other .lunar{" + OTH + "}" + stCell + " .jedate-content .daystable td.contain," + stCell + " .jedate-content .daystable td.contain:hover{background-" + OTH + "}";
                        that.dateCell.appendChild(styleDiv);
                    }
                }
                that.compileBindNode(that.dateCell);
                if (document.querySelectorAll(elxID).length > 0) document.body.removeChild($Q(elxID));
                !isShow ? that.valCell.appendChild(that.dateCell) : document.body.appendChild(that.dateCell);
                jet.setCss(that.dateCell, jet.extend({
                    position: (!isShow ? "relative" : (opts.fixed == true ? "absolute" : "fixed"))
                }, isShow ? setzin : {}));
                that.methodEventBind();
                if (that.dlen == 7 || (that.dlen > 3 && that.dlen <= 6)) that.locateScroll();
                if (opts.festival && opts.language.name == "cn") that.showFestival();
                if (isShow) {
                    that.dateOrien(that.dateCell, that.valCell);
                    that.blankArea();
                }
            },
            //设置日期值
            setValue: function (fnStr, matStr, bool) {
                var that = this,
                    valCell = that.valCell,
                    strVal;
                matStr = matStr || that.format;
                if ((typeof fnStr == 'string') && fnStr != '') {
                    var sprange = fnStr.split(that.$opts.range),
                        inArr = [];
                    jet.each(sprange, function (i, sval) {
                        var reVal = jet.reMatch(sval),
                            inObj = {};
                        jet.each(jet.reMatch(matStr), function (r, val) {
                            inObj[val] = reVal[r];
                        });
                        inArr.push(inObj);
                    });
                    strVal = inArr;
                } else {
                    strVal = fnStr;
                }
                // log(matStr)
                var vals = that.parseValue(strVal, matStr);
                if (bool != false) jet.valText(valCell, vals);
                return vals;
            },
            //获取日期值
            getValue: function (valobj) {
                var that = this,
                    valCell = that.valCell,
                    opts = that.$opts,
                    reObj, result = new DateTime().reDate(),
                    dateY = result.GetYear(),
                    dateM = result.GetMonth(),
                    dateD = result.GetDate(),
                    timeh = result.GetHours(),
                    timem = result.GetMinutes(),
                    times = result.GetSeconds();
                if (valobj == undefined && jet.isBool(opts.isShow)) {
                    reObj = jet.valText(valCell);
                } else {
                    var isValShow = jet.isBool(opts.isShow) ? (jet.valText(valCell) == "") : !jet.isBool(opts.isShow),
                        objarr = jet.extend({
                            YYYY: null,
                            MM: null,
                            DD: null
                        }, valobj || {}),
                        ranMat = [],
                        newArr = new Array(2),
                        unObj = function (obj) {
                            return [(objarr[obj] == undefined || objarr[obj] == null), objarr[obj]];
                        },
                        defObj = [{
                            YYYY: dateY,
                            MM: dateM,
                            DD: dateD,
                            hh: timeh,
                            mm: timem,
                            ss: times,
                            zz: '00'
                        },
                        {
                            YYYY: dateY,
                            MM: dateM,
                            DD: dateD,
                            hh: timeh,
                            mm: timem,
                            ss: times,
                            zz: '00'
                        }
                        ];
                    if (isValShow) {
                        //目标为空值则获取当前日期时间
                        jet.each(newArr, function (i) {
                            var inObj = {};
                            jet.each(ymdzArr, function (r, val) {
                                inObj[val] = parseInt(unObj(val)[0] ? defObj[i][val] : unObj(val)[1]);
                            });
                            ranMat.push(jet.extend(defObj[i], inObj));
                        });
                    } else {
                        var isunRange = opts.range != false,
                            initVal = that.getValue(),
                            spVal = initVal.split(opts.range),
                            reMat = jet.reMatch(that.format);
                        jet.each(newArr, function (i) {
                            var inObj = {},
                                reVal = isunRange ? jet.reMatch(spVal[i]) : jet.reMatch(initVal);
                            jet.each(reMat, function (r, val) {
                                inObj[val] = reVal[r];
                            });
                            var exVal = jet.extend(inObj, valobj || {});
                            ranMat.push(jet.extend(defObj[i], exVal));
                        });
                    }
                    reObj = ranMat;
                }
                return reObj;
            },
            storeData: function (curr, next) {
                next = next || {};
                var that = this,
                    opts = that.$opts,
                    multi = opts.multiPane,
                    valCell = that.valCell,
                    days = new Date().getDate(),
                    DTS = that.$data,
                    isnext = jet.isObj(next),
                    RES = {
                        yearlist: [],
                        monthlist: [
                            [],
                            []
                        ],
                        daylist: [],
                        daytit: [],
                        timelist: []
                    },
                    seltime,
                    cday = curr.DD == null ? days : curr.DD,
                    nday = next.DD == null ? days : next.DD,
                    timeA = {
                        hh: curr.hh,
                        mm: curr.mm,
                        ss: curr.ss
                    },
                    timeB = {
                        hh: next.hh || 0,
                        mm: next.mm || 0,
                        ss: next.ss || 0
                    };
                //设置年的数据
                RES.yearlist.push(that.eachYear(parseInt(curr.YYYY), 1));
                if (multi == false) {
                    var yearNext = isnext ? next.YYYY : curr.YYYY;
                    RES.yearlist.push(that.eachYear(parseInt(yearNext), 2));
                }
                //设置月的数据
                RES.monthlist[0] = that.eachMonth(curr.YYYY, 0);
                if (multi == false) {
                    var monthNext = isnext ? next.YYYY : curr.YYYY + 1;
                    RES.monthlist[1] = that.eachMonth(curr.YYYY + 1, 1);
                }
                //设置天的数据
                RES.daylist.push(that.eachDays(curr.YYYY, curr.MM, cday, 0));
                RES.daytit.push({
                    YYYY: curr.YYYY,
                    MM: curr.MM
                });
                if (multi == false) {
                    var dayNext = jet.nextMonth(curr.YYYY, curr.MM);
                    RES.daylist.push(that.eachDays(dayNext ? dayNext.y : "", dayNext.m, nday, 1));
                    RES.daytit.push({
                        YYYY: dayNext ? dayNext.y : "",
                        MM: dayNext ? dayNext.m : ""
                    });
                }
                //设置时间数据
                that.selectTime = [timeA, timeB];
                RES.timelist.push(that.eachTime(timeA, 1));
                if (multi == false) {
                    seltime = that.dlen == 7 && opts.range && !isnext ? timeA : timeB;
                    if (that.dlen == 7 && opts.range && jet.valText(valCell) == "") {
                        that.selectTime[1] = jet.extend(timeB, timeA);
                    }
                    RES.timelist.push(that.eachTime(seltime, 2));
                }
                // log(that.$data, RES)
                //最后将数据合并于总数据中
                jet.extend(that.$data, RES);
            },
            dateTemplate: function () {
                var that = this,
                    opts = that.$opts,
                    multi = opts.multiPane,
                    YMDStr = "",
                    hmsStr = "",
                    lang = opts.language,
                    ytxt = lang.name == "cn" ? "年" : "",
                    mtxt = lang.name == "cn" ? "月" : "";
                var ymvals = multi ? '{%=ymlist[0].YYYY%}-{%=ymlist[0].MM%}' : '{%=ymlist[0].YYYY%}-{%=ymlist[0].MM%}#{%=ymlist[ynidx].YYYY%}-{%=ymlist[ynidx].MM%}';
                var aowArr = (function () {
                    var butArr = [],
                        ismu = multi ? "11" : "23";
                    // log(that.dlen)
                    if (that.dlen == 1) {
                        butArr = ['{%=yearlist[i][0].y-' + ismu + '%}', '{%=yearlist[i][yearlist[i].length-1].y%}'];
                    } else if (that.dlen == 2) {
                        butArr = multi ? ['{%=yearlist[0][0].y-1%}', '{%=yearlist[0][0].y+1%}'] : ['{%=yearlist[i][0].y-' + ismu + '%}', '{%=yearlist[i][yearlist[i].length-1].y%}'];
                    } else if (that.dlen > 2 && that.dlen <= 6) {
                        butArr = ['{%=yearlist[0][0].y-1%}', '{%=yearlist[0][0].y+1%}'];
                    }
                    return butArr;
                })();
                var lyPrev = '<em class="yearprev yprev jedatefont" @on="yearBtn(lprev,' + aowArr[0] + ')">&#xed6c2;</em>',
                    lyNext = '<em class="yearnext ynext jedatefont" on="yearBtn(lnext,' + aowArr[2] + ')">&#xed6c5;</em>',
                    ryPrev = '<em class="yearprev yprev jedatefont" on="yearBtn(rprev,' + aowArr[3] + ')">&#xed6c2;</em>',
                    ryNext = '<em class="yearnext ynext jedatefont" @on="yearBtn(rnext,' + aowArr[1] + ')">&#xed6c5;</em>',
                    mPrev = '{% if(dlen>2){ %}<em class="monthprev mprev jedatefont" @on="monthBtn(mprev,{%=daytit[i].YYYY%}-{%=daytit[i].MM%})">&#xed602;</em>{% } %}',
                    mNext = '{% if(dlen>2){ %}<em class="monthnext mnext jedatefont" @on="monthBtn(mnext,{%=daytit[i].YYYY%}-{%=daytit[i].MM%})">&#xed605;</em>{% } %}';
                //循环年的模板
                var yaerHtml = '<table class="yeartable year{%= i==0 ? "left":"right"%}" style="display:{%=year ? "block":"none"%};"><tbody><tr>' +
                    '{% for(var y=0;y<=11;y++){ %}<td class="{%=yearlist[i][y].style%}" @on="yearClick({%=yearlist[i][y].y%})"><span>{%=yearlist[i][y].y%}' + ytxt + '</span></td>{% if((y+1)%3==0){ %} </tr>{% } %} {% } %} </tbody></table>';
                //循环月的模板
                var monthHtml = '<table class="monthtable month{%= i==0 ? "left":"right"%}" style="display:{%=month ? "block":"none"%};"><tbody><tr>' +
                    '{% for(var m=0;m<=11;m++){ %}<td class="{%=monthlist[i][m].style%}" ym="{%=monthlist[i][m].y%}-{%=monthlist[i][m].m%}" @on="monthClick({%=monthlist[i][m].y%}-{%=monthlist[i][m].m%})"><span>{%=monthlist[i][m].m%}' + mtxt + '</span></td>{% if((m+1)%3==0){ %} </tr>{% } %} {% } %} </tbody></table>';
                //循环天的模板
                var daysHtml = '<table class="daystable days{%= i==0 ? "left":"right"%}" style="display:{%=day ? "block":"none"%};"><thead><tr>' +
                    '{% for(var w=0;w<lang.weeks.length;w++){ %} <th>{%=lang.weeks[w]%}</th> {% } %}</tr></thead><tbody>' +
                    '<tr>{% for(var d=0;d<=41;d++){ %}<td class="{%=daylist[i][d].style%}" ymd="{%=daylist[i][d].ymd%}" @on="daysClick({%=daylist[i][d].ymd%})">{%=daylist[i][d].day%}</td>{% if((d+1)%7==0){ %} </tr>{% } %} {% } %} </tbody></table>';
                //循环时间模板
                var hmsHtml = '<div class="jedate-time">{% for(var h=0;h<timelist.length;h++){ %}<div class="timepane"><div class="timeheader">{%= timelist.length == 1 ? lang.timetxt[0]:lang.timetxt[h+1]%}</div><div class="timecontent">' +
                    '<div class="hmstitle"><p>{%=lang.times[0]%}</p><p>{%=lang.times[1]%}</p><p>{%=lang.times[2]%}</p></div>' +
                    '<div class="hmslist">{% for(var t=0;t<3;t++){ %}<div class="hmsauto"><ul>{% for(var s=0;s<timelist[h][t].length;s++){ %}<li class="{%=timelist[h][t][s].style%}" @on="hmsClick({%= h %},{%= h>0?3+t:t %})">{%= timelist[h][t][s].hms < 10 ? "0" + timelist[h][t][s].hms :timelist[h][t][s].hms %}</li>{% } %}</ul></div>{% } %}</div></div>' + '</div>{% } %}</div>';
                //左边选择模板
                var shortHtml = opts.shortcut.length > 0 ? "{% for(var s=0;s<shortcut.length;s++){ %}<p @on=shortClick({%= shortcut[s].val %})>{%=shortcut[s].name%}</p>{% } %}" : '';
                var ymtitHtml = (function () {
                    var ymtitStr = "";
                    if (that.dlen == 1) {
                        ymtitStr = '<span class="ymbtn">{%=yearlist[i][0].y%}' + ytxt + ' ~ {%=yearlist[i][yearlist[i].length-1].y%}' + ytxt + '</span>';
                    } else if (that.dlen == 2) {
                        ymtitStr = '<span class="ymbtn" @on="yearShow({%=yearlist[0][i].y%})">{%=yearlist[0][i].y%}' + ytxt + '</span>';
                    } else if (that.dlen > 2 && that.dlen <= 6) {
                        ymtitStr = '<span class="ymbtn" @on="monthShow({%=daytit[i].MM%})">{%=daytit[i].MM%}' + mtxt + '</span>' +
                            '<span class="ymbtn" @on="yearShow({%=daytit[i].YYYY%})">{%=daytit[i].YYYY%}' + ytxt + '</span>';
                    }
                    return ymtitStr;
                })();
                var ymButton = (function () {
                    var titStrBut = "";
                    if (that.dlen == 1) {
                        titStrBut = multi ? [lyPrev + ryNext] : [lyPrev, ryNext];
                    } else if (that.dlen == 2) {
                        titStrBut = multi ? [lyPrev + ryNext] : [lyPrev, ryNext];
                    } else if (that.dlen > 2 && that.dlen <= 6) {
                        titStrBut = multi ? [lyPrev + mPrev + mNext + ryNext] : [lyPrev + mPrev, mNext + ryNext];
                    } else if (that.dlen == 7) {
                        titStrBut = "";
                    }
                    return titStrBut;
                })();
                if (that.dlen == 1) {
                    YMDStr = yaerHtml;
                } else if (that.dlen == 2) {
                    YMDStr = yaerHtml + monthHtml;
                } else if (that.dlen == 3) {
                    YMDStr = yaerHtml + monthHtml + daysHtml;
                } else if (that.dlen > 3 && that.dlen <= 6) {
                    YMDStr = yaerHtml + monthHtml + daysHtml;
                    hmsStr = hmsHtml;
                } else if (that.dlen == 7) {
                    hmsStr = hmsHtml;
                }
                var paneHtml = '{% for(var i=0;i<pane;i++){ %}<div class="jedate-pane">' +
                    '<div class="jedate-header">{% if(i==0){ %}' + ymButton[0] + '{% }else{ %}' + ymButton[1] + '{% } %}' + ymtitHtml + '</div>' +
                    '<div class="jedate-content{%= i==1?" bordge":"" %}">' + YMDStr + '</div>' +
                    '</div>{% } %}';
                var btnStr = '{% if(timebtn){%}<div class="timecon" style="cursor: pointer;" @on="timeBtn">{%=lang.timetxt[0]%}</div>{% } %}<div class="btnscon">{% if(clear){ %}<span class="clear" @on="clearBtn">{%=lang.clear%}</span>{% } %}{% if(today){ %}<span class="today" @on="nowBtn">{%=lang.today%}</span>{% } %}{% if(yes){ %}<span class="setok" @on="sureBtn">{%=lang.yes%}</span>{% } %}</div>';
                return '<div class="jedate-menu" style="display:{%=shortcut.length>0 ? "block":"none"%};">' + shortHtml + '</div><div class="jedate-wrap">' + paneHtml + '</div>' + hmsStr + '<div class="jedate-footbtn">' + btnStr + '</div><div class="jedate-tips"></div>';
            },
            //递归绑定事件
            compileBindNode: function (dom) {
                var self = this,
                    aton = "@on";
                var acquireAttr = function (atVal) {
                    var args = /\(.*\)/.exec(atVal);
                    if (args) { //如果函数带参数,将参数字符串转换为参数数组
                        args = args[0];
                        atVal = atVal.replace(args, "");
                        args = args.replace(/[\(\)\'\"]/g, '').split(",");
                    } else args = [];
                    return [atVal, args];
                };
                jet.each(dom.childNodes, function (i, node) {
                    if (node.nodeType === 1) {
                        if (!self.$opts.festival) node.removeAttribute("ymd");
                        self.compileBindNode(node);
                        var geton = node.getAttribute(aton);
                        if (geton != null) {
                            var onarr = acquireAttr(geton);
                            jet.on(node, "click", function () {
                                self[onarr[0]] && self[onarr[0]].apply(node, onarr[1]);
                            });
                            node.removeAttribute(aton);
                        }
                    }
                });
            },
            methodEventBind: function () {
                var that = this,
                    opts = that.$opts,
                    multi = opts.multiPane,
                    DTS = that.$data,
                    result = new DateTime().reDate(),
                    dateY = result.GetYear(),
                    dateM = result.GetMonth(),
                    dateD = result.GetDate(),
                    range = opts.range,
                    elCell = that.dateCell;
                jet.extend(that, {
                    yearBtn: function (type, val) {
                        // console.log(that.valCell)
                        if ($('.yeartable').css('display') == 'block') {
                            if (type == 'lprev') val = val - 10 + ''
                            else if (type == 'rnext') val = parseFloat(val) + 10 + ''
                        }
                        var yarr = val.split("#"),
                            pval = jet.reMatch(yarr[0]),
                            tmval = that.selectTime;
                        exarr = [jet.extend({
                            YYYY: parseInt(val),
                            MM: dateM,
                            DD: dateD
                        }, tmval[0]), {}];
                        var dateVal = that.parseValue([exarr[0]], that.format);
                        that.storeData(exarr[0], exarr[1]);
                        that.renderDate();
                        opts.toggle && opts.toggle({
                            elem: that.valCell,
                            val: dateVal,
                            date: exarr[0]
                        });
                    },
                    yearShow: function (val) {
                        DTS.year = DTS.year ? false : true;
                        DTS.month = that.dlen < 3 ? true : false;
                        if (that.dlen > 2 && that.dlen <= 6) {
                            var dayCell = $Q(".daystable", elCell);
                            DTS.day = dayCell.style.display == "none" ? true : false;
                        }
                        that.renderDate();
                    },
                    monthBtn: function (type, val) {
                        var ymarr = jet.reMatch(val),
                            tmval = that.selectTime,
                            exarr = [],
                            PrevYM, NextYM,
                            year = parseInt(ymarr[0]),
                            month = parseInt(ymarr[1]);
                        if (range) {
                            if (type == "mprev") {
                                PrevYM = jet.prevMonth(year, month);
                                NextYM = jet.nextMonth(PrevYM.y, PrevYM.m);
                            } else {
                                NextYM = jet.nextMonth(year, month);
                                PrevYM = jet.prevMonth(NextYM.y, NextYM.m);
                            }
                            exarr = [jet.extend({
                                YYYY: PrevYM.y,
                                MM: PrevYM.m,
                                DD: dateD
                            }, tmval[0]), {
                                YYYY: NextYM.y,
                                MM: NextYM.m,
                                DD: dateD
                            }];
                        } else {
                            var PNYM = (type == "mprev") ? jet.prevMonth(year, month) : jet.nextMonth(year, month);
                            exarr = [jet.extend({
                                YYYY: PNYM.y,
                                MM: PNYM.m,
                                DD: dateD
                            }, tmval[0]), {}];
                        }
                        var dateVal = that.parseValue([exarr[0]], that.format);
                        that.storeData(exarr[0], exarr[1]);
                        that.renderDate();
                        opts.toggle && opts.toggle({
                            elem: that.valCell,
                            val: dateVal,
                            date: exarr[0]
                        });
                    },
                    monthShow: function (val) {
                        DTS.year = false;
                        DTS.month = DTS.month ? false : true;
                        if (that.dlen > 2 && that.dlen <= 6) {
                            var dayCell = $Q(".daystable", elCell);
                            DTS.day = dayCell.style.display == "none" ? true : false;
                        }
                        that.renderDate();
                    },
                    shortClick: function (val) {
                        var reval = val.replace(/\#/g, ','),
                            evobj = eval("(" + reval + ")"),
                            gval = jet.getDateTime(evobj),
                            tmval = that.selectTime;
                        that.selectValue = [jet.parse(gval, "YYYY-MM-DD")];
                        that.selectDate = [{
                            YYYY: gval.YYYY,
                            MM: gval.MM,
                            DD: gval.DD
                        }];
                        if (opts.onClose) {
                            var nYM = jet.nextMonth(gval.YYYY, gval.MM),
                                ymarr = [{
                                    YYYY: gval.YYYY,
                                    MM: gval.MM,
                                    DD: gval.DD
                                }, {
                                    YYYY: nYM.y,
                                    MM: nYM.m,
                                    DD: null
                                }];
                            that.storeData(jet.extend(ymarr[0], tmval[0]), jet.extend(ymarr[1], tmval[1]));
                            that.renderDate();
                        } else {
                            that.setValue(gval, that.format);
                            that.closeDate();
                        }
                    },
                    yearClick: function (val) {
                        if (jet.hasClass(this, "disabled")) return;
                        var yearVal = "",
                            lens = that.dlen;
                        if (range && lens == 1) {
                            var ylen = that.selectValue.length;
                            that.selectDate = (ylen == 2) ? [{
                                YYYY: parseInt(val),
                                MM: dateM
                            }] : [{
                                YYYY: that.selectDate[0].YYYY,
                                MM: that.selectDate[0].MM
                            }, {
                                YYYY: parseInt(val),
                                MM: dateM
                            }];
                            that.selectValue = (ylen == 2) ? [val + "-" + jet.digit(dateM)] : [that.selectValue[0], val + "-" + jet.digit(dateM)];
                            if (that.selectValue.length == 2) {
                                var svalarr = [that.selectValue[0], that.selectValue[1]],
                                    newArr = [{}, {}];
                                svalarr.sort(function (a, b) {
                                    return a > b ? 1 : -1;
                                });
                                that.selectValue = svalarr;
                                jet.each(svalarr, function (i, strval) {
                                    jet.each(jet.reMatch(strval), function (s, dval) {
                                        newArr[i][ymdzArr[s]] = dval;
                                    });
                                });
                                that.selectDate = newArr;
                            }
                        } else if (lens > 1 && lens <= 6) {
                            yearVal = parseInt(val);
                        } else {
                            that.selectValue = [val + "-" + jet.digit(dateM)];
                            that.selectDate = [{
                                YYYY: parseInt(val),
                                MM: dateM
                            }];
                        }
                        DTS.year = (lens == 1) ? true : false;
                        DTS.month = (lens < 3) ? true : false;
                        DTS.day = (lens > 2 && lens <= 6) ? true : false;
                        var electVal = (lens > 1 && lens <= 6) ? yearVal : parseInt(that.selectDate[0].YYYY);
                        that.storeData(jet.extend({
                            YYYY: electVal,
                            MM: dateM,
                            DD: dateD
                        }, that.selectTime[0]), {});
                        that.renderDate();
                    },
                    monthClick: function (val) {
                        if (jet.hasClass(this, "disabled")) return;
                        var ymval = jet.reMatch(val),
                            newArr = [{}, {}],
                            mlen = that.selectValue.length;
                        if (range) {
                            that.selectDate = (mlen == 2) ? [{
                                YYYY: ymval[0],
                                MM: ymval[1]
                            }] : [{
                                YYYY: that.selectDate[0].YYYY,
                                MM: that.selectDate[0].MM
                            }, {
                                YYYY: parseInt(val),
                                MM: ymval[1]
                            }];
                            that.selectValue = (mlen == 2) ? [val] : [that.selectValue[0], val];
                            if (that.selectValue.length == 2) {
                                var svalarr = [that.selectValue[0], that.selectValue[1]];
                                svalarr.sort(function (a, b) {
                                    return a > b ? 1 : -1;
                                });
                                that.selectValue = svalarr;
                                jet.each(svalarr, function (i, strval) {
                                    jet.each(jet.reMatch(strval), function (s, dval) {
                                        newArr[i][ymdzArr[s]] = dval;
                                    });
                                });
                                that.selectDate = newArr;
                            }
                        } else {
                            that.selectValue = [val];
                            that.selectDate = [{
                                YYYY: ymval[0],
                                MM: ymval[1]
                            }];
                        }
                        if (that.dlen > 2) {
                            DTS.year = false;
                            DTS.month = false;
                        }
                        DTS.day = (that.dlen > 2 && that.dlen <= 6) ? true : false;
                        that.storeData(jet.extend({
                            YYYY: parseInt(that.selectDate[0].YYYY),
                            MM: parseInt(that.selectDate[0].MM),
                            DD: dateD
                        }, that.selectTime[0]), {});
                        that.renderDate();
                    },
                    daysClick: function (val) {
                        if (jet.hasClass(this, "disabled")) return;
                        var tmval = that.selectTime,
                            matVal = jet.reMatch(val),
                            slen = that.selectValue.length,
                            dateVal = "",
                            newArr = [{}, {}],
                            sday, nYM, ymarr;
                        if (range) {
                            if (slen == 1) {
                                var svalarr = [that.selectValue[0], val];
                                svalarr.sort(function (a, b) {
                                    return a > b ? 1 : -1;
                                });
                                that.selectValue = svalarr;
                                jet.each(svalarr, function (i, strval) {
                                    jet.each(jet.reMatch(strval), function (s, dval) {
                                        newArr[i][ymdzArr[s]] = dval;
                                    });
                                });
                                that.selectDate = newArr;
                            } else {
                                that.selectValue = [val];
                                newArr = [{
                                    YYYY: matVal[0],
                                    MM: matVal[1],
                                    DD: matVal[2]
                                }];
                                that.selectDate = [{
                                    YYYY: matVal[0],
                                    MM: matVal[1],
                                    DD: matVal[2]
                                }, {}];
                            }
                            nYM = jet.nextMonth(newArr[0].YYYY, newArr[0].MM);
                            ymarr = [{
                                YYYY: newArr[0].YYYY,
                                MM: newArr[0].MM,
                                DD: newArr[0].DD
                            }, {
                                YYYY: nYM.y,
                                MM: nYM.m,
                                DD: null
                            }];
                            that.storeData(jet.extend(ymarr[0], tmval[0]), jet.extend(ymarr[1], tmval[1]));
                            that.renderDate();
                        } else {
                            that.selectValue = [val];
                            that.selectDate = [{
                                YYYY: matVal[0],
                                MM: matVal[1],
                                DD: matVal[2]
                            }, {
                                YYYY: matVal[0],
                                MM: matVal[1],
                                DD: matVal[2]
                            }];
                            jet.each(new Array(range == false ? 1 : 2), function (a) {
                                jet.each(matVal, function (i, val) {
                                    newArr[a][ymdzArr[i]] = val;
                                });
                                jet.extend(newArr[a], tmval[a]);
                            });
                            if (opts.onClose) {
                                that.storeData(jet.extend(newArr[0], tmval[0]), jet.extend(newArr[1], tmval[1]));
                                that.renderDate();
                            } else {
                                dateVal = that.setValue(newArr, that.format);
                                that.closeDate();
                                opts.donefun && opts.donefun.call(that, {
                                    elem: that.valCell,
                                    val: dateVal,
                                    date: newArr
                                });
                            }
                        }
                    },
                    hmsClick: function (idx, num) {
                        var pidx = parseInt(num),
                            vals = parseInt(jet.text(this)),
                            paridx = parseInt(idx),
                            act = "action",
                            mhms = ["hh", "mm", "ss"],
                            ulCell = $Q(".jedate-time", that.dateCell).querySelectorAll("ul")[pidx],
                            tlen = that.$data.timelist[0].length;
                        if (jet.hasClass(this, "disabled")) return;
                        jet.each(ulCell.childNodes, function (i, node) {
                            var reg = new RegExp("(^|\\s+)" + act + "(\\s+|$)", "g");
                            node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
                        });
                        that.selectTime[paridx][paridx == 1 ? mhms[pidx - tlen] : mhms[pidx]] = vals;
                        this.className = this.className + act;
                        var hmsCls = ulCell.querySelector("." + act);
                        ulCell.scrollTop = hmsCls ? (hmsCls.offsetTop - 145) : 0;
                        if (that.dlen == 7 && idx == 0 && range && !multi) {
                            var nVal = that.getValue({}),
                                nYM = jet.nextMonth(nVal[0].YYYY, nVal[0].MM),
                                st = that.selectTime;
                            // log(st)
                            that.storeData({
                                YYYY: nVal[0].YYYY,
                                MM: nVal[0].MM,
                                DD: null,
                                hh: st[0].hh,
                                mm: st[0].mm,
                                ss: st[0].ss
                            }, {
                                    YYYY: nYM.y,
                                    MM: nYM.m,
                                    DD: null,
                                    hh: st[1].hh,
                                    mm: st[1].mm,
                                    ss: st[1].ss
                                });
                            that.renderDate();
                        }
                    },
                    timeBtn: function () {
                        var timeCell = $Q(".jedate-time", elCell),
                            disNo = timeCell.style.display == "none";
                        jet.text(this, disNo ? opts.language.backtxt : opts.language.timetxt[0]);
                        jet.setCss(timeCell, {
                            display: disNo ? "block" : "none"
                        });
                    },
                    //清空按钮函数
                    clearBtn: function () {
                        jet.valText(that.valCell, "");
                        that.selectDate = [jet.parse(jet.getDateTime({}), "YYYY-MM-DD hh:mm:ss")];
                        that.closeDate();
                    },
                    //现在按钮函数
                    nowBtn: function () {
                        var newArr = jet.getDateTime({}),
                            nYM = jet.nextMonth(newArr.YYYY, newArr.MM),
                            dateVal;
                        that.selectDate = [newArr];
                        dateVal = opts.isShow ? that.setValue([newArr], that.format, true) : jet.parse(newArr, that.format);
                        if (opts.onClose && range || !opts.isShow) {
                            that.storeData(newArr, {
                                YYYY: nYM.y,
                                MM: nYM.m,
                                DD: null,
                                hh: 0,
                                mm: 0,
                                ss: 0
                            });
                            that.renderDate();
                        } else {
                            that.closeDate();
                        }
                        opts.donefun && opts.donefun.call(that, {
                            elem: that.valCell,
                            val: dateVal,
                            date: newArr
                        });
                    },
                    //确认按钮函数
                    sureBtn: function () {
                        var newArr = that.selectValue.length > 1 ? [{}, {}] : [{}],
                            dateVal = "",
                            tmval = that.selectTime;
                        var equal = function (o) {
                            var h = o.hh == undefined ? 0 : o.hh,
                                m = o.mm == undefined ? 0 : o.mm,
                                s = o.ss == undefined ? 0 : o.ss;
                            return parseInt(jet.digit(h) + "" + jet.digit(m) + "" + jet.digit(s));
                        };
                        // log(range)
                        if (range) {
                            if (that.selectValue.length > 1) {
                                var sortarr = that.selectValue;
                                sortarr.sort(function (a, b) {
                                    return a > b ? 1 : -1;
                                });
                                jet.each(sortarr, function (i, arr) {
                                    jet.each(jet.reMatch(arr), function (a, val) {
                                        newArr[i][ymdzArr[a]] = val;
                                    });
                                    jet.extend(newArr[i], tmval[i]);
                                });
                            } else if (that.dlen == 7 && tmval.length > 1) {
                                newArr = tmval;
                            }
                            var sameTime = equal(tmval[0]) >= equal(tmval[1]),
                                selVal = that.selectValue,
                                sameDate = "";
                            if (selVal[1] != undefined) sameDate = selVal[0].replace(/\-/g, "") == selVal[1].replace(/\-/g, "");
                            if (selVal.length == 1 && that.dlen < 7) {
                                that.tips(opts.language.name == "cn" ? "未选结束日期" : "Please select the end date");
                                return;
                            } else if ((that.dlen == 7 && sameTime) || (sameDate && sameTime)) {
                                that.tips(opts.language.name == "cn" ? "结束时间必须大于开始时间" : "The end time must be greater than the start time");
                                return;
                            }
                        } else {
                            jet.each(new Array(range == false ? 1 : 2), function (i) {
                                if (that.dlen != 7) jet.each(jet.reMatch(that.selectValue[0]), function (a, val) {
                                    newArr[i][ymdzArr[a]] = val;
                                    newArr[i].DD = newArr[i].DD || 1
                                });
                                jet.extend(newArr[i], tmval[i]);
                            });
                        }
                        dateVal = that.setValue(newArr, that.format, opts.isShow ? true : false);
                        // log(newArr)
                        opts.isShow && that.closeDate();
                        opts.donefun && opts.donefun.call(that, {
                            elem: that.valCell,
                            val: dateVal,
                            date: newArr
                        });
                        //

                    },
                    blankArea: function () {
                        jet.on(document, "mouseup", function (ev) {
                            jet.stopPropagation(ev);
                            that.closeDate();
                        });
                        jet.on($Q(elx), "mouseup", function (ev) {
                            jet.stopPropagation(ev);
                        });
                    }
                });
            },
            //循环生成年数据
            eachYear: function (val, type) {
                var that = this,
                    opts = that.$opts,
                    yNum = parseInt(val),
                    yarr = [],
                    seCls = '',
                    selYear = that.selectDate,
                    i,
                    mins = jet.reMatch(that.minDate),
                    maxs = jet.reMatch(that.maxDate);
                i = type == 1 ? yNum : that.yindex;
                that.yindex = type == 1 ? 12 + yNum : 12 + that.yindex;
                var endDate = selYear[1] == undefined ? "" : selYear[1].YYYY;
                for (; i < that.yindex; i++) {
                    if (i == selYear[0].YYYY || i == endDate) {
                        seCls = "action";
                    } else if (i > selYear[0].YYYY && i < endDate) {
                        seCls = "contain";
                    } else if (i < mins[0] || i > maxs[0]) {
                        seCls = "disabled";
                    } else {
                        seCls = "";
                    }
                    yarr.push({
                        style: seCls,
                        y: i
                    });
                }
                return yarr;
            },
            //循环生成月数据
            eachMonth: function (val, type) {
                var that = this,
                    opts = that.$opts,
                    range = opts.range,
                    marr = [],
                    selMonth = that.selectDate,
                    seCls = '',
                    monthArr = opts.language.month,
                    mins = jet.reMatch(that.minDate),
                    maxs = jet.reMatch(that.maxDate),
                    minym = parseInt(mins[0] + "" + jet.digit(mins[1])),
                    maxym = parseInt(maxs[0] + "" + jet.digit(maxs[1])),
                    currStart = parseInt(selMonth[0].YYYY + "" + jet.digit(selMonth[0].MM)),
                    currEnd = selMonth[1] ? parseInt(selMonth[1].YYYY + "" + jet.digit(selMonth[1].MM)) : 0;
                jet.each(monthArr, function (i, months) {
                    var ival = parseInt(val + "" + jet.digit(months));
                    if (ival == currStart || ival == currEnd) {
                        seCls = "action";
                    } else if (ival > currStart && ival < currEnd) {
                        seCls = "contain";
                    } else if (ival < minym || ival > maxym) {
                        seCls = "disabled";
                    } else {
                        seCls = "";
                    }
                    marr.push({
                        style: seCls,
                        y: val,
                        m: months
                    });
                });
                return marr;
            },
            //循环生成天数据
            eachDays: function (yd, md, ds, idx) {
                var that = this,
                    count = 0,
                    daysArr = [],
                    opts = that.$opts,
                    multiPane = jet.isBool(opts.multiPane),
                    firstWeek = new Date(yd, md - 1, 1).getDay() || 7,
                    valrange = opts.range != false,
                    daysNum = jet.getDaysNum(yd, md),
                    didx = 0,
                    sDate = that.selectDate,
                    prevM = jet.prevMonth(yd, md),
                    isShow = jet.isBool(opts.isShow),
                    prevDaysNum = jet.getDaysNum(yd, prevM.m),
                    nextM = jet.nextMonth(yd, md),
                    objCell = that.valCell,
                    lang = opts.language,
                    endval = opts.valiDate || [],
                    minArr = jet.reMatch(that.minDate),
                    minNum = parseInt(minArr[0] + "" + jet.digit(minArr[1]) + "" + jet.digit(minArr[2])),
                    maxArr = jet.reMatch(that.maxDate),
                    maxNum = parseInt(maxArr[0] + "" + jet.digit(maxArr[1]) + "" + jet.digit(maxArr[2]));
                var startDate = sDate[0] ? parseInt(sDate[0].YYYY + "" + jet.digit(sDate[0].MM) + "" + jet.digit(sDate[0].DD)) : "";
                var endDate = sDate[1] ? parseInt(sDate[1].YYYY + "" + jet.digit(sDate[1].MM) + "" + jet.digit(sDate[1].DD)) : "";
                //设置时间标注
                var setMark = function (my, mm, md) {
                    var Marks = opts.marks,
                        contains = function (arr, obj) {
                            var clen = arr.length;
                            while (clen--) {
                                if (arr[clen] === obj) return true;
                            }
                            return false;
                        },
                        isArr = jet.isType(Marks, "array");
                    return isArr && Marks.length > 0 && contains(Marks, my + "-" + jet.digit(mm) + "-" + jet.digit(md)) ? '<i class="marks"></i>' : "";
                };
                //是否显示节日
                var isfestival = function (y, m, d) {
                    var festivalStr = '';
                    if (opts.festival == true && lang.name == "cn") {
                        var lunar = jeLunar(y, m - 1, d),
                            feslunar = (lunar.solarFestival || lunar.lunarFestival),
                            lunartext = (feslunar && lunar.jieqi) != "" ? feslunar : (lunar.jieqi || lunar.showInLunar);
                        festivalStr = '<p><span class="solar">' + d + '</span><span class="lunar">' + lunartext + '</span></p>';
                    } else {
                        festivalStr = '<p class="nolunar">' + d + '</p>';
                    }
                    return festivalStr;
                };
                //判断是否在限制的日期之中
                var dateLimit = function (Y, M, D, isMonth) {
                    var thatNum = parseInt(Y + "" + jet.digit(M) + "" + jet.digit(D));
                    if (isMonth) {
                        if (thatNum >= minNum && thatNum <= maxNum) return true;
                    } else {
                        if (minNum > thatNum || maxNum < thatNum) return true;
                    }
                };
                var regExpDate = function (date, cls) {
                    var inArray = function (search, array) {
                        for (var i in array)
                            if (array[i] == search) return true;
                        return false;
                    };
                    if (endval.length > 0 && endval[0] != "") {
                        if (/\%/g.test(endval[0])) {
                            var reval = endval[0].replace(/\%/g, "").split(","),
                                enArr = [];
                            jet.each(reval, function (r, rel) {
                                enArr.push(jet.digit(parseInt(rel)));
                            });
                            var isfind = inArray(jet.digit(date), enArr) == false;
                            cls = jet.isBool(endval[1]) ? (isfind ? " disabled" : cls) : (isfind ? cls : " disabled");
                        } else {
                            var valreg = that.dateRegExp(endval[0]),
                                regday = valreg.test(jet.digit(date));
                            cls = jet.isBool(endval[1]) ? (regday ? " disabled" : cls) : (regday ? cls : " disabled");
                        }
                    }
                    return cls;
                };
                //var ymds = ymdarr[1]
                //上一月剩余天数
                for (var p = prevDaysNum - firstWeek + 1; p <= prevDaysNum; p++ , count++) {
                    var pmark = setMark(prevM.y, prevM.m, p),
                        pcls = dateLimit(prevM.y, prevM.m, p, false) ? "disabled" : "other";
                    pcls = regExpDate(p, pcls);
                    daysArr.push({
                        style: pcls,
                        ymd: prevM.y + '-' + jet.digit(prevM.m) + '-' + jet.digit(p),
                        day: (isfestival(prevM.y, prevM.m, p) + pmark)
                    });
                }
                //本月的天数
                for (var b = 1; b <= daysNum; b++ , count++) {
                    var bmark = setMark(yd, md, b),
                        bcls = "";
                    var dateval = parseInt(yd + "" + jet.digit(md) + "" + jet.digit(b)),
                        parsdate = dateval > startDate,
                        rangdate = dateval < endDate;
                    if (dateLimit(yd, md, b, true)) {
                        if (dateval == startDate || dateval == endDate) {
                            bcls = " action";
                        } else if (parsdate && rangdate) {
                            bcls = " contain";
                        } else {
                            bcls = "";
                        }
                    } else {
                        bcls = " disabled";
                    }
                    bcls = regExpDate(b, bcls);
                    daysArr.push({
                        style: "normal" + bcls,
                        ymd: yd + '-' + jet.digit(md) + '-' + jet.digit(b),
                        day: (isfestival(yd, md, b) + bmark)
                    });
                }
                //下一月开始天数
                for (var n = 1, nlen = 42 - count; n <= nlen; n++) {
                    var nmark = setMark(nextM.y, nextM.m, n);
                    var ncls = dateLimit(nextM.y, nextM.m, n, false) ? "disabled" : "other";
                    ncls = regExpDate(n, ncls);
                    daysArr.push({
                        style: ncls,
                        ymd: nextM.y + '-' + jet.digit(nextM.m) + '-' + jet.digit(n),
                        day: (isfestival(nextM.y, nextM.m, n) + nmark)
                    });
                }
                //将星期与日期拼接起来
                return daysArr;
            },
            eachTime: function (hmsArr, type) {
                var that = this,
                    opts = that.$opts,
                    range = opts.range,
                    multi = opts.multiPane,
                    minVal = [],
                    maxVal = [],
                    mhms = ["hh", "mm", "ss"],
                    timeArr = [],
                    hmsCls = '',
                    format = that.format,
                    ntVal = jet.trim(that.minDate).replace(/\s+/g, " "),
                    xtVal = jet.trim(that.maxDate).replace(/\s+/g, " "),
                    nVal = ntVal.split(" "),
                    xVal = xtVal.split(" ");
                if (that.dlen > 3 && /\:/.test(nVal) && /\:/.test(xVal)) {
                    minVal = jet.reMatch(/\s/.test(ntVal) && that.dlen > 3 ? nVal[1] : ntVal);
                    maxVal = jet.reMatch(/\s/.test(xtVal) && that.dlen > 3 ? xVal[1] : xtVal);
                }
                jet.each([24, 60, 60], function (s, lens) {
                    timeArr[s] = [];
                    var unhmsVal = minVal[s] == undefined || minVal[s] == 0 ? hmsArr[mhms[s]] : minVal[s],
                        currVal = that.getValue() == "" ? unhmsVal : hmsArr[mhms[s]];
                    if (that.dlen > 3 && /\:/.test(nVal) && type == 1) {
                        that.selectTime[0][mhms[s]] = currVal;
                    }
                    for (var h = 0; h < lens; h++) {
                        var exists = new RegExp(mhms[s], "g").test(format);
                        if (h == currVal) {
                            hmsCls = exists ? "action" : "disabled";
                        } else if (!exists || !range && multi && (h < minVal[s] || h > maxVal[s])) {
                            hmsCls = "disabled";
                        } else if (!multi) {
                            hmsCls = type == 1 && h < minVal[s] || type == 2 && h > maxVal[s] ? "disabled" : "";
                        } else {
                            hmsCls = "";
                        }
                        timeArr[s].push({
                            style: hmsCls,
                            hms: h
                        });
                    }
                });
                return timeArr;
            },
            //关闭日期控件
            closeDate: function () {
                var elem = $Q(elx),
                    tipelem = $Q("#jedatetipscon");
                elem && document.body.removeChild(elem);
                tipelem && document.body.removeChild(tipelem);
                //再次初始化值
                this.setDatas();
            },
            //转换日期值
            parseValue: function (fnObj, matStr) {
                var that = this,
                    valArr = [],
                    opts = that.$opts,
                    range = opts.range;
                jet.each(fnObj, function (i, val) {
                    valArr.push(jet.parse(val, matStr));
                });
                // log(valArr[0])
                return range == false ? valArr[0] : valArr.join(range);
            },
            //初始验证正则
            dateRegExp: function (valArr) {
                var enval = valArr.split(",") || [],
                    regs = "";
                var doExp = function (val) {
                    var arr, tmpEval, regs = /#?\{(.*?)\}/;
                    val = val + "";
                    while ((arr = regs.exec(val)) != null) {
                        arr.lastIndex = arr.index + arr[1].length + arr[0].length - arr[1].length - 1;
                        tmpEval = parseInt(eval(arr[1]));
                        if (tmpEval < 0) tmpEval = "9700" + -tmpEval;
                        val = val.substring(0, arr.index) + tmpEval + val.substring(arr.lastIndex + 1);
                    }
                    return val;
                };
                if (enval && enval.length > 0) {
                    for (var i = 0; i < enval.length; i++) {
                        regs += doExp(enval[i]);
                        if (i != enval.length - 1) regs += "|";
                    }
                    regs = regs ? new RegExp("(?:" + regs + ")") : null;
                } else {
                    regs = null;
                }
                //re = new RegExp((re + "").replace(/^\/\(\?:(.*)\)\/.*/, "$1"));
                return regs;
            },
            //显示农历节日
            showFestival: function () {
                var that = this,
                    opts = that.$opts;
                jet.each(that.dateCell.querySelectorAll(".daystable td"), function (i, node) {
                    var tval = jet.reMatch(jet.attr(node, "ymd")),
                        tipDiv = document.createElement("div");
                    node.removeAttribute("ymd");
                    //鼠标进入提示框出现
                    jet.on(node, "mouseover", function () {
                        var lunar = new jeLunar(tval[0], tval[1] - 1, tval[2]);
                        if ($Q("#jedatetipscon")) return;
                        tipDiv.id = tipDiv.className = "jedatetipscon";
                        var tiphtml = '<p>' + lunar.solarYear + '\u5E74' + lunar.solarMonth + '\u6708' + lunar.solarDate + '\u65E5 ' + lunar.inWeekDays + '</p><p class="red">\u519C\u5386：' + lunar.shengxiao + '\u5E74 ' + lunar.lnongMonth + '\u6708' + lunar.lnongDate + '</p><p>' + lunar.ganzhiYear + '\u5E74 ' + lunar.ganzhiMonth + '\u6708 ' + lunar.ganzhiDate + '\u65E5</p>';
                        var Fesjieri = (lunar.solarFestival || lunar.lunarFestival) != "" ? '<p class="red">' + ("\u8282\u65E5：" + lunar.solarFestival + lunar.lunarFestival) + '</p>' : "";
                        var Fesjieqi = lunar.jieqi != "" ? '<p class="red">' + (lunar.jieqi != "" ? "\u8282\u6C14：" + lunar.jieqi : "") + '</p>' : "";
                        var tiptext = (lunar.solarFestival || lunar.lunarFestival || lunar.jieqi) != "" ? (Fesjieri + Fesjieqi) : "";
                        jet.html(tipDiv, tiphtml + tiptext);
                        document.body.appendChild(tipDiv);
                        //获取并设置农历提示框出现的位置
                        var tipPos = that.lunarOrien(tipDiv, this);
                        jet.setCss(tipDiv, {
                            "zIndex": (opts.zIndex == undefined ? 10000 + 5 : opts.zIndex + 5),
                            top: tipPos.top,
                            left: tipPos.left,
                            position: "absolute",
                            display: "block"
                        });
                    });
                    //鼠标移除提示框消失
                    jet.on(node, "mouseout", function () {
                        document.body.removeChild($Q("#jedatetipscon"));
                    });
                });
                if (that.dateCell.nodeType === 1 && !jet.hasClass(that.dateCell, "grid")) that.dateCell.className = that.dateCell.className + " grid";
            },
            //农历方位辨别
            lunarOrien: function (obj, self, pos) {
                var tops, leris, ortop, orleri, rect = self.getBoundingClientRect(),
                    boxW = obj.offsetWidth,
                    boxH = obj.offsetHeight;
                leris = rect.right + boxW / 1.5 >= jet.docArea(true) ? rect.right - boxW : rect.left + (pos ? 0 : jet.docScroll(true));
                tops = rect.bottom + boxH / 1 <= jet.docArea() ? rect.bottom - 1 : rect.top > boxH / 1.5 ? rect.top - boxH - 1 : jet.docArea() - boxH;
                if (leris + boxW > jet.docArea(true)) leris = rect.left - (boxW - rect.width);
                ortop = Math.max(tops + (pos ? 0 : jet.docScroll()) + 1, 1) + "px", orleri = leris + "px";
                return {
                    top: ortop,
                    left: orleri
                }
            },
            //辨别控件的方位
            dateOrien: function (elbox, valCls, pos) {
                var that = this,
                    tops, leris, ortop, orleri,
                    rect = that.$opts.fixed ? valCls.getBoundingClientRect() : elbox.getBoundingClientRect(),
                    leris = rect.left,
                    tops = rect.bottom;
                if (that.$opts.fixed) {
                    var boxW = elbox.offsetWidth,
                        boxH = elbox.offsetHeight;
                    //如果右侧超出边界
                    if (leris + boxW > jet.docArea(true)) {
                        leris = leris - (boxW - rect.width);
                    }
                    //如果底部超出边界
                    if (tops + boxH > jet.docArea()) {
                        tops = rect.top > boxH ? rect.top - boxH - 2 : jet.docArea() - boxH - 1;
                    }
                    //根据目标元素计算弹层位置
                    ortop = Math.max(tops + (pos ? 0 : jet.docScroll()) + 1, 1) + "px";
                    orleri = leris + "px";
                } else {
                    //弹层位置位于页面上下左右居中
                    ortop = "50%";
                    orleri = "50%";
                    elbox.style.cssText = "marginTop:" + -(rect.height / 2) + ";marginLeft:" + -(rect.width / 2);
                }
                jet.setCss(elbox, {
                    top: ortop,
                    left: orleri
                });
            },
            tips: function (text, time) {
                var that = this,
                    tipCls = $Q(".jedate-tips", that.dateCell),
                    tipTime;
                jet.html(tipCls, text || "");
                jet.setCss(tipCls, {
                    display: "block"
                });
                clearTimeout(tipTime);
                tipTime = setTimeout(function () {
                    jet.html(tipCls, "");
                    jet.setCss(tipCls, {
                        display: "none"
                    });
                }, (time || 2.5) * 1000);
            },
            locateScroll: function () {
                var that = this,
                    ulCell = $Q(".jedate-time", that.dateCell).querySelectorAll("ul");
                jet.each(ulCell, function (i, cell) {
                    var hmsCls = cell.querySelector(".action");
                    cell.scrollTop = hmsCls ? (hmsCls.offsetTop - 145) : 0;
                });
                if (that.dlen != 7) jet.setCss($Q(".jedate-time", that.dateCell), {
                    display: 'none'
                });
            }
        });
        //农历数据
        function jeLunar(ly, lm, ld) {
            var lunarInfo = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42448, 83315, 21200, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448],
                sTermInfo = [0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758];
            var Gan = "甲乙丙丁戊己庚辛壬癸",
                Zhi = "子丑寅卯辰巳午未申酉戌亥",
                Animals = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
            var solarTerm = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满",
                "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
            ];
            var nStr1 = "日一二三四五六七八九十",
                nStr2 = "初十廿卅",
                nStr3 = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"],
                sFtv1 = {
                    "0101": "*1元旦节",
                    "0202": "湿地日",
                    "0214": "情人节",
                    "0308": "妇女节",
                    "0312": "植树节",
                    "0315": "消费者权益日",
                    "0401": "愚人节",
                    "0422": "地球日",
                    "0501": "*1劳动节",
                    "0504": "青年节",
                    "0512": "护士节",
                    "0518": "博物馆日",
                    "0520": "母亲节",
                    "0601": "儿童节",
                    "0623": "奥林匹克日",
                    "0630": "父亲节",
                    "0701": "建党节",
                    "0801": "建军节",
                    "0903": "抗战胜利日",
                    "0910": "教师节",
                    "1001": "*3国庆节",
                    "1201": "艾滋病日",
                    "1224": "平安夜",
                    "1225": "圣诞节"
                },
                sFtv2 = {
                    "0100": "除夕",
                    "0101": "*2春节",
                    "0115": "元宵节",
                    "0505": "*1端午节",
                    "0707": "七夕节",
                    "0715": "中元节",
                    "0815": "*1中秋节",
                    "0909": "*1重阳节",
                    "1015": "下元节",
                    "1208": "腊八节",
                    "1223": "小年"
                };
            function flunar(Y) {
                var sTerm = function (j, i) {
                    var h = new Date((31556925974.7 * (j - 1900) + sTermInfo[i] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
                    return (h.getUTCDate());
                },
                    d = function (k) {
                        var h, j = 348;
                        for (h = 32768; h > 8; h >>= 1) j += (lunarInfo[k - 1900] & h) ? 1 : 0;
                        return (j + b(k));
                    },
                    ymdCyl = function (h) {
                        return (Gan.charAt(h % 10) + Zhi.charAt(h % 12));
                    },
                    b = function (h) {
                        var islp = (g(h)) ? ((lunarInfo[h - 1900] & 65536) ? 30 : 29) : (0);
                        return islp;
                    },
                    g = function (h) {
                        return (lunarInfo[h - 1900] & 15)
                    },
                    e = function (i, h) {
                        return ((lunarInfo[i - 1900] & (65536 >> h)) ? 30 : 29);
                    },
                    newymd = function (m) {
                        var k, j = 0,
                            h = 0,
                            l = new Date(1900, 0, 31),
                            n = (m - l) / 86400000;
                        this.dayCyl = n + 40;
                        this.monCyl = 14;
                        for (k = 1900; k < 2050 && n > 0; k++) {
                            h = d(k);
                            n -= h;
                            this.monCyl += 12;
                        }
                        if (n < 0) {
                            n += h;
                            k--;
                            this.monCyl -= 12;
                        }
                        this.year = k;
                        this.yearCyl = k - 1864;
                        j = g(k);
                        this.isLeap = false;
                        for (k = 1; k < 13 && n > 0; k++) {
                            if (j > 0 && k == (j + 1) && this.isLeap == false) {
                                --k;
                                this.isLeap = true;
                                h = b(this.year);
                            } else {
                                h = e(this.year, k);
                            }
                            if (this.isLeap == true && k == (j + 1)) {
                                this.isLeap = false;
                            }
                            n -= h;
                            if (this.isLeap == false) this.monCyl++;
                        }
                        if (n == 0 && j > 0 && k == j + 1) {
                            if (this.isLeap) {
                                this.isLeap = false;
                            } else {
                                this.isLeap = true;
                                --k;
                                --this.monCyl;
                            }
                        }
                        if (n < 0) {
                            n += h;
                            --k;
                            --this.monCyl;
                        }
                        this.month = k;
                        this.day = n + 1;
                    },
                    digit = function (num) {
                        return num < 10 ? "0" + (num | 0) : num;
                    },
                    reymd = function (i, j) {
                        var h = i;
                        return j.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function (k) {
                            switch (k) {
                                case "yyyy":
                                    var l = "000" + h.getFullYear();
                                    return l.substring(l.length - 4);
                                case "dd":
                                    return digit(h.getDate());
                                case "d":
                                    return h.getDate().toString();
                                case "MM":
                                    return digit((h.getMonth() + 1));
                                case "M":
                                    return h.getMonth() + 1;
                            }
                        });
                    },
                    lunarMD = function (i, h) {
                        var j;
                        switch (i, h) {
                            case 10:
                                j = "初十";
                                break;
                            case 20:
                                j = "二十";
                                break;
                            case 30:
                                j = "三十";
                                break;
                            default:
                                j = nStr2.charAt(Math.floor(h / 10));
                                j += nStr1.charAt(h % 10);
                        }
                        return j;
                    };
                this.isToday = false;
                this.isRestDay = false;
                this.solarYear = reymd(Y, "yyyy");
                this.solarMonth = reymd(Y, "M");
                this.solarDate = reymd(Y, "d");
                this.solarWeekDay = Y.getDay();
                this.inWeekDays = "星期" + nStr1.charAt(this.solarWeekDay);
                var X = new newymd(Y);
                this.lunarYear = X.year;
                this.shengxiao = Animals.charAt((this.lunarYear - 4) % 12);
                this.lunarMonth = X.month;
                this.lunarIsLeapMonth = X.isLeap;
                this.lnongMonth = this.lunarIsLeapMonth ? "闰" + nStr3[X.month - 1] : nStr3[X.month - 1];
                this.lunarDate = X.day;
                this.showInLunar = this.lnongDate = lunarMD(this.lunarMonth, this.lunarDate);
                if (this.lunarDate == 1) {
                    this.showInLunar = this.lnongMonth + "月";
                }
                this.ganzhiYear = ymdCyl(X.yearCyl);
                this.ganzhiMonth = ymdCyl(X.monCyl);
                this.ganzhiDate = ymdCyl(X.dayCyl++);
                this.jieqi = "";
                this.restDays = 0;
                if (sTerm(this.solarYear, (this.solarMonth - 1) * 2) == reymd(Y, "d")) {
                    this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2];
                }
                if (sTerm(this.solarYear, (this.solarMonth - 1) * 2 + 1) == reymd(Y, "d")) {
                    this.showInLunar = this.jieqi = solarTerm[(this.solarMonth - 1) * 2 + 1];
                }
                if (this.showInLunar == "清明") {
                    this.showInLunar = "清明节";
                    this.restDays = 1;
                }
                this.solarFestival = sFtv1[reymd(Y, "MM") + reymd(Y, "dd")];
                if (typeof this.solarFestival == "undefined") {
                    this.solarFestival = "";
                } else {
                    if (/\*(\d)/.test(this.solarFestival)) {
                        this.restDays = parseInt(RegExp.$1);
                        this.solarFestival = this.solarFestival.replace(/\*\d/, "");
                    }
                }
                this.showInLunar = (this.solarFestival == "") ? this.showInLunar : this.solarFestival;
                this.lunarFestival = sFtv2[this.lunarIsLeapMonth ? "00" : digit(this.lunarMonth) + digit(this.lunarDate)];
                if (typeof this.lunarFestival == "undefined") {
                    this.lunarFestival = "";
                } else {
                    if (/\*(\d)/.test(this.lunarFestival)) {
                        this.restDays = (this.restDays > parseInt(RegExp.$1)) ? this.restDays : parseInt(RegExp.$1);
                        this.lunarFestival = this.lunarFestival.replace(/\*\d/, "");
                    }
                }
                if (this.lunarMonth == 12 && this.lunarDate == e(this.lunarYear, 12)) {
                    this.lunarFestival = sFtv2["0100"];
                    this.restDays = 1;
                }
                this.showInLunar = (this.lunarFestival == "") ? this.showInLunar : this.lunarFestival;
            }
            return new flunar(new Date(ly, lm, ld));
        }
        return jeDate;
    });
$("body").on('click', '.jeinpbox', function (event) {
    event.preventDefault();
    var elId = $(this).find(".jeinput").attr("id")
    if (!elId) return false
    $(this).find(".jeinput").attr('readonly', 'readonly')
    var format = $(this).find(".jeinput").attr("format") || 'YYYY-MM-DD'
    var _this = this
    jeDate('#' + elId, {
        trigger: false,
        format: format,
        theme: {
            bgcolor: '#00A1CB',
            pnColor: '#00CCFF'
        },
        donefun: function (a) {
            !window.jedateClick || window.jedateClick(a.val)

            if ($(_this).parents('table').length) {
                !window.jedateClicks || window.jedateClicks(a.val)
            }
        }
    })
});
$('body').on('focus', '.jeinput', function (event) {
    event.preventDefault();
    $(this).attr('readonly', 'readonly').click()
});
//钱
$("body").on('keyup change', '.money', function (event) {
    var oldTxt = $(this).val() ? $(this).val() : ""
    var reg = oldTxt.match(/\d+\.?\d{0,2}/);
    var txt = '';
    if (reg != null) txt = reg[0];
    if (txt >= 9999999999.99) txt = '9999999999.99'
    $(this).val(txt);
    if ($('.nowAmountView').length) {
        $('.nowAmountView').html(txt || '0.00')
        tabObj['PaymentApplicationTable'].tab_select_data = []
        tabObj['PaymentApplicationTable'].tab_select_ids = []
        $("#PaymentApplicationTable").find('.checkBoxTrue').removeClass('checkBoxTrue').addClass("checkBoxLocking")
    }
});
//纯数字
$("body").on('keyup change', '.chunNum', function (event) {
    var oldTxt = $(this).val() ? $(this).val() : ""
    var reg = oldTxt.match(/\d+/);
    var txt = '';
    if (reg != null) txt = reg[0];
    // if (txt >= 9999999999.99) txt = '9999999999.99'
    $(this).val(txt)
});
//折扣
$("body").on('keyup change', '.moneyDiscount', function (event) {
    var oldTxt = $(this).val() ? $(this).val() : ""
    var reg = oldTxt.match(/\d+\.?\d{0,2}/);
    var txt = '';
    if (reg != null) txt = reg[0];
    if (txt >= 9999999999.99) txt = '9999999999.99'
    $(this).val(txt);
});

$("body").on('keyup change', '.smallBai', function (event) {
    var oldTxt = $(this).val() ? $(this).val() : ""
    var reg = oldTxt.match(/\d+\.?\d{0,2}/);
    var txt = '';
    if (reg != null) txt = reg[0];
    if (txt >= 99.99) txt = '99.99'
    $(this).val(txt);
});

//手机号
$("body").on('keyup change', '.phoneIpt', function (event) {
    if ($(this).val().length == 1) {
        $(this).val($(this).val().replace(/[^1-9]/g, ''))
    } else {
        $(this).val($(this).val().replace(/\D/g, ''))
    }
});
//手机验证
$("body").on('blur change', '.phoneIpt', function (event) {
    if (!$.checkReg($(this).val(), 'phone')) {
        $.popInfo("手机号错误！");
        $(this).val('')
    }
});
$("body").on('blur change', '.phone_tel_Ipt', function (event) {
    // log($(this).val(this))
    if (!$.checkReg($(this).val(), 'phone') && ($(this).val().length != 11 || isNaN($(this).val()))) {
        $.popInfo("手机号/座机错误！");
        $(this).val('')
    }
});
//账号验证 纯手机号
$("body").on('blur change', 'input.userName', function (event) {
    if (!$.checkReg($(this).val(), 'phone')) {
        $.popInfo("账号错误！");
        $(this).val('')
    }
});
//邮箱验证
$("body").on('blur change', '.email', function (event) {
    if (!$.checkReg($(this).val(), 'email')) {
        $.popInfo("邮箱错误！");
        $(this).val('')
    }
});
//一次密码验证
$("body").on('blur change', '.password', function (event) {
    // if (!$.checkReg($(this).val(), 'password')) {
    //
    // }
    // function isPasswd(s) {
    var patrn = /^(\w){6,20}$/;
    // log()
    if (!patrn.exec($(this).val())) {
        $.popInfo("密码错误！");
        $(this).val('')
    }
    // return true
    // }
});
//二次密码验证
$("body").on('blur change', '.passwordConfirm', function (event) {
    if ($(this).val() !== $(".password").val()) {
        $.popInfo("两次密码不一致！");
        $(this).val('')
    }
});
//身份证验证
$("body").on('blur', '.idCardIpt', function (event) {
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($(this).val()))) {
        $.popInfo("身份证号错误！");
        $(this).val('')
    }
});
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var pluses = /\+/g;
    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }
    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }
    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }
    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }
    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    var config = $.cookie = function (key, value, options) {
        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }
            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }
        // Read
        var result = key ? undefined : {};
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }
            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };
}));
//获取函数形参名
function getArgs(func) {
    //匹配函数括号里的参数
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    //分解参数成数组
    return args.split(",").map(function (arg) {
        //去空格和内联注释
        return arg.replace(/\/\*.*\*\//, "").trim();
    }).filter(function (args) {
        //确保没有undefineds
        return args;
    });
}
// 兼容
$("body").on('click', ".btn.btn-primary.clickBtn", function () {
    var aEle = $(this).find("a")
    //  log(aEle.length == 1 ,aEle.attr("href"))
    if (aEle.length == 1 && aEle.attr("href")) {
        goNewPage(aEle.attr("href"))
    }
})
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    };
}
/**
 * JSON 兼容
 *
 */
if (typeof JSON !== "object") JSON = {};
(function () {

    "use strict";
    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10) ? "0" + n : n;
    }
    function this_value() {
        return this.valueOf();
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function () {
            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };
        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }
    var gap;
    var indent;
    var meta;
    var rep;
    function quote(string) {
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.
        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }
    function str(key, holder) {
        // Produce a string from holder[key].
        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];
        // If the value has a toJSON method, call it to obtain a replacement value.
        if (
            value
            && typeof value === "object"
            && typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }
        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }
        // What happens next depends on the value's type.
        switch (typeof value) {
            case "string":
                return quote(value);
            case "number":
                // JSON numbers must be finite. Encode non-finite numbers as null.
                return (isFinite(value))
                    ? String(value)
                    : "null";
            case "boolean":
            case "null":
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.
                return String(value);
            // If the type is "object", we might be dealing with an object or an array or
            // null.
            case "object":
                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.
                if (!value) {
                    return "null";
                }
                // Make an array to hold the partial results of stringifying this object value.
                gap += indent;
                partial = [];
                // Is the value an array?
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }
                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? (
                                "[\n"
                                + gap
                                + partial.join(",\n" + gap)
                                + "\n"
                                + mind
                                + "]"
                            )
                            : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }
                // If the replacer is an array, use it to select the members to be stringified.
                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                } else {
                    // Otherwise, iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                }
                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.
                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }
    // If the JSON object does not yet have a stringify method, give it one.
    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {
            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.
            var i;
            gap = "";
            indent = "";
            // If the space parameter is a number, make an indent string containing that
            // many spaces.
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }
                // If the space parameter is a string, it will be used as the indent string.
            } else if (typeof space === "string") {
                indent = space;
            }
            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("JSON.stringify");
            }
            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.
            return str("", { "": value });
        };
    }
    // If the JSON object does not yet have a parse method, give it one.
    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {
            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.
            var j;
            function walk(holder, key) {
                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.
                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.
            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }
            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.
            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.
            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {
                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.
                j = eval("(" + text + ")");
                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.
                return (typeof reviver === "function")
                    ? walk({ "": j }, "")
                    : j;
            }
            // If the text is not JSON parseable, then a SyntaxError is thrown.
            throw new SyntaxError("JSON.parse");
        };
    }
}());


Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('tofixed()数字参数必须是0和20之间');
    }
    var number = this;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (var i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (var i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    var last = decimal.substr(n, 1);

    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        var x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }

    return result;
}



function accMul(arg1, arg2) {
    arg1 = arg1 || 0
    arg2 = arg2 || 0
    var m = 0, s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) { }
    try {
        m += s2.split(".")[1].length
    } catch (e) { }

    var str = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)

    if (!isNaN(str)) {
        str = parseFloat(str.toFixed(2))
    }
    return str
}
