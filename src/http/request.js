import axios from "axios";
import store from "@/store";
import router from "@/router";
import { ElMessage } from "element-plus";
import { NotAuthUrl } from "@/utils/auth";
import { getToken, notAuth } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token && notAuth(config.url)) {
      config.headers['Authorization'] = getToken()
    }
    if (!(config.headers['Content-Type'])) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
let status = true
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    const res = response.data
    // if not json response
    const contentType = response.headers['content-type']
    if (contentType !== 'application/json') {
      return response
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 && status) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 2 * 1000
      })
      status = false
      if (res.code === 40100) {
        // to re-login
        router.push({ path: NotAuthUrl.Login }).then(() => {})
        store.dispatch('user/resetToken').then(() => {})
      }
      let timeout = setTimeout(() => {
        status = true
        clearTimeout(timeout)
      }, 1500)
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    if (status) {
      ElMessage({
        message: error.message,
        type: 'error',
        duration: 2 * 1000
      })
      status = false
      let timeout = setTimeout(() => {
        status = true
        clearTimeout(timeout)
      }, 1500)
      return Promise.reject(error)
    }
  }
)

export default service
