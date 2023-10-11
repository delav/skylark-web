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
    <right />
  </div>
</template>

<script>
import Logo from "@/layout/components/NavbarItem/Logo";
import Right from "@/layout/components/NavbarItem/Right";

export default {
  name: 'Navbar',
  components: {
    Logo,
    Right
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
