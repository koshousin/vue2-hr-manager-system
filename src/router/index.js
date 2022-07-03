import Vue from 'vue'
import Router from 'vue-router'
import employeesRouter from './modules/employees'
import approvalsRouter from './modules/approvals'
import attendancesRouter from './modules/attendances'
import departmentsRouter from './modules/departments'
import permissionsRouter from './modules/permissions'
import salarysRouter from './modules/salarys'
import settingsRouter from './modules/settings'
import socialSecuritysRouter from './modules/social_securitys'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes  静态路由表
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName:"login"*/ "@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/import",
    component: Layout,
    hidden: true, // 不显示到左侧菜单
    children: [
      {
        path: "",
        component: () => import("@/views/import"),
      },
    ],
  }, 
];

// 根据用户生成的动态路由
export const dynamicRoutes = [
  // 重点开发以下四个业务模块
  departmentsRouter,
  employeesRouter,
  permissionsRouter,
  settingsRouter,

  salarysRouter,
  socialSecuritysRouter,
  approvalsRouter,
  attendancesRouter,
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 动静路由表结合
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  //console.log(newRouter.matcher,router.matcher);
  router.matcher = newRouter.matcher; // reset router
  //console.log('重置后的数组：',router);
}

export default router
