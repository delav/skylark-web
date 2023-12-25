import router from "./router";
import store from "./store";
import NProgress from "nprogress";
import { ElMessage } from "element-plus";
import { isNotAuthPage, NotAuthPath } from "@/utils/auth";
import { getToken } from "@/utils/auth";
import { isMobile } from "@/utils/other";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  if (isMobile()) {
    next({ path: '/404' })
  }
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === NotAuthPath.Login) {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page
          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`${NotAuthPath.Login}?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (isNotAuthPage(to.path)) {
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`${NotAuthPath.Login}?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
