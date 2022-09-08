<!--
 * loading组件
-->
<template>
  <div class="loading-all-box">
    <div class="loading-box">
      <div class="layout"></div>
      <div class="loading-icon"> <div> <img src="./assets/loading1.png" alt="加载中......"/></div> </div>
    </div>
  </div>
</template>


<script>
module.exports = {
  props: {
  },
   mounted() {
    //只要此组件加载，就隐藏滚动条
    document.getElementsByTagName('html')[0].classList.add('overHTML')
  },
    beforeDestroy() {
    document.getElementsByTagName('html')[0].classList.remove('overHTML')
  },
  methods: {
  }

}
</script>
<style scoped>
</style>
