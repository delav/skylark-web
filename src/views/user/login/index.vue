<template>
  <div class="login-container">
    <div class="image-viewer">
      <el-image
        style="width: 85%; height: auto"
        :src="loginImage"
        fit="contain"
      />
    </div>
    <div class="login-box">
      <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginRules">
        <div class="login-image">
          <el-image
            style="width: 180px; height: auto"
            :src="login1Image"
            fit="contain"
          />
        </div>
        <p class="label-desc">Username</p>
        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <p class="label-desc" style="margin-top: 30px">Password</p>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <div class="forgot-password">
          <el-button type="primary" link>Forgot password?</el-button>
        </div>
        <el-button :loading="loading" class="login-button" type="primary" @click.native.prevent="handleLogin">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { encrypt } from "@/utils/auth";

export default {
  name: 'Login',
  data() {
    return {
      loginImage: require('@/assets/login.jpg'),
      logoImage: require('@/assets/logo.png'),
      login1Image: require('@/assets/login-1.png'),
      loginForm: {
        username: '123456@163.com',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const postData = {
            username: this.loginForm.username,
            password: encrypt(this.loginForm.password)
          }
          this.$store.dispatch('user/login', postData).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  min-height: 100vh;
  width: 100%;
  .image-viewer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #e7eef6;
    width: 50%;
  }
  .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 50%;
    .login-image {
      margin-right: auto;
      margin-bottom: 60px;
    }
    .login-form {
      min-width: 400px;
      margin: 0 auto;
      align-items: center;
      justify-content: center;
      .label-desc {
        margin: 0 0 5px 0;
        font-weight: 500;
        font-size: 15px;
        color: #6b778c;
      }
      .svg-container {
        padding: 6px 5px 6px 15px;
        color: #889AA4FF;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
      }
      .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: #889AA4FF;
        cursor: pointer;
        user-select: none;
      }
      .forgot-password {
        margin: 10px 0 10px 0;
        float: right;
      }
      .login-button {
        width: 100%;
        height: 45px;
      }
    }
  }
}
:deep(.el-input) {
  display: inline-block;
  height: 45px;
  width: 85%;
  .el-input__wrapper {
    background: transparent;
    width: 100%;
    padding: 0;
    box-shadow: none;
    input {
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 10px 5px 10px 12px;
      height: 45px;
      font-size: 14px;
    }
  }
}
:deep(.el-form-item) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
