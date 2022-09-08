// 此组件主要用来存储收藏、定制、配置的数据，兼容uTools会员，它能够同步本地文档
//具体的剪切板内容就不进行同步了，没必要
class UDB {
  //1. 构造函数，传入的是存储的_id
  constructor(key) {
    //初始化存储的_id、存储的对象
    this._id = key
    this.dataBase = {
      collectors: [], //收藏的剪切板数据
      config:{},//自己定制的配置项
      customs:[]//自己定制的固定项
    }
    this.createTime = new Date()
  }
  /* *********************************************** S：封装官方的存取方法  *********************************************** */
  //2-1.获取当前传入key的数据
  getDocByKey(key) {
    //如果key为空，则中断
    if (!key) return
    //因为allDocs是能筛选出key为前缀的所有数据，所以这里要筛选出与key一致的内容，减少外部工作量
    //如果有数据就返回对象，没数据就是undefined，方便外部判断
    return utools.db.allDocs(key).filter((temp) => temp._id == key)?.[0]
  }
  //2-2.执行该方法将会删除数据库文档，可以传入文档对象或文档 id 进行操作。--清空数据库
  clearDataBase(id) {
    return utools.db.remove(id)
  }
  //2-3.执行该方法将会创建或更新数据库文档，文档内容不超过 1M
  put(key, data) {
    //如果没有_id直接中断
    if (!key || !data) return
    //获取当前key在uTools库中所对应的数据
    const dataBase = this.allDocs(key)?.[0] || {}
    //取出已有数据的_id，_rev，用作更新，如果_id为空，则使用传入的key作为_id，如果_rev为空，说明是新建，不为空则带入更新
    const { _id = key, _rev } = dataBase
    //拼凑数据
    const item = { _id, data, _rev }
    console.log('更新写入！！！！！', item)
    return utools.db.put(item)
  }
  /* *********************************************** S： 初始化以及其他方法 *********************************************** */
  //2. 初始化存储对象
  initDataBase() {
    const currData = this.getDocByKey(this._id)
    if (currData) {
      //读取数据存入
      this.dataBase = currData
      const uToolsBaseData = window.uToolsBaseData
      //这里需要判断配置项是否有改动  --通过其生成的id判断
      if(uToolsBaseData){
        //如果有改动，进行相关操作--后续添加
        console.log(uToolsBaseData,"如果有改动，进行相关操作")
      }
      //这里将存储的配置项挂载到window
      window.uToolsBaseData = currData
      console.log(currData, 'currDatacurrDatacurrDatacurrDatacurrData')
    }
  }
}
//初始化DB对象
const uTools_db = new UDB('config')
uTools_db.initDataBase()
//导出初始化好的DB对象
module.exports = uTools_db
