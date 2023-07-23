<template>
  <div class="setting">
    <div class="setting-navbar">
      <el-menu :default-active="activeMenu" style="height: 100%" router>
        <el-menu-item v-for="(route, i) in settingRoutes" :key="i" :index="resolvePath(route)">
          <svg-icon class="icon-class" :icon-class="route.meta.icon" ></svg-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="setting-body">
      <router-view :key="key"></router-view>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";

export default {
  name: 'Setting',
  components: {
    SvgIcon
  },
  computed: {
    key() {
      return this.$route.path
    },
    settingRoutes() {
      const navbarRoutes = []
      const allRoutes = this.$router.options.routes
      for (let i = 0; i < allRoutes.length; i++) {
        const item = allRoutes[i]
        if (item.name === this.$options.name) {
          const child2Routes = item.children[0]['children']
          if (!child2Routes) break
          child2Routes.forEach(childItem => {
            if (childItem.meta['navbar']) {
              navbarRoutes.push(childItem)
            }
          })
          break
        }
      }
      return navbarRoutes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta['secondActiveMenu']) {
        return meta['secondActiveMenu']
      }
      return path
    }
  },
  methods: {
    resolvePath(route) {
      return route.path
    },
  }
}
</script>

<style lang="scss" scoped>
$menuItemHeight: 40px;
$menuHeight: 125px;
$planHeight: 260px;

.setting {
  width: 100%;
  height: 100%;
  display: flex;
  .setting-navbar {
    width: 200px;
    height: 100%;
    .el-menu--vertical>.el-menu-item {
      height: $menuItemHeight;
      line-height: $menuItemHeight;
    }
    .el-menu--vertical>.el-submenu .el-submenu__title {
      height: $menuItemHeight;
      line-height: $menuItemHeight;
    }
    .el-menu-item.is-active {
      color: #6681FA; background-color: #EAEEFF;
    }
    .icon-class {
      margin-right: 5px;
    }
  }
}
</style>
