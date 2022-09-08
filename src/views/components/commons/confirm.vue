<!--
 * 二次确认框组件
-->
<template>
  <div class="confirm-box">
    <transition name="fade">
      <div class="transition-box">
        <div class="layout"></div>
        <div class="confirm">
          <div class="confirm-windows">
            <div class="confirm-windows-header">{{config.title}}</div>
            <div class="confirm-windows-main">{{config.msg}}</div>
            <div class="confirm-windows-btn">
              <div @click="clickPrimary" class="primary">确认</div>
              <div @click="clickClose" class="close">取消</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
module.exports = {
  props: {
    config: {
      type: Object,
      default: {
        title: '提示',
        msg: '确定xxxxx？'
      }
    }
  },
  mounted() {
    //只要此组件加载，就隐藏滚动条
    document.getElementsByTagName('html')[0].classList.add('overHTML')
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
