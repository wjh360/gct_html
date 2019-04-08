

//表二---------------------------------------------------------------------------------------------------------------------------------


function getEchoTableTwo() {
    $http({
        url: "/gct-web/tableThreeNail/tableTwo",
        data: {
            budgetId: budgetId,
        },
        success: function (r) {
            reformData(r.data)
        }
    })
}




function reformData(data) {
    var arrObj = {
        architectureContain: {
            no: "",
            name: "建筑安装工程费(含税价)",
            attr: "一至四之和",
            amount: ""
        },
        architectureSub: {
            no: "",
            name: "建筑安装工程费(除税价)",
            attr: "一 + 二 + 三 - 甲供主材（除税价）",
            amount: ""
        },
        directFee: {
            no: "一",
            name: "直接费",
            attr: "（一）至（二）之和",
            amount: ""
        },
        directProjectFee: {
            no: "(一)",
            name: "直接费工程费",
            attr: "1~4之和",
            amount: ""
        },
        personFee: {
            no: "1",
            name: "人工费",
            attr: "技工费 + 普工费",
            amount: ""
        },
        mechanicFee: {
            no: "[1]",
            name: "技工费",
            attr: "技工工日×" + data.mechanicRate,
            amount: ""
        },
        generalFee: {
            no: "[2]",
            name: "普工费",
            attr: "普工工日×" + data.generalRate,
            amount: ""
        },
        materialFee: {
            no: "2",
            name: "材料费",
            attr: "主材费 + 辅材费",
            amount: ""
        },
        mainMaterialFee: {
            no: "[1]",
            name: "主要材料费",
            attr: "国内主材费",
            amount: ""
        },
        assistMaterialFee: {
            no: "[2]",
            name: "辅助材料费",
            attr: "国内主材费×" + data.assistMaterialRate + "%",
            amount: ""
        },
        mechanicsTotal: {
            no: "3",
            name: "机械使用费",
            attr: "见表三乙",
            amount: "",
            isEdit: true,
            flag: 1
        },
        meterTotal: {
            no: "4",
            name: "仪器仪表费",
            attr: "见表三丙",
            amount: "",
            isEdit: true,
            flag: 2
        },
        measuresFee: {
            no: "(二)",
            name: "措施费",
            attr: "1~15之和",
            amount: ""
        },
        civilizedConstructFee: {
            no: "1",
            name: "文明施工费",
            attr: "人工费×" + data.civilizedConstructRate + " %",
            amount: "",
            isEdit: true,
            flag: 3
        },
        siteEquipmentFee: {
            no: "2",
            name: "工地器材搬运费",
            attr: "人工费×" + data.siteEquipmentRate + " %",
            amount: "",
            isEdit: true,
            flag: 4
        },
        interfereFee: {
            no: "3",
            name: "工程干扰费",
            attr: "人工费×" + data.interfereRate + " %",
            amount: "",
            isEdit: true,
            flag: 5
        },
        siteCleanFee: {
            no: "4",
            name: "工程点交、场地清理费",
            attr: "人工费×" + data.siteCleanRate + " %",
            amount: "",
            isEdit: true,
            flag: 6
        },
        interimFee: {
            no: "5",
            name: "临时设施费",
            attr: "人工费×" + data.interimRate + " %",
            amount: "",
            isEdit: true,
            flag: 7
        },
        carFee: {
            no: "6",
            name: "工程车辆使用费",
            attr: "人工费×" + data.carRate + " %",
            amount: "",
            isEdit: true,
            flag: 8
        },
        nightFee: {
            no: "7",
            name: "夜间施工增加费",
            attr: "人工费×" + data.nightRate + " %",
            amount: "",
            isEdit: true,
            flag: 9
        },
        winterRainyFee: {
            no: "8",
            name: "冬雨季施工增加费",
            attr: "人工费×" + data.winterRainyRateOut + " %",
            amount: "",
            isEdit: true,
            flag: 10
        },
        toolProductFee: {
            no: "9",
            name: "生产工具用具使用费",
            attr: "人工费×" + data.toolProductRate + " %",
            amount: "",
            isEdit: true,
            flag: 11
        },
        hydropowerFee: {
            no: "10",
            name: "施工用水电蒸汽费",
            attr: "按实计列",
            amount: "",
            isEdit: true,
            flag: 12
        },
        specialAreaFee: {
            no: "11",
            name: "特殊地区施工增加费",
            attr: data.specialAreaRate + "×总工日",
            amount: "",
            isEdit: true,
            flag: 13
        },
        finishProtectFee: {
            no: "12",
            name: "已完工程及设备保护费",
            attr: "人工费×" + data.finishProtectRateOut + " %",
            amount: "",
            isEdit: true,
            flag: 14
        },
        earthMoveFee: {
            no: "13",
            name: "运土费",
            attr: "按实计列",
            amount: "",
            isEdit: true,
            flag: 15
        },
        ranksFee: {
            no: "14",
            name: "施工队伍调遣费",
            attr: "单程调遣费×调遣人数×2",
            amount: "",
            isEdit: true,
            flag: 16
        },
        mechanicalDispatchFee: {
            no: "15",
            name: "大型施工机械调遣费",
            attr: "调遣用车运价×调遣运距×2",
            amount: "",
            isEdit: true,
            flag: 17
        },
        indirect: {
            no: "二",
            name: "间接费",
            attr: "（一）+（二）",
            amount: ""
        },
        guiFee: {
            no: "(一)",
            name: "规费",
            attr: "1 + 2 + 3 + 4",
            amount: ""
        },
        sewageFee: {
            no: "1",
            name: "工程排污费",
            attr: "按实计列",
            amount: "",
            isEdit: true,
            flag: 18
        },
        sociology: {
            no: "2",
            name: "社会保障费",
            attr: "人工费×" + data.sociologyRate + "%",
            amount: ""
        },
        house: {
            no: "3",
            name: "住房公积金",
            attr: "人工费×" + data.houseRate + "%",
            amount: ""
        },
        danger: {
            no: "4",
            name: "危险作业意外伤害保险费",
            attr: "人工费×" + data.dangerRate + "%",
            amount: ""
        },
        businessManagement: {
            no: "（二）",
            name: "企业管理费",
            attr: "人工费×" + data.businessManagementRate + "%",
            amount: ""
        },
        profit: {
            no: "三",
            name: "利润",
            attr: "人工费×" + data.profitRate + "%",
            amount: ""
        },
        outputTax: {
            no: "四",
            name: "销项税额",
            attr: "（人工费+乙供主材费+辅材费+机械使用费+仪表使用费+措施费+规费+企业管理费+利润）×销项税率",
            amount: ""
        }
    }
    var obj = {
        name: "Ⅱ",
        attr: "Ⅲ",
        amount: "Ⅳ",
        no: "Ⅰ"
    }
    var arr1 = [], arr2 = []
    if (data.statistic) {
        var sc = data.statistic
        arr1 = [obj], arr2 = [obj]
        for (var k in arrObj) {
            arrObj[k]['amount'] = sc[k] || 0
            arrObj[k]['t_name'] = k
            if (arr1.length < 20) arr1.push(arrObj[k])
            else arr2.push(arrObj[k])
        }
        // log(arr)
    }
    initTable('tableTwoTable1', arr1, tableTwoColumns)
    initTable('tableTwoTable2', arr2, tableTwoColumns)

}




