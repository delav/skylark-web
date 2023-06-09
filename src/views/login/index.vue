<template>
  <div class="login-container">
    <div class="image-viewer">
      <el-image
        style="width: 500px; height: auto"
        :src="loginImage"
        fit="contain"
      />
    </div>
    <div class="login-box">
<!--      <div class="desc">-->
<!--        <span>skylark</span>-->
<!--      </div>-->
      <el-form ref="loginForm" class="login-form" :model="loginForm" :rules="loginRules" label-position="left">
        <p style="margin: 0 0 5px 0">Username</p>
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
            auto-complete="on"
          />
        </el-form-item>
        <p style="margin: 25px 0 5px 0">Password</p>
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

        <el-button :loading="loading" type="primary" style="width:100%;height:40px;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

        <div class="tips">
          <span style="margin-right:20px;">username: admin</span>
          <span> password: 111111</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginImage: require('@/assets/login.svg'),
      logoImage: require('@/assets/logo.png'),
      loginForm: {
        username: '123456@163.com',
        password: '+LbLATJm7w2F21Dqdp33tA=='
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' }
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
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
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
    background-color: #f3f6f9;
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
    z-index: 1;
    width: 50%;
    .desc {
      text-align: left;
      justify-content: left;
      margin-bottom: 50px;
    }
    .login-form {
      min-width: 400px;
      position: relative;
      margin: 0 auto;
      overflow: hidden;
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
  }
}
:deep(.el-input) {
  display: inline-block;
  height: 48px;
  width: 85%;
  .el-input__wrapper {
    background: transparent;
    width: 100%;
    padding: 0;
    box-shadow: none;
    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #9dd6f0;
      height: 50px;
      caret-color: #fff;
      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px #2D3A4BFF inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
}
:deep(.el-form-item) {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  color: #454545;
}
</style>
