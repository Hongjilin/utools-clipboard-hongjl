<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-09-01 16:05:16
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-08 15:55:38
 * @FilePath: \插件开发\src\views\components\custom-mode.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="custom-mode-box">
    <div>(此页面样式未优化,先开放部分功能用以过渡) </div>
    <span>固定功能开发中，后续可自选与定制</span>
    <div class="write-mode">
      <div class="write-mode-list" v-for="(key, index) in Object.keys(writeModeLists)">
        {{writeModeLists[key].title}}:{{writeModeLists[key].data}}
        <div class="write-mode-list-btn">
          <span class="write-mode-list-btn-refresh" @click="()=>{handleRefresh(key)}">♻</span>
          <button
            class="write-mode-list-btn-copy"
            @click="()=>{handleItemClick(writeModeLists[key])}"
          >复制</button>
        </div>
      </div>
  </div>
  <div class="write-mode-lists-box-box" style="width:100%" v-if="collectorsLists.length>0">
    收藏的剪切板剪切板列表（ALT+左键从剪切列表存入）
      <div class="write-mode-lists-box">
      <!-- 正常的剪切板列表 -->
      <!-- <item-list-detail v-if="showDetail" :details="details"></item-list-detail> -->
      <custom-mode-item-list  @show-details="showDetails"  :lists="collectorsLists" :custom="true"></custom-mode-item-list>
    </div>
    </div>
    <div v-else>当前收藏的剪切版为空（ALT+左键从剪切列表存入）</div>
  </div>
</template>

<script>
module.exports = {
      inject: ['copy'],
    components: {
   customModeItemList: httpVueLoader('./custom-mode-item-list.vue'),
     ItemListDetail: httpVueLoader('./lists/item-list-detail.vue'),
  },
  props: {
        lists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      collectorsLists:[],
      showDetail:false,
      details:{},
      writeModeLists: {
        unitCode: { title: '随机社会信用代码', type: 'text', data: '912955552GH6REQG1N' },
        phone: { title: '随机手机号码', type: 'text', data: '15111111111' },
        ID: { title: '随机身份证', type: 'text', data: '110101200409018710' }
      },
      //后续将随机生成,现在先写死
      enums: {
        unitCode: [
          '91213541T14YDE870E',
          '91133456AQXB2W2Q1Q',
          '91648393J6T8KPR185',
          '911694583W3RG9LT1K',
          '91283027F2MP2D25XY',
          '92847763U2X64N6UX9',
          '929801329D5DXD755T',
          '92529914NLCW61AL6W',
          '92016193LCTPGNNQ1N',
          '92170341QTLF5A8886',
          '92642858M3FHDNEQXF',
        ],
        phone: [
          '17007769882',
          '13851558733',
          '13285322012',
          '13248084176',
          '13187619883',
          '15788424696',
          '15415363125',
          '15015833264',
          '15719694818',
          '15448899707',
          '15947718132',
          '15784261487',
          '15911279147',
          '15696211617',
          '15064972259',
          '15471981857'
        ],
        ID: [
          '35010120000101709X',
          '35010120000101805X',
          '350101200001011659',
          '350101200001015430',
          '350101200001017639',
          '350101200001014198',
          '35010120000101709X',
          '350101200001019554',
          '350101200001013996',
          '350101200001017997',
          '350101200001011616',
          '350101200001012811',
          '350101200001016898'
        ]
      }


    }

  },
  mounted() {
    console.log("重新加载")
    this.collectorsLists= window.DB.dataBase.collectors||[]
  },
  methods: {
        showDetails(item) {
      //将详情数据写入data，并传给子组件进行展示
      this.details = item
      //展示详情状态标识为true
      this.showDetail = true
    },
    handleRefresh(key) {
      if( this.enums[key]){
        //刷新的时候，也要重新获取一次收藏列表，防止刷新的时候页面带入旧的收藏数据，造成收藏取消失败的假象
       this.collectorsLists= window.DB.dataBase.collectors||[]
       const length=this.enums[key].length-1
       this.writeModeLists[key].data= this.enums[key]?.[Math.floor(Math.random()*100%length)]||'暂无随机值'
        console.log("随机！！！！！",length,Math.random()*100%length)
      }
    },
    handleItemClick(item) {
      console.log(item, "eeeeeeeeeeeeeeeeeeeeeeee点击了！！！！")
      this.copy(item)
      window.paste()

    }
  }

}
</script>
