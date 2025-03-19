import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { isURL } from '@/utils/validate'
import website from '@/config/website'
import { Base64 } from 'js-base64'
import crypto from '@/utils/crypto'

// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = website?.tokenHeader || 'Access-Token'

// NProgress 配置
NProgress.configure({
  showSpinner: false,
})

// 扩展 InternalAxiosRequestConfig 类型，添加 meta 属性
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  meta?: {
    isToken?: boolean
    isSerialize?: boolean
    [key: string]: any
  }
}

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: '',
  timeout: 100000, // 更新为与原配置一致的超时时间
  validateStatus(status) {
    return status >= 200 && status <= 500
  },
  withCredentials: true, // 跨域请求，允许保存cookie
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
  error_description?: string
  code?: number
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  NProgress.done()

  if (error.response) {
    const { data = {}, status, statusText } = error.response
    const message = data.message || data.errorMessage || data.error_description || statusText || '未知错误'
    const statusWhiteList = website?.statusWhiteList || []

    // 如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) {
      return Promise.reject(error.response)
    }

    // 401 未登录/未授权
    if (status === 401) {
      showNotify({
        type: 'danger',
        message: 'Authorization verification failed',
      })
      // 跳转登录页面
      // store.dispatch('FedLogOut').then(() => router.push({path: '/login'}))
    }
    else if (status === 403) {
      // 403 无权限
      showNotify({
        type: 'danger',
        message,
      })
    }
    else {
      showNotify({
        type: 'danger',
        message,
      })
    }
  }

  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig | Promise<ExtendedAxiosRequestConfig> {
  // 开启 progress bar
  NProgress.start()

  // 地址为已经配置状态则不添加前缀
  if (config.url && !isURL(config.url) && !config.url.startsWith(import.meta.env.VITE_APP_API_BASE_URL)) {
    config.url = import.meta.env.VITE_APP_API_BASE_URL + config.url
  }

  const meta = config.meta || {}

  // headers判断是否需要
  const authorization = config.headers?.authorization === false
  if (!authorization && website?.clientId && website?.clientSecret) {
    config.headers.Authorization = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`
  }

  // headers判断请求是否携带token
  const isToken = meta.isToken === false
  // headers传递token是否加密
  const cryptoToken = config.headers?.cryptoToken === true
  // 判断传递数据是否加密
  const cryptoData = config.headers?.cryptoData === true

  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  if (savedToken && !isToken) {
    config.headers[REQUEST_TOKEN_KEY] = cryptoToken
      ? `crypto ${crypto.encryptAES(savedToken, crypto.cryptoKey)}`
      : `bearer ${savedToken}`
  }

  // 开启报文加密
  if (cryptoData) {
    if (config.params) {
      const data = crypto.encryptAES(JSON.stringify(config.params), crypto.aesKey)
      config.params = { data }
    }
    if (config.data) {
      config.headers['Content-Type'] = 'text/plain'
      config.data = crypto.encryptAES(JSON.stringify(config.data), crypto.aesKey)
    }
  }

  // headers中配置text请求
  if (config.headers?.text === true) {
    config.headers['Content-Type'] = 'text/plain'
  }

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && meta.isSerialize === true) {
    const serialize = (obj: any) => {
      const params: string[] = []
      Object.keys(obj).forEach((key) => {
        params.push(`${key}=${encodeURIComponent(obj[key])}`)
      })
      return params.join('&')
    }
    config.data = serialize(config.data)
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }

  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: any) {
  // 关闭 progress bar
  NProgress.done()

  // 获取状态码
  const status = response.data.code || response.status
  const statusWhiteList = website?.statusWhiteList || []
  const message = response.data.msg || response.data.error_description || '未知错误'
  const config = response.config
  const cryptoData = config.cryptoData === true

  // 如果在白名单里则自行catch逻辑处理
  if (statusWhiteList.includes(status))
    return Promise.reject(response)

  // 如果请求为非200则统一处理
  if (status !== 200) {
    // 如果是401则跳转到登录页面
    if (status === 401) {
      showNotify({
        type: 'danger',
        message,
      })
      // store.dispatch('FedLogOut').then(() => router.push({path: '/login'}))
    }
    else {
      showNotify({
        type: 'danger',
        message,
      })
    }
    return Promise.reject(new Error(message))
  }

  // 解析加密报文
  if (cryptoData) {
    response.data = JSON.parse(crypto.decryptAES(response.data, crypto.aesKey))
  }

  return response.data
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
