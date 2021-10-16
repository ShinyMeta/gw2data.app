import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import vuetify from './plugins/vuetify';
import client from 'gw2api-client'
import cacheMemory from 'gw2api-client/src/cache/memory'
const api = client()
api.cacheStorage([cacheMemory()])

Object.defineProperty(Vue.prototype, '$axios', {value: axios})
Object.defineProperty(Vue.prototype, '$gw2api', {value: api})

Vue.config.productionTip = false
Vue.use(AsyncComputed)

console.log(process.env.NODE_ENV)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
