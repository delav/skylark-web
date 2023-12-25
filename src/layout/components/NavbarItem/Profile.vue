<template>
  <div class="profile">
    <el-dropdown>
      <span style="outline: none">
        {{ userName }}
        <el-icon><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click.native="logout" icon="Right">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import { NotAuthPath } from "@/utils/auth";

export default {
  name: 'Profile',
  computed: {
    userName() {
      return this.$store.getters.name
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      return this.$router.push(`${NotAuthPath.Login}?redirect=${this.$route.fullPath}`)
    },
  }
}
</script>

<style lang="scss" scoped>
.profile {
  margin-right: 48px;
}
</style>
