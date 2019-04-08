var version = {}
//生成随机版本号
version.randoms = function (sizes) {
    if (!sizes) sizes = 10
    var seed = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'l', 'j', 'k', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z', '0', '1',
        '2', '3', '4', '5', '6', '7', '8', '9');//数组
    var seedlength = seed.length;//数组长度
    var createPassword = '';
    for (var i = 0; i < sizes; i++) {
        var j = Math.floor(Math.random() * seedlength);
        createPassword += seed[j];
    }
    return createPassword;
}
version.randomPassword = version.randoms()
var cssStr = `
    <link rel="icon" href="/img/bitbug_favicon.ico" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="/js/bootstrap-3.3.7/css/bootstrap.css?${version.randomPassword}">
    <link rel="stylesheet" href="/css/allLess.css?${version.randomPassword}">
    <!--[if lte IE 9]>
        <script type="text/javascript" src="/js/html5shiv.min.js?${version.randomPassword}"></script>
    <![endif]-->
</head>`

version.getJsPath = function (tName, ss) {
    var jsStr = `
    <div class="Remarks">本平台由 金雀互联 | 京ICP备17038965号</div>
    <script type="text/javascript" src="/js/jquery-1.11.3.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/bootstrap-3.3.7/js/bootstrap.min.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/bootstrap-table.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/tools.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/webuploader.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/distpicker.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/power.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/common.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/download.js?${version.randomPassword}"></script>
    <script type="text/javascript" src="/js/tableAttr.js?${version.randomPassword}"></script>`
    tName = tName ? tName : ""
    tName = tName.slice(tName.lastIndexOf("\\") + 1, tName.lastIndexOf(".html"))
    ss = ss.replace(/<head>/g, '<head>\r\n<meta name="renderer" content="webkit|ie-comp|ie-stand">\r\n<meta http-equiv="X-UA-Compatible" content="IE=Edge,11,10,9,chrome=1">')
        .replace(/<\/head>/g, cssStr)
        .replace(/<\/body>/g, jsStr)
    var cTxt = ""
    if (tName != 'login') {
        cTxt = '	<script type="text/javascript" src="./' + tName + '/' + tName + '.js?' + version.randomPassword + '"></script>\r\n</body>\r\n</html>'
    } else {
        cTxt = '    <script type="text/javascript" src="./modules/login/login.js"></script>\r\n</body>\r\n</html>'
    }
    ss = ss.replace(/<\/html>/g, cTxt)
    return ss
}
var csd = require('./gulpDev.js')()
var srcPath = csd['srcPath']
version.setJsStatus = function (a, b) {
    a = a ? a : ""
    a = a.slice(a.lastIndexOf("\\") + 1, a.lastIndexOf(".js"))
    if (a == 'common') {
        srcPath = srcPath.replace(/gct-web\//, 'file')
        var desPath = ""
        if (srcPath.indexOf("//192") == -1) desPath = 'desStatus = true'
        else srcPath = ""
        b = b.replace(/var/, 'window.webPath = "' + srcPath + '";' + desPath + '\r\nvar')
        return b
    } else return b
}
module.exports = function () { return version; }
