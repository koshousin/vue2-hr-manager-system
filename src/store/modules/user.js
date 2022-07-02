import { getToken, setToken, removeToken } from '@/utils/auth'
import { login,getUserProfile,getUserDetailById} from '@/api/user'; 
import { resetRouter } from "@/router";

export default {
  namespaced:true,
  state: {
    token: getToken() || null,
    userInfo:{}
  },
  mutations: {
    SET_TOKEN(state,str) {
      state.token = str;
      setToken(str);
    }, 
    SET_USER_PROFILE(state,data) {
      state.userInfo = data;
    },
    REMOVE_TOKEN(state) {
      state.token = null;
      removeToken();
    },
    REMOVE_USER_PROFILE(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async userLogin({ commit }, data) {
      try {
        const { data: token } = await login(data);
        console.log('token',token);
        commit('SET_TOKEN',token);
      } catch (error) {
        console.log('请求登录失败：',error);
      }
    },
    async getProfile({commit}) {
      try {
        const rs = await getUserProfile();
        const info = await getUserDetailById(rs.data.userId);
        commit('SET_USER_PROFILE', { ...rs.data, ...info.data });
        return rs.data.roles.menus;
      } catch (error) {
        console.log('获取用户信息失败');
      }
    },
    userLogout({commit}) {
      commit("REMOVE_TOKEN");
      commit("REMOVE_USER_PROFILE");
      // commit('menuList/SET_MENU_LIST',[]);
      //重置路由
      resetRouter();
    }
  }
}
