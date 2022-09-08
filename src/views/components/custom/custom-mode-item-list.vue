<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-08-29 11:05:02
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-08 16:56:04
 * @FilePath: \插件开发\src\views\components\item-list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="item-list-box">
    <div
      class="clip-item"
      v-for="(item, index) in lazyLists"
      :key="item.createTime"
      :class="{ active: activeIndex===index }"
      @click.left="handleItemClick($event, item)"
      @click.right="handleItemClick($event, item)"
      @mouseover="handleMouseOver(index)"
    >
      <!-- 列表前面时间部分 -->
      <div class="clip-item-time">
        <span>{{formatDateToString(item.updateTime)}}</span>
      </div>
      <!-- 列表内容部分 -->
      <div class="clip-item-info">
        <div class="clip-item-info-data">
          <template v-if="item.type === 'text'">
            <div class="clip-item-info-data-main-text">{{ item.data}}</div>
          </template>
          <template v-if="item.type === 'html'">
            <div class="clip-item-info-data-main">
              <prism-editor
                class="my-editor height-200"
                v-model="item.data"
                :highlight="highlighter"
                line-numbers
              ></prism-editor>
            </div>
          </template>
          <template v-if="item.type === 'image'">
            <div class="clip-item-info-data-img-box">
              <span class="clip-item-info-data-img-size">{{item.size}}</span>
              <img class="clip-item-info-data-img" :src="item.data" alt="Image" />
            </div>
          </template>
          <template v-if="item.type === 'file'">
            <item-list-file @show-details="showDetails" :info="item"></item-list-file>
          </template>
        </div>
      </div>
      <div class="clip-item-btn">
        <item-list-btn v-if="activeIndex===index" :modelist="true" :item="item"></item-list-btn>
      </div>
    </div>
  </div>
</template>

<script>
const formatDateToString = window.formatDateToString;
module.exports = {
  inject: ["highlighter", "copy",'messageConfig'],
  provide() {
    //定义全局
    return {
      delCollectors: this.delCollectors //二次弹窗控制函数注入
    };
  },
  components: {
    ItemListFile: httpVueLoader("../lists/item-list-file.vue"),
    itemListBtn: httpVueLoader("../lists/item-list-btn.vue")
  },
  props: {
    lists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeIndex: 0, //默认选中列表第一位
      lazyIndex: 8, //当前懒加载下标
      lazyLists: 8 //当前懒加载下标
    };
  },
  mounted() {
    this.lazyLists = this.lists.slice(0, this.lazyLists);
    console.log(
      formatDateToString(new Date().getTime()),
      "utilsutilsutilsutilsutilsutils"
    );
    this.initAddEventListenerKey();
    window.addEventListener("scroll", this.scrollLazyFunc, false);
    //初始化时聚焦
    window.focus();
  },
  beforeDestroy() {
    console.log("组件销毁！！！！！！！！！！！！！！！！！！！");
    this.removeEventListenerKey();
    window.removeEventListener("scroll", this.scrollLazyFunc, false);
  },
  methods: {
    scrollLazyFunc() {
      console.log("滚动i!!!!!!!!!!!!!!!!!!!");
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度  --防止误差，少一点
      var scrollHeight =
        (document.documentElement.scrollHeight || document.body.scrollHeight) -
        1;
      //滚动条到底部的条件
      if (scrollTop + windowHeight >= scrollHeight) {
        if (this.lists.length >= this.lazyIndex) {
          this.throttle(() => {
            this.lazyIndex += 8;
            this.lazyLists = this.lists.slice(0, this.lazyIndex);
          }, 500)();
        } else {
             this.messageConfig({type:'success',msg:'到底了~'})
        }
      }
    },
    // 节流
    throttle(callback, delay) {
      let timer;
      return function() {
        console.log();
        if (timer) {
          return;
        }
        timer = setTimeout(() => {
          // 此处设置apply 是为了保证函数上下文不改变
          callback.apply(this, arguments);
          //清理定时器
          clearTimeout(timer);
        }, delay);
      };
    },
    delCollectors(item) {
      const temps = this.lists.filter(list => list.id != item.id);
      this.lists = temps;
      this.lazyLists = temps.slice(0, this.lazyLists);

      window.DB.updateDataBaseOnlyCollectors(temps);
    },
    delCollectors(item) {
      const temps = this.lists.filter(list => list.id != item.id);
      this.lists = temps;
      this.lazyLists = temps.slice(0, this.lazyLists);
      window.DB.updateDataBaseOnlyCollectors(temps);
    },
    //展示当前记录的详情页面
    showDetails(item) {
      this.$emit("show-details", item);
    },
    //定位当前的下标，并将其定位到界面中间
    checkActiveInCenter() {
      //为什么需要用$nextTick？  --因为vue监听数据变化并不是同步马上进行的，所以需要等这次dom渲染结束后再去进行下面的跳转操作
      this.$nextTick(() => {
        //再将当前下标数据置于界面中间
        document.querySelector(".clip-item.active") &&
          document.querySelector(".clip-item.active").scrollIntoView({
            block: "nearest",
            inline: "nearest"
          });
      });
    },

    //添加监听键盘事件，同时将记录当前按下的键位
    initAddEventListenerKey() {
      window.addEventListener("keydown", this.EventListenerKeyDownFunc, false);
      //添加键盘抬起事件的监听，如果抬起键盘的时候要将原本的按钮标识还原
      window.addEventListener("keyup", this.EventListenerKeyUpFunc, false);
    },
    //注销监听事件
    removeEventListenerKey() {
      window.removeEventListener(
        "keydown",
        this.EventListenerKeyDownFunc,
        false
      );
      window.removeEventListener("keyup", this.EventListenerKeyUpFunc, false);
    },
    EventListenerKeyDownFunc(e) {
      const { key, ctrlKey, metaKey, altKey } = e;
      //当前是否按下ctrl，存到全局中，因为多处地方会调用文件列表，所以不可以直接用父子组件传，不然耦合性太高
      window.isCtrlKey = ctrlKey || metaKey;
      switch (key) {
        //当你按下键盘【↑】
        case "ArrowUp": {
          if (this.activeIndex > 0) this.activeIndex--;
          //如果当前下标为0了，就不再对其进行【↑】的相关操作
          else if (this.activeIndex === 1) window.toTop();
          //如果当前下标为1，直接对其进行置顶操作
          else {
            //如果其他情况，就将当前选中激活的元素置于页面中间
            this.checkActiveInCenter();
          }
          break;
        }
        //当你按下了键盘【↓】
        case "ArrowDown": {
          //要保证不能超过list长度
          if (this.activeIndex < this.lazyLists.length - 1) {
            this.activeIndex++;
            //将当前选中激活的元素置于页面中间
            this.checkActiveInCenter();
          }
          break;
        }
        //当你按下了回车键【Enter】
        case "Enter": {
          //当你按下了回车键，按照当前的下标查找到对应的剪切板数据，同时粘贴到页面上
          this.copy(this.lazyLists[this.activeIndex]);
          window.paste();
          break;
        }
      }
    },
    EventListenerKeyUpFunc() {
      window.isCtrlKey = false;
    },
    //鼠标移入移出事件
    handleMouseOver(index) {
      //移入时将index下标赋值到data中，用以渲染当前选中项样式
      this.activeIndex = index;
    },
    //鼠标点击事件，左键点击复制+粘贴，右键只有复制
    handleItemClick(ev, item) {
      const { button } = ev;
      console.log(button, "当前按钮项目");
      if (button === 0) {
        // 左键 复制后粘贴
        this.copy(item);
        window.paste();
      } else if (button === 2) {
        // 右键 仅复制
        this.copy(item);
      }
    }
  }
};
</script>
