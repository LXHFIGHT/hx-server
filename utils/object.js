/**
 * Created by LXHFIGHT on 2019/4/6 11:55.
 * Email: lxhfight1@gmail.com
 * Description:
 *  function for processing js Object
 */

const shuffle = require('knuth-shuffle')
const crypto = require('crypto')
const pinyin = require('pinyin')
const X2JS = require('x2js')

/**
 * 执行将Js对象转换为XML的方法
 * @param {Object} obj
 * @returns {String} xml文本
 */
const createX2JSTools = () => {
  let x2js
  return (function() {
    if (x2js) {
      return x2js
    }
    x2js = new X2JS()
    return x2js
  }())
}
const json2xml = jsonObj => {
  return createX2JSTools().js2xml(jsonObj)
}

/**
 * 对数组乱序处理
 * @param arr 操作对象数组
 */
const randomArray = (arr) => {
  if (!Array.isArray(arr)) {
    return null
  }
  return shuffle(arr)
}

/**
 * 生成随机数
 * @param options 随机生成对象
 * @param options.from 区间下限（包括）
 * @param options.to   区间上限（不包括）
 */
const randomNumber = (options) => {
  if (Object.prototype.toString.call(options) === '[object Number]') {
    return Math.floor(Math.random() * options);
  } else {
    return options.from + Math.floor(Math.random() * Math.abs(options.to - options.from));
  }
}

/**
 * 生成随机字符串，基于0-9  大小写字母
 * @param length 字符串长度
 */
const randomString = (length) => {
  let result = ''
  let tpl = '0123456789qwertyuiopasdfghjklzxcvbnmZXCVBNMASDFGHJKLQWERTYUIOP'
  for (let i = 0; i < length; i++) {
    result += tpl.charAt(randomNumber({from: 0, to: 62}))
  }
  return result
};

/**
 * 加密字符串通用方法 
 * @param {string} str 待处理字符串
 * @param {string} algorithm 加密算法 常见的有 'md5', 'RSA-MD5', 'md5-sha1', 'RSA-SHA1', 'sha1', 'sha256'
 */
const encryptStr = (str, algorithm = 'md5') => {
  if (crypto.getHashes().includes(algorithm)) {
    let shasum = crypto.createHash(algorithm)
    shasum.update(str)
    return shasum.digest('hex')
  } else {
    return { errMsg: `不存在${algorithm}这种加密算法,可选项参照content`, content: supported }
  }
}

/**
 * 获取字符串拼音
 * @param {String} str 待处理字符串 
 */
const getPinyin = (str) => {
  let result = pinyin(str, {
    style: pinyin.STYLE_NORMAL,
    heteronym: false
  })
  return result.join('').toLowerCase()
}

/**
 * 判断该对象中arr数组内的参数名对应的值是否为空，打印判断结果并且返回json
 * @param obj 带判断的结果 例如： { a: 123, b: null, c: 'hello world' }
 * @param arr 不能为空的参数名列表 例如： [{ key: '昵称', value: 'nickname'}, {key: '头像', value: 'avatarUrl' }]
 * @return  判断结果 根据上面两个例子会返回： b, foo 等参数不能为空
 */
let smartValidator = (obj, arr) => {
  let errArr = []
  arr.forEach((v) => {
    if (obj[v.value] == null) {
      errArr.push(v.key)
    }
  })
  if (errArr.length !== 0) {
    return `${errArr.join(',')} ${ errArr.length === 1 ? '' : '等' }参数不能为空`;
  }
  return null;
}

/**
 * 将对象中的空元素排除： 不包含 0
 * @param {Object} obj 目标对象
 * @returns {Object} 排除空元素后的新对象
 */
const getNotNullObject = (obj) => {
  if (typeof obj !== 'object') {
    return {}
  }
  const bundle = Object.assign({}, obj)
  for (let p in bundle) {
    if (!bundle[p] && bundle[p] !== 0) {
      delete bundle[p]
    }
  }
  return bundle
}

/**
 * 防抖工具方法
 * @param {*} fn 需要执行的方法
 * @param {*} duration  防抖延时
 * @returns 
 */
const debounce = (fn, duration) => {
  let timeout = null
  return function () {
    let ctx = this
    let args = arguments
    if (timeout) {
      clearTimeout(timeout)
      timeout= null
    }
    timeout = setTimeout(function() {
      fn instanceof Function && fn.apply(ctx, args)
    }, duration)
  }
}

module.exports = {
  randomArray,
  randomNumber,
  randomString,
  encryptStr,
  getPinyin,
  smartValidator,
  getNotNullObject,
  debounce,
  json2xml
}
