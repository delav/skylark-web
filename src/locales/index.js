import { createI18n } from 'vue-i18n'
import CN from './zh-CN'
import US from './en-US'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  global: true,
  locale: 'CN',
  fallbackLocale: 'CN',
  silentTranslationWarn: true,
  messages: {
    CN,
    US,
  }
})

export default i18n
