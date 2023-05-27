<template>
  <div class="record-list">
    <div class="menu-list">
      <div class="item-list">
        <el-menu @select="selectMenuItem">
          <el-menu-item index="1">
            <el-icon><document /></el-icon>
            <span>快速构建</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><document /></el-icon>
            <span>构建计划</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><document /></el-icon>
            <span>构建记录</span>
          </el-menu-item>
        </el-menu>
      </div>
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
</template>

<script>
import PAGE from "@/constans/build";
import InstantlyItem from "@/views/build/components/InstantlyItem";
import RecentlyItem from "@/views/build/components/RecentlyItem";
import { fetchRecords } from "@/api/record";
import { fetchInstantlyPlans } from "@/api/plan";

export default {
  name: 'MixMenu',
  components: {
    InstantlyItem,
    RecentlyItem,
  },
  data() {
    return {
      instantlyPlanList: [],
      recentlyRecordList: [],
    }
  },
  created() {
    this.getRecentlyRecordList()
    this.getInstantlyPlanList()
  },
  methods: {
    getRecentlyRecordList() {
      fetchRecords(1, 15).then(response => {
        this.recentlyRecordList = response.data.data
      })
    },
    getInstantlyPlanList() {
      fetchInstantlyPlans(5).then(response => {
        this.instantlyPlanList = response.data
      })
    },
    selectMenuItem(index) {
      if (index === '1') {
        this.$store.commit('page/SET_DETAIL_PAGE', PAGE.PageType.QUICKBUILD)
      } else if (index === '2') {
        this.$store.commit('page/SET_DETAIL_PAGE', PAGE.PageType.PLANLIST)
      } else if (index === '3') {
        this.$store.commit('page/SET_DETAIL_PAGE', PAGE.PageType.RECORDLIST)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$menuItemHeight: 40px;
$menuHeight: 125px;
$planHeight: 260px;

.record-list {
  width: 100%;
  height: 100%;
  .menu-list {
    height: $menuHeight;
    .item-list {
      .el-menu--vertical>.el-menu-item {
        height: $menuItemHeight;
        line-height: $menuItemHeight;
        padding: 0;
      }
      .el-menu--vertical>.el-submenu .el-submenu__title {
        height: $menuItemHeight;
        line-height: $menuItemHeight;
      }
      .el-menu-item.is-active {
        color: #6681FA; background-color: #EAEEFF;
      }
    }
  }
  .instantly {
    height: $planHeight;
    .instantly-desc {
      height: 24px;
      margin: 0;
      padding-left: 5px;
      background-color: #7a869a;
      font-size: 14px;
      span {
        line-height: 24px;
      }
    }
    .instantly-list {
      height: calc(100% - 24px - 10px);
      overflow-y: auto;
      border-top: 1px solid #000;
    }
  }
  .recently {
    margin-top: 15px;
    height: calc(100% - #{$menuHeight} - #{$planHeight} - 15px);
    .recently-desc {
      height: 24px;
      margin: 0;
      padding-left: 5px;
      background-color: #7a869a;
      font-size: 14px;
      span {
        line-height: 24px;
      }
    }
    .recently-list {
      height: calc(100% - 24px);
      overflow-y: auto;
      border-top: 1px solid #000;
      padding-bottom: 5px;
    }
  }
}
</style>
