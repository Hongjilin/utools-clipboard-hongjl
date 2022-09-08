<template>
  <div :class="{footer:true,'footer-active':showbatch}">
    <!-- 此处相对路径要按照index.html为准，而不是当前vue组件的位置 -->
    <div class="footer-img-gotop">
      <img src="./assets/upward.png" title="返回顶部"  alt="返回顶部" @click.stop="handleGoToTop" />
    </div>
    <div class="footer-img-batch-delete" v-if="showbatch">
      <img src="./assets/font-icon/zhantie.png" title="聚合粘贴" alt="聚合粘贴" @click.stop="groupCopy" />
    </div>
    <div class="footer-img-batch-delete" v-if="showbatch">
      <img src="./assets/batchdel.png" title="批量删除" alt="批量删除" @click.stop="batchDelete" />
    </div>
    <div class="footer-img-batch-delete" v-if="showbatch">
      <img src="./assets/font-icon/shoucang_1.png" title="批量收藏" alt="收藏" @click.stop="batchCollector" />
    </div>
    <div class="footer-img-del">
      <img src="./assets/del.png" title="清空"  alt="清空" @click.stop="clearStore" />
    </div>
  </div>
</template>


<script>
module.exports = {
  inject: ['confirmConfig','groupCopy'],
  props: {
    showbatch: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
  },
  methods: {
    //批量删除
    batchDelete() {
      this.confirmConfig({ title: '批量删除', msg: '确定批量删除选中的记录？' }, () => {
        this.$emit('batch-delete')
      })

    },
    //批量收藏
    batchCollector() {
      this.confirmConfig({ title: '批量收藏', msg: '确定批量收藏选中的记录？' }, () => {
        this.$emit('batch-collector')
      })

    },
    //回到顶部
    handleGoToTop() {
      this.$emit('handle-go-top')
    },
    //清空存储的数据
    clearStore() {
      this.$emit('clear-store')

    },
  }

}
</script>
