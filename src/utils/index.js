/**
 * 工具类
 */
const crypto = require('crypto') //加密工具
const fs = require('fs')
const time = require('./timLoop/index')
const { clipboard } = require('electron') //
//引入配置的变量
const { SCHEDULE_TIME } = require('../config/h-config')

//0 - 获取小图片文件   --非常重要的操作，关乎性能
const getSmallImgFile = (files) => {
  let result = undefined
  //（1）如果只有一个文件的情况,我们要去判断是否是图片，如果是小图，就直接当作图片展示
  if (files?.length == 1) {
    const file = files[0]
    const fileName = file.name
    const filePath = file.path
    //(2)如果文件是图片类型，我们进一步判断文件大小，如果小于100KB就当作图片渲染
    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|svg)$/.test(fileName)) {
      //(2-1)通过fs获取文件，随后获取文件大小
      const stats = fs.statSync(filePath)
      const fileSizeInBytes = Number(stats['size'])
      const imageSize = fileSizeInBytes / 1024 / 100 //100KB == 1
      //(2-2)如果文件小于100kb 去调用剪切板的读取图片函数，随后返回图片格式的内容
      if (imageSize < 1) {
        //注意，如果是直接复制图片文件，仍然是判断成文件而不是图片
        //如果比如：从聊天框中复制的，将图片文件放到聊天框再剪切，就转换成了图片
        const image = clipboard.readImage()
        if (!image.isEmpty()) {
          const data = image.toDataURL()
          result = {
            type: 'image',
            size: `${image.getSize().width}x${image.getSize().height}`,
            data: data,
          }
        }
      }
    }
  }
  return result
}
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
  if (html && text.trim()) return { type: 'html', data: text }
  //（2）排除了html格式，如果文本不为空，就说明是文本，否则可能是图片或者文件
  if (text.trim()) return { type: 'text', data: text }
  // Ⅳ - 如果获取的到文件，就返回文件类型数据
  const files = utools.getCopyedFiles()
  //（1） 获取文件中的小图片文件   --注意，如果是直接复制图片文件，仍然是判断成文件而不是图片
  //为什么要这么麻烦要专门转换？ 如果不判断小图片文件进行转换，会将很多情况下的图片都转换成了文件进行了展示；
  //为什么要限制【小】，而不是直接图片文件就转换成图片格式？ 如果不判断大小，复制的图片如果是几十M的情况下，我们定时器轮询读取图片就会耗费大量的CPU（后续会进行配置，但默认0.5s就会获取一次，并且开了多线程，就会短时间占用大量CPU）
  const res= getSmallImgFile(files)
  //（2） 如果取到了值，就中断函数执行，把小图片文件转换成图片格式
  if (res) return res
  //（3） 如果不是小图片文件，就返回文件格式数据
  if (files) {
    return {
      type: 'file',
      data: JSON.stringify(files),
    }
  }
  // Ⅴ - 如果是图片类型，返回图片数据类型    --- 踩过的坑：图片要优先于文件判断，因为图片可能会被认为file(属于file)（不可行） 问题：如果读取的是大文件，会占用很大的cpu资源！特别是开多线程的情况，所以还是需要放到文件读取下面
  // 所以图片必须在最后判断，防止出现复制大图时使用【clipboard.readImage】方法导致剪切板CPU被大量占据的问题！！区别是如果图片被误认为文件的情况，再进行小图片判断，能优化用户体验
  const image = clipboard.readImage() //
  if (!image.isEmpty()) {
    const data = image.toDataURL()
    return {
      type: 'image',
      size: `${image.getSize().width}x${image.getSize().height}`,
      data: data,
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
  const loop = () => {
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

//5转换时间戳为字符串显示格式  --时分秒的形式
const formatDateToTime = (timestamp) => {
  //获取时间差
  const timeDifference = new Date().getTime() - new Date(timestamp).getTime()
  //转换显示的格式
  const day = Math.floor(timeDifference / 1000 / 60 / 60 / 24) // 天
  //获取时间差
  const temp = new Date(timestamp)
  //如果超过一天，就显示日期
  if (day > 0) return temp.toLocaleDateString()

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

// 节流
const throttle = (callback, delay) => {
  let timer
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      // 此处设置apply 是为了保证函数上下文不改变
      callback.apply(this, arguments)
      //清理定时器
      clearTimeout(timer)
    }, delay)
  }
}
module.exports = {
  scheduleClipboard,
  copy,
  paste,
  formatDateToString,
  formatDateToTime,
  throttle,
}
