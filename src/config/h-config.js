/**
 * 项目的通用变量配置文件，写在最外层，方便调整一些常用的参数
 * 此处是初始化配置，后续将会开放可修改配置的功能
 */

module.exports = {
  //轮询剪切板内容的时间间隔
  SCHEDULE_TIME: 500,
  VIEWS_SCHEDULE_TIME: 500,
  //DB数据存储条数的上限设置---500，可以自己设置长度
  DB_ITEM_MAX_SIZE:500,
  //是否为文件存储的方式，如果为否，则使用uTools提供的db接口
  IS_FS_DB:true,
  //列表允许的列数
  LIST_SLICE_NUMBER:7,
  //

}
