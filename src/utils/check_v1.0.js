var objLeft = { "key": "123", "student": { "name": "zyu", "sex": "1" }, "value": { "city": "厦门" } }
var objRight = { "key": "123", "student": { "name": "zyu", "phone": "13163977252" }, "value": "历史" }

// 表达式                        返回值
// typeof undefined        'undefined'
// typeof null                 'object'
// typeof true                 'boolean'
// typeof 123                'number'
// typeof "abc"            'string'
// typeof function() {}    'function'
// typeof {}                 'object'
// typeof []                 'object'

/**
 * 校验左边的对象
 */
function checkLeft(child_left_obj, child_right_obj) {

  let c_obj_left = Object.keys(child_left_obj)
  let c_obj_right = Object.keys(child_right_obj)

  c_obj_left.filter(item => {
    // 判断如果右边对象不存在该字段，则添加标注
    if (c_obj_right.indexOf(item) === -1) {
      child_left_obj['$L.' + item] = child_left_obj[item]
      delete child_left_obj[item];
    } else {
      // 判断如果属性不同也标注
      if (typeof child_right_obj[item] !== typeof child_left_obj[item]) {
        child_left_obj['$L.' + item] = child_left_obj[item]
        delete child_left_obj[item];

      } else if (typeof child_left_obj[item] === 'object') {
        // 判断value 是否为 Object 
        checkLeft(child_left_obj[item], child_right_obj[item])
      }
    }
  })
}

function checkRight(child_left_obj, child_right_obj) {

  let c_obj_left = Object.keys(child_left_obj)
  let c_obj_right = Object.keys(child_right_obj)

  c_obj_right.filter(item => {
    // 判断如果右边对象不存在该字段，则添加标注
    if (c_obj_left.indexOf(item) === -1) {
      child_right_obj['$R.' + item] = child_right_obj[item]
      delete child_right_obj[item];
    } else {

      // 判断如果属性不同也标注
      if (typeof child_right_obj[item] !== typeof child_left_obj[item]) {
        child_right_obj['$R.' + item] = child_right_obj[item]
        delete child_right_obj[item];

      } else if (typeof child_right_obj[item] === 'object') {
        // 判断value 是否为 Object 
        checkRight(child_left_obj[item], child_right_obj[item])
      }

    }
  })
}

/**
 * 对象深度拷贝
 */
var clone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
}

var newObjLeft = clone(objLeft)
var newObjRigt = clone(objRight)

checkLeft(newObjLeft, newObjRigt)
checkRight(newObjLeft, newObjRigt)

console.log('check_left --- ', objLeft)
console.log('check_right --- ', objRight)

console.log('check_left --- ', newObjLeft)
console.log('check_right --- ', newObjRigt)


