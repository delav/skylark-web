<template>
  <div class="navbar">
    <logo />
    <div class="router">
      <el-menu class="menu" :default-active="activeMenu" mode="horizontal" router>
        <el-menu-item v-for="(route, i) in routes" :key="i" :index="route.path">
          {{ route.meta.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <info />
  </div>
</template>

<script>
import Logo from "@/layout/components/Logo";
import Info from "@/layout/components/Info";

export default {
  name: 'Navbar',
  components: {
    Logo,
    Info
  },
  computed: {
    routes() {
      const navbarRoutes = []
      const allRoutes = this.$router.getRoutes()
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
