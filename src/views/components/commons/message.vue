<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-09-03 11:04:55
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-03 16:34:19
 * @FilePath: \插件开发\src\views\components\commons\confirm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
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
