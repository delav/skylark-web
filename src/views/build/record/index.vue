<template>
  <div class="record-list">
    <div class="instantly">
      <div class="header">
        <span class="instantly-desc">即将构建</span>
        <quick-build />
      </div>
      <div class="instantly-list">
        <instantly-item v-for="(item, index) in instantlyPlanList" :key="index" :item-data="item" />
      </div>
    </div>
    <div class="recently">
      <p class="recently-desc">最近构建</p>
      <div class="recently-list">
        <recently-item v-for="(item, index) in recentlyRecordList" :key="index" :item-data="item" />
      </div>
    </div>
  </div>
</template>

<script>
import QuickBuild from "@/views/build/record/components/QuickBuild";
import InstantlyItem from "@/views/build/record/components/InstantlyItem";
import RecentlyItem from "@/views/build/record/components/RecentlyItem";
import { fetchRecords } from "@/api/record";
import { fetchInstantlyPlans } from "@/api/plan";

export default {
  name: 'BuildRecord',
  components: {
    QuickBuild,
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
      fetchRecords(10).then(response => {
        this.recentlyRecordList = response.data
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
$planHeight: 300px;

.record-list {
  width: 100%;
  height: 100%;
  padding: 5px;
  .instantly {
    height: $planHeight;
    .header {
      height: 24px;
      display: flex;
      .instantly-desc {
        width: 150px;
      }
    }
    .instantly-list {
      height: calc(100% - 24px - 10px);
      margin-top: 10px;
      overflow-y: auto;
      border-top: 1px solid #000;
    }
  }
  .recently {
    margin-top: 15px;
    height: calc(100% - #{$planHeight} - 15px);
    .recently-desc {
      height: 24px;
      margin: 0;
    }
    .recently-list {
      height: calc(100% - 24px);
      overflow-y: auto;
      border-top: 1px solid #000;
    }
  }
}
</style>
