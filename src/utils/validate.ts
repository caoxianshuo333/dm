/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str: string): boolean {
  const valid_map = ['admin', 'editor']
  return valid_map.includes(str.trim())
}

/* 合法uri */
export function validateURL(textval: string): boolean {
  const urlregex = /^(?:https?|ftp):\/\/(?:[a-zA-Z0-9.-]+(?::[a-zA-Z0-9.&%$-]+)*@)*(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d?)(?:\.(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}|(?:[a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(?:com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(?::\d+)*(?:\/(?:$|[\w.,?'\\+&%$#=~-]+))*$/
  return urlregex.test(textval)
}
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s: string): boolean {
  return /^[\w-]+@[\w-]+(?:\.[\w-]{2,3}){1,2}$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s: string): boolean {
  return /^1\d{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s: string): boolean {
  return /^(?:\d{3,4}-)?\d{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s: string): boolean {
  return /^https?:\/\/.*/.test(s)
}

/* 小写字母 */
export function validateLowerCase(str: string): boolean {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase(str: string): boolean {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets(str: string): boolean {
  const reg = /^[A-Z]+$/i
  return reg.test(str)
}
/* 验证pad还是pc */
export function vaildatePc(): boolean {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod',
  ]
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email: string): boolean {
  const re = /^(?:[^<>()[\].,;:\s@"]+(?:\.[^<>()[\].,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-0-9]+\.)+[a-z]{2,})$/i
  return re.test(email)
}

/**
 * 判断身份证号码
 */
export function cardid(code: string): [boolean, string] {
  const list: [boolean, string] = [false, '']
  let result = true
  let msg = ''
  const city: Record<string, string> = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  }
  if (!validatenull(code)) {
    if (code.length === 18) {
      if (!code || !(/^[\dX]\d{17}$/i).test(code)) {
        msg = '证件号码格式错误'
      }
      else if (!city[code.substr(0, 2)]) {
        msg = '地址编码错误'
      }
      else {
        // 18位身份证需要验证最后一位校验位
        const codeArray = code.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
        let sum = 0
        let ai = 0
        let wi = 0
        for (let i = 0; i < 17; i++) {
          ai = Number.parseInt(codeArray[i])
          wi = factor[i]
          sum += ai * wi
        }
        if (parity[sum % 11] !== code[17]) {
          msg = '证件号码校验位错误'
        }
        else {
          result = false
        }
      }
    }
    else {
      msg = '证件号码长度不为18位'
    }
  }
  else {
    msg = '证件号码不能为空'
  }
  list[0] = result
  list[1] = msg
  return list
}
/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone: string): [boolean, string] {
  const list: [boolean, string] = [false, '']
  let result = true
  let msg = ''
  const isPhone = /^0\d{2,3}-?\d{7,8}$/
  // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
  if (!validatenull(phone)) {
    if (phone.length === 11) {
      if (isPhone.test(phone)) {
        msg = '手机号码格式不正确'
      }
      else {
        result = false
      }
    }
    else {
      msg = '手机号码长度不为11位'
    }
  }
  else {
    msg = '手机号码不能为空'
  }
  list[0] = result
  list[1] = msg
  return list
}
/**
 * 判断姓名是否正确
 */
export function validatename(name: string): boolean {
  const regName = /^[\u4E00-\u9FA5]{2,4}$/
  if (!regName.test(name))
    return false
  return true
}
/**
 * 判断是否为整数
 */
export function validatenum(num: string | number, type: number): boolean {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(String(num)))
      return false
  }
  else if (type === 2) {
    regName = /\D/g
    if (!regName.test(String(num)))
      return false
  }
  return true
}
/**
 * 判断是否为小数
 */
export function validatenumord(num: string | number, type: number): boolean {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(String(num)))
      return false
  }
  else if (type === 2) {
    regName = /[^\d.]/g
    if (!regName.test(String(num)))
      return false
  }
  return true
}
/**
 * 判断是否为空
 */
export function validatenull(val: any): boolean {
  if (typeof val === 'boolean') {
    return false
  }
  if (typeof val === 'number') {
    return false
  }
  if (val instanceof Array) {
    if (val.length === 0)
      return true
  }
  else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}')
      return true
  }
  else {
    if (val === 'null' || val === null || val === 'undefined' || val === undefined || val === '')
      return true
    return false
  }
  return false
}
