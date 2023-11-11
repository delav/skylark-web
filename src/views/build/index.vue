<template>
  <div class="build">
    <div class="quick-list">
      <div class="menu-list">
        <el-menu :default-active="activeMenu" style="height: 100%" router>
          <el-menu-item v-for="(route, i) in settingRoutes" :key="i" :index="resolvePath(route)">
            <svg-icon class="icon-class" :icon-class="route.meta.icon" ></svg-icon>
            <span>{{ $t(route.meta.title) }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="dynamic-list">
        <div class="instantly">
          <keep-alive>
            <instantly-list />
          </keep-alive>
        </div>
        <div class="recently">
          <keep-alive>
            <recently-list />
          </keep-alive>
        </div>
      </div>
    </div>
    <div class="page-route">
      <router-view :key="key"></router-view>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";
import InstantlyList from "@/views/build/components/InstantlyList";
import RecentlyList from "@/views/build/components/RecentlyList";

export default {
  name: 'Build',
  components: {
    SvgIcon,
    InstantlyList,
    RecentlyList,
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
    return {
      instantlyPlanList: [],
      recentlyRecordList: [],
    }
  },
  created() {
    this.$store.dispatch('base/getBaseInfo')
  },
  methods: {
    resolvePath(route) {
      return route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$menuItemHeight: 40px;
$menuHeight: 130px;
$planHeight: 260px;

.build {
  width: 100%;
  height: 100%;
  display: flex;
  .quick-list {
    width: 400px;
    height: 100%;
    .menu-list {
      height: $menuHeight;
      .el-menu--vertical>.el-menu-item {
        color: $textColor;
        font-weight: 500;
        height: $menuItemHeight;
        line-height: $menuItemHeight;
        padding: 0 0 0 5px;
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
        margin: 0 5px;
        font-size: 16px;
      }
    }
    .dynamic-list {
      height: calc(100% - #{$menuHeight});
      .instantly {
        height: 50%;
        border-right: solid 1px #dcdfe6;
      }
      .recently {
        height: 50%;
        border-right: solid 1px #dcdfe6;
      }
    }
  }
  .page-route {
    height: 100%;
    width: calc(100% - 400px);
    min-width: 500px;
  }
}
</style>
