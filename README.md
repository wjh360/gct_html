# gct-html

工程通pc端 

 
# pro 相关
-----------------------------
> # 所有封装 的表格、下拉、三级联动、日期选择器 等 id不能使用md文件上出现的id
> # 所有封装 的表格、下拉、三级联动、日期选择器 等 id不能使用md文件上出现的id
> # 所有封装 的表格、下拉、三级联动、日期选择器 等 id不能使用md文件上出现的id  
> # 重要的事情说三遍。。。

--------------------------------
> # 所有链接 注意大小写  如 
	```
		<script type="text/javascript" src="/js/downLoad.js"></script>
		js 文件夹中  downLoad.js 不存在  只有 download.js 
		开发的时候不会报错  但是 生产时会报错   多确认！！
	```
## 样式相关
 
 - common.less中不写样式 只设置全局变量
 
 - @变量名：值
  
 - 在less文件中直接调用@变量名就ok
 
 - 设置变量名时请添加备注
 
 - 添加页面样式时 calss请保持唯一性 css合并文件容易样式混乱
 
 - class命名规则   ：页面名称 + 功能名称  例如 login_btn,login_post等.....
 
 - 所有class名称 必须做到 多字段名字用下划线拼接  例如 fixed-table-container等...
 
 - 全局样式设置时 不要使用  div a  或者  main nth-child(2) 
 
 - 太广泛的选择器 请细化使用calss选择器
 

> ## console.log 禁止使用 全局使用 log() 函数

> ## ajax调用函数 $http(url,data,func,cmp)

- @url  请求地址

- @data 请求参数

- @func 请求成功回调

- @cmp 请求完成回调

> ## 初始化表格		initTable(attr, resData,col,other) 	

- @attr         生成表格的id

- @resData 		数据源 [{}]

- @col   展示数据		[{ field: 'url'	// 数据源 ,	 title: 'Item Name' // 表头名称,fomatter:function(){}//回调 }]

- @other 	(非必填)

	```
	other = {
			isFrozen:false,     //是否冻结表格
			isShowFooter:false, //是否显示底部
			singleSelect:false  //是否禁止多选
			total:1,            //数据总条数
			init:function(){},  //函数自身（刷新表格用）
			cur:1,              //表格显示当前页
		}
	```

> ## 确认取消弹出框		$.popConfirm(action)	 
- @action 			对象（必填）

- @action.title 		提示框title （选填）  

- @action.content 	提示框内容 （必填）

- @action.confirm 	提示框确认回调 （选填  不填 默认直接关闭弹框）

- @action.error 		提示框取消回调 （选填  不填 默认直接关闭弹框）

> ## 警告弹出框			$.popAlert(action)
 
- @action.title 		提示框title （选填）   

- @action.content 	提示框内容 （必填）

- @action.confirm 	提示框确认回调 （选填  不填 默认直接关闭弹框）

> ## 生成三级联动	
>>	` <div id="proCtiyCounty1" class="proCtiyCounty"></div>`

- class 必须是 proCtiyCounty

- 动态生成三级联动 creatCityDiv (dataEle) //元素id

- 回显三级联动 getCodeEcho (ele,pro,ct,cy)

- @ele 元素id名

- @pro  省id

- @ct   市id

- @cy   区id

 - > 获取省市区id	getCodeSub (el) 

	* @el 元素id名

> ## 文件上传 postFils(ele,autoF,otherData)
 
 - @ele         上传文件 元素 id
 
 - @autoF       是否自动上传 默认false
 
 - @otherData   携带其他参数 对象
 
> ## session 封装 storage(name,val,path)

- @name  键名

- @val   键值

- @path 保存的页面

- 都传时，储存对应的键名与键值。

- val不传时，获取键名所对应的键值

- val 全等于 -1 时删除指定键对应的值
 
- 都不传时 清除所有
###
1. storage('abc',123)   			直接存

2. storage('abc')				直接取 //123

3. storage('abc',222,'fd')		带页面存

4. storage('abc')				直接取会得到 直接存的值 //123

5. storage('abc',"",'fd')		带页面取 会得到 带页面存的值 //222

> ## 生成下拉选择	getDownSelect(el,txt,dataArr,dataIdx,dataName,arList)
>> `<div id="downSelect1" class="downSelect"> </div>`
 
-  @el 			元素id名		string  不加 #
 
-  @txt 		提示文本		string
 
-  @dataArr 	数据列表 		array	[{dataIdx:xxx,dataName:xxx}...]
 
-  @dataIdx 	需要提交的值 	string
  
-  @dataName    需要回显的文本 	string
  
-  @arList 		其他的参数		list 	//例 ['1','2','3']

> ## 生成日历选择
>> 
	```
		<div class="jeinpbox">
				<input type="text" class="jeinput" id="bidTimeStr"  placeholder="请选择开始日期" />
				<span class="jeinput_icons"></span>
		</div>
	```
- id 为必填项

> ## 返回上一页  function goBack()
 -如果需要点击事件  直接 给元素添加 class goBack

> ## 跳页 function goNewPage(url)

> ## 超出规定字符长度 以'...'显示 initTxt(str,lenNum,ipt)
- @str  	传入的字符

- @lenNum	需要传入规定的长度

- @ipt      是否是input显示



> ## 初始化日期 initDate(data, isNeedOther)
- @data 		时间戳
- > @isNeedOther 	
- >>默认 '' 	只显示到日  
- >>传入 's'	显示到秒   
- >>传入 'y'    只显示到月 



> ## 判断参数是否是数组 $.isArray(array)  array 必传
-
> ## 判断参数是否是字符串 $.isString(str)
-
> ## 判断参数是否是JSON $.isJSON(str)
-
> ## 判断参数是否是图片 $.isImg(str)
-
> ## 数组去重 $.ArrDup(array,name)
- @array 数组  必传

- @name 如果其中存在对象 传入 根据判断不可重复的键名 


> ## 正则 验证 $.checkReg(val,type)
``` 
var regObj = {
		isParseInt: //数字

		age: //数字,最高位不能为0

		money://整数或者小数

		password://密码验证

		isCn://汉字

		email://邮箱

		tel: //电话

		phone://手机

		isDate://匹配日期

	}
```
- @val 需要验证的值

- @type 需要验证的类型  regObj对象中的类型 

- 如果需要验证账号 // type = 'account'


> ## 对象 数组删除指定属性  $.removeAtbute(arr,attr)
- @arr	   数组 或对象
- @attr    不传参 返回空数组   可以传 对象 数组 字符串 数字 
-		   传下标时 需要两个参数 （attr，true） 下标 true


> ## 判断目标值是否为空 $.empty(val)
- undefined, null, '', false, 0, [], {} 均返回true，否则返回false

> ## 本地存储名称尽量统一
```
var mainStore = {

	projectId:'',			//项目Id

	projectName:'',			//项目名称

	companyId:'',			//公司Id

	companyName:'',			//公司名称

	departmentId:'',		//部门Id

	departmentName:'',		//部门名称	

	formId:'',				//表单Id		==> 工单操作记录

	auditId:'',				//审核Id

	leaderName:'',			//直属领导名称

	leaderId:'',			//直属领导id

	companyManName:'', 		//公司负责人名称

	companyManId:'',		//公司负责人id

	departmentManName:'',	//部门负责人名称

	departmentManId:'',		//部门负责人id

	personId:'',			//人员Id

	curLoginPersonId:'',   	//当前登陆人员id

	curLoginPersonName:'',  //当前登陆人员姓名

	sysMsgId:'',			//系统消息通知Id

	auditItem,				 //事项分类  添加流程页面

	processId，				//流程id   编辑流程id

	BiddingId               //投标申请id
	BiddingName               //投标申请名称

	DocId                    //标书购买申请id

	BondId                  //保证金申请id

	BusinessId              //业务费用id

	frameContractId			//框架合同id  编辑页面

	FinancingID              融资申请id
	frameContractId			//框架合同id  编辑页面 详情页面

	constructContractId		//施工合同id  编辑页面 详情页面 

	taskId  				//工单 id

	MoneyId                 //报销申请id

	datumId                  //竣工资料Id
	taskRecordId			//工单事项记录Id

	taskRecord				//工单记录对象
    invoiceId               //发票Id
    invoicePoolId           //发票池Id

	orderId                  //订单id

	taskForm              // 工单数据对象
	payApplyId            //付款申请id

	supperlierId          //供应商历史
	procursePlanId        //采购计划ID
	storageId             //库房Id

	contractRecordId   工程款记录id
	contractId         工程款id
	projectCose        项目成本
	projectOrderAmount 项目订单金额（金额）
	BiddingName   投标名称
	acceptCerId     验收证书Id

}

```


> ## 搜索 框	高级搜索list class用 searchList	 creatSearchBox (callback)
	```
		<div class="searchBox" attr="easy high" val="请输入工单名称"></div>

		</div>
	```
- callback  需要回调的函数
- attr 标识 简单搜索 easy 和 高级搜索 high
- val 属性 标识 简单搜索框内placeholder文本 