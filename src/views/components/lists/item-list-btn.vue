<template>
  <div class="item-list-btn-box">
        <div v-if="!modelist" :class="{'item-list-btn':true}" @click.stop="()=>{copy(item)}">
      <img src="./assets/font-icon/fuzhi.png" title=复制 alt="复制"/>
    </div>
        <div   v-if="!modelist"  :class="{'item-list-btn':true}" @click.stop="()=>{
        //先复制，再粘贴
          copy(item)
          window.paste(item)
          }">
      <img src="./assets/font-icon/zhantie.png" title=粘贴 alt="粘贴"/>
    </div>
        <div v-if="judeRenderDetailsBtn()&&!modelist"  :class="{'item-list-btn':true}" @click.stop="()=>showDetails(item)">
      <img src="./assets/nav-icon/chakan.png" title="查看更多详情" alt="查看详情"/>
    </div>
        <div v-else-if="!modelist"  :class="{'item-list-btn':true,'item-list-btn-detalis':true}" @click.stop="()=>{}">
      <img src="./assets/nav-icon/chakan.png"  title="未超出隐藏" alt="查看详情"/>
    </div>
    <div class="item-list-btn" v-if="isShowCang">
      <img src="./assets/font-icon/shoucang_1.png" @click.stop="()=>closeCollector(item)" title="取消收藏" alt="取消收藏"/>
    
    </div>
    <div  v-else class="item-list-btn">
      <img src="./assets/font-icon/shoucang.png" @click.stop="()=>collector(item)" title="收藏" alt="收藏"/>
    </div>
    <div class="item-list-btn"  v-if="!modelist" >
      <img src="./assets/font-icon/shanchu.png" @click.stop="()=>deleteOneConfig(item)" title="删除"  alt="收藏"/>
    </div>
  </div>
</template>

<script>
module.exports = {
    inject: ['showDetails','deleteOne','confirmConfig','collectorOne','delCollectors','messageConfig','copy','initCollectorsLists'],
  props: {
    item:{
      type:Object,
       default: () =>{}
    },
    modelist:{
      type:Boolean,
       default:false
    }
  },
  data(){
    return {
      isShowCang:false
    }
  },
  mounted() {
     this.isShowCang= this.judeShouCang()
  },
  methods: {
    collector(item){
      //收藏/取消收藏不再进行提示
        //  this.confirmConfig({ title: '收藏', msg: '收藏后不会随着清空剪切板而消失，确定收藏该记录吗？' }, () => {
            this.collectorOne(item)
             this.isShowCang= this.judeShouCang()
             this.messageConfig({type:'success',msg:'收藏成功'})

      // })
    },
    closeCollector(item){
            // this.confirmConfig({ title: '取消收藏', msg: '取消收藏后该记录会随着清空剪切板而消失，确认取消吗？' }, () => {
            this.delCollectors(item)
             this.isShowCang= this.judeShouCang()
               this.messageConfig({type:'success',msg:'取消成功'})
               //取消收藏后，需要刷新收藏页面
               this.initCollectorsLists&&this.initCollectorsLists()
      // })

    },

    deleteOneConfig(item){
      console.log("xxxxxxxxxxxxxxxxx",item)
         this.confirmConfig({ title: '删除', msg: '确定删除该记录？' }, () => {
         this.deleteOne(item)
           this.messageConfig({type:'success',msg:'删除成功'})
      })
    },
    //判断是否收藏
    judeShouCang(){
      const collectors=window.DB.dataBase.collectors||[]
      const ids=[]
      collectors.map(item=>{
      ids.push(item.id)
      })
      return ids.indexOf(this.item.id)!=-1
    },
    judeRenderDetailsBtn(){
      const item=this.item
      if(item.type=='text') return item.data.split(`\n`).length>window.HConfig.LIST_SLICE_NUMBER||item.data.length>500
      else if(item.type=='html') return item.data.split(`\n`).length>window.HConfig.LIST_SLICE_NUMBER
      else if(item.type=='file') return JSON.parse(item.data).length>window.HConfig.LIST_SLICE_NUMBER
      return false
    }
  }

}
</script>
