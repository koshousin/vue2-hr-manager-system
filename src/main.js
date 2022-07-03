import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import MyPlugin from '@/components'
import i18n from '@/lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
Vue.use(MyPlugin);
// 注册权限点全局指令
Vue.directive('allow', {
  inserted: (el,binding) => {
    const points = store.state.user.userInfo.roles.points;
    // 如果points有binding.value则显示
    if (points.includes(binding.value)) {
      // console.log('判断这个元素是否会显示', el, binding.value)
    } else {
      // console.log(el.parentNode);
      el.parentNode.removeChild(el);
      // el.style.display = 'none'
    }
  }
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
