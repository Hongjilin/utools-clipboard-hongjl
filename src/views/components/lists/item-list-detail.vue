<template>
  <div class="item-list-detail-box">
    <div class="item-list-detail-btn">
      <div @click="()=>handleItemClick('copy')">复制 📋</div>
      <!-- <div @click="()=>handleItemClick('paste')">粘贴 🚀</div> -->
    </div>
    <div v-if="details.type==='text'" class="item-list-detail-text">
     {{details.data}}
    </div>
    <div v-if="details.type==='html'" class="item-list-detail-code">
    <prism-editor class="my-editor-detail" v-model="details.data" :highlight="highlighter" line-numbers></prism-editor>
    </div>
    <div v-if="details.type==='file'" class="item-list-detail-file" >
    <item-list-file :number="9999"  :info="details"></item-list-file>
    </div>
  </div>
</template>

<script>
module.exports = {
    inject: ['highlighter','copy'],
    components: {
    ItemListFile: httpVueLoader('./item-list-file.vue'),
  },
  props: {
    details:{
       type: Object,
       default:()=>{}
    }
  },
  mounted() {
  },
  methods: {
     //按钮事件 --默认给值赋值
    handleItemClick(type='copy') {
      const data =this.details
      if (type === 'paste') {
        //  复制后粘贴
        this.copy(data)
        window.paste()
      } else if (type === 'copy') {
        //仅复制
        this.copy(data)
      }
    }

  }

}
</script>
