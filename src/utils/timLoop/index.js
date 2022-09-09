const path = require('path')
//此方法 要感谢作者【inu255】，定时器进行读取会有问题，经过排查发现阻塞了，随后翻阅该作者的代码找到解决方案
function newPromise(fn) {
  let a, b
  const tmp = {
    resolve(x) {
      if (this.pending) {
        a(x)
        this.resolved = true
        this.pending = false
      }
    },
    reject(e) {
      if (this.pending) {
        b(e)
        this.rejectd = true
        this.pending = false
      }
    },
    pending: true,
    resolved: false,
    rejected: false,
  }
  /** @type {Promise<T>} */
  const pms = new Promise(function (resolve, reject) {
    a = resolve
    b = reject
    if (fn) fn(tmp.resolve, tmp.reject)
  })
  return Object.assign(pms, tmp)
}

let cbIdx = 1
const cbMap = new Map()
const getWorker = () => {
  if (getWorker.worker) return getWorker.worker
  //处理js卡死的问题
	//在electron环境中使时需要用__dirname，不能用相对路径
  const worker = new Worker(path.join(__dirname, 'worker.js'))
  getWorker.worker = worker
  worker.onmessage = (e) => {
    if (e.data && cbMap.has(e.data.cb)) {
      cbMap.get(e.data.cb).apply(null, e.data.args)
    }
  }
  return worker
}

function call(method, args) {
  const cb = cbIdx++
  let pms = newPromise()
  cbMap.set(cb, function (err, data) {
    if (err) pms.reject(err)
    else pms.resolve(data)
  })
  getWorker().postMessage({
    method,
    args,
    cb,
  })
  return pms
}

function sleep(ms) {
  return call('sleep', [ms])
}
exports.sleep = sleep
