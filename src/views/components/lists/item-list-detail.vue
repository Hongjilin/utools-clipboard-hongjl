<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-08-31 19:57:34
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-01 09:41:19
 * @FilePath: \插件开发\src\views\components\item-list-detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
      console.log(type,"typetypetypetype")
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
