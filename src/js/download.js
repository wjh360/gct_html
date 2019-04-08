
// 获取当前浏览器版本
function versionIE() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
	var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
	var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (fIEVersion == 8) {
			return 8;
		} else if (fIEVersion == 9) {
			return 9;
		} else if (fIEVersion == 10) {
			return 10;
		} else {
			return 6;//IE版本<=7
		}
	} else if (isEdge) {
		return 'edge';//edge
	} else if (isIE11) {
		return 11; //IE11
	} else {
		return -1;//不是ie浏览器
	}
}
//匹配可以下载的格式
function replaceHref() {
	var a = $("[href$='.gif'],[href$='.jpg'],[href$='.jpeg'],[href$='.bmp'],[href$='.png']," +
		"[href$='.3gp'],[href$='.mp4'],[href$='.avi'],[href$='.mov'],[href$='.doc']," +
		"[href$='.docx'],[href$='.pdf'],[href$='.xls'],[href$='.xlsx'],[href$='.rar']," +
		"[href$='.ppt'],[href$='.pptx'],[href$='.zip'],[href$='.dwg'],[href$='.txt']");
	for (var i = 0; i < a.length; i++) { $(a[i]).attr("href", "javascript:$.downloadTemplate('" + $(a[i]).attr("href") + "')"); }
}
//ie8文件下载
jQuery.downloadTemplate = function (filePath) {
	alert(filePath)
	jQuery('<form action="/fgwwjcommon/commonservice/downloadTemplate?theme=none" method="post">' +  // action请求路径及推送方法
		'<input type="text" name="filePath" value="' + filePath + '"/>' + // 文件名称及文件路径
		'</form>')
		.appendTo('body').submit().remove();
};
function download(data, dataName, tar) {
	// console.log(data)
	var src = encodeURI(encodeURI('/gct-web/upload/fileDownload?filePath=' + data + '&fileName=' + dataName))
	if ($.isObject(data) && data.isExPort) {
		src = encodeURI(encodeURI(data.isExPort))
	}
	// alert(versionIE())
	//ie9 以下
	if (!$(tar).attr('href')) {
		if (versionIE() > 7) { replaceHref(); $(tar).attr('href', src) }
		//ie9以上
		else $(tar).attr('download', decodeURI(dataName)).attr('href', src)
	}
} /* end download() */



/**
* Base64 encode / decode
*/
function Base64() {
	// private property
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	// public method for encoding
	this.encode = function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}
	// public method for decoding
	this.decode = function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}
	// private method for UTF-8 encoding
	_utf8_encode = function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}
	// private method for UTF-8 decoding
	_utf8_decode = function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}


/**
* randomP
*/


function randomP(sizes) {
	// if (window.mathRandom && !sizes) return window.mathRandom
	if (!sizes) sizes = 10
	var seed = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
		"M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b",
		"c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
		"s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
		"8", "9", "+", "/", "="); //数组
	var seedlength = seed.length; //数组长度
	var createPassword = '';
	for (var i = 0; i < sizes; i++) {
		var j = Math.floor(Math.random() * seedlength);
		createPassword += seed[j];
	}
	// alert(createPassword)
	return createPassword;
}
