<!--
 * 二次确认框组件
-->
<template>
  <div class="message-box">
    <transition name="fade">
      <div v-if="config.type=='success'" class="success">{{config.msg}}</div>
      <div v-else class="error">{{config.msg}}</div>
    </transition>
  </div>
</template>


<script>
module.exports = {
  props: {
    config: {
      type: Object,
      default: {
        msg: '复制成功',
        type:'success'
      }
    }
  },
  mounted() {
    //只要此组件加载，就隐藏滚动条
  },
  methods: {
    //点击确定时执行的函数
    clickPrimary() {
      const call = window.confirmFunc
      call && call()
      window.confirmFunc = () => { }
      this.$emit('close')
      document.getElementsByTagName('html')[0].classList.remove('overHTML')
    },
    clickClose() {
      window.confirmFunc = () => { }
      this.$emit('close')
      document.getElementsByTagName('html')[0].classList.remove('overHTML')
    }
  }

}
</script>
<style scoped>
</style>
