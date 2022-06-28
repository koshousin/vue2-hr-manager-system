import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
import getTitle from '@/utils/get-page-title'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'


// 添加路径白名单
const whiteList = ['/login','/404']

// 添加前置路由守卫
router.beforeEach(async (to,from,next) => {
  const token = getToken();
  if (token) { 
    if (to.path === "/login") {
      console.log("已经登陆，请勿重复登录！");
      next("/");
      NProgress.done();
    } else {
      // 防止多次跳转
      if (!store.state.user.userInfo.userId) {
        await store.dispatch("user/getProfile");
      } 
      next();
    }
  } else {
    // 如果在白名单里
    if (whiteList.indexOf(to.path) > -1) {
      next();
    } else {
      // 存储用户登陆成功后要跳转的页面
      console.log('未登录，转到登录页。');
      next('/login');
      NProgress.done();
    }
  }
});

// 给每个页面添加标题
router.beforeEach((to, from, next) => {
  document.title = getTitle(to.meta.title);
  next();
})

router.afterEach(() => {
  NProgress.done();
})


// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })


