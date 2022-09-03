<template>
  <div class="navbar">
    <div class="logo">
      <img :src="logo" class="navbar-logo" alt="">
    </div>
    <el-menu class="menu" :default-active="activeMenu" mode="horizontal" router>
      <el-menu-item v-for="(route, i) in routes" :key="i" :index="resolvePath(route)">
        <span>{{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
    <el-dropdown class="profile" trigger="click">
      <div class="avatar-wrapper">
        <el-avatar :size="36" :src="avatar" />
        <svg-icon icon-class="caret-bottom" class="btn-avatar"></svg-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <span>Setting</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>Logout</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'Navbar',
  components: { SvgIcon },
  data() {
    return {
      logo: require('@/assets/logo.png'),
      avatar: require('@/assets/avatar.gif')
    }
  },
  computed: {
    routes() {
      const navbarRoutes = []
      const allRoutes = this.$router.options.routes
      allRoutes.forEach(item => {
        if (item.meta['navbar']) {
          navbarRoutes.push(item)
        }
      })
      return navbarRoutes
    },
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    hasOneShowingChild(children = []) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      })

      if (showingChildren.length === 1) {
        return true
      }
      return showingChildren.length === 0;
    },
    resolvePath(route) {
      if (isExternal(route.path)) {
        return route.path
      }
      if (this.hasOneShowingChild(route.children)) {
        return path.resolve(route.path, route.children[0].path)
      }
      return route.path
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      return this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>

</style>
