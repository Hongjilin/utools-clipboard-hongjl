<!--
 * @Author: 'hongjilin' '1044580210@qq.com'
 * @Date: 2022-08-26 16:20:28
 * @LastEditors: 'hongjilin' '1044580210@qq.com'
 * @LastEditTime: 2022-09-03 16:33:03
 * @FilePath: \插件开发\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home">
    <!-- transition实现动画效果 -->
    <transition name="fade">
      <div class="detail-box" v-if="showPageName=='details'">
        <item-list-detail :details="details"></item-list-detail>
        <div class="layout" @click="closeDetails"></div>
      </div>
    </transition>
    <message v-if="showMessage" :config="messageConfigData"></message>
    <confirm v-if="showConfim" :config="confirmConfigData" @close="confirmClose"></confirm>
    <readme v-if="showPageName=='readme'" @close-readme="closeReadme"></readme>
    <!-- 查看详情时不隐藏该列表 -->
    <div v-if="showPageName=='lists'||showPageName=='details'">
      <div class="header-box">
        <nav-tabs ref="navTabs" @get-navtab-type="getNavTabType"></nav-tabs>
        <nav-search @change-search-input="changeSearchInput"></nav-search>
        <div class="hander-readme" @click.stop="openReadme">📑</div>
      </div>
      <div class="main-box">
        <!-- 自定义剪切板  --里面还会调用剪切板列表组件，所以一些控制函数也要传入 -->
        <custom-mode :lists.sync="lists" v-if="showCustom"></custom-mode>
        <!-- 正常的剪切板列表 -->
        <item-list
          v-else
          @init-db-lists="initDbLists"
          @clear-store="clearStore"
          @show-details="showDetails"
          :dblists="dbLists"
          :lists="lists"
        ></item-list>
      </div>
    </div>
  </div>
</template>

<script>
// 不能使用 export default
module.exports = {
  components: {
    ItemList: httpVueLoader('./components/lists/item-list.vue'),
    NavTabs: httpVueLoader('./components/header/nav-tabs.vue'),
    NavSearch: httpVueLoader('./components/header/nav-search.vue'),
    ItemListDetail: httpVueLoader('./components/lists/item-list-detail.vue'),
    CustomMode: httpVueLoader('./components/custom/custom-mode.vue'),
    Readme: httpVueLoader('./components/commons/readme.vue'),
    Confirm: httpVueLoader('./components/commons/confirm.vue'),
    Message: httpVueLoader('./components/commons/message.vue'),
  },

  provide() {//定义全局注入
    return {
      confirmConfig: this.confirmConfig,//二次弹窗控制函数注入
      highlighter:this.highlighter,//代码块所需函数
      showDetails:this.showDetails,//控制显示详情界面的函数
      messageConfig:this.messageConfig,//提示弹窗注入
      copy:this.copy,//提示弹窗注入
    }
  },

  data() {
    return {
      searchInput: '',
      dbLists: [],//存放从存储库中取到的list
      lists: [],//存放筛选后的list
      navTabType: 'all',
      details: {},//详情数据
      showCustom: false,//是否展示自定义tab
      showConfim: false,//是否展示二次确认弹窗
      showMessage: false,//是否展示信息提示
      showPageName: 'lists',//当前展示的页面  
      confirmConfigData: {},//展示二次弹窗，且写入配置项
      messageConfigData:{}//展示信息提示，且写入配置项
    };
  },
  mounted() {
    //初始化时两个都要初始化
    this.dbLists = window.DB.dataBase.data
    this.lists = window.DB.dataBase.data
    this.addInterVal()
  },
  watch: {
    navTabType: {
      handler(type) {
        //如果是定制页面，要专门跳转另外的页面
        if (type === 'custom') {
          this.showCustom = true
          return
        }
        //如果不是，就要重置标识，并且进行剪切列表的筛选
        this.showCustom = false
        this.filterLists()
      }
    },
  },
  methods: {

    /* *********************************************** S：界面开关  *********************************************** */

    //关闭说明文档
    closeReadme() {
      this.showPageName = 'lists'
      //说明文档关闭后要回到之前的tab选中项目  --完成渲染后再调用，防止页面上还没有这个元素就进行了操作
      this.$nextTick(() => {
        this.$refs.navTabs && this.$refs.navTabs.checkNavTab(this.navTabType)
      })

    },
    //打开说明文档
    openReadme() {
      this.showPageName = 'readme'
    },
    showDetails(item) {
      //将详情数据写入data，并传给子组件进行展示
      this.details = item
      //展示状态标识为详情
      this.showPageName = "details"
      //添加样式，使得下方的滚动消失
      document.getElementsByTagName('html')[0].classList.add('overHTML')
    },
    //关闭界面
    closeDetails() {
      //展示详情状态标识为列表
      this.showPageName = 'lists'
      //移除样式，使得html的滚动出现
      document.getElementsByTagName('html')[0].classList.remove('overHTML')
    },
    /* *********************************************** S：功能函数  *********************************************** */
    // 定期检查更新   --此处没做定时器的销毁，是因为此页面为总页面，不会被销毁，除非直接关闭整个应用
    addInterVal() {
      let lastCopy = {}
      setInterval(() => {
        //获取最新的一个数据
        const now = window.DB.dataBase.data[0]
       if (lastCopy?.id !== now?.id)  {
          console.log('定时器进行更新', window.DB.dataBase.data)
          // 有更新
          this.dbLists = window.DB.dataBase.data
          lastCopy = now
          this.filterLists()
        }
      }, window.HConfig.VIEWS_SCHEDULE_TIME || 500)
    },

    //筛选显示数组列表
    filterLists() {
      const val = this.searchInput
      const type = this.navTabType
      //如果分类是全部，就只筛选搜索框内容
      if (type === 'all') {
        this.lists = this.dbLists.filter(item => item.data.indexOf(val) != -1)
      } else if(type === 'html'||type === 'text'){
        //如果是文本或者html,筛选到一起
        this.lists = this.dbLists.filter(item => item.data.indexOf(val) != -1 && (item.type === type||item.type === 'html'))
        }else{
        //如果不是全部，就都要进行搜索
        this.lists = this.dbLists.filter(item => item.data.indexOf(val) != -1 && item.type === type)
      }
    },
    //初始化db数据的时候要重新筛选当前剪切板列表
    initDbLists(dbLists) {
      console.log('初始化dbimage.png', window.DB.dataBase.data)
      this.dbLists = dbLists || window.DB.dataBase.data
      this.filterLists()
    },
    /* *********************************************** S：全局注入的方法  *********************************************** */
    //注入到全局中的函数，这样在所有地方都可以直接调用这个方法来控制二次确认谈拆给你
    confirmConfig(config = {}, fn) {
      this.confirmConfigData = config
      this.showConfim = true
      window.confirmFunc = fn
      console.log("全局注入的函数")
    },
    messageConfig(config = {},time=800){
      this.messageConfigData=config
      this.showMessage=true
      setTimeout(()=>{
        this.showMessage=false
      },time)
    },
    //二次封装的copy  --带提示
    copy(item){
      window.copy(item)
      this.messageConfig({type:'success',msg:'复制成功'})
    },
    //这是代码块所需的方法
    highlighter(code) {
      // js highlight example
      return Prism.highlight(code, Prism.languages.js, "js");
    },
    //关闭二次弹窗的函数
    confirmClose() {
      this.showConfim = false
    },
    //清空列表
    clearStore() {
      //清空库 
      window.DB.clearDataBase()
      //清空页面上的数据
      this.dbLists = []
      this.lists = []
    },
    //传给子组件的，修改搜索变量的
    changeSearchInput(val) {
      this.searchInput = val
      this.filterLists()
    },
    //获取当前的类型--默认全部
    getNavTabType(type = 'all') {
      console.log('父组件')
      this.navTabType = type
    }

  }
};
</script>

<style>
.main-box {
  margin-top: 50px;
}
</style>