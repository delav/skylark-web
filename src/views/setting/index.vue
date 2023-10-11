<template>
  <div class="setting">
    <div class="setting-navbar">
      <el-menu :default-active="activeMenu" style="height: 100%" router>
        <el-menu-item
          v-for="(route, i) in settingRoutes"
          :key="i"
          :index="resolvePath(route)"
        >
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
      const allRoutes = this.$router.getRoutes()
      for (let i = 0; i < allRoutes.length; i++) {
        const item = allRoutes[i]
        if (item.name === this.$options.name) {
          const child2Routes = item.children[0]['children']
          if (!child2Routes) break
          child2Routes.forEach(childItem => {
            if (childItem.meta['sidebar']) {
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
  data() {
    this.onlyOneChild = null
  },
  mounted() {
    this.$store.dispatch('base/getBaseInfo')
  },
  methods: {
    resolvePath(route) {
      return route.path
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$navbarWidth: 250px;
$menuItemHeight: 48px;
$menuHeight: 125px;
$planHeight: 260px;

.setting {
  width: 100%;
  height: 100%;
  display: flex;
  .setting-navbar {
    width: $navbarWidth;
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
      color: $mainColor;
      background-color: $hoverBg;
    }
    .icon-class {
      font-size: 18px;
      margin-right: 5px;
    }
  }
  .setting-body {
    min-height: 600px;
    min-width: 800px;
    width: calc(100% - #{$navbarWidth});
    overflow: auto;
  }
}
</style>
