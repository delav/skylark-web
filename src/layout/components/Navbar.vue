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
    <guide />
    <div class="divider"></div>
    <feedback />
    <div class="divider"></div>
    <message />
    <div class="divider"></div>
    <language />
    <div class="divider"></div>
    <profile />
    <github-corner />
  </div>
</template>

<script>
import Logo from "@/layout/components/NavbarItem/Logo";
import Profile from "@/layout/components/NavbarItem/Profile";
import Language from "@/layout/components/NavbarItem/Language";
import Message from "@/layout/components/NavbarItem/Message";
import Feedback from "@/layout/components/NavbarItem/Feedback";
import Guide from "@/layout/components/NavbarItem/Guide";
import GithubCorner from "@/layout/components/NavbarItem/GithubCorner";

export default {
  name: 'Navbar',
  components: {
    Logo,
    Profile,
    Language,
    Message,
    Feedback,
    Guide,
    GithubCorner,
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
.divider {
  margin: 0 8px;
  width: 1px;
  height: 16px;
  border-left: 1px solid #dcdfe6;
}
</style>
