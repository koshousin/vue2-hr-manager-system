import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
});

service.interceptors.request.use(config => {
  const token = store.state.user.token
  if (token) {
    // 请求头添加 token
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
})

service.interceptors.response.use(res => {
    if (!res.data.success) {
      return Promise.reject(new Error('请求错误'+res.data.message));
    }else {
      // 简化响应回来的数据
      return res.data
    }
  },
  async error => {     // token 失效处理
    if (error.response.data.code === 10002) {
      console.log("token失效");
      await store.dispatch("user/userLogout");
      router.push(
        "/login?return_url=" + encodeURIComponent(router.currentRoute.fullPath)
      );
    }
    return Promise.reject(error)
  }
)

export default service;


// request interceptor ,主要完成 token 的统一注入
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log('axios request interceptor catch an error:',error) // for debug
//     return Promise.reject(error)
//   }
// )

// response interceptor , 主演完成返回的数据异常和数据结构问题
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('interceptor res err:' , error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

