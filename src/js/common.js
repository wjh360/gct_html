//commonJs
var baseFileUrl = ''                                    //图片回显基础路径
var tab_rowData = {};                                   //表格点击获取整行数据(页面表格里dom的点击事件里直接取 tab_rowData对象里的数据)
var tab_rowData_s = {};
var orFileData = {}                                     //文件数据对象
var nav_idx = storage("nav_idx") || 0;                  //当前页面如果存在多个 tab 页面  需要显示的当前tab的下标 (一级tab) ---待修改
var nav_twos_idx = storage("nav_twos_idx") || 0;        //二级tabl 下标
var noAttrPower = false;                                //是否添加权限    true 没有    false   已添加 ==》 手动修改
var tab_select_data = [];                               //当前选中的所有数据
var tab_select_ids = [];                                //当前选中的所有数据的id
var tabObj = {}                                         //表格选中 数据对象
var orFileObj = {}                                      //文件dom对象
var delFileObjUrlList = []                              //返回队列文件数组
var delFileIdList = []                                  //被删除文件 id List
var fileTypeCount = 0                                   //判断是否是多中类型的文件上传
var oneFileDelFileIdsList = []                          //单文件 删除id list
var oneFileDelFileUrlList = []                          //单文件 删除url list
var oneFileEchoFileList = []                            //单文件 回显list
var curLoginName = storage('curLoginName', "", 'login') //当前登陆 人姓名
var downDatasLen = [];
//开发时路径/生产时路径 //window.desStatus == true 时 说明当前链接的调试地址是(服务器地址 || 生产地址)
if ($checkDevStatus && window.webPath && window.desStatus) baseFileUrl = window.webPath; else if ($checkDevStatus) baseFileUrl = '/gct-web/file'; else baseFileUrl = location.origin + '/file';
//禁止页面拖动打开新的页面
$("body").on("dragstart", function () { return false; })
//当前登陆人 如果不存在则返回登录页
if (curLoginName) {
    $("#userName").html(storage('curLoginName', "", 'login'))
} else if ($windowCurPathName != 'login') {
    $.popAlert({
        'content': '您的登录已超时，请重新登录！',
        'confirm': function () {
            goNewPage("/login.html")
        }
    })
}
//退出登陆
$("body").on('click', '.logout', function () {
    storage();
    $http('/gct-web/loginWeb/getLogOut');
    goNewPage("/login.html");
})
//初始化表格
function initTable(attr, resData, col, other) {
    tabObj[attr] = {
        tab_select_data: [],
        tab_select_ids: []
    }
    resData = resData || [];
    downDatasLen = resData
    $("#" + attr + " .checkBoxTrue").removeClass("checkBoxTrue").addClass('checkBox')
    var fatherList = arguments && arguments.callee && arguments.callee.caller ? arguments.callee.caller.arguments : []
    var init = fatherList[3] || function () { }
    if (!$('#' + attr + 'Page').length && !$('#' + attr).parents(".page").hasClass("uploader_Table")) {
        $("#" + attr).after('<div id="' + attr + 'Page"></div>')
    }
    other = other || {}
    other = {
        isFrozen: other.isFrozen || false, //是否冻结表格
        isShowFooter: other.isShowFooter ? other.isShowFooter : false, //是否显示底部
        singleSelect: other.singleSelect || false, //是否禁止多选
        total: fatherList[4] || 1, //数据总条数
        init: init, //函数自身（刷新表格用）
        cur: fatherList[1] || 1, //表格显示当前页
        selectedIdx: fatherList[2],
        iscollect: other.iscollect   //是否手机id
    }
    $.each(col, function (index, eleVal) {
        if (eleVal.title && eleVal.title != '操作') {
            if (!eleVal.formatter && eleVal['class'] != 'iscollectIds') {
                eleVal.formatter = function (a) {
                    if (a && ($.isString(a) || !isNaN(a)) || a === 0) {
                        // log($("<span>"+a +"</span>").width())
                        // return '<span title="' + a + '">' + initText(a + "", 6) + '</span>'
                        return '<span class="overf_Ec" style="display:inline-block;max-width:' + (eleVal['width'] || 100) + 'px;">' + a + '</span>'
                    } else {
                        return ""
                    }
                }
            }
        } else if (eleVal.title == '操作') {
            // $(ele).addClass('operate')
            eleVal['class'] = eleVal['class'] + ' operate'
        }
    })
    if (other.iscollect) {
        if (col[col.length - 1]['class'] != 'iscollectIds') {
            col.push({
                field: 'id',
                title: 'ids',
                'class': 'iscollectIds',
                width: '10'
            })
        }
    }
    // log(fatherList)
    getPage(attr + 'Page', Math.ceil(other.total / (other.selectedIdx || 10)), other.cur, other.init, other.selectedIdx) //添加分页
    $("#" + attr).bootstrapTable('load', resData); //刷新列表
    $('#' + attr).bootstrapTable({
        undefinedText: "", //如果数据为空 显示“/”
        // striped: true, //隔行变色
        showFooter: other.isShowFooter, //是否显示底部
        singleSelect: other.singleSelect, //是否禁止多选
        data: resData, //数据源
        clickToSelect: false, //点击行 选中
        columns: col, //数据
        onClickRow: function (row, $el, field) {
            tab_rowData = row || {};
            tab_rowData_s.field = field
            tab_rowData_s.trIdx = $el.attr("data-index")

        } //点击行事件 //全局储存表格行内数据
    });
    if (other.isFrozen) getR(col, '#' + attr, resData)

    $('#' + attr).find('[data_power]').each(function (index, el) {
        var isShowTd = curPowerObj[$(el).attr("data_power")]
        if (!isShowTd) {
            if ($(el).parents("td").children().length <= 1) {
                $(el).parents("td").hide()
                $(el).parents("#" + attr).find("thead tr th").last().hide()
            }
            $(el).remove()
        } else {
            $(el).attr("data_power", 'powers_' + $(el).attr('data_power'))
        }
    })
}
//阻止 操作栏/空数据栏 事件默认行为
$('body').on('click', '.table tbody tr .operate,.table tbody tr.no-records-found td', function (e) {
    var tar = e.target;
    if ($(tar).hasClass("operate") || $(tar).parent().hasClass("no-records-found")) return false
})
/*冻结*/
function getR(col, id, resData) {
    if ($(id).find(".dss").length) $(".dss").remove()
    $(id).parents('.page').css("overflow-x", 'scroll')
    var count = 0, lastTd;
    if (Array.prototype.isPrototypeOf(col[1])) {
        $.each(col[0], function (i, v) {
            count += v['width'] - 0
            // console.log(v)
            if (i == col.length - 1 && v['class'] == 'dis') lastTd = v['width'] + 'px'
        })
    } else {
        $.each(col, function (i, v) {
            count += v['width'] - 0
            // console.log(v)
            if (i == col.length - 1 && v['class'] == 'dis') lastTd = v['width'] + 'px'
        })
    }
    // console.lo?g(count)
    $(id).css('width', count + 'px').parents('.bootstrap-table').css('width', count + 'px')
    if (!resData || !resData.length || !lastTd) return false
    var bodyW = parseFloat($("body").css("width")),
        pageW = parseFloat($(id).parents('.page').css("width")),
        pageL = $(id).parents('.page').offset().left
    var pp = bodyW - pageW - pageL - 1 + 'px;'
    $(id).find(".dis").each(function (i, v) {
        var tops = parseFloat($(v).offset().top)
        if ($("#menu").css('display') == 'none') tops += 60
        tops = tops + 'px;'
        var str = $(v).html()
        if (i == 0) {
            $(v).after('<th style="padding-top: 15px;width:' + lastTd + ';background: rgb(224,240,255);top:' + tops + 'right: ' + pp + '" class="dss">' + str + '</th>')
        } else {
            $(v).after('<td style="width:' + lastTd + ';background: rgb(255,255,255); top:' + tops + 'right: ' + pp + '" class="dss">' + str + '</td>')
        }
    });
    // console.log(col)
    $("body").on('click', '.dss', function (e) {
        var tar = e.target,
            classStr = ""
        if ($(tar).attr('class').indexOf(' ') != -1) classStr = $(tar).attr('class').slice(0, $(tar).attr('class').indexOf(' '))
        else classStr = $(tar).attr('class')
        $(this).prev('td').find('.' + classStr).click()
    })
}
//文件上传
function postFiles(el, autoF, otherData) {
    fileTypeCount++;
    orFileData[el] = []
    orFileData[el + 'Echo'] = orFileData[el + 'Echo'] || []
    if (orFileObj[el + 'Uploader']) return false;
    var ele = "#" + el,
        autoF = autoF ? autoF : false
    var otherData = {
        url: otherData && otherData.url ? otherData.url : '/gct-web/upload/uploadFile',
        data: otherData && otherData.data ? otherData.data : {}, //需要上次的其他参数
        fileType: otherData && otherData.fileType ? otherData.fileType : {
            title: 'fileType',
            extensions: 'jpg,png',
            mimeTypes: '.jpg,.png'
        },
        init: otherData && otherData.init ? otherData.init : "",
        isMore: otherData && otherData.isMore ? otherData.isMore : false,
        echoImg: otherData && otherData.echoImg ? otherData.echoImg : null, //回显照片
        fileNumLimit: otherData && otherData.fileNumLimit ? otherData.fileNumLimit - orFileData[el + 'Echo'].length : 10 - orFileData[el + 'Echo'].length,
        readExel: otherData.readExel ? otherData.readExel : false
    }
    //上传文件
    orFileObj[el + 'Uploader'] = WebUploader.create({
        swf: '/js/Uploader.swf', // swf文件路径
        server: otherData.url, // 文件接收服务端。
        auto: autoF, //是否自动上传
        pick: {
            id: ele,
            multiple: otherData.isMore //是否支持多选  默认是 false  不支持
        }, // 选择文件的按钮。可选。 // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        formData: otherData.data,
        fileNumLimit: otherData.fileNumLimit,
        fileSizeLimit: 100 * 1024 * 1024,
        accept: otherData.fileType,
        duplicate: true,
        resize: false // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传
    });

    orFileData[el + 'num'] = 0
    orFileObj[el + 'Uploader'].on('fileQueued', function (file, a, c, d, e) { // 当有文件被添加进队列的时候
        htmlDown()
        if (otherData.readExel) {
            // log(file)
            otherData.readExel(file)
            orFileObj[el + 'Uploader'].stop()
        }
        if (otherData.echoImg) {
            orFileObj[el + 'Uploader'].makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                if (oneFileEchoFileList.length) {
                    $.each(oneFileEchoFileList, function (index, eleVal) {
                        if (eleVal.id) {
                            oneFileDelFileIdsList.push(eleVal.id)
                            if (eleVal.projectFileUrl) {
                                oneFileDelFileUrlList.push(eleVal.projectFileUrl)
                            }
                            if (eleVal.thumbnailUrl) {
                                oneFileDelFileUrlList.push(eleVal.thumbnailUrl)
                            }
                            oneFileEchoFileList.splice(index, 1)
                        }
                    })
                } else {
                    if (orFileData[el].length - 1 >= 0) {
                        var s = orFileData[el][orFileData[el].length - 1]
                        if (s.projectFileUrl) {
                            oneFileDelFileUrlList.push(s.projectFileUrl)
                        }
                        if (s.thumbnailUrl) {
                            oneFileDelFileUrlList.push(s.thumbnailUrl)
                        }
                    }
                }
                $('#' + el).find("img").attr("src", src)
            }, '150', '150');
        }
    });
    orFileObj[el + 'Uploader'].on("error", function (type, handler, a, b, c, d) {
        // log(orFileData[el + 'num'])
        //
        if (type == "Q_EXCEED_SIZE_LIMIT") { //文件大小超限制
            htmlDownRemove()
            $.popInfo("文件大小不能大于100MB")
            orFileObj[el + 'Uploader'].stop(true)
        } else if (type == 'Q_EXCEED_NUM_LIMIT') { //文件数量超限制
            // if (!fileBaseStats)
            // $.popInfo("最多上传" + otherData.fileNumLimit + "个文件，每个文件不能大于100MB")
            fileBaseStats = true
            orFileObj[el + 'Uploader'].stop(true)
            // orFileData[el + 'num'] = 0
        }
    });
    var i = 0
    orFileObj[el + 'Uploader'].on('uploadSuccess', function (file, res) {

        //上传成功
        if (res.code == 0) {
            orFileData[el + 'num']++;
            if (!res.prList) {
                var data = res.data
                data.eleName = el
                data.fileIdx = file.id
                data.projectFileSize = data.fileSize
                data.fileSize = initFileSize(data.fileSize)
                data.init = otherData.init || function () { }
                orFileData[el].push(data)
                orFileData[el + 'Id'] = orFileData[el + 'Id'] || []
                orFileData[el + 'Id'].push(file.id)
                //重新渲染。
                if (otherData.init) {
                    var Echo = orFileData[el + 'Echo'] || []
                    otherData.init(Echo.concat(orFileData[el]))
                }
                //消费记录时，
                if (url.has('Reimbursement')) {
                    $("#" + el).before('<div class="picUploader_box"><img src="' + (baseFileUrl + res.data.projectFileUrl) + '" alt="">\n' +
                        '<div class="delete_pic" index="' + data.fileIdx + '" name="' + el + '"></div> </div>');
                    if ($("#" + el).parents(".picBigContainer").find(".picUploader_box").length == 10) {
                        $("#" + el).hide()
                    }
                }
            } else {
                orFileData[el] = []
                var data = res.prList
                $.each(data, function (k, v) {
                    v.eleName = el;
                    data.init = otherData.init;
                    orFileData[el].push(v)
                })
                //重新渲染。
                if (otherData.init) {
                    var Echo = orFileData[el + 'Echo'] || []
                    otherData.init(Echo.concat(orFileData[el]))
                }
            }
        }
        if ((!res.data && res.code == 1) || res.result == 1) {  //空文件 或 上传失败
            //
            orFileObj[el + 'Uploader'].removeFile(file.id, true);
            $.popInfo(res.message || res.msg)
        } else if (res.result == 2) {
            $.popAlert({
                'content': res.message || res.msg,
                confirm: function () {
                    goNewPage('/login.html')
                }
            })
        }
    });
    orFileObj[el + 'Uploader'].on('uploadError', function (file, res) {
        htmlDownRemove()
        // log(file, file.id)
        orFileObj[el + 'Uploader'].removeFile(file.id, true);
        //上传失败
        $.popInfo(file.name + '上传失败，请重新上传！')
    });

    orFileObj[el + 'Uploader'].on('uploadFinished', function (a, b, c, d) {
        htmlDownRemove()
        if (fileBaseStats) {
            $.popInfo("成功上传" + orFileData[el + 'num'] + "个文件，已达到文件上传上限")
        } else {
            orFileData[el + 'num'] = 0
        }

    });
}
//格式化文件大小
function initFileSize(data) {
    if (data === 0) return '0 B';
    if (!data) return ""
    var k = 1024;
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    i = Math.floor(Math.log(data) / Math.log(k));
    return (data / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
//权限判断
(function ($) {
    //没有权限时
    if (!curPowerObj && noAttrPower) {
        $("[data_power]").each(function (i, el) {
            $(el).show()
            if ($(el).parent('.nav-tabs').length && $(el).attr('data_index') == nav_idx && !$(el).parents('.twos_nav').length) {
                $(el).addClass('active').find("a").attr('aria-expanded', "true")
                $($(el).find("a").attr("href")).addClass("in").addClass("active")
            } else if ($(el).parents('.twos_nav').length) {
                if ($(el).attr('data_index') == nav_twos_idx) {
                    $(el).addClass('active').find("a").attr('aria-expanded', "true")
                    $($(el).find("a").attr("href")).addClass("in").addClass("active")
                }
            }
        })
        return false
    }
    if (!nav_idx) {
        // log(123)
        $("[data_power]").each(function (i, el) {
            if (curPowerObj[$(el).attr("data_power")] || $(el).attr("data_power") == 'noPower') {
                $(el).attr("data_power", 'powers_' + $(el).attr('data_power'))
            } else {

                !$(el).parent(".commonCon").length || $(el).parent(".commonCon").css("min-height", '52px')
                $(el).remove()
            }
            if ($(el).parent('.nav-tabs').length && $(el).index() == 0 && !$(el).parents('.twos_nav').length) {
                nav_idx = $(el).attr("data_index")
                $(el).addClass('active').find("a").attr('aria-expanded', "true")
                $($(el).find("a").attr("href")).addClass("in").addClass("active")
            } else if ($(el).parents('.twos_nav').length) {
                if ($(el).attr('data_index') == nav_twos_idx) {
                    $(el).addClass('active').find("a").attr('aria-expanded', "true")
                    $($(el).find("a").attr("href")).addClass("in").addClass("active")
                }
            }
        })
    } else {
        $("[data_power]").each(function (i, el) {
            if (curPowerObj[$(el).attr("data_power")] || $(el).attr("data_power") == 'noPower') {
                $(el).attr("data_power", 'powers_' + $(el).attr('data_power'))
            } else {
                !$(el).parent(".commonCon").length || $(el).parent(".commonCon").css("min-height", '52px')
                $(el).remove()
            }
            if ($(el).parent('.nav-tabs').length && $(el).attr('data_index') == nav_idx && !$(el).parents('.twos_nav').length) {
                $(el).addClass('active').find("a").attr('aria-expanded', "true")
                $($(el).find("a").attr("href")).addClass("in").addClass("active")
            } else if ($(el).parents('.twos_nav').length) {
                if ($(el).attr('data_index') == nav_twos_idx) {
                    $(el).addClass('active').find("a").attr('aria-expanded', "true")
                    $($(el).find("a").attr("href")).addClass("in").addClass("active")
                }
            }
        })
    }
})(jQuery);
//
//循环渲染页面函数 需要特殊处理的日期
function eachData(obj, data, isNeedS, parEl) {
    for (var k in obj) {
        var val = data[k],
            ele = parEl ? $('.' + parEl).find("." + k) : $("." + k)
        if (k == 'province' || k == 'city' || k == 'county') {
            var cc = ele.parents(".proCtiyCounty ").attr("id")
            if (k == 'county') {
                getCodeEcho(cc, data.province, data.city, data.county)
            }
        } else {
            if (k.has('Date') || k.has('Time')) {
                if (k.indexOf('Time') > -1) {
                    var str = k.slice(0, k.indexOf('Time'))
                } else if (k.indexOf('Date') > -1) {
                    var str = k.slice(0, k.indexOf('Date'))
                }
                // log(str)
                str = data[str + 'Time'] || data[str + 'Date']
                // log(data[k])
                val = initDate(str, isNeedS ? isNeedS : "") //如果是日期字段 格式化日期
                // log(val)
            }
            if (!checkAttr(ele)) ele.html(val)
            else ele.val(val)
        }
    }
    return false
}
//判断元素是否是input //INPUT  无论设置值还是获取值都要用 val     TEXTAREA 只有获取时用val
function checkAttr(ele) {
    if (ele[0] && ele[0].tagName == 'INPUT') return true //使用val()函数
    return false //使用html函数
}
//所有角色下拉框 渲染
function getRoleAll(ele, fileId) {
    $http({
        url: '/gct-web/sysUser/getRoleAll',
        success: function (r) {
            getDownSelect(ele, '请选择人员角色', r.data.roles, 'id', 'roleName')
            if (fileId) {
                $("#" + ele).find('li').each(function (i, el) { //账号角色
                    if ($(el).attr("index") == fileId) {
                        $(this).click()
                        $(this).parents("ul").hide().prev('.downSetOpen').removeClass("downSetOpen")
                    }
                })
            }
        }
    })
}
//复选框点击事件
$("body").on("click", ".checkBox", function () {
    $(this).removeClass("checkBox").addClass('checkBoxTrue');
    return false
})
//复选框点击事件
$("body").on("click", ".checkBoxTrue", function () {
    $(this).removeClass("checkBoxTrue").addClass('checkBox');
    if ($(this).parents(".table").attr("id")) getTableSelectId($(this).parents(".table").attr("id"))
    return false
})
//table 全选
$("body").on("click", '.table thead .checkBox,.table thead .checkBoxTrue', function () {
    // log($(this).hasClass("checkBoxTrue"))
    if ($(this).hasClass("checkBoxTrue")) {
        $(this).parents(".table").find("tbody .checkBox").addClass("checkBoxTrue")
    } else {
        $(this).parents(".table").find("tbody .checkBoxTrue").removeClass("checkBoxTrue").addClass("checkBox")
    }
    getTableSelectId($(this).parents(".table").attr("id"))
    return false
})
// 外部按钮 全选 表格
function checkAllFun(attr, idstr) {
    $("#" + attr).find(".checkBox").addClass("checkBoxTrue")
    getTableSelectId(attr, idstr)
}
// 外部按钮 全取消 表格
function removecheckAllFun(attr, idstr) {
    $("#" + attr).find(".checkBoxTrue").addClass('checkBox').removeClass("checkBoxTrue")
    getTableSelectId(attr, idstr)
}
//table 单选
$("body").on("click", '.table tbody .checkBox', function () {
    if ($(this).attr("name") != 'radio') {
        var selectedLength = $(this).parents("tbody").find(".checkBoxTrue").length
        if (selectedLength == $(this).parents("tbody").find("tr").length) {
            $(this).parents(".table").find('thead .checkBox').addClass('checkBoxTrue')
        } else {
            $(this).parents(".table").find('thead .checkBox').removeClass('checkBoxTrue')
        }
    } else {
        $(this).parents("tbody").find(".checkBoxTrue").removeClass("checkBoxTrue").addClass('checkBox')
        $(this).addClass("checkBoxTrue")
    }
    getTableSelectId($(this).parents(".table").attr("id"))
})
//获取表格中所有选中的行数据 ('表格id','需要获取的值')
function getTableSelectId(el, idStr) {
    tabObj[el].tab_select_data = []
    tabObj[el].tab_select_ids = []
    idStr = idStr ? idStr : 'id'
    var ele = $("#" + el)
    if (!ele.length) return false
    ele.find("tbody tr .checkBoxTrue").each(function (i, elw) {
        var parIdx = $(elw).parents('tr').attr("data-index")
        tabObj[el].tab_select_data.push(ele.bootstrapTable('getData')[parIdx])
        tabObj[el].tab_select_ids.push(ele.bootstrapTable('getData')[parIdx][idStr])
    })
    return false
}
// 提交成功
function submitSuccess(msg, fn) {
    subFunction("ajaxSuccess", msg, fn)
}
// 提交失败
function sumitErr(msg, fn) {
    subFunction("ajaxErr", msg, fn)
}
//提交成功失败状态函数
function subFunction(status, msg, fn, data) {
    var tit = '<div class="shade shadeTan" style="display: block">' +
        '        <div class="titleBox">' +
        '            <img src="/img/' + status + '.png" alt="">' +
        '            <div class="succTi">' + (msg || '操作成功') + '</div>' +
        '        </div>' +
        '    </div>';
    $(".container").after(tit)
    $(".titleBox").show()
    $(".container").next().fadeOut(2000, function () {
        $(".shadeTan").remove()
        if (fn) fn()
    })
}

function htmlDown() {

    if ($(".shade").length == 0) {
        var tit = '<div class="shade htmlDown" style="display: block">\n' +
            '   <div class="titleBox" style="display: block;background: transparent">\n' +
            '               <div class="processDu">\n' +
            '                   <img src="/img/loader.gif" style="width: 100px;height: 100px" alt="">\n' +
            '                   </div>\n' +
            '               </div>\n' +
            '      </div>'
    }
    $("body").after(tit)
    unScroll()

}
function htmlDownRemove() {
    $(".shade").remove()
    removeUnScroll()
}

// 创建树
function createTree(testData, obj, treeObj, Fn) {
    var setting = {
        view: {
            selectedMulti: false,
            showIcon: false,
            showTitle: false
        },
        data: {
            simpleData: {
                enable: true
            },
            key: {
                name: Fn && Fn.childName ? Fn.childName : "depName"
            }
        },
        callback: {
            onClick: Fn && Fn.init ? Fn.init : function (event, treeId, treeNode) {
            },
            onCheck: Fn && Fn.onCheck ? Fn.onCheck : function (event, treeId, treeNode) {
            }
        }
        // ,
    };
    setting.check = !Fn.check || {
        enable: true,
        nocheck: false,
        chkStyle: Fn && Fn.chkStyle ? Fn.chkStyle : "checkbox",
        chkboxType: { "Y": "", "N": "" },
        radioType: "all"
    }
    var zNodes = null, zTreeObj = null, newCount = 1;
    // log(testData)
    if ($('#' + treeObj).length == 0) {
        zNodes = testData;
        var _ul = $('<ul id=' + treeObj + ' class="ztree"></ul>');          //创建树dom
        obj.append(_ul);
        zTreeObj = $.fn.zTree.init($('#' + treeObj), setting, zNodes);      //实例化树
    }
}
//提交页面 判断是否需要提交审核
$(function () {
    if ($(".postBtn").length && $(".postBtn").html() == '提交') {
        var auditItemId = storage("auditItem") || window.auditItem
        if (!auditItemId || $windowPath.has("processAdmin")) return false
        $http({
            url: '/gct-web/auditProcess/isAudit',
            data: {
                auditItem: auditItemId        //事项分类
            },
            success: function (r) {
                //1不需要审核  2需要审核
                if (r.data == 2) $(".postBtn").html("提交审核")
            }
        })
    }
})
//表格内删除文件 按钮
$("body").on("click", '.cancelFileBtn', function (e) {
    var tar = e.target
    var fIdx = $(tar).parents("tr").attr("data-index")      //当前文件所在的 下标
    var eleName = $(this).attr("name")                      // 当前文件 所在的文件对象
    var Ech = orFileData[eleName + 'Echo'] || []    //回显的所有文件
    var EchLen = Ech.length                         //回显的文件长度
    var fileList = Ech.concat(orFileData[eleName])  //所有的文件  （回显 + 新增）
    var initFn = fileList[fIdx].init                //初始化表格 所用的初始化函数
    if (!fileList[fIdx]) return false
    var curFile = fileList[fIdx]
    if (curFile.projectFileUrl) { delFileObjUrlList.push(curFile.projectFileUrl) }     ///被删除的文件 url list
    if (curFile.thumbnailUrl) { delFileObjUrlList.push(curFile.thumbnailUrl) }        //被删除的文件id list
    //判断是否是 fileList[fIdx].fileIdx  为真时  新上传的文件
    if (fileList[fIdx]['id']) {   //回显的文件
        delFileIdList.push(fileList[fIdx]['id'])
        if (orFileData[eleName + 'Echo']) {
            orFileData[eleName + 'Echo'].splice(fIdx, 1)
        }
    } else {
        orFileObj[fileList[fIdx].eleName + 'Uploader'].removeFile(fileList[fIdx].fileIdx, true)
        orFileData[eleName].splice(fIdx - EchLen, 1)
    }
    Ech = orFileData[eleName + 'Echo'] || []
    !initFn || initFn(Ech.concat(orFileData[eleName]))
})
//回显 下拉
function downSelectEcho(data) {
    data = {
        el: data.el,                //元素id
        data: data.data,            //数据
        ratioName: data.ratioName,   // 需要比值的 键名
        ratio: data.ratio,           // 需要比值的 基准值
        idx: data.idx,               // 需要区分的键名 唯一标识
        txt: data.txt,               // 中文名字 所在的键名
        type: data.type,              //比值类型  '==' 的情况下 数据 val[data.ratioName] == 基准值  否则  就是 ！=
        more: data.more || null
    }
    var NewName = "请选择"
    var NewId = ""
    $.each(data.data, function (index, val) {
        if (data.type == '==') {
            if (val[data.ratioName] == data.ratio) {
                // log(val)
                NewId = val[data.idx]
                NewName = val[data.txt]
            }
        } else {
            if (val[data.ratioName] != data.ratio) {
                // log(val)
                NewId = val[data.idx]
                NewName = val[data.txt]
            }
        }
    })
    getDownSelect(data.el, NewName, data.data, data.idx, data.txt, data.more)
    $("." + data.el).attr('index', NewId)
}
//点击文件名称 查看 图片  ==>  表格中的文件
$("body").on('click', ".tab_fileName", function () {
    tab_rowData.fileName = tab_rowData.fileName || ""
    var type = tab_rowData.suffixName || tab_rowData.fileName.slice(tab_rowData.fileName.lastIndexOf(".") + 1)
    // log(type)
    if (type != 'jpg' && type != 'png' && type != 'jpeg' && type != 'PNG' && type != 'JPG') return false
    viewBigImg(tab_rowData.projectFileUrl)
})
//点击文件名称 查看 图片  ==>   单张图片查看
$("body").on('click', ".imgView", function () {
    viewBigImg($(this).attr("data_file"))
})
//文件上传 回显
var fileBtnObj = {}
//文件上传按钮Id   数据data '表格Id' 表格配置参数 其他数据
function fileUploader(data) {
    data = {
        btn: data.btn || "",
        data: data.data || [],
        tabId: data.tabId || "",
        col: data.col || "",
        other: data.other || {},
        dataS: data.dataS || function () { }
    }
    if (!data.btn) return false
    $("#" + data.btn).addClass('postFileBtn_C')
    if (data.col) {
        fileBtnObj[data.btn] = {
            init: function (arr) {
                if (data.btn == 'workSheetMaterialFile') {
                    arr = orFileData[data.btn]
                    arr = arr.length ? arr[arr.length - 1].list : ""
                }
                arr = arr || []
                var _that = this
                $.each(arr, function (i, val) {
                    if (!val.init) {
                        val.init = _that.init
                        val.eleName = data.btn
                    }
                })
                if (data.tabId) initTable(data.tabId, arr, data.col)
            }
        }
    } else {
        fileBtnObj[data.btn] = {
            init: data.dataS ? data.dataS : function () { }
        }
    }
    data.other.init = fileBtnObj[data.btn] ? fileBtnObj[data.btn].init : function () { }
    postFiles(data.btn, true, data.other)
    return fileBtnObj[data.btn].init(data.data)
}
//判断文件list的同步    没有文件 返回 true   有文件 返回 false
function checkFileList(btn) {
    orFileData[btn + 'Echo'] = orFileData[btn + 'Echo'] || []
    if (!orFileData[btn].length && !orFileData[btn + 'Echo'].length) return true
    return false
}
//提交页面取消按钮 事件
$("body").on("click", '.cancelBtn', function () {
    for (k in sessionStorage) {
        var str = k.split('_')
        if (str[0] == $windowCurPathName) storage(str[1], -1)
    }
    $.popConfirm({
        content: '确定取消该操作吗?',
        confirm: function () {
            goBack()
        }
    })
})
// 阻止页面 二次提交  或 重复 请求
$('.nav-tabs li a').click(function (e) {
    if ($(this).parents('.nav-tabs').length && $(this).parents("li").hasClass("active")) return false;
    $.abortAll($.xhrPool)
})
$('.postBtn').click(function (e) {
    $.abortAll($.xhrPool)
})
$('.saveBtn').click(function (e) {
    $.abortAll($.xhrPool)
})
$('body').on('click', '.nav-tabs li', function (e) {
    $($(this).find("a").attr("href")).show().siblings('.tab-pane').hide()
})
//审核通过函数 ====>  审核页面
function auditFun(auditRemark, status) {
    if (!auditRemark) return $.popInfo("请填写审核意见！")
    var auditId = storage("auditId")
    $.popConfirm({
        'content': '确定审核吗？',
        'confirm': function () {
            $http({
                url: ' /gct-web/audit/audit',
                data: {
                    id: auditId,                                     //：3   审核表ID
                    status: status,                             //： 4审核不通过 5审核通过
                    auditRemark: auditRemark                    //：“审核意见”
                },
                success: function (r) {
                    submitSuccess("审核成功", function () {
                        goBack()
                    })
                }
            })
        }
    })
}
//通过
$('body').on('click', '.auditPass', function () {
    auditFun($("textarea.auditRemark").val(), 5)
})
//驳回
$('body').on('click', '.auditNoPass', function () {
    auditFun($("textarea.auditRemark").val(), 4)
})
//如果没有审核流程不让往下走
function isYesProcess(auditItem, callBack) {
    $http({
        url: '/gct-web/audit/isYesProcess',
        data: {
            auditItem: auditItem
        },
        success: function (r) {
            if (r.code == 0) if (callBack) callBack(r)
        }
    })
}
//回显审核意见函数
function auditNoPassRemark(formId, auditItem) {
    $http({
        url: ' /gct-web/audit/noPassRemark',
        data: {
            formId: formId,                     //：3   各个事项表单ID
            auditItem: auditItem                //：1001  事项
        },
        success: function (r) {
            if (r.data) {
                var str = '<div class="Role-noticeCon">' +
                    '<div class="inforHeader clearfix">' +
                    '<div class="verHang f_l"></div>' +
                    '<div class="headerText f_l">' +
                    '审核信息' +
                    '</div>' +
                    '</div>' +
                    '<div class="RoleDiv" style="margin-bottom: 0;">' +
                    '<span class="nameId">审核人：</span>' +
                    '<span class="nameCon auditName">' + r.data.auditName + '</span>' +
                    '</div>' +
                    '<div class="RoleDiv" style="margin-bottom: 0;">' +
                    '<span class="nameId">审核时间：</span>' +
                    '<span class="nameCon auditTime">' + initDate(r.data.auditTime, 's') + '</span>' +
                    '</div>' +
                    '<div class="RoleDiv" style="margin-bottom: 0;">' +
                    '<span class="nameId">审核意见：</span>' +
                    '<span class="nameCon auditRemarks">' + r.data.auditRemark + '</span>' +
                    '</div>' +
                    '</div>'
                $(".auditNoPassRemark").append(str).show()
            }
        }
    })
}
//文件导出接口
function exportTable(dataUrl, data, tar) {
    var str = ""
    $(tar).attr("href", "")
    for (var key in data) {
        str += key + '=' + data[key] + '&'
    }
    str = str.slice(0, str.lastIndexOf('&'))
    var downDatas = downDatasLen.length ? true : false
    if (!downDatas) {
        var funTar = arguments.callee.caller
        var e = funTar.arguments[0]
        //如果提供了事件对象，则这是一个非IE浏览器
        if (e && e.preventDefault) e.preventDefault();   //阻止默认浏览器动作(W3C)
        else window.event.returnValue = false;   //IE中阻止函数器默认动作的方式
        $.popInfo("暂无数据可导出")
        return false;
    }
    download({
        isExPort: dataUrl + '?' + str
    }, '', tar)
}
//各表单操作记录
function formAuditRecord(formId, auditItem, callBack) {
    $http({
        url: '/gct-web/audit/auditRecord',
        data: {
            id: formId,
            auditItem: auditItem
        },
        success: function (r) {
            // log(r)
            if (callBack) callBack(r)
        }
    })
}
//各类审核记录详情
function formAuditList(formId, callBack) {
    $http({
        url: '/gct-web/audit/auditList',
        data: {
            id: formId  //审核历史列表Id
        },
        success: function (r) {
            if (callBack) callBack(r)
            else initTable('auditRecordList', r.data, audit_list_Log)
        }
    })
}
//点击header 人员头像 跳转 个人信息页
$("body").on("click", ".header .avatar", function () {
    if (isSuperManagement) {  //超管 跳 单位信息
        if (location.pathname == '/modules/accountManagement/UnitInformation.html') return false
        goNewPage('/modules/accountManagement/UnitInformation.html')
    } else {
        if (location.pathname == '/modules/accountManagement/PersonalInformation.html') return false
        goNewPage('/modules/accountManagement/PersonalInformation.html')
    }
})
//点击header 信息 跳转 消息通知页
$("body").on("click", ".header .message", function () {
    if (location.pathname == '/modules/accountManagement/MessageNotification.html') return false
    goNewPage('/modules/accountManagement/MessageNotification.html')
})
//创建项目地区
var proCtiyCountyLen = 0;
function createProCity(data) {
    proCtiyCountyLen++;
    var str = ""
    if (proCtiyCountyLen > 1) {
        str = '<span class="nameId f_l" style="width:100px;height:34px;"></span>'
    } else {
        str = '<span class="nameId">项目地区：</span>'
    }
    var str = '<div class="RoleDiv clearfix" index="' + proCtiyCountyLen + '">' +
        str +
        '<span >' +
        '<span style="padding:0 10px;">' + (data.provinceName ? data.provinceName : '') + '</span>' +
        '<span style="padding:0 10px;">' + (data.cityName ? data.cityName : '') + '</span>' +
        '<span style="padding:0 10px;">' + (data.countyName ? data.countyName : '') + '</span>'
    '</span>' +
        '<span class="delProCity"></span>'
    '</div>'
    $(".addcountyMore").append(str)
}
//    点击查看照片拍摄位置
$("body").on("click", '.viewPhotoLocation', function () {
    var taskId = storage("taskId")
    if (!taskId || !$(this).next().children().length) return false;
    var fileType = $(this).attr("fileType")
    var obj = {
        taskId: taskId,
        fileType: fileType
    }
    if (fileType == 3 || fileType == 4) {
        var date = $(".work_Date").attr("name")
        obj.date = date
    }
    storage('seePicPositionObj', obj, 'seePicPosition')
    goNewPage('/modules/engineerManagement/constructionManagement/UnansweredTable/seePicPosition.html')
});
//请求消息通知 及点击消息事件处理
(function ($) {
    var arr;
    if ($windowCurPathName != 'login' && $windowCurPathName != 'MessageNotification') {
        $http({
            url: "/gct-web/user/getSystemInfoEcho",
            success: function (r) {
                if (!r.data) return false
                if (r.data.systemInfoDataVOS && r.data.systemInfoDataVOS.length) loopMsg(r.data.systemInfoDataVOS)
            }
        })
    }
})(jQuery)
var loopTimer, disLoop;
function loopMsg(arr) {
    var str = ""
    arr = arr || []
    $.each(arr, function (index, eleVal) {
        var stMsg = eleVal.type == 2 ? '工作消息：' : '系统消息：'
        str += '<li class="inform-li overf_Ec" index="' + eleVal.type + '" >' + stMsg + eleVal.title + '</li>'
    })
    $(".inform-ul").append(str)
    if (str.length) $(".message").find(".middle").show()
    if ($windowCurPathName != 'MessageNotification' && $windowCurPathName != 'TaskTrajectory') {
        $(".header_infoMsg").show()
        $(".content").css("margin-top", '30px')
    }
    // log(arr)
    if (arr.length > 1) {
        disLoop = true
        loopTimer = setInterval('AutoScroll(".header_infoMsg")', 10000)
    }

}
function AutoScroll(obj) {
    $(obj).find("ul").animate({
        marginTop: "-30px"
    }, 1000, function () {
        $(this).css({
            marginTop: "0"
        }).find("li:first").appendTo(this);
    }
    );
}
$("body").on("mouseover", ".inform-ul", function () {
    clearInterval(loopTimer)
    loopTimer = null
})
$("body").on("mouseleave", ".inform-ul", function () {
    clearInterval(loopTimer)
    if (disLoop) loopTimer = setInterval('AutoScroll(".header_infoMsg")', 10000)
})
$("body").on("click", ".inform-ul li", function () {
    if ($(this).attr("index") == 2) storage('nav_idx', 0, 'MessageNotification')
    else storage('nav_idx', '1', 'MessageNotification')
    if ($windowCurPathName != 'MessageNotification') return goNewPage('/modules/accountManagement/MessageNotification.html')
    return false
})


var fileBaseStats = false //文件初始状态
//限制文件数量
$("body").on("click", ".postFileBtn_C", function () {
    fileBaseStats = false
    var btn = $(this).attr("id")
    orFileData[btn] = orFileData[btn] || []
    orFileData[btn + "Echo"] = orFileData[btn + "Echo"] || []
    var len = orFileObj[btn + 'Uploader'].options.fileNumLimit + orFileData[btn + "Echo"].length
    var or = orFileData[btn].concat(orFileData[btn + "Echo"])
    if (or.length >= len) {
        $.popInfo("最多上传" + len + "个文件")
        return false
    }
})
