//引入封装的工具函数
 const utils= require('./utils/index')
 const {
  scheduleClipboard,
  copy,
  paste,
  formatDateToString,
  formatDateToTime,
}=utils
const crypto = require('crypto') //加密工具
const { clipboard } = require('electron') //

//按需引入全局配置项
const config = require('./config/h-config')
const { IS_FS_DB } = config
//引入自己封装的数据存储对象   --剪切板所有数据都存一份本地
const DB = require('./model/fs-db.js')
//引入自己封装的uTools存储对象，使用此对象可以将数据存入uTools文档中--一般用来存取配置项，就能兼容有会员的同学不用手动搬本地文件了
const uTools_db=require('./model/utools-db.js')
// //根据是否文件形式存储引入不同的db初始化构造文件
// const DB = IS_FS_DB ? fs_db : uTools_db
//存储的数据
const { dataBase } = DB
/* *********************************************** S：调用工具函数  *********************************************** */
scheduleClipboard(dataBase, (item) => {
  // 此函数不断执行
  if (!item) return
  // 如果已经在库中的，会在if语句中的【updateItem】函数执行时更新时间
  if (DB.updateItem(item.id)) return
  // 不在库中 就新增他
  item.createTime = new Date().getTime()
  item.updateTime = new Date().getTime()
  DB.addItem(item)
  
})

/* *********************************************** S：页面初始化渲染相关  *********************************************** */
const focus = () => document.querySelector('#nav-search-input')?.focus()
//列表跳转于顶部
const toTop = () => (document.scrollingElement.scrollTop = 0)
let num=0
//每次进入都会执行的方法,用作一些初始操作
utools.onPluginEnter(() => {
  // num++
  // const data={num,data:'测试db数据存入1',xx:'xxxxxx'}
  // uTools_db.put('config',data)
  document.querySelector('#nav-search-input').select() // 进入插件将搜索框内容全选
  focus()
  toTop()
})
/* *********************************************** S：一些方法的二次封装  *********************************************** */
//仅粘贴然后不进入剪切板--聚合搜索时可用
const onlyPasteThenClear = (item) => {
  const promise = new Promise((resolve, reject) => {
    //先根据规则生成id，再存入剪切板
    item.id = crypto.createHash('md5').update(item.data).digest('hex')
    switch (item.type) {
      case 'text':
      case 'html':
        clipboard.writeText(item.data)
        break
      case 'image':
        utools.copyImage(item.data)
        break
      case 'file':
        const paths = JSON.parse(item.data).map((file) => file.path)
        utools.copyFile(paths)
        break
    }
    paste()
    //粘贴需要一点时间，如果马上走到下一步进行剪切板清空，那么粘贴就无法生效
    setTimeout(() => {
      resolve(true)
    }, 100)
  })
  promise.then(() => {
    //将当前传入项暂存起来，与后面的剪切板列表首位进行对比
    const temp = item
    //清空当前剪切板内容，防止定时器轮询时删除又添加
    clipboard.clear(item)
    //获取当前存储数据中的第一位
    let last = dataBase.data?.[0] || []
    //如果当前已经将聚合的数据存入了，就将其删除
    if (temp && last.id == temp.id) {
      //shift会直接操作数组，删除首位
      dataBase.data.shift()
      DB.updateDataBase(dataBase)
    }
  })
}

/* *********************************************** S：全局变量挂载  *********************************************** */
//将DB存储对象挂到全局上
window.DB = DB
window.uTools_db=uTools_db
//将uTools的复制粘贴api封装后挂在到全局上
window.copy = copy
window.utils = utils
window.onlyPasteThenClear = onlyPasteThenClear
window.paste = paste
//挂在一些utools的api到全局上
window.openFile = utools.shellOpenPath
window.getIcon = utools.getFileIcon
window.focus = focus
window.formatDateToString = formatDateToString
window.formatDateToTime = formatDateToTime
//把配置项挂到全局
window.HConfig = config
