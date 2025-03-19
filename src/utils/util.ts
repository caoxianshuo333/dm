import { validatenull } from './validate'
// 表单序列化
export function serialize(data: Record<string, any>): string {
  const list: string[] = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}
export function getObjType(obj: any): string {
  const toString = Object.prototype.toString
  const map: Record<string, string> = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
export function getViewDom(): HTMLElement | null {
  const el = window.document.getElementById('avue-view')
  return el ? el.getElementsByClassName('el-scrollbar__wrap')[0] as HTMLElement : null
}
/**
 * 对象深拷贝
 */
export function deepClone(data: any): any {
  const type = getObjType(data)
  let obj: any
  if (type === 'array') {
    obj = []
  }
  else if (type === 'object') {
    obj = {}
  }
  else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  }
  else if (type === 'object') {
    for (const key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}
/**
 * 设置灰度模式
 */
export function toggleGrayMode(status: boolean): void {
  if (status) {
    document.body.className = `${document.body.className} grayMode`
  }
  else {
    document.body.className = document.body.className.replace(' grayMode', '')
  }
}
/**
 * 设置主题
 */
export function setTheme(name: string): void {
  document.body.className = name
}

// 添加CryptoJS的接口声明
declare global {
  interface Window {
    CryptoJS: any
  }
}

/**
 * 加密处理
 */
interface EncryptionParams {
  data: Record<string, any>
  type: 'Base64' | 'Aes'
  param: string[]
  key: string
}

export function encryption(params: EncryptionParams): Record<string, any> {
  const {
    data,
    type,
    param,
    key,
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele])
    })
  }
  else if (type === 'Aes') {
    param.forEach((ele) => {
      result[ele] = window.CryptoJS.AES.encrypt(result[ele], key).toString()
    })
  }
  return result
}

/**
 * 浏览器判断是否全屏
 */
export function fullscreenToggel(): void {
  if (fullscreenEnable()) {
    exitFullScreen()
  }
  else {
    reqFullScreen()
  }
}
/**
 * esc监听全屏
 */
export function listenfullscreen(callback: () => void): void {
  function listen() {
    callback()
  }

  document.addEventListener('fullscreenchange', () => {
    listen()
  })
  document.addEventListener('mozfullscreenchange', () => {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', () => {
    listen()
  })
  document.addEventListener('msfullscreenchange', () => {
    listen()
  })
}
/**
 * 浏览器判断是否全屏
 */
export function fullscreenEnable(): boolean {
  const doc: any = document
  const isFullscreen = doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen
  return !!isFullscreen
}

/**
 * 浏览器全屏
 */
export function reqFullScreen(): void {
  const doc: any = document.documentElement
  if (doc.requestFullScreen) {
    doc.requestFullScreen()
  }
  else if (doc.webkitRequestFullScreen) {
    doc.webkitRequestFullScreen()
  }
  else if (doc.mozRequestFullScreen) {
    doc.mozRequestFullScreen()
  }
}
/**
 * 浏览器退出全屏
 */
export function exitFullScreen(): void {
  const doc: any = document
  if (doc.exitFullScreen) {
    doc.exitFullScreen()
  }
  else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen()
  }
  else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen()
  }
}
/**
 * 递归寻找子类的父类
 */
interface MenuItem {
  id: string | number
  children: MenuItem[]
  [key: string]: any
}

export function findParent(menu: MenuItem[], id: string | number): MenuItem | undefined {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children.length !== 0) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i]
        }
        else {
          if (menu[i].children[j].children.length !== 0) {
            return findParent(menu[i].children[j].children, id)
          }
        }
      }
    }
  }
  return undefined
}
/**
 * 判断2个对象属性和值是否相等
 */

/**
 * 动态插入css
 */

export function loadStyle(url: string): void {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}
/**
 * 判断路由是否相等
 */
export function diff(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  delete obj1.close
  const o1 = obj1 instanceof Object
  const o2 = obj2 instanceof Object
  if (!o1 || !o2) { /*  判断不是对象  */
    return obj1 === obj2
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object
    const t2 = obj2[attr] instanceof Object
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr])
    }
    else if (obj1[attr] !== obj2[attr]) {
      return false
    }
  }
  return true
}

interface DictionaryItem {
  label: string
  value: string | number | boolean
}

/**
 * 根据字典的value显示label
 */
export function findByvalue(dic: DictionaryItem[], value: any): string {
  let result: string[] = []
  if (validatenull(dic))
    return String(value)
  if (typeof (value) === 'string' || typeof (value) === 'number' || typeof (value) === 'boolean') {
    let index = 0
    index = findArray(dic, value)
    if (index !== -1) {
      result = [dic[index].label]
    }
    else {
      result = [String(value)]
    }
  }
  else if (value instanceof Array) {
    let index = 0
    value.forEach((ele) => {
      index = findArray(dic, ele)
      if (index !== -1) {
        result.push(dic[index].label)
      }
      else {
        result.push(String(ele))
      }
    })
  }
  return result.join(',')
}

/**
 * 根据字典的value查找对应的index
 */
export function findArray(dic: DictionaryItem[], value: string | number | boolean): number {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i
    }
  }
  return -1
}
/**
 * 生成随机len位数字
 */
export function randomLenNum(len, date) {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len || 4)
  if (date)
    random = random + Date.now()
  return random
}

interface ExtendedScreen extends Screen {
  left?: number
  top?: number
}

export function openWindow(url: string, title: string, w: number, h: number): void {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (screen as ExtendedScreen).left || 0
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (screen as ExtendedScreen).top || 0

  const width = window.innerWidth || document.documentElement.clientWidth || screen.width
  const height = window.innerHeight || document.documentElement.clientHeight || screen.height

  const left = ((width / 2) - (w / 2)) + dualScreenLeft
  const top = ((height / 2) - (h / 2)) + dualScreenTop
  const newWindow = window.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`)

  // Puts focus on the newWindow
  if (window.focus && newWindow) {
    newWindow.focus()
  }
}

/**
 * 获取顶部地址栏地址
 */
export function getTopUrl() {
  return window.location.href.split('/#/')[0]
}

/**
 * 获取url参数
 * @param name 参数名
 */
export function getQueryString(name: string): string | null {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r !== null)
    return unescape(decodeURI(r[2]))
  return null
}

interface ExtendedNavigator extends Navigator {
  msSaveOrOpenBlob?: (blob: Blob, filename: string) => void
  msSaveBlob?: (blob: Blob, filename: string) => void
}

export function downloadFileBlob(path: string, name: string): void {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      // 如果是IE10及以上，不支持download属性，采用msSaveOrOpenBlob方法，但是IE10以下也不支持msSaveOrOpenBlob
      if ('msSaveOrOpenBlob' in navigator) {
        (navigator as ExtendedNavigator).msSaveOrOpenBlob?.(this.response, name)
        return
      }
      const url = URL.createObjectURL(this.response)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }
}

export function downloadFileBase64(path: string, name: string): void {
  const xhr = new XMLHttpRequest()
  xhr.open('get', path)
  xhr.responseType = 'blob'
  xhr.send()
  xhr.onload = function () {
    if (this.status === 200 || this.status === 304) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.response)
      fileReader.onload = function () {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = this.result as string
        a.download = name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    }
  }
}

interface ExtendedWindow extends Window {
  chrome?: any
}

export function downloadXls(fileArrayBuffer: ArrayBuffer, filename: string): void {
  const data = new Blob([fileArrayBuffer], { type: 'application/vnd.ms-excel,charset=utf-8' })
  if (typeof (window as ExtendedWindow).chrome !== 'undefined') {
    // Chrome
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(data)
    link.download = filename
    link.click()
  }
  else if (typeof (window.navigator as ExtendedNavigator).msSaveBlob !== 'undefined') {
    // IE
    const blob = new Blob([data], { type: 'application/force-download' });
    (window.navigator as ExtendedNavigator).msSaveBlob?.(blob, filename)
  }
  else {
    // Firefox
    const file = new File([data], filename, { type: 'application/force-download' })
    window.open(URL.createObjectURL(file))
  }
}
