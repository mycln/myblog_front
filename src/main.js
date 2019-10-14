import '@babel/polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import { Modal } from 'iview'
import router from './router'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import Axios from 'axios'
import global from '@/libs/global'
import qs from "qs"
import md5 from 'js-md5'
import has from '@/libs/btnPermissions.js';
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import {initRouter} from '@/libs/util'
/**
 * @description 
 * 发送请求拦截 以及加请求头的参数
 * */
const service = Axios.create({
  timeout: 20000 // request timeout
})
service.interceptors.request.use(function (config) {
 if(config.method=='get'){
      var getUrl = config.url
      if(getUrl.indexOf('?') == '-1'){
          getUrl += '?_=' + (new Date()).getTime()
      }else{
          getUrl += '&_=' +(new Date()).getTime()
      }
      config.url = getUrl
  }
  const  timestamp = new Date().getTime();
  const  sign = md5(sessionStorage.getItem('apiAuth')+"api_1.0.0"+timestamp+"");
  config.headers['token'] = sessionStorage.getItem('apiAuth')||'';
  config.headers['sign'] = sign||'';
  config.headers['timestamp'] = timestamp||'';
  // Spin.show()
  // 在发送请求之前做些什么
  return config;
});
// 响应拦截 
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
service.interceptors.response.use((res) => {
    if (res.status === 200) {
      // 401不是状态码，而是和0 1 类似的code
      if (res.data.code === 401) {
        Modal.error({
          title: '未登录',
          content: '未登录，或登录失效，请登录！'
        });
         window.location.href = '/#/'
      }
      if (res.data.code === 403) {
        Modal.error({
          title: '无访问权限',
          content: '无访问权限！'
        });
        window.location.href = '/#/'
      }
      return res
    }
  }, (error) => {
    // 响应错误统一转到500页面
    if (error.response) {
      Modal.error({
        title: '访问失败',
        content: '网络中断或服务器内部错误，请检查网络或稍后重试！'
      });
    }
    return Promise.reject(error)
  })
Vue.prototype.$axios = service
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
Vue.prototype.$axios = service
Vue.prototype.$GLOBAL = global
Vue.prototype.$qs = qs
Vue.prototype.$objCopy = function(obj){
    let newobj = {}
    for(let i in obj){
        newobj[i] = obj[i]
    }
    return newobj
}
/**
 * 注册指令
 */
importDirective(Vue)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
  mounted () {
    initRouter(this);
  }
})
