<template>
  <div class="instantly-content">
    <p class="instantly-header">
      <span class="desc">即将构建</span>
      <span class="refresh">
        <el-icon @click="refreshInstantlyPlanList" :size="16" style="margin-top: 5px"><RefreshLeft /></el-icon>
      </span>
    </p>
    <div class="instantly-list">
      <div class="instantly-item" v-for="item in instantlyPlanList" :key="item.id">
        <div class="item-title">
          <text-tooltip
            class="title-text"
            ref-name="itemText"
            font-size="14px"
            :content="item['title']"
            @click="gotoPlanDetail(item.id)"
          />
          <p class="time-tip">下次构建时间：{{item['periodic']['next_time']}}</p>
        </div>
        <div class="item-tip">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";

export default {
  name: 'InstantList',
  components: {
    TextTooltip
  },
  watch: {
    '$store.state.plan.instantlyPlans': {
      handler() {
        this.instantlyPlanList = this.$store.state.plan.instantlyPlans
      },
      deep: true,
    }
  },
  data() {
    return {
      instantlyPlanList: [],
    }
  },
  created() {
    this.$store.dispatch('plan/getInstantlyPlanList')
  },
  methods: {
    refreshInstantlyPlanList() {
      this.$store.dispatch('plan/getInstantlyPlanList')
    },
    gotoPlanDetail(planId) {
      this.$router.push(`/build/plan/detail/${planId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$itemHeight: 48px;

.instantly-content {
  height: 100%;
  .instantly-header {
    height: 24px;
    margin: 0;
    padding-left: 5px;
    background-color: #f4f5f7;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: $textColor;
    .desc {
      font-size: 13px;
    }
    .refresh {
      //margin-left: auto;
      margin-left: 5px;
      cursor: pointer;
      :hover {
        color: $mainColor;
      }
    }
  }
  .instantly-list {
    height: calc(100% - 24px - 10px);
    overflow-y: auto;
    border-top: 1px solid #dcdfe6;
    .instantly-item {
      width: 100%;
      height: $itemHeight;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      padding-left: 10px;
      .item-title {
        width: 100%;
        .title-text {
          padding-top: 5px;
          color: $mainColor;
          cursor: pointer;
          :hover {
            color: #7ae5f3;
          }
        }
        .time-tip {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #a3a7af;
        }
      }
      .item-tip {
        width: 60px;
        margin-right: 10px;
        line-height: $itemHeight;
        font-size: 12px;
      }
    }
  }
}
</style>
