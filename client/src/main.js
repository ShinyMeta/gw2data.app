import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
Object.defineProperty(Vue.prototype, '$axios', {value: axios})

Vue.config.productionTip = false

console.log(process.env.NODE_ENV)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
