/**
 * 工具类
 */
const crypto = require('crypto') //加密工具
const time = require('./timLoop/index')
const { clipboard } = require('electron') //
//引入配置的变量
const { SCHEDULE_TIME } = require('../config/h-config')
/**
 * 1. 获取剪切板内容并进行数据格式转换 --随后根据剪切板中数据的类型返回不同的文件类型
 * @returns 返回文件数据,如果没有数据则不返回
 */
const getClipboard = () => {
  //Ⅰ- 先获取剪切板中html内容
  const html = clipboard.readHTML()
  //Ⅱ- 获取剪切板中的文字类型，如果不为空则返回文字类型
  const text = clipboard.readText()
      // Ⅲ - 首先判断剪切板中的html类型，如果不为空则返回html类型,但是内容要返回text的，否则网页上复制东西会影响样式
    //（1）如果是html，但是又获取不到它的文字，说明可能是文件或者图片
    if (html&&text.trim()) return { type: 'html', data: text }
    //（2）排除了html格式，如果文本不为空，就说明是文本，否则可能是图片或者文件
  if (text.trim()) return { type: 'text', data: text }
    // Ⅳ - 如果是图片类型，返回图片数据类型    --- 图片要优先于文件判断，因为图片可能会被认为file(属于file)
    const image = clipboard.readImage()
    if (!image.isEmpty()) {
      const data = image.toDataURL()
      return {
        type: 'image',
        size: `${image.getSize().width}x${image.getSize().height}`,
        data: data,
      }
    }
  // Ⅴ - 如果获取的到文件，就返回文件类型数据
  const files = utools.getCopyedFiles()
  if (files) {
    return {
      type: 'file',
      data: JSON.stringify(files),
    }
  }
}

/**
 *  2. 轮询获取剪切板内容加入到dataBase
 * 为何要判断id与最近一次复制的是否一致？ --因为是轮询，一定时间会执行一次，不进行对比会出现重复的剪切板数据
 * @param {*} dataBase 存储的数据
 * @param {*} fn 轮询的回调函数，新增单条记录或者更新已有复制项的时间
 */
const scheduleClipboard = (dataBase, fn) => {
  //获取当前存储数据中的第一位
  let last = dataBase.data?.[0] || []
  const loop=() =>{
    //不断调用自身
    time.sleep(SCHEDULE_TIME).then(loop)
    let item = getClipboard()
    //如果剪切板为空就中断当前按执行函数
    if (!item) return
    //根据当前剪切板内容生成id--一样的内容会生成一样的id，以此来做是否重复的验证
    item.id = crypto.createHash('md5').update(item.data).digest('hex')
    //如果当前剪切板的id与历史数据中的第一位的id一致（即同一个数据），就不进行存储操作
    if (item && last.id != item.id) {
      //如果与之前不一致，这时候首先需要将item传入回调函数中
      fn(item)
      //同时将当前的获取到的数据赋值给存放 【上一次数据】的变量，用作下一次的对比
      last = item
    }
  }
  //首次调用
  loop()
}

//3. 调用utools的复制方法
const copy = (item) => { 
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
}

//4. uTools的剪切方法
const paste = () => {
  //注意：粘贴的时候一定要先关闭窗口，否则焦点无法回到当前光标处，就无法正常粘贴
  utools.hideMainWindow()
  if (utools.isMacOs()) utools.simulateKeyboardTap('v', 'command')
  else utools.simulateKeyboardTap('v', 'ctrl')
}
//转换时间戳为字符串显示格式
const formatDateToString = (timestamp) => {
  //获取时间差
  const timeDifference = new Date().getTime() - new Date(timestamp).getTime()
  //转换显示的格式
  const day = Math.floor(timeDifference / 1000 / 60 / 60 / 24) // 天
  if (day > 0) return `${day}天前`
  const hour = Math.floor(timeDifference / 1000 / 60 / 60) // 小时
  if (hour > 0) return `${hour}小时前`
  const minute = Math.floor(timeDifference / 1000 / 60) // 分
  if (minute > 0) return `${minute}分钟前`
  return '刚刚'
}

//转换时间戳为字符串显示格式  --时分秒的形式
const formatDateToTime = (timestamp) => {
    //获取时间差
    const timeDifference = new Date().getTime() - new Date(timestamp).getTime()
    //转换显示的格式
    const day = Math.floor(timeDifference / 1000 / 60 / 60 / 24) // 天
  //获取时间差
   const temp = new Date(timestamp)
    //如果超过一天，就显示日期
    if (day > 0)  return temp.toLocaleDateString()

  //如果不超过一天，就只显示时分秒
  return temp.toLocaleTimeString()
  // const h = temp.getHours()
  // const hours = h > 9 ? h : '0' + h
  // const m = temp.getMinutes()
  // const min = m > 9 ? m : '0' + m
  // const s = temp.getSeconds()
  // const sec = s > 9 ? s : '0' + s
  // return `${hours}:${min}:${sec}`
}

module.exports = {
  scheduleClipboard,
  copy,
  paste,
  formatDateToString,
  formatDateToTime,
}
