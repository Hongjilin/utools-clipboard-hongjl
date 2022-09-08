<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-08-29 11:05:02
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-08 17:03:07
 * @FilePath: \插件开发\src\views\components\item-list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="item-list-box" class="item-list-box" @mouseup="mouseUp" @mousedown="mouseDown" @blur="mouseUp">
    <!-- <div class="list-layout"></div> -->
    <div
      class="clip-item"
      unselectable="on"
      onselectstart="return false;"
      style="-moz-user-select:none;"
      v-for="(item, index) in lists"
      :key="item.createTime"
      :class="{ active: activeIndex===index,activeBatch:(selectActiveIds.indexOf(item.id)!=-1) }"
      @click.left="handleItemClick($event, item)"
      @click.right="handleItemClick($event, item)"
      @dblclick="handleItemBblclick($event, item)"
      @mouseover="handleMouseOver(index)"
    >
      <!-- 列表前面时间部分 -->
      <div class="clip-item-time">
        <span v-if="activeIndex==index">{{formatDateToTime(item.updateTime)}}</span>
        <span v-else>{{formatDateToString(item.updateTime)}}</span>
      </div>
      <!-- 列表内容部分 -->
      <!-- <div :class="{'clip-item-info':activeIndex==index,'clip-item-info-failure':activeIndex!==index}">  这行放开效果为：选中行变短，其他行占满 -->
      <div class="clip-item-info">
        <div class="clip-item-info-data">
          <template v-if="item.type === 'text'">
            <div
              class=" clip-item-info-data-main-text"
            >{{ item.data.split(`\n`).join(`\n`) }}</div>
          </template>
         <template v-else-if="item.type === 'image'">
            <div class="clip-item-info-data-img-box">
            <span class="clip-item-info-data-img-size"> {{item.size}}</span>
            <img class="clip-item-info-data-img" :src="item.data" alt="Image" />
            </div>
          </template>
          <template v-else-if="item.type === 'html'">
            <div class="clip-item-info-data-main">
              <!-- 如果是svg或者html形式的图片（前面放出了图片兼容） -->
              <prism-editor
                class="my-editor height-200"
                v-model="item.data.split(`\n`).join(`\n`)"
                :highlight="highlighter"
                line-numbers
              ></prism-editor>
            </div>
          </template>
          <template v-else-if="item.type === 'file'">
            <item-list-file @show-details="showDetails" :info="item"></item-list-file>
          </template>
        </div>
      </div>
      <div class="clip-item-btn">
        <item-list-btn v-if="activeIndex===index" :item="item"></item-list-btn>
      </div>
    </div>
    <footer-tools
      @handle-go-top="handleGoToTop"
      @batch-delete="batchDelete"
      @batch-collector="batchCollector"
      @clear-store="clearStore"
      :showbatch="selectActiveIds.length>0"
    ></footer-tools>
  </div>
</template>

<script>
const formatDateToString = window.formatDateToString;
const formatDateToTime = window.formatDateToTime;
module.exports = {
  inject: ["highlighter", 'copy','messageConfig'],
  provide() {//定义全局
    return {
      deleteOne: this.deleteOne,//删除单个数据
      collectorOne: this.collectorOne,//单个收藏
      delCollectors: this.delCollectors,//删除单个收藏
      groupCopy: this.groupCopy,//聚合复制
    }
  },
  components: {
    ItemListFile: httpVueLoader("./item-list-file.vue"),
    itemListBtn: httpVueLoader("./item-list-btn.vue"),
    FooterTools: httpVueLoader("../commons/footer-tools.vue")
  },
  props: {
    lists: {
      type: Array,
      default: () => []
    },
    dblists: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      code: "console.log('hello world')",
      activeIndex: 0, //默认选中列表第一位
      selectActiveIds: [],
      ss: "ssssss重新出现在重新注册自行车",
      isMouseDown: false//s是否鼠标点击
    };
  },
  mounted() {
    console.log(
      formatDateToString(new Date().getTime()),
      "utilsutilsutilsutilsutilsutils"
    );
    this.initAddEventListenerKey();
    //初始化时聚焦
    window.focus();
  },
  beforeDestroy() {
    console.log('组件销毁！！！！！！！！！！！！！！！！！！！')
    this.removeEventListenerKey()
  },
  watch: {
    lists: {
      handler(val) {
        console.log(
          "列表刷新！！！！！！！！！！！！！！！！！！！！！！！！！！！",
          val
        );
      },
      deep: true
    }
  },
  methods: {
    mouseDown() {

      this.isMouseDown = true
      console.log('鼠标单击事件')
    },
    mouseUp() {
      this.isMouseDown = false
      console.log('鼠标抬起单击事件')
    },

    //单个删除
    deleteOne(item) {
      const temp = [];
      this.dblists.map(list => {
        if (list.id !== item.id) temp.push(list);
      });
      window.DB.dataBase.data = temp;
      this.$emit("init-db-lists");
      window.DB.updateDataBaseOnlyData(temp);
    },
    //聚合复制
    groupCopy() {
            const temps = [];
      this.dblists.map(item => {
        if (this.selectActiveIds.indexOf(item.id) !== -1) temps.push(item);
      });
      let str= ''
      temps.map(temp=>{
        //如果是文本以及html类型，就凭借在一起
        if(temp.type=='text'||temp.type=='html') str+=temp.data+'\n'
      })
      if(str.trim()&&temps.length>1) {
        const item={type:'html',data:str}
         window.onlyPasteThenClear(item)
         this.selectActiveIds=[]
        //  this.deleteOne(item)

      }else{
          this.messageConfig({type:'error',msg:'最少两条'})
      }
      console.log('聚合复制',str)
    },
    //批量删除
    batchDelete() {
      const temp = [];
      console.log(
        "批量删除的函数！！！！！！！！！！！！！！！！！",
        this.dblists
      );
      this.dblists.map(item => {
        if (this.selectActiveIds.indexOf(item.id) == -1) temp.push(item);
      });
      // this.lists = temp
      console.log("批量删除的函数11！！！！！！！！！！！！！！！！！", temp);
      this.selectActiveIds = [];
      window.DB.dataBase.data = temp;
      this.$emit("init-db-lists");
      window.DB.updateDataBaseOnlyData(temp);
    },
    collectorOne(item) {
      const temp = [];
      this.lists.map(list => {
        if (list.id == item.id) temp.push(list);
      });
      const collectors = window.DB.dataBase.collectors || [];
      const tempArr = [...temp, ...collectors];
      for (let i = 0; i < tempArr.length; i++) {
        for (let j = i + 1; j < tempArr.length; j++) {
          if (tempArr[i].id == tempArr[j].id) {
            tempArr.splice(j, 1);
            j--;
          }
        }
      }
      this.selectActiveIds = [];
      window.DB.updateDataBaseOnlyCollectors(tempArr);

    },
    //批量收藏
    batchCollector() {
      const temp = [];
      this.lists.map(item => {
        if (this.selectActiveIds.indexOf(item.id) != -1) temp.push(item);
      });
      const collectors = window.DB.dataBase.collectors || [];
      const tempArr = [...temp, ...collectors];
      for (let i = 0; i < tempArr.length; i++) {
        for (let j = i + 1; j < tempArr.length; j++) {
          if (tempArr[i].id == tempArr[j].id) {
            tempArr.splice(j, 1);
            j--;
          }
        }
      }
      this.selectActiveIds = [];
      window.DB.updateDataBaseOnlyCollectors(tempArr);
    },

    delCollectors(item) {
      const temps = this.lists.filter(list => list.id != item.id)
      this.lists = temps
      window.DB.updateDataBaseOnlyCollectors(temps)
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
    /* *********************************************** S：监听事件！！  *********************************************** */
    //按钮按下事件的处理
    EventListenerKeyDownFunc(e) {
      const { key, ctrlKey, metaKey, altKey } = e;
      console.log(key, "yyyyyyyyyyyyyy");
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
          if (this.activeIndex < this.lists.length - 1) {
            this.activeIndex++;
            //将当前选中激活的元素置于页面中间
            this.checkActiveInCenter();
          }
          break;
        }
        //当你按下了回车键【Enter】
        case "Enter": {
          //当你按下了回车键，按照当前的下标查找到对应的剪切板数据，同时粘贴到页面上
          console.log("按下了回车键！！！！！！1", this.lists[this.activeIndex])
          const item = this.lists[this.activeIndex]
          this.copy(item);
          window.paste();
          break;
        }
        //当你按下了【Shift】
        case "Shift": {
          window.isShift = true;
          break;
        }
        //当你按下了【Alt】
        case "Alt": {
          console.log("anxialeAlt");
          window.Alt = true;
          break;
        }
        //当你按下了【a】
        // case "a": {
        //   if(window.Alt)  {
        //     const temp=[]
        //     this.lists.map(item=>{
        //         temp.push(item.id)
        //     })
        //     console.log('temptemptemptemp',temp)
        //     // this.selectActiveIds=temp
        //   }
        //   break;
        // }
      }

    },
    //键盘抬起事件
    EventListenerKeyUpFunc(e) {
      //只要键盘抬起，就要重置按钮标识
      window.isCtrlKey = false;
      window.isShift = false;
    },

    //添加监听键盘事件，同时将记录当前按下的键位
    initAddEventListenerKey() {
      window.addEventListener("keydown", this.EventListenerKeyDownFunc, false);
      //添加键盘抬起事件的监听，如果抬起键盘的时候要将原本的按钮标识还原
      window.addEventListener("keyup", this.EventListenerKeyUpFunc, false);
    },
    //注销监听事件
    removeEventListenerKey() {
      window.removeEventListener("keydown", this.EventListenerKeyDownFunc, false);
      window.removeEventListener("keyup", this.EventListenerKeyUpFunc, false);
    },
    //回到顶部
    handleGoToTop() {
      this.activeIndex = 0;
      //定位当前下标，同时将页面滚动到最上方
      document.scrollingElement.scrollTop = 0;
    },
    //清空存储的数据
    clearStore() {
      //要先询问用户
      const flag = window.confirm("确定要清空剪贴板记录吗?");
      if (flag) {
        //如果用户确认后，调用封装好的清空数据库方法
        this.$emit("clear-store");
      }
    },
    //鼠标移入移出事件
    handleMouseOver(index) {
      //移入时将index下标赋值到data中，用以渲染当前选中项样式
      this.activeIndex = index;
      const isMouseDown = this.isMouseDown
      if (isMouseDown) {
        this.selectActiveIds.push(this.lists[index]?.id)
      }
    },
    //鼠标左键双击事件
    handleItemBblclick(ev, item) {
      console.log('双击！！！！！', item)
      this.copy(item);
      window.paste();
    },
    //鼠标点击事件，左键点击复制+粘贴，右键只有复制
    handleItemClick(ev, item) {
      const { button } = ev;
      const temps = this.selectActiveIds;
      if (button === 2) {
        //右键取消批量选择
        window.isCtrlKey = false;
        window.isShift = false;
        this.selectActiveIds = [];
      }
      if (window.isCtrlKey) {
        //如果没有的直接添加
        if (temps.length == 1) {
          this.selectActiveIds.push(item.id);
          return;
        }
        //判断当前传入项是否重复
        let repeatFlag = false;
        temps.map(active => {
          if (active === item.id) {
            repeatFlag = true;
          }
        });
        //如果重复，就直接筛选掉
        if (repeatFlag) {
          this.selectActiveIds = temps.filter(activeId => activeId !== item.id);
        }
        //如果不重复，就添加
        else {
          this.selectActiveIds.push(item.id);
        }
        return;
      }
      if (button === 0) {
        // //只有左键点击的时候去除批量选中的数据  --后续要做成配置项目 ，可自己单击也可双击
        this.selectActiveIds = [];
        this.copy(item);
        window.paste();
      }
      console.log("xzczxczxcxz", button);
    }
  }
};
</script>
