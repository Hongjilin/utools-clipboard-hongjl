<template>
<div  class="clip-file-list-box">
  <div class="clip-file-list">
    <div
      class="clip-file-list-item"
      v-for="file of JSON.parse(info.data)"
      @click.left.stop="handleItemFileClick($event, file)"
      @click.right.stop="handleItemFileClick($event, file)"
    >
      <img class="clip-file-list-item-icon" :src="getIcon(file.path)" alt="icon" />
      {{ file.name }}
       </div>
   </div>
        <!-- <div
              class="btn-show-detail "
              v-if="JSON.parse(info.data).length>window.HConfig.LIST_SLICE_NUMBER"
              @click.stop="()=>showDetails(info)"
            >{{`查\n看\n全\n部`}}</div> -->
  </div>
</template>

<script>
module.exports = {
      inject: ['copy'],
  props: {
    info: {
      type: Object,
      default: () =>{}
    },
    costom: {
      type: Boolean,
      default: false
    },
    //显示的文件数
    number:{
      type:Number,
      default:8
    },
  },
  mounted() {
    console.log(this.info,"this.infothis.infothis.info")
  },
  methods: {
    //展示当前记录的详情页面
    showDetails(){
      const fileData=this.info
      this.$emit('show-details',fileData)
    },

    handleItemFileClick(ev, file) {
      const { button } = ev
      const isCtrlKey= window.isCtrlKey
      //如果左键点击的同时，也按下了ctrl键（兼容了mac）,就打开文件预览
      if (button === 0 && isCtrlKey) {
        this.copy(file)
        return this.openFile(file.path)
      }
      //不论左键还是右键都会进行复制
      this.copy(file)
    },

    openFile(path) { return window.openFile(path) },
    getIcon(path) { return window.getIcon(path) }
  }

}
</script>
