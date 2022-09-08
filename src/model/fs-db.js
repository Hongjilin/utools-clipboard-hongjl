/**
 * 文件存储的DB初始化文件--不使用uTools提供的api而是写入到本地文件进行存储
 */

const fs = require('fs')
const path = require("path");
//引入配置的变量
const config = require('../config/h-config')
const { DB_ITEM_MAX_SIZE } = config
//获取当前 用户的 home 文件夹（主目录）
const homePath = utools.getPath('home')
//是否是window环境，要用做路径区分  --window的路径跟mac不同
const isWindows = utools.isWindows()
//拼接该文件路径，后续存储剪切板历史记录
const dbPath = path.join(homePath, `${isWindows ? '\\' : '/'}utools_clipboard_storage`);
//存储条数上限---500，可以自己设置长度
const dbItemMaxSize = DB_ITEM_MAX_SIZE
//首次加载是将配置项写入到window中
window.dbItemMaxSize = dbItemMaxSize
/* *********************************************** S：一、声明存储事件构造函数，封装常用的存储方法以及初始化函数  *********************************************** */
class DB {
  //1. 构造函数，传入的是存储的文件路径
  constructor(path) {
    //初始化存储的文件路径、创建时间（用作排序以及过期删除使用）、存储的对象
    this.path = path
    this.dataBase = {
      data: [],
      collectors:[], //收藏的剪切板数据
      config,//自己定制的配置项
      customs:[]//自己定制的固定项
    }
    this.createTime = new Date()
  }
  //2. 初始化存储对象
  initDataBase() {
    //Node判断文件路径是否存在
    const isExist = fs.existsSync(this.path)
    //如果存在的情况下，将去读取文件数据
    if (isExist) {
      try {
        //同步读取文件数据
        const dataBase = fs.readFileSync(this.path, 'utf8')
        this.dataBase = JSON.parse(dataBase)
        console.log(this.dataBase, '读取到的文件数据')
      } catch (e) {
        console.error(e, '文件读取的错误')
      }
    } else {
      //进行初始化操作S
    }
    //直接调用写入对象数据方法   ---在class内部互相调用要加this，后面就不再赘述
    this.updateDataBase()
    console.log(this, isExist, 'xxxx')
  }
  //3. 写入/更新存储对象数据
  updateDataBase(dataBase) {
    // 写入文件数据
    fs.writeFileSync(
      this.path,
      JSON.stringify(dataBase || this.dataBase),
      (err) => { if (err)   console.log('err',err) }
    )
  }
  //4. 新增单条数据
  addItem(item) {
    const maxSize = window.dbItemMaxSize
    //如果传入数据为空的情况，直接return
    if (!item) return
    //进入后如果item有值，放到列表头部
    this.dataBase.data.unshift(item)
     // 达到条数限制，删除最后一位，保持长度
    if (this.dataBase.data?.length > maxSize)  this.dataBase.data.pop()
    this.updateDataBase()
  }
  //5. 更新已有的单条数据
  updateItem(id) {
    //遍历当前存储对象，如果已有重复，则将该数据更新日期改为最新，随后排序
    //ps:此处不推荐使用forEach和map，他们用return只能中断当前循环，还是会执行完所有循环，相对浪费资源
    for (const item of this.dataBase?.data) {
      if (item.id === id) {
        console.log('当前更新的数据', item)
        item.updateTime = new Date().getTime()
        this.sortDataBaseByTime()
        return true
      }
    }
    return false
  }
  //6.数据根据更新时间进行排序
  sortDataBaseByTime() {
    this.dataBase.data = this.dataBase.data.sort((a, b) =>  b.updateTime - a.updateTime)
    //排序后要同步写入到存储文件中
    this.updateDataBase()
  }
  //7. 清空存储数据
  clearDataBase() {
    this.dataBase.data = []
    this.updateDataBase()
  }
  //8.只更新库中的剪切板数据
  updateDataBaseOnlyData(data) {
    this.dataBase = { ...this.dataBase, data }
    // 写入文件数据
    fs.writeFileSync(this.path, JSON.stringify(this.dataBase), err=> { if (err)  console.log('err',err) })
  }
  //9.只更新收藏的数据
  updateDataBaseOnlyCollectors(collectorsTemp=[]){
    let collectors=collectorsTemp
    //如果收藏的数据超过100条，删除
    if(collectorsTemp.length>100)  collectors=collectorsTemp.splice(0,100)
    this.dataBase = { ...this.dataBase, collectors }
    console.log('更新收藏加', collectors)
    window.DB.dataBase.collectors=collectors
    // 写入文件数据
    fs.writeFileSync(this.path, JSON.stringify(this.dataBase), err=> { if (err)  console.log('err',err) })
  }
}
/* *********************************************** E：一、声明存储事件构造函数，封装常用的存储方法以及初始化函数  *********************************************** */

//初始化DB对象  --这时需传入地址路径
const db = new DB(dbPath)
db.initDataBase()
console.log(db, '这时model的db')

//导出初始化好的DB对象
module.exports = db
