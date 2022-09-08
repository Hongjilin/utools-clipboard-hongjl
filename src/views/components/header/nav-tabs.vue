<template>
  <div class="nav-tabs">
    <div
      class="nav-tabs-item"
      v-for="(tab, index) in tabs"
      :class="{active: tab.type===activeType}"
      @click="()=>{checkNavTab(tab.type)}"
    >
      <div class="nav-tabs-item-icon">
        <img :src="getIcon(tab.type, tab.type===activeType)" alt />
      </div>
      {{tab.tabName}}
    </div>
  </div>
</template>

<script>
// 不能使用 export default
module.exports = {
  data() {
    return {
      //自定义tabs列表
      tabs: [
        { tabName: " 全部", type: "all" },
        { tabName: " 文字", type: "text" },
        { tabName: " 图片", type: "image" },
        { tabName: " 文件", type: "file" },
        { tabName: " 定制", type: "custom" }
      ],
      activeType: "all" //默认就是全部
    };
  },
  mounted() {
    this.initAddEventListenerKey();
  },
    beforeDestroy() {
    this.removeEventListenerKey()
  },
  methods: {
    getIcon(type, active = false) {
      switch (type) {
        case "all":
          return active
            ? "./assets/nav-icon/all_1.png"
            : "./assets/nav-icon/all_2.png";
          break;
        case "text":
        case "html":
          return active
            ? "./assets/nav-icon/text_1.png"
            : "./assets/nav-icon/text_2.png";
          break;
        case "image":
          return  active?"./assets/nav-icon/image_1.png":"./assets/nav-icon/image_2.png";
          break;
        case "file":
          return  active?"./assets/nav-icon/file_1.png":"./assets/nav-icon/file_2.png";
          break;
        case "custom":
          return  active?"./assets/nav-icon/collector.png":"./assets/nav-icon/collector.png";
          break;
      }
    },
    checkNavTab(type) {
      this.activeType = type;
      this.$emit("get-navtab-type", type);
    },
  EventListenerKeyDown(e){
     const { key } = e;
        switch (key) {
          //当你按下键盘【tab】
          case "Tab": {
            const list = ["all", "text", "image", "file", "custom"];
            const index = list.indexOf(this.activeType);
            const target =
              index === list.length - 1 ? list[0] : list[index + 1];
            this.checkNavTab(target);
          }
        }
  },

    //添加监听键盘事件，同时将记录当前按下的键位
    initAddEventListenerKey() {
      window.addEventListener("keydown",this.EventListenerKeyDown,false);
    },
        //注销监听事件
    removeEventListenerKey() {
      window.removeEventListener("keydown",this.EventListenerKeyDown,false);
    },
  }
};
</script>
