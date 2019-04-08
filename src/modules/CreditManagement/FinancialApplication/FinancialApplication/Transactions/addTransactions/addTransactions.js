 $(function () {
     //  获取必传字段
     var postData = { //注释部分为非必传项

         user: "申请人", //申请人
         tel: "联系电话", //联系电话
         manage: "理财金额", //理财金额
         interestRateStr: "期望利率", //期望利率
         expectCycle: "期望周期" //期望周期
     }


     //提交业务费用申请添加

     function addTransactions() {
         // log()


         var postObj = {}
         for (var k in postData) {
             val = $("." + k).val()
             if (!val) return $.popInfo(postData[k] + '输入错误，请确认！')
             postObj[k] = val
         }
         // log(postObj)
         $http({
             url: '/gct-web/finance/addManageMoney',
             data: postObj,
             success: function (r) {
                submitSuccess('',function () {
                    goBack()
                })
             }
         })

     }

     //提交
     $("body").on("click", '.postBtn', function () {
         $.popConfirm({
             content: "<div class='warnIcon'><i></i>确定提交当前操作的内容吗？</div>",
             confirm: function () {
                 addTransactions()
             }

         })
     })


 })