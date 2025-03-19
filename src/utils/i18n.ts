import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import { Locale } from 'vant'
import type { PickerColumn } from 'vant'
import zhCNMessages from '../locales/zh-CN.json'
import enUSMessages from '../locales/en-US.json'

const FALLBACK_LOCALE = 'zh-CN' as const
type LocaleType = 'zh-CN' | 'en-US'

const vantLocales = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const messages = {
  'zh-CN': zhCNMessages,
  'en-US': enUSMessages,
}

export const languageColumns: PickerColumn = [
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en-US' },
]

export const i18n = setupI18n()
type I18n = typeof i18n

export const locale = computed({
  get() {
    return i18n.global.locale.value
  },
  set(language: LocaleType) {
    setLang(language, i18n)
  },
})

function setupI18n() {
  const locale = getI18nLocale()

  const i18n = createI18n({
    locale,
    legacy: false,
    messages,
  })
  setLang(locale, i18n)
  return i18n
}

async function setLang(lang: LocaleType, i18n: I18n) {
  document.querySelector('html').setAttribute('lang', lang)
  localStorage.setItem('language', lang)
  i18n.global.locale.value = lang

  // 设置 vant 组件语言包
  Locale.use(lang, vantLocales[lang])
}

// 获取当前语言对应的语言包名称
function getI18nLocale(): LocaleType {
  const storedLocale = localStorage.getItem('language') || navigator.language

  const langs = languageColumns.map(v => v.value as LocaleType)

  // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const foundLocale = langs.find(v => v === storedLocale || v.indexOf(storedLocale) === 0)

  // 若未找到，则使用 默认语言包
  const locale = foundLocale || FALLBACK_LOCALE

  return locale
}
