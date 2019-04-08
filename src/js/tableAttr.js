//项目需求表公共的

//工单 icon
var task_icon = {
    // icon    //1.无 2.转派 3.超时 4.转派+超时
    field: 'icon',
    width: 30,
    'class': 'tab_task_icon',
    formatter: function (a) {
        var icons = {
            '1': {
                url: ""
            },
            '2': {
                name: 'zhuan',
                url: '/img/rander_icon.png'
            },
            '3': {
                name: 'chaoshi',
                url: '/img/time_out_icon.png'
            },
            '4': 'liangge'
        }
        if (a >= 4) return '<p class="' + icons[a] + '">' +
            '<img src="' + icons['3'].url + '" class="chaoS" height="100%" width="100%">' +
            '</p>' +
            '<p class="' + icons[a] + '">' +
            '<img src="' + icons['2'].url + '" class="zhuanP" height="100%" width="100%">' +
            '</p>'
        var str = a > 1 ? '<img src="' + icons[a].url + '" height="100%" width="100%">' : ""
        return '<span class=" ' + icons[a].name + ' ">' +
            str +
            '</span>'
    }
}
//一般文件
var fileCol = [
    {
        field: 'fileName',
        title: '文件名称',
        'class': ' tab_fileName',
        width: '900'
    }, {
        field: 'fileSize',
        title: '文件大小',
        width: '100',
        formatter: function (a, b) {
            return a || initFileSize(b.projectFileSize)
        }
    }, {
        title: '操作',
        'class': '',
        width: '100',
        formatter: function (a, b) {
            return '<a class="cancelFileBtn m_red" name="' + b.eleName + '" title= "">删除</a>'
        }
    }
]
// 线路类
var project_LineTable = [
    {
        field: 'fileName',
        title: '序号',
        formatter: function (a, b, c) {
            return c + 1
        }
    }, {
        field: 'demandCode',
        title: '需求编号'
    }, {
        field: 'demandName',
        title: '需求名称'
    }, {
        field: 'rangeArea',
        title: '施工区域'
    }, {
        field: 'start',
        title: '施工起点'
    }, {
        field: 'end',
        title: '施工终点'
    }, {
        field: 'scale',
        title: '建设规模（公里）'
    }, {
        field: 'demandType',
        title: '施工类型',
    }
]
//基站类
var project_equipmentTable = [
    {
        field: '',
        title: '序号',
        formatter: function (a, b, c) {
            return c + 1
        }
    }, {
        field: 'demandCode',
        title: '需求编号'
    }, {
        field: 'demandName',
        title: '需求名称'
    }, {
        field: 'rangeArea',
        title: '施工区域'
    }, {
        field: 'major',
        title: '施工专业'
    }, {
        field: 'demandType',
        title: '施工类型'
    }, {
        field: 'locale',
        title: '建设地点'
    }, {
        field: 'projectLng',
        title: '经度'
    }, {
        field: 'projectLat',
        title: '纬度',
    }
]
//配置 需求列表参数 线路    添加 编辑工单
var line_listOfRequirements = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function () {
            return '<span class="checkBox" name="radio"></span>'
        }
    }, {
        field: 'demandCode',
        width: '200',
        title: '需求编号'
    }, {
        field: 'demandName',
        width: '200',
        title: '需求名称'
    }, {
        field: 'rangeArea',
        width: '200',
        title: '施工区域'
    }, {
        field: 'start',
        width: '200',
        title: '施工起点'
    }, {
        field: 'end',
        width: '200',
        title: '施工终点'
    }, {
        field: 'scale',
        width: '200',
        title: '建设规模（公里）'
    }, {
        field: 'demandType',
        width: '200',
        title: '施工类型',
    }
]
//配置 需求列表参数  基站  添加 编辑工单
var station_listOfRequirements = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function () {
            return '<span class="checkBox" name="radio"></span>'
        }
    }, {
        field: 'demandCode',
        width: '200',
        title: '需求编号'
    }, {
        field: 'demandName',
        width: '200',
        title: '需求名称'
    }, {
        field: 'rangeArea',
        width: '200',
        title: '施工区域'
    }, {
        field: 'major',
        width: '200',
        title: '施工专业'
    }, {
        field: 'demandType',
        width: '200',
        title: '施工类型'
    }, {
        field: 'locale',
        width: '200',
        title: '建设地点'
    }, {
        field: 'projectLng',
        width: '200',
        title: '经度'
    }, {
        field: 'projectLat',
        width: '200',
        title: '纬度',
    }
]
// 工单物料列表  添加 编辑工单
var workSheetMaterialCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        "class": '',
        width: '200'
    }, {
        field: 'matterName',
        title: '物料名称',
        "class": '',
        width: '200'
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '200'
    }, {
        field: 'matterUnit',
        title: '单位',
        "class": '',
        width: '100'
    }, {
        field: 'matterPrice',
        title: '单价(元)',
        "class": '',
        width: '100'
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '200'
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '200'
    }, {
        field: 'matterSupplier',
        title: '物料供应商',
        width: '200'
    }, {
        field: 'matterNum',
        title: '设计量',
        width: '100'
    }
]
// 工单物料详情
var workSheetMaterialDetailsCol = [
    {
        field: 'matterCode',
        title: '物料编号',
        "class": '',
        width: '200'
    }, {
        field: 'matterName',
        title: '物料名称',
        "class": '',
        width: '200'
    }, {
        field: 'matterSpec',
        title: '规格',
        width: '200'
    }, {
        field: 'matterUnit',
        title: '单位',
        "class": '',
        width: '100'
    }, {
        field: 'matterPrice',
        title: '单价(元)',
        "class": '',
        width: '100'
    }, {
        field: 'matterType',
        title: '物料类型',
        width: '200'
    }, {
        field: 'matterSource',
        title: '供方属性',
        width: '200'
    }, {
        field: 'matterSupplier',
        title: '物料供应商',
        width: '200'
    }, {
        field: 'matterNum',
        title: '设计量',
        width: '100'
    }, {
        field: 'useNum',
        title: '使用量',
        width: '100'
    }
]
//详情 文件下载
var fileColDetail = [
    {
        field: 'fileName',
        title: '文件名称',
        'class': ' tab_fileName',
        width: '900'
    }, {
        field: 'fileSize',
        title: '文件大小',
        width: '100',
        formatter: function (a, b) {
            return a || initFileSize(b.projectFileSize)
        }
    }, {
        title: '操作',
        'class': '',
        width: '100',
        formatter: function (a, b) {
            return '<a class="downLoadFile" download="download" href="">' + '下载' + '</a>'
        }
    }
]
//配置 施工管理  未拍工单
var constructionManagement_getTaskNoPage = [
    {
        field: 'taskCode',
        title: '工单编号',
        width: 150
    }, {
        field: 'taskName',
        title: '工单名称',
        width: 150
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 150
    }, {
        field: 'hours',
        title: '工单周期(天)',
        width: 100
    }, {
        field: 'userName',
        title: '施工队长',
        width: 100
    }, {
        field: 'createCompany',
        title: '创建单位',
        width: 150,
        'class': 'disUnit'
    }, {
        field: 'createUser',
        title: '创建人',
        width: 100
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 150,
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: '',
        title: '操作',
        width: 100,
        formatter: function () {
            return '<a data_power="Edit-work-order-operation" class="editTask">编辑</a><a data_power="Delete-work-order-operation" class="delTask">删除</a>'
        }
    }
]
//配置 施工管理  未接 已接 工单
var constructionManagement_getTaskSendPage = [
    task_icon,
    {
        field: 'taskCode',
        title: '工单编号',
        width: 100
    }, {
        field: 'taskName',
        title: '工单名称',
        width: 100
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 100
    }, {
        field: 'hours',
        title: '工单周期(天)',
        width: 100
    }, {
        field: 'userName',
        title: '施工队长',
        width: 100
    }, {
        field: 'createCompany',
        title: '创建单位',
        width: 100,
        'class': 'disUnit'
    }, {
        field: 'createUser',
        title: '创建人',
        width: 100
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 150,
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: '',
        title: '操作',
        width: 130,
        formatter: function () {
            return '<a data_power="Reminder-operation" class="reminder">催单</a><a data_power="Withdrawal-of-work-order-operation" class="cancelTask">撤单</a><a data_power="List-of-reminders" class="reminderRecord">催单记录</a>'
        }
    }
]
//配置 施工管理  施工 整改 完工 工单
var constructionManagement_getTaskConstructionInPage = [
    task_icon,
    {
        field: 'taskCode',
        title: '工单编号',
        width: 100
    }, {
        field: 'taskName',
        title: '工单名称',
        width: 100
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 100
    }, {
        field: 'hours',
        title: '工单周期(天)',
        width: 50
    }, {
        field: 'eCycle',
        title: '执行周期(天)',
        width: 50
    }, {
        field: 'userName',
        title: '施工队长',
        width: 100
    }, {
        field: 'createCompany',
        title: '创建单位',
        width: 100,
        'class': 'disUnit'
    }, {
        field: 'createUser',
        title: '创建人',
        width: 100
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 150,
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'taskStatus',
        title: '工单状态',
        width: 100
    }, {
        field: '',
        title: '操作',
        width: 200,
        formatter: function (a, b) {
            if (b.taskType == 1) {
                return '<a  data_power="Equipment-position" class="EquipmentPosition">施工轨迹</a><a data_power="Reminder-operation" class="reminder">催单</a><a data_power="List-of-reminders" class="reminderRecord">催单记录</a>'
            } else {
                return '<a data_power="Construction-track" class="DeviceLocation">设备位置</a><a data_power="Reminder-operation" class="reminder">催单</a><a data_power="List-of-reminders" class="reminderRecord">催单记录</a>'
            }
        }
    }
]
//配置 施工管理  我参与的  工单列表 工单
var constructionManagement_getTaskInvolvedPage = [
    task_icon,
    {
        field: 'taskCode',
        title: '工单编号',
        width: 100
    }, {
        field: 'taskName',
        title: '工单名称',
        width: 100
    }, {
        field: 'projectName',
        title: '项目名称',
        width: 100
    }, {
        field: 'hours',
        title: '工单周期(天)',
        width: 100
    }, {
        field: 'eCycle',
        title: '执行周期(天)',
        width: 100
    }, {
        field: 'userName',
        title: '施工队长',
        width: 100
    }, {
        field: 'createCompany',
        title: '创建单位',
        width: 100,
        'class': 'disUnit'
    }, {
        field: 'createUser',
        title: '创建人',
        width: 100
    }, {
        field: 'createTime',
        title: '创建时间',
        width: 150,
        formatter: function (a) {
            return initDate(a, 's')
        }
    }, {
        field: 'taskStatus',
        title: '工单状态',
        width: 100
    }, {
        field: '',
        title: '操作',
        width: 200,
        formatter: function (a, b) {
            if (b.taskType == 1) {
                return '<a data_power="" class="">施工轨迹</a>'
            } else {
                return '<a data_power="" class="DeviceLocation">设备位置</a>'
            }
        }
    }
]
//隐藏工作量 ---> 当天工作量
var workLog_hideListCol = [
    {
        field: 'hideName',
        title: '名称',
        width: 600
    }, {
        field: 'hideUnit',
        title: '单位',
        width: 200
    }, {
        field: 'hideNum',
        title: '工作量',
        width: 100
    }
]
//工单操作记录
var TaskRecord_ListCol = [
    {
        field: 'itemName',
        title: '操作事项',
        width: 600
    }, {
        field: 'applyName',
        title: '操作人',
        width: 200
    }, {
        field: 'applyTime',
        title: '操作时间',
        width: 200,
        formatter: function (a, b) {
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '事项状态',
        width: 100,
        formatter: function (a, b) {
            // log(b.itemCode) //itemCode  
            var obj1 = {
                3: '审核中',
                4: '驳回',
                5: '通过',
                6: '转派成功'
            }
            return obj1[a]
        }
    }
]
//工单催单记录
var reminderRecord_ListCol = [
    {
        field: 'content',
        title: '催单内容',
        width: 600
    }, {
        field: 'trueName',
        title: '催单人',
        width: 200
    }, {
        field: 'userName',
        title: '被催单人',
        width: 200
    }, {
        field: 'createTime',
        title: '催单时间',
        width: 200,
        formatter: function (a, b) {
            return initDate(a, 's')
        }
    }
]
// 工单操作详情 ==> 审核详情
var taskFormAudit_listCol = [
    {
        field: 'auditName',
        title: '审核人',
        width: 100
    }, {
        field: 'auditTime',
        title: '审核时间',
        width: 200,
        formatter: function (a, b) {
            if (b.status == 3) return '暂无'
            return initDate(a, 's')
        }
    }, {
        field: 'status',
        title: '审核结果',
        width: 100,
        formatter: function (a) {
            var obj = {
                '3': '暂无',
                '4': '驳回',
                '5': '通过'
            }
            return obj[a]
        }
    }, {
        field: 'auditRemark',
        title: '审核意见',
        width: 500,
        formatter: function (a, b) {
            if (b.status == 3) return '暂无'
            return a
        }
    }
]
// 工单操作详情 ==> 审核详情
var PaymentApplication_listCol = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function () {
            return '<span class="checkBoxLocking" ></span>'
        }
    }, {
        field: 'invoiceNo',
        title: '发票号',
        width: 600
    }, {
        field: 'invoiceAmount',
        title: '发票金额',
        width: 200
    }, {
        field: 'nowAmount',
        title: '可付款金额(元)',
        width: 200
    }
]

var PaymentApplication_listCol1 = [
    {
        field: '',
        title: '',
        "class": '',
        width: '30',
        formatter: function (a, b) {
            if (b.applyInvoiceId > 0) return '<span class="checkBoxTrue" ></span>'
            return '<span class="checkBoxLocking" ></span>'
        }
    }, {
        field: 'invoiceNo',
        title: '发票号',
        width: 600
    }, {
        field: 'invoiceAmount',
        title: '发票金额',
        width: 200
    }, {
        field: 'totalNowAmount',
        title: '可付款金额(元)',
        width: 200
    }
]

var PaymentApplication_listCol2 = [
    {
        field: 'invoiceNo',
        title: '发票号',
        width: 600
    }, {
        field: 'invoiceAmountData',
        title: '发票金额',
        width: 200
    }, {
        field: 'invoiceAmount',
        title: '付款金额(元)',
        width: 200
    }
]
//各类审核记录详情
var audit_list_Log = [
    {
        field: 'auditName',
        title: '审核人',
        width: 100
    }, {
        field: 'auditTime',
        title: '审核时间',
        width: 200,
        formatter: function (a) {
            return initDate(a, 's') || '暂无'
        }
    }, {
        field: 'status',
        title: '审核结果',
        width: 100,
        formatter: function (a) {
            return a == 5 ? '通过' : (a == '4' ? '驳回' : '暂无')
        }
    }, {
        field: 'auditRemark',
        title: '审核意见',
        width: 500,
        formatter: function (a) {
            return '<sapn class="overf_Ec" style="display:inline-block; max-width:600px;">' + (a || '暂无') + '</sapn>'
        }
    }
]


//概预算项目类----------------------------------------------------------------

//表一
var tableOneColumns = [
    [   //一级表头
        {
            title: '序号',
            field: 'idx',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0) return c
                return b.idx
            }
        }, {
            title: '表格序号',
            field: 'no',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b.Other) {
                    return '<span class="tableOneTableOther">' + a + '</span>'
                }
                return a
            }
        }, {
            title: '费用名称',
            field: 'name',
            width: 140,
            colspan: 1,
            rowspan: 2
        }, {
            title: '小型建筑工</br>程费',
            field: 'no_txt',
            colspan: 1,
            rowspan: 1,
            width: 100
        }, {
            title: '需要安装的</br>设备费',
            field: 'needDevice',
            colspan: 1,
            rowspan: 1,
            width: 110
        }, {
            title: '不需要安装</br>的设备工器具费',
            field: 'noNeedDevice',
            colspan: 1,
            rowspan: 1,
            width: 100
        }, {
            title: '建筑安装工</br>程费',
            field: 'architectureSub',
            colspan: 1,
            rowspan: 1,
            width: 110
        }, {
            title: '工程建设其</br>他费',
            field: 'no_txt2',
            colspan: 1,
            rowspan: 1,
            width: 110,
            formatter: function (a, b, c) {

                if (c > 0) {
                    if (!isNaN(b.otherSub)) return b.otherSub || 0
                }
                return b['no_txt2']
            }
        }, {
            title: '预备费',
            field: 'no_txt3',
            colspan: 1,
            rowspan: 1,
            width: 110,
            formatter: function (a, b, c) {
                if (c > 0) {
                    return a
                }
                return b['no_txt3']
            }
        }, {
            title: '总价值（元）',
            field: '',
            colspan: 4,
            rowspan: 1,
            align: "center"
        }
    ], [
        {
            field: '',
            title: '元',
            colspan: 6,
            rowspan: 1,
            align: "center",
            formatter: function (a) {
                return a;
            }
        }, {
            title: '除税价',
            field: 'architectureSubCount',
            colspan: 1,
            rowspan: 1,
            width: 150,
            formatter: function (a, b, c) {
                if (!isNaN(b.otherSub)) return b.otherSub || 0
                else if (!isNaN(b.sumSub)) return b.sumSub || 0
                else if (!isNaN(b.constructFee)) return b.constructFee || 0
                return a
            }
        }, {
            title: '增值税',
            field: 'architectureAddCount',
            colspan: 1,
            rowspan: 1,
            width: 150,
            formatter: function (a, b, c) {
                if (!isNaN(b['otherAdd'])) return b['otherAdd'] || 0
                else if (!isNaN(b.sumAdd)) return b.sumAdd || 0
                else if (!isNaN(b.otherSub)) return b.otherSub || 0
                return a
            }
        }, {
            title: '含税价',
            field: 'architectureContainCount',
            colspan: 1,
            rowspan: 1,
            width: 150,
            formatter: function (a, b, c) {
                if (!isNaN(b.otherContain)) return b.otherContain || 0
                else if (!isNaN(b.sumContain)) return b.sumContain || 0
                else if (!isNaN(b.contractFee)) return b.contractFee || 0
                return a
            }
        }, {
            title: '其中:外币',
            field: 'no_txt4',
            colspan: 1,
            rowspan: 1,
            width: 30,
            'class': "footerActive_dis"
        }
    ]  //二级表头
]
//表二
var tableTwoColumns = [
    {
        field: 'no',
        title: '序号'
    }, {
        field: 'name',
        title: '费用名称',
        width: 200,
        formatter: function (a, b, c) {
            return a
        }
    }, {
        field: 'attr',
        title: '依据和计算方法',
        formatter: function (a, b, c) {
            return a
        }
    }, {
        field: 'amount',
        title: '合计（元）',
        'class': "editTablePar",
        width: 200,
        formatter: function (a, b, c) {
            // log(a)
            if (c > 0 && b.isEdit && !window.quotaDetails) {
                var str = '<input class=" money" value="' + a + '" readonly maxLength="13" />' +
                    '<span class="editTablePn"></span>' +
                    '<span class="confirmTablePn"></span>'
                if (!b['noDD']) str += '<div class="titBox"><span style="z - index: 1;position: relative;">系统计算值</span>' +
                    '<img src="/img/titBoxPn.png">' +
                    '<span style="display: inline-block; position: relative; top: -27px;">' + b['amountTit'] + ' 元</span>'
                '</div>'
                return str
            }
            return a
        }
    }
]
//表三甲
var tableThreeColumnsA = [
    [   //一级表头
        {
            title: '',
            field: '',
            width: 30,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (!b.w && c > 0 && !window.quotaDetails) return '<span class="delTablePn"></span>'
                else if (b.w) {
                    return '<span class="tableThreeTableOther">' + b.w + '</span>'
                } else return ""
            }
        }, {
            title: '序号',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0) return c
                return b.o
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 117,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (a) return a
                else if (b.status == "newAdd")
                    return '<input placeholder="请输入定额编号" class="QuotaNo" value="" style="    width: 100px;">'
                else if (b.quotaProject) return b.quotaProject.no
            }
        }, {
            title: '项目名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b.quotaProject) return b.quotaProject.name
                return a
            }
        }, {
            title: '建设类型',
            field: 'buildType',
            colspan: 1,
            rowspan: 2,
            width: 150,
            "class": "selectD",
            formatter: function (a, b, c) {
                if (c > 0) {
                    var status = a || "1"
                    var statusObj = {
                        '1': "新建",
                        '2': "扩建",
                        '3': "拆除",
                        '4': "入库拆除",
                        '5': "不入库拆除"
                    }
                    if (!window.quotaDetails) return '<div id="constStatus' + c + '" class="downSelect" style="width: 150px;">' +
                        '<span class=" downSet  overf_E " index="' + status + '" fl_val="" title="' + statusObj[status] + '" > ' + statusObj[status] + '</span>' +
                        '<ul>' +
                        '<li class="overf_E ' + (status != "1" || "activeSelect") + '" index="1" title="新建">新建</li>' +
                        '<li class="overf_E ' + (status != "2" || "activeSelect") + '" index="2" title="扩建">扩建</li>' +
                        '<li class="overf_E ' + (status != "3" || "activeSelect") + '" index="3" title="拆除">拆除</li>' +
                        '<li class="overf_E ' + (status != "4" || "activeSelect") + '" index="4" title="入库拆除">入库拆除</li>' +
                        '<li class="overf_E ' + (status != "5" || "activeSelect") + '" index="5" title="不入库拆除">不入库拆除</li>' +
                        '</ul>' +
                        '</div > '
                    else return statusObj[status]
                } return a
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            rowspan: 2
        }, {
            title: '数量',
            field: 'num',
            colspan: 1,
            rowspan: 2,
            width: 120,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = a || ""
                    if (!window.quotaDetails) return '<input style="    width: 100px;"  placeholder="请输入数量" class="editNum money" value="' + str + '">'
                    return str
                } return a
            }
        }, {
            title: '单位定额值（工日）',
            align: "center",
            colspan: 2,
            rowspan: 1
        }, {
            title: '合计值（工日）',
            align: "center",
            colspan: 2,
            rowspan: 1
        }
    ],
    [
        {
            title: '技工',
            field: 'mechanic',
            colspan: 1,
            rowspan: 1,
            width: 130,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        var mechanic = b['mechanic'] || b['mechanicNum']
                        var returnb;
                        if (buildTypeObj[b.buildType]) {
                            if (b['quotaProject']) {
                                returnb = accMul(b['quotaProject']['mechanic'], b['quotaProject'][buildTypeObj[b.buildType]]) || 0
                                // log((b['quotaProject']['mechanic'] * b['quotaProject'][buildTypeObj[b.buildType]].toFixed(2)).toFixed(2))
                                // log()
                            } else {
                                returnb = accMul(mechanic, b[buildTypeObj[b.buildType]]) || 0
                            }
                        } else if (b.buildType == 2 && proDataThree['kuojian']) {
                            if (b['quotaProject']) {
                                returnb = accMul(b['quotaProject']['mechanic'], proDataThree['kuojian']) || 0
                            } else returnb = accMul(mechanic, proDataThree['kuojian']) || 0
                        } else if (b.buildType == 1) {
                            returnb = mechanic || a || 0
                        }
                        returnb = returnb.toFixed(2)
                        if (returnb) return returnb
                        else return ""
                    }
                } return a
            }
        }, {
            title: '普工',
            field: 'generalWorker',
            colspan: 1,
            rowspan: 1,
            width: 130,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        var returnb = 0;
                        var generalWorker = b['generalWorker'] || b['generalNum']
                        if (buildTypeObj[b.buildType]) {
                            if (b['quotaProject']) {
                                returnb = accMul(b['quotaProject']['generalWorker'], b['quotaProject'][buildTypeObj[b.buildType]]) || 0
                            } else {
                                returnb = accMul(generalWorker, b[buildTypeObj[b.buildType]]) || 0
                            }
                        } else if (b.buildType == 2 && proDataThree['kuojian']) {

                            if (b['quotaProject']) {
                                returnb = accMul(b['quotaProject']['generalWorker'], proDataThree['kuojian']) || 0
                            } else {
                                returnb = accMul(generalWorker, proDataThree['kuojian']) || 0
                            }
                        } else if (b.buildType == 1) {
                            returnb = generalWorker || a || 0
                        }
                        returnb = returnb.toFixed(2)
                        if (returnb) return returnb
                        else return ""
                    }
                } return a
            }
        }, {
            title: '技工',
            field: 'mechanicTotal',
            colspan: 1,
            rowspan: 1,
            width: 130,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        var returnb;
                        var mechanic = b['mechanic'] || b['mechanicNum']
                        if (buildTypeObj[b.buildType]) {
                            if (b['quotaProject']) {
                                var onoe = accMul(b['quotaProject']['mechanic'], b['quotaProject'][buildTypeObj[b.buildType]])
                                returnb = accMul(onoe, b.num) || ""
                            } else {
                                var onoe = accMul(mechanic, b[buildTypeObj[b.buildType]])
                                returnb = accMul(onoe, b.num) || ""
                            }

                        } else if (b.buildType == 2 && proDataThree['kuojian']) {
                            if (b['quotaProject']) {
                                var onoe = accMul(b['quotaProject']['mechanic'], proDataThree['kuojian'])
                                returnb = accMul(onoe, b.num) || ""

                            } else {
                                var onoe = accMul(mechanic, proDataThree['kuojian'])
                                returnb = accMul(onoe, b.num) || ""
                            }
                        } else if (b.buildType == 1) {
                            if (b['quotaProject']) returnb = accMul(b.num, mechanic) || ""
                            else returnb = accMul(b.num, mechanic) || ""
                        }
                        if (returnb) return returnb.toFixed(2)
                        else return "0.00"
                    }

                } return a
            }
        }, {
            title: '普工',
            field: 'generalTotal',
            colspan: 1,
            rowspan: 1,
            width: 130,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b.buildType) {
                        var returnb;
                        var generalWorker = b['generalWorker'] || b['generalNum']
                        if (buildTypeObj[b.buildType]) {
                            if (b['quotaProject']) {
                                var onoe = accMul(b['quotaProject']['generalWorker'], b['quotaProject'][buildTypeObj[b.buildType]])
                                returnb = accMul(onoe, b.num) || ""
                            } else {
                                var onoe = accMul(generalWorker, b[buildTypeObj[b.buildType]])
                                returnb = accMul(onoe, b.num) || ""
                            }
                        }
                        else if (b.buildType == 2 && proDataThree['kuojian']) {
                            if (b['quotaProject']) {
                                var onoe = accMul(b['quotaProject']['generalWorker'], proDataThree['kuojian'])
                                returnb = accMul(b.num, onoe) || ""

                            } else {
                                var onoe = accMul(generalWorker, proDataThree['kuojian'])
                                returnb = accMul(b.num, onoe) || ""

                            }
                        } else if (b.buildType == 1) {
                            if (b['quotaProject']) returnb = accMul(b.num, generalWorker) || ""
                            else returnb = accMul(b.num, b['generalWorker']) || ""
                        }
                        if (returnb) return returnb.toFixed(2)
                        else return "0.00"
                    }
                } return a
            }
        }
    ]  //二级表头
]
//表三乙
var tableThreeColumnsB = [
    [   //一级表头
        {
            title: '序号',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (!b.w && c > 0) return c
                else if (b.w) {
                    return '<span class="tableThreeTableOther">' + b.w + '</span>'
                } else {
                    return b.o
                }
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 100,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['no']
                else return a
            }
        }, {
            title: '项目名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['name']
                else return a
            }
        }, {
            title: '建设类型',
            field: 'buildType',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                var statusObj = {
                    '1': "新建",
                    '2': "扩建",
                    '3': "拆除",
                    '4': "入库拆除",
                    '5': "不入库拆除"
                }

                if (c > 0) return statusObj[a]
                return a
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            rowspan: 2
        }, {
            title: '数量',
            field: 'quotaNum',
            colspan: 1,
            rowspan: 2,
            width: 135,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = !isNaN(a) ? a : ""
                    if (!window.quotaDetails) return '<input style="width:100px;" placeholder="请输入数量" class="editNum money" readonly maxLength="13" value="' + str + '">' +
                        '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                    return str
                } return a
            }
        }, {
            title: '机械名称',
            field: 'nameMechanics',
            colspan: 1,
            rowspan: 2
        }, {
            title: '单位定额值',
            // field: 'f',
            align: "priceMechanics",
            colspan: 2,
            rowspan: 1
        }, {
            title: '合计值（工日）',
            // field: 'g',
            align: "center",
            colspan: 2,
            rowspan: 1
        }
    ],
    [
        {
            title: '数量（台班）',
            field: 'numRate',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                log(a)
                if (c > 0) {

                    // if (tableThreeBBuildTypeObj[b.buildType]) {
                    //     // log(b['quotaProject'][tableThreeBBuildTypeObj[b.buildType]],a)
                    //     b.totalA = (b['quotaNum'] * b['quotaProject'][tableThreeBBuildTypeObj[b.buildType]] || 0).toFixed(2)
                    // } else if (b.buildType == 2 && proDataThreeB['kuojian']) {
                    //     b.totalA = (b['quotaNum'] * proDataThreeB['kuojian'] || 0).toFixed(2)
                    // } else {
                    b.totalA = a || "0.00"
                    // }
                    return b.totalA
                }
                return a
            }
        }, {
            title: '单价（元）',
            field: 'priceMechanics',
            colspan: 1,
            rowspan: 1,
            width: 100,
        }, {
            title: '数量（台班）',
            field: 'num',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b['w']) {
                        return numAll.toFixed(2)
                    } else {
                        b.totalB = (accMul(b['quotaNum'], b['totalA']) || 0).toFixed(2)
                        numAll += parseFloat(b.totalB)
                    }

                    return b.totalB
                }
                return a
            }
        }, {
            title: '合价（元）',
            field: 'price',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c, d) {
                if (c > 0) {

                    if (!b.w) {
                        b.totalC = (accMul(b['priceMechanics'], b['totalB']) || 0).toFixed(2)
                        priceAll += parseFloat(b.totalC)
                        return b.totalC
                    } else {
                        return priceAll.toFixed(2)
                    }
                } return a
            }
        }
    ]  //二级表头
]
//表三丙
var tableThreeColumnsC = [
    [   //一级表头
        {
            title: '序号',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (!b.w && c > 0) return c
                else if (b.w) {
                    return '<span class="tableThreeTableOther">' + b.w + '</span>'
                } else {
                    return b.o
                }
            }
        }, {
            title: '定额编号',
            field: 'no',
            width: 100,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['no']
                else return a
            }
        }, {
            title: '项目名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (b['quotaProject']) return b['quotaProject']['name']
                else return a
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            rowspan: 2
        }, {
            title: '数量',
            field: 'quotaNum',
            colspan: 1,
            rowspan: 2,
            width: 135,
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = !isNaN(a) ? a : ""
                    if (!window.quotaDetails) return '<input style="width:100px;" placeholder="请输入数量" class="editNum money" readonly maxLength="13" value="' + str + '">' +
                        '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                    return str
                } return a
            }
        }, {
            title: '仪表名称',
            field: 'nameMeter',
            colspan: 1,
            rowspan: 2,
            width: 200,
        }, {
            title: '单位定额值',
            // field: 'f',
            align: "priceMechanics",
            colspan: 2,
            rowspan: 1
        }, {
            title: '合计值（工日）',
            // field: 'g',
            align: "center",
            colspan: 2,
            rowspan: 1
        }
    ],
    [
        {
            title: '数量（台班）',
            field: 'numRate',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '单价（元）',
            field: 'priceMeter',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '数量（台班）',
            field: 'num',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (b['w']) {
                        return numAll.toFixed(2)
                    } else {
                        b.totalB = (accMul(b['quotaNum'], b['numRate']) || 0).toFixed(2)
                        numAll += parseFloat(b.totalB)
                    }
                    return b.totalB
                }
                return a

            }
        }, {
            title: '合价（元）',
            field: 'price',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c, d) {
                if (c > 0) {

                    if (!b.w) {
                        b.totalC = (accMul(b['priceMeter'], b['totalB']) || 0).toFixed(2)
                        priceAllC += parseFloat(b.totalC)
                        return b.totalC
                    } else {
                        return priceAllC.toFixed(2)
                    }
                } return a
            }
        }
    ]  //二级表头
]
//表四甲
var tableFourColumnsA = [
    [   //一级表头
        {
            title: '',
            field: 'a',
            width: 40,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c == 0) return a
                if (b.noFlag == 1 || b.noFlag == 2) return '<span class="tableFourTableAOther">' + b.typrName + '</span>'
                if (!window.quotaDetails) return "<span class='checkBox'></span>"
                return ""
            }
        }, {
            title: '序号',
            field: 'a',
            width: 50,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0) return c
                return b.b
            }
        }, {
            title: '设备名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit" title="' + a + '">' + initText(a, 10) + '</span>'
            }
        }, {
            title: '规格程式',
            field: 'specFormat',
            colspan: 1,
            rowspan: 2,
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit"title="' + a + '">' + initText(a, 10) + '</span>'
            }
        }, {
            title: '单位',
            field: 'meterageName',
            colspan: 1,
            width: 100,
            rowspan: 2
        }, {
            title: '数量',
            field: 'num',
            colspan: 1,
            width: 100,
            rowspan: 2
        }, {
            title: '单价（元）',
            colspan: 1,
            rowspan: 1
        }, {
            title: '合计（元）',
            align: "center",
            colspan: 3,
            rowspan: 1
        }, {
            title: '备注',
            field: 'remark',
            colspan: 1,
            align: "center",
            rowspan: 2,
            width: 100,
            'class': "footerActive_dis",
            formatter: function (a) {
                if (!a) return ''
                return a//'<span class="tit" title="' + a + '">' + initText(a, 10) + '</span>'
            }
        }
    ],
    [
        {
            title: '除税价',
            field: 'price',
            colspan: 1,
            rowspan: 1,
            width: 100,
        }, {
            title: '除税价',
            field: 'subtractTax',
            colspan: 1,
            rowspan: 1,
            width: 135,
            formatter: function (a, b, c) {
                if (b.noFlag == 2 && !window.quotaDetails) return '<input class="money subtractTaxInputFourA" style="width: 100px" readonly maxLength="13" value="' + a + '" /> <span class="editTablePn"></span><span class="confirmTablePn subtractTaxConfirm"></span>'
                else return a
            }
        }, {
            title: '增值税',
            field: 'addTax',
            colspan: 1,
            width: 100,
            rowspan: 1
        }, {
            title: '含税价',
            field: 'containTax',
            colspan: 1,
            width: 100,
            rowspan: 1
        }
    ]  //二级表头
]
//表四乙 丙
var tableFourColumnsB_C = [
    [   //一级表头
        {
            title: '',
            field: '',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (b.type == 'computeType') {
                    return '<span class="tableFourBTableOther">' + b.name + '</span>'
                } else if (c > 0) {
                    if (!window.quotaDetails) return '<span class="checkBox"></span>'
                    else return ""

                }
                return b.a
            }
        }, {
            title: '序号',
            field: 'a',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                if (c > 0) return b['idx']
                return b.b
            }
        }, {
            title: '定额编号',
            field: 'no',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0 && b['quotaProject']) return b['quotaProject']['no']
                return b.c
            }
        }, {
            title: '名称',
            field: 'a',
            colspan: 1,
            rowspan: 2,
            // width: 150,
            formatter: function (a, b, c) {
                if (c > 0 && b['material']) return b['material']['name'] || "" //'<span title="' + b['material']['name'] + '">' + initText(b['material']['name'] || "", 5) + '</span>'
                return b.d
            }
        }, {
            title: '规格程式',
            field: 'b',
            colspan: 1,
            rowspan: 2,
            width: 120,
            formatter: function (a, b, c) {
                if (c > 0 && b['material']) return b['material']['specFormat']//'<span title="' + b['material']['specFormat'] + '">' + initText(b['material']['specFormat'] || "", 5) + '</span>'
                return b.e
            }
        }, {
            title: '单位',
            field: 'd',
            colspan: 1,
            rowspan: 2,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) return b['meterageName']
                return b.f
            }
        }, {
            title: '数量',
            field: 'e',
            colspan: 1,
            rowspan: 2,
            width: 135,
            'class': 'editNum',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['num'] || "0.00"
                    if (!window.quotaDetails) return '<input style="width:100px;" placeholder="请输入数量" class="money" readonly maxLength="13" value="' + str + '">' +
                        '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                    return str
                }
                return b.g
            }
        }, {
            title: '单价（元）',
            field: 'e',
            colspan: 1,
            rowspan: 1
        }, {
            title: '合计（元）',
            align: "center",
            colspan: 3,
            rowspan: 1
        }, {
            title: '备注',
            colspan: 1,
            align: "center",
            rowspan: 2,
            width: 135,
            'class': 'editRemark',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['remark'] || ""
                    if (b.type != 'computeType' && !window.quotaDetails) return '<input style="width:100px;" title="' + str + '" placeholder="请输入备注" class="remark" readonly maxLength="20" value="' + str + '">' +
                        '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                    return ""
                }
                return b.l
            }
        }
    ], [
        {
            title: '除税价',
            field: 'k',
            colspan: 1,
            rowspan: 1,
            width: 135,
            'class': 'editPrice',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = b['price'] || "0.00"
                    if (b.type != 'computeType' && !window.quotaDetails) return '<input style="width:100px;" placeholder="请输入单价" class=" money" readonly maxLength="13" value="' + str + '">' +
                        '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                }
                return b.h
            }
        }, {
            title: '除税价',
            field: 'l',
            colspan: 1,
            rowspan: 1,
            width: 135,
            'class': 'editNumService',
            formatter: function (a, b, c) {
                if (c > 0) {
                    var str = (accMul(b['num'], b['price']) || 0).toFixed(2)

                    if (b.type != 'computeType') {
                        subtotal += parseFloat(str)
                        mainMaterialRateNum = (accMul(mainMaterialRate[diRate[b['material']['type']]], subtotal) / 100 || 0).toFixed(2)
                        // log(mainMaterialRate[diRate[b['material']['type']]])
                        b['lis_One'] = str
                        return str
                    }
                    else if (b.computeType == 'subtotal') {
                        b.subtotal = subtotal

                        return b.subtotal.toFixed(2)
                    } else if (b.computeType == 'rate') {

                        b.rate = mainMaterialRateNum
                        return b.rate
                    } else if (b.computeType == 'Insurance') {
                        b.Insurance = (accMul(secureRate, subtotal) / 100 || 0).toFixed(2)
                        return b.Insurance
                    } else if (b.computeType == 'safekeeping') {
                        b.safekeeping = (accMul(purchaseRate, subtotal) / 100 || 0).toFixed(2)
                        return b.safekeeping
                    } else if (b.computeType == 'Service') {
                        b.Service = parseFloat(b.val || 0).toFixed(2)
                        // fuwuFeeNum = b.Service
                        tableFourTableBData[c + 1]['serviceNum'] = b.Service
                        if (!window.quotaDetails) return '<input placeholder="请输入数量" style="width:100px;" class=" money" readonly maxLength="13" value="' + b.Service + '">' +
                            '<span class="editTablePn"></span><span class="confirmTablePn"></span>'
                        return b.Service
                    } else if (b.computeType == 'amount') {
                        var amount = (parseFloat(subtotal.toFixed(2)) +
                            parseFloat(mainMaterialRateNum) +
                            parseFloat((accMul(secureRate, subtotal) / 100 || 0).toFixed(2)) +
                            parseFloat((accMul(purchaseRate, subtotal) / 100 || 0).toFixed(2)) +
                            parseFloat(b['serviceNum'] || 0) || 0).toFixed(2)
                        subtotal = 0
                        mainMaterialRateNum = 0
                        DetaxAmonutAll += parseFloat(amount)
                        b.amount = amount
                        return b.amount
                    } else if (b.computeType == 'all') {
                        b.all = DetaxAmonutAll.toFixed(2)
                        return b.all
                    }
                }
                return b.r
            }
        }, {
            title: '增值税',
            field: 'm',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (isSIb) return ""
                    if (b.type != 'computeType') {
                        b['z_list_One'] = nailRate ? (accMul(b['lis_One'], nailRate) / 100 || 0).toFixed(2) : "0.00"
                        return b['z_list_One']
                    } else {
                        b['z_' + b.computeType] = nailRate ? (accMul(b[b.computeType], nailRate) / 100 || 0).toFixed(2) : "0.00"
                        return b['z_' + b.computeType]
                    }
                }
                return b.j
            }
        }, {
            title: '含税价',
            field: 'n',
            colspan: 1,
            rowspan: 1,
            width: 100,
            formatter: function (a, b, c) {
                if (c > 0) {
                    if (isSIb) return ""
                    if (b.type != 'computeType') {
                        return (parseFloat(b['z_list_One']) + parseFloat(b['lis_One']) || 0).toFixed(2)
                    } else {
                        return (parseFloat(b['z_' + b.computeType]) + parseFloat(b[b.computeType]) || 0).toFixed(2)
                    }
                }
                return b.k
            }
        }
    ]  //二级表头
]
// 表五
var tableFiveColumns = [
    [   //一级表头
        {
            title: '序号',
            field: 'no',
            width: 60,
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b, c) {
                // log(a)
                if (c > 0) {
                    if (a) return '<span class="tableFiveTableOther">' + a + '</span>'
                    return c
                }
                return a
            }
        }, {
            title: '费用名称',
            field: 'name',
            colspan: 1,
            rowspan: 2,
            formatter: function (a, b) {
                if (a) return a
            }
        }, {
            title: '计算依据及方法',
            field: 'attr',
            colspan: 1,
            rowspan: 2,
        }, {
            title: '合计（元）',
            // field: 'g',
            align: "center",
            colspan: 3,
            rowspan: 1
        }, {
            title: '备注',
            field: 'remark_val',
            colspan: 1,
            align: "center",
            rowspan: 2,
            width: 300,
            formatter: function (a, b, c) {
                a = a || ""
                if (c > 0) {
                    if (!b.no) {
                        if (!window.quotaDetails) return '<input placeholder="请输入备注" class="" readonly maxLength="20" value="' + a + '">' +
                            '<span class="editTablePn"></span><span index="2" class="confirmTablePn"></span>'
                        return a
                    }
                }
            }
        }
    ],
    [
        {
            title: '除税价',
            field: 'price',
            colspan: 1,
            rowspan: 1,
            width: 200,
            formatter: function (a, b, c) {
                a = a || ""
                if (c > 0 && b.t_name && c < 8 && !window.quotaDetails) return '<input placeholder="请输入单价" class="money" readonly maxLength="13" value="' + a + '">' +
                    '<span class="editTablePn"></span><span index="1" class="confirmTablePn"></span>'
                return a
            }
        }, {
            title: '增值税',
            field: 'price_B',
            colspan: 1,
            rowspan: 1
        }, {
            title: '含税价',
            field: 'all',
            colspan: 1,
            rowspan: 1
        }
    ]  //二级表头
]
