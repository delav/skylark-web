<template>
  <div class="navbar">
    <div class="logo">
      <img :src="logo" class="navbar-logo" alt="">
    </div>
    <div class="router">
      <el-menu class="menu" :default-active="activeMenu" mode="horizontal" router>
        <el-menu-item v-for="(route, i) in routes" :key="i" :index="resolvePath(route)">
          {{ route.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="language">
      <el-dropdown :command="changeLanguage">
        <span class="el-dropdown-link">
          {{ $t('Navbar._language') }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="changeLanguage('CN')">
              <span>中文</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="changeLanguage('US')">
              <span>English</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="profile">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userName }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Setting">
              设置
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout" icon="Right">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";

export default {
  name: 'Navbar',
  data() {
    return {
      logo: require('@/assets/logo.png'),
      avatar: require('@/assets/avatar.gif'),
      lang: {
        'CN': '中文',
        'US': 'English',
      }
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
    },
    userName() {
      return this.$store.getters.name
    }
  },
  methods: {
    changeLanguage(val) {
      console.log('切换语言')
      if (this.$i18n.locale === val) return
      this.$i18n.locale = val
      this.$root.$i18n.locale = val
    },
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
