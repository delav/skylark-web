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
    <div class="info">
      <div class="handbook">
        <el-link type="primary" :underline="false"><el-icon><Document /></el-icon>用户手册</el-link>
      </div>
      <div class="divider"></div>
      <div class="feedback">
        <el-link type="primary" :underline="false"><el-icon><EditPen /></el-icon>意见反馈</el-link>
      </div>
      <div class="divider"></div>
      <div class="notice">
        <el-badge :value="noticeMsgNum" :hidden="!noticeMsgNum" :max="9" class="item">
          <el-popover
            placement="top-start"
            title="Title"
            :width="200"
            trigger="hover"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <el-link :underline="false">
                <el-icon :size="18"><Bell /></el-icon>
              </el-link>
            </template>
          </el-popover>
        </el-badge>
      </div>
      <div class="divider"></div>
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
      <div class="divider"></div>
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
  </div>
</template>

<script>
import path from "path";
import { NotAuthUrl } from "@/utils/auth";
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
      },
      noticeMsgNum: 2
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
      const route = this.$route
      const { meta, path } = route
      if (meta['activeMenu']) {
        return meta['activeMenu']
      }
      return path
    },
    userName() {
      return this.$store.getters.name
    }
  },
  methods: {
    changeLanguage(val) {
      console.log('切换语言')
      if (this.$i18n.locale === val) {
        return
      }
      this.$i18n.locale = val
      this.$root.$i18n.locale = val
    },
    hasOneShowingChild(children = []) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return showingChildren.length === 0
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
    logout() {
      this.$store.dispatch('user/logout')
      return this.$router.push(`${NotAuthUrl.Login}?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style scoped>
:deep(.el-badge) {
  border-radius: 12px;
  font-size: 8px;
  padding: 4px;
}
</style>
