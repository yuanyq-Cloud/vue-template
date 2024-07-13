import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import ElementUI from 'element-ui'

import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import i18nWord from '../i18n/common.json' // 使用本地common.json的形式
let enLocale = i18nWord['en-US']
let zhLocale = i18nWord['zh-CN']

Vue.use(VueI18n)
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})
const messages = {
    'en-US': {
        ...enLocale,
        ...elementEnLocale
    },
    'zh-CN': {
        ...zhLocale,
        ...elementZhLocale
    }
}

const lang = Cookies.get('lang') || 'zh-CN'
const i18n = new VueI18n({
    // set locale
    locale: lang,
    silentTranslationWarn: true,
    // set locale messages
    messages
})
/** 使用i18nOnline */

// function loadLanguageAsync() {
//     import(`@/i18nOnline/${lang}.js`).then((result) => {
//         i18n.mergeLocaleMessage(lang, result.default)
//     })
// }
// Vue.prototype.loadLanguageAsync = loadLanguageAsync
// loadLanguageAsync()

export default i18n
