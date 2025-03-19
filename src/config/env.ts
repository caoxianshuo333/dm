// 阿里矢量图标库配置
const iconfontVersion = ['567566_pwc3oottzol']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`

// 声明函数
function generatorSsoUrl() {
  const urlValue = window.location.href
  const port = window.location.port
  if (port === '') {
    return window.location.host
  }
  else {
    return `${urlValue.substr(0, urlValue.indexOf(`:${port}/`))}:9000`
  }
}

// 使用 import.meta.env 替代 process.env
const env = import.meta.env

// 使用立即执行函数初始化常量
const baseUrl = (() => {
  if (env.MODE === 'development') {
    return '' // 开发环境地址
  }
  else if (env.MODE === 'production') {
    return '' // 生产环境地址
  }
  else if (env.MODE === 'test') {
    return '' // 测试环境地址
  }
  return ''
})()

const codeUrl = `${baseUrl}/code`

const ssoRequestUrl = (() => {
  if (env.MODE === 'development') {
    return 'http://localhost:8100'
  }
  else {
    return generatorSsoUrl()
  }
})()

const ssoRedirectUrl = window.location.origin

export {
  baseUrl,
  ssoRequestUrl,
  ssoRedirectUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env,
}
