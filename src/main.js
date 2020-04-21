import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import './assets/css/reset.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1/api/private/v1/'

// 增加一个拦截器
axios.interceptors.response.use(response => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, error => {
  if (error.message) {
    Vue.prototype.$message.closeAll()
    Vue.prototype.$message({
      type: 'error',
      message: error.message
    })
  }
})

axios.interceptors.request.use(config => {
  // Do something before request is sent
  if (sessionStorage.getItem('token')) {
    config.headers.Authorization = sessionStorage.getItem('token')
  }
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
