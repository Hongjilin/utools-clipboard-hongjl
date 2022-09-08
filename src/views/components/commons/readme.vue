<template>
<div  class="readme-class">
     <div  id="zm_xyz">
      <section class="container">
  <div class="heading">
    <h1 class="heading_title">使用说明</h1>
  </div>
  <div class="auto-class-box">
  <div class="auto-class">
      <div > <img src="./assets/gitee.png" alt="gitee" /></div>   
      <input class="form_input"
      disabled
           type="text" 
           id="todo" 
           name="to-do"
           value="https://gitee.com/hongjilin"
           size="30"
           required>
      </div>
  <div class="auto-class">
        <div > <img src="./assets/github.png" alt="github"/></div> 
      <input class="form_input"
      disabled
           type="text" 
           id="todo" 
           name="to-do"
           value="https://github.com/Hongjilin"
           size="30"
           required>
      </div>
      </div>
  <form class="form">
      
    <div class="button-box-class">
      <button class="button" @click="closeReadme"><span>关闭</span></span></button>
    </div>
  </form>
  <div>
    <ul class="toDoList">
      <li>首先：首次要勾选【跟随主程序同时启动】，否则插件处于后台情况下会失效</li>
      <li>1. 鼠标左键点住不放进行拖拽（可配合ALT+左键单击选特定剪切板内容）可多选，可以进行批量删除、收藏、聚合粘贴等。收藏数据将存入【定制】一页的tab</li>
      <li>2. 鼠标右键取消多选项，鼠标左键单点仍可直接粘贴</li>
      <li>3. 鼠标 or 光标 悬浮到某个记录，会出现单条记录的操作按钮，可进行单条操作</li>
      <li>4. ALT+左键选中文件名称，可直接打开文件</li>
      <li>5. 定制一栏tab将会固定一些常用的数据以复制，还有收藏的数据（收藏的数据不会随着剪切板清空而消失） ---此界面的样式还未完善，敬请期待</li>
      <li>功能、样式、交互还在设计与开发中，且本人近几个月将996时间较少，请大家多点耐心，有建议的话可以直接评论区</li>
      <li>源码将在项目功能大致开发完成的时候开放到个人主页</li>
    </ul>
  </div>
</section>
    </div>
    </div>
</template>


<script>
module.exports = {
  props: {
  },
  mounted() {
  },
  methods: {
      closeReadme(){
          this.$emit('close-readme')
      }
  }

}
</script>
