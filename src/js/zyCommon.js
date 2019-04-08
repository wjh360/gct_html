
$(function () {
    //方块点击
    $("body").on("click", '.checkClick', function () {
        $(this).toggleClass("checkActive")
        //如果是点击全选按钮
        if ($(this).parents(".checkAllBox").length > 0) {
            //点击全选,第二级全选或全不选
            if ($(this).hasClass("checkActive")) {
                $(this).parents(".checkAllBox").next().find(".checkClick").addClass("checkActive")
            } else {
                $(this).parents(".checkAllBox").next().find(".checkClick").removeClass("checkActive")
            }
        } else {
            //如果二级中checkClick的长度 ！==checkActive的长度，说明有没有选中的，这是全选对勾取消，如果相等，全选按钮添加
            // if($(this).parents(".privateTd").find(".checkActive").length==0){
            //     $(this).parents(".privateTr").find(".checkAllBox").find(".checkClick").removeClass("checkActive")
            // } else{
            $(this).parents(".privateTr").find(".checkAllBox").find(".checkClick").addClass("checkActive")
            // }
        }
    })
    // 圆圈点击事件
    $("body").on("click", '.radioClick', function () {
        if ($(this).hasClass("danCheck")) {
            //如果是单选===不一定选择====它的兄弟选中移除掉
            $(this).parents(".radioBox").siblings().find(".radioClick").removeClass("radioActive")
        } else if ($(this).hasClass("bidanCheck")) {
            //单选==必选一个
            if ($(this).hasClass("radioActive")) {
                $(this).parents(".radioBox").siblings().find(".radioClick").addClass("radioActive")
            } else {
                $(this).parents(".radioBox").siblings().find(".radioClick").removeClass("radioActive")
            }
        }
        if (!$(this).parent().siblings(".radioAll").find(".radioClick").hasClass("radioActive")) {
            $(this).toggleClass("radioActive")
        }
    })
})
function unique(arr) {
    var hash = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                ++i;
            }
        }
        hash.push(arr[i]);
    }
    return hash;
}
//加法
function money_Add(arg1, arg2) {
    if (!arg1) arg1 = 0
    if (!arg2) arg2 = 0
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
// 减法
function money_Jian(arg1, arg2) {
    if (!arg1) arg1 = 0
    if (!arg2) arg2 = 0
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 - arg2) / m;
}
function money_cheng(arg1, arg2) {
    if (!arg1) arg1 = 0
    if (!arg2) arg2 = 0
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}