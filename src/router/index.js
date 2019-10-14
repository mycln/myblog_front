import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
Vue.use(Router)
const router = new Router({
  routes,
  // mode: 'history',
})

const HOME_PAGE_NAME = 'home'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if(to.name == 'login' &&  from.name){
    router.go(0)
    next({  
      name: 'login' //  退出的时候刷新页面
    })
  }
  const token =sessionStorage.getItem('apiAuth')
  if (!token && to.name !== 'login') {
    // 未登录且要跳转的页面不是登录页
    iView.LoadingBar.finish()
    next({
      name: 'login' // 跳转到登录页
    })
  } else if (!token && to.name === 'login') {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    next({
      name: 'home' // 跳转到homeName页
    })
  } else if(token && sessionStorage.getItem('username') && to.name !='login'){
     // 已登录且要跳转的页面不是登录页
     next();
  }else{
    next({
      name: 'login' // 跳转到登录页
    })
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  // window.scrollTo(0, 0);
  document.body.scrollTop = 0;
})

export default router
