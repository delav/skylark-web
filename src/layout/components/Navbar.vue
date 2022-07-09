<template>
  <div>
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        @select="handleSelect"
        router>
      <el-menu-item v-for="(route, i) in routes" :key="i" :index="resolvePath(route)">
        <span>{{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import path from 'path'
import Logo from './Logo'
import { isExternal } from '@/utils/validate'

export default {
  name: 'Navbar',
  components: { Logo },
  data() {
    return {
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
    handleSelect(key, keyPath) {
      console.log(key + keyPath)
    }
  }
}
</script>

<style scoped>

</style>
