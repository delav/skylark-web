<template>
  <div class="reset">
    <div class="content">
      <el-form
        ref="resetFrom"
        :model="resetFrom"
        :rules="resetRules"
        label-width="120px"
      >
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="resetFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="resetFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="resetFrom.confirm_password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="captcha">
          <el-input
            style="float: left;width: 257px"
            v-model="resetFrom.captcha"
          >
          </el-input>
          <el-button
            style="float: left;margin-left: 20px"
            type="warning"
            @click="sendEmailCaptcha"
            :disabled="disabledSend"
          >发送验证码</el-button>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click.native.prevent="commitResetPassword">提交</el-button>
          <el-button @click="routeToLogin">返回登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetPrecheck, resetConfirm } from "@/api/user";
import {encrypt, NotAuthPath} from "@/utils/auth";

export default {
  name: 'Reset',
  data() {
    return {
      resetFrom: {
        email: '',
        password: '',
        confirm_password: '',
        captcha: ''
      },
      resetRules: {
        email: [
          { required: true, trigger: 'blur', message: '邮箱不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        confirm_password: [
          { required: true, trigger: 'blur', message: '确认密码不能为空' }
        ],
        captcha: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      },
      disabledSend: false
    }
  },
  mounted() {
    this.resetFrom.email = this.$route.params.email
  },
  methods: {
    routeToLogin() {
      this.$router.push({name: 'Login'})
    },
    validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      return emailRegex.test(email)
    },
    sendEmailCaptcha() {
      const params = {
        email: this.resetFrom.email
      }
      if (!this.validateEmail(params.email)) {
        this.$message.error('请检查邮箱格式是否正确')
        return
      }
      resetPrecheck(params).then(() => {
        this.disabledSend = true
        this.$message.success('验证码已发送到您的邮箱')
      })
    },
    commitResetPassword() {
      this.$refs.resetFrom.validate(valid => {
        if (valid) {
          if (!this.validateEmail(this.resetFrom.email)) {
            this.$message.error('请检查邮箱格式是否正确')
            return
          }
          const postData = {
            email: this.resetFrom.email,
            password: encrypt(this.resetFrom.password),
            confirm_password: encrypt(this.resetFrom.confirm_password),
            captcha: this.resetFrom.captcha
          }
          resetConfirm(postData).then(() => {
            this.$message.success('重置密码成功')
            this.$router.push(NotAuthPath.Login)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reset {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .content {
    width: 500px;
    margin-top: 10%;
  }
}
</style>
