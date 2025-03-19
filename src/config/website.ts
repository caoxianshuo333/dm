/**
 * 全局配置文件
 */
import { ssoRedirectUrl, ssoRequestUrl } from './env'

export default {
  title: 'tk_dm_app',
  logo: 'S',
  key: 'tk_device', // 配置主键,目前用于存储
  indexTitle: '图快设备管理APP',
  clientId: 'tk_device', // 客户端id
  clientSecret: 'tk_device_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: '000000', // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  switchMode: false, // 是否开启部门切换模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  // http的status默认放行列表
  statusWhiteList: [],
  // 配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '首页',
    value: '/wel/index',
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard',
    },
    group: [],
    close: false,
  },
  // 配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children',
    },
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
  // 单点登录系统认证(blade-auth服务的地)
  ssoUrl: `${ssoRequestUrl}/oauth/authorize?client_id=tk_device&response_type=code&redirect_uri=`,
  // 单点登录回调地址(Saber服务的地址)
  redirectUri: ssoRedirectUrl,
}
