import { constantRoutes } from "@/router"
export default {
  namespaced: true,
  state: {
    menuList:[...constantRoutes]
  },
  mutations: {
    SET_MENU_LIST(state,dynamicRoutes) {
      state.menuList = [...state.menuList, ...dynamicRoutes]
      //console.log('当前菜单项',state.menuList);
    },
    RESET_MENU_LIST(state) {
      state.menuList = [...constantRoutes]
    }
  }
}