<template>
  <div class="build">
    <div class="quick-list">
      <div class="menu-list">
        <el-menu :default-active="activeMenu" style="height: 100%" router>
          <el-menu-item v-for="(route, i) in settingRoutes" :key="i" :index="resolvePath(route)">
            <svg-icon class="icon-class" :icon-class="route.meta.icon" ></svg-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="instantly">
        <p class="instantly-desc">
          <span>即将构建</span>
        </p>
        <div class="instantly-list">
          <instantly-item v-for="(item, index) in instantlyPlanList" :key="index" :item-data="item" />
        </div>
      </div>
      <div class="recently">
        <p class="recently-desc">
          <span>最近构建</span>
        </p>
        <div class="recently-list">
          <recently-item v-for="(item, index) in recentlyRecordList" :key="index" :item-data="item" />
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
import InstantlyItem from "@/views/build/components/InstantlyItem";
import RecentlyItem from "@/views/build/components/RecentlyItem";
import { fetchRecords } from "@/api/record";
import { fetchInstantlyPlans } from "@/api/plan";

export default {
  name: 'Build',
  components: {
    SvgIcon,
    InstantlyItem,
    RecentlyItem,
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
  data() {
    return {
      instantlyPlanList: [],
      recentlyRecordList: [],
    }
  },
  created() {
    this.$store.dispatch('base/getBaseInfo')
    this.getRecentlyRecordList()
    this.getInstantlyPlanList()
  },
  unmounted() {
    this.$store.commit('base/RESET_STATE')
  },
  methods: {
    resolvePath(route) {
      return route.path
    },
    getRecentlyRecordList() {
      fetchRecords(1, 15).then(response => {
        this.recentlyRecordList = response.data.data
      })
    },
    getInstantlyPlanList() {
      fetchInstantlyPlans(5).then(response => {
        this.instantlyPlanList = response.data
      })
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
        background-color: #EAEEFF;
      }
      .icon-class {
        margin: 0 5px;
        font-size: 16px;
      }
    }
    .instantly {
      height: calc(50% - #{$menuHeight}/2);
      border-right: solid 1px #dcdfe6;
      .instantly-desc {
        height: 24px;
        margin: 0;
        padding-left: 5px;
        background-color: #dcdfe6;
        font-size: 14px;
        span {
          line-height: 24px;
        }
      }
      .instantly-list {
        height: calc(100% - 24px - 10px);
        overflow-y: auto;
        border-top: 1px solid #dcdfe6;
      }
    }
    .recently {
      padding-top: 15px;
      height: calc(50% - #{$menuHeight}/2);
      border-right: solid 1px #dcdfe6;
      .recently-desc {
        height: 24px;
        margin: 0;
        padding-left: 5px;
        background-color: #dcdfe6;
        font-size: 14px;
        span {
          line-height: 24px;
        }
      }
      .recently-list {
        height: calc(100% - 24px);
        overflow-y: auto;
        border-top: 1px solid #dcdfe6;
        padding-bottom: 5px;
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
