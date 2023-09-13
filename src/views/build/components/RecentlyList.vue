<template>
  <div class="recently-content">
    <p class="recently-header">
      <span class="desc">最近构建</span>
      <span class="refresh">
        <el-icon @click="refreshRecentlyRecordList" :size="20" style="margin-top: 5px"><RefreshLeft /></el-icon>
      </span>
    </p>
    <div class="recently-list">
      <div class="recently-item" v-for="(item, index) in recentlyRecordList" :key="index">
        <div class="item-title">
          <text-tooltip
            class="title-text"
            ref-name="itemText"
            font-size="14px"
            :content="item['desc']"
            @click="getRecentlyPlanDetail"
          />
          <p class="time-tip">构建开始时间：{{item['create_at']}}</p>
        </div>
        <div class="item-tip">
          <span class="running-text" v-if="item['status'] === 0">Running</span>
          <span class="finish-text" v-else-if="item['status'] === 1">Finish</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";

export default {
  name: 'RecentlyList',
  components: {
    TextTooltip
  },
  watch: {
    '$store.state.record.recentlyRecords': {
      handler() {
        this.recentlyRecordList = this.$store.state.record.recentlyRecords
      },
      deep: true,
    }
  },
  data() {
    return {
      recentlyRecordList: [],
    }
  },
  created() {
    this.$store.dispatch('record/getRecentlyRecordList')
  },
  methods: {
    refreshRecentlyRecordList() {
      this.$store.dispatch('record/getRecentlyRecordList')
    },
    getRecentlyPlanDetail() {}
  }
}
</script>

<style lang="scss" scoped>
$itemHeight: 48px;

.recently-content {
  height: 100%;
  border-right: solid 1px #dcdfe6;
  .recently-header {
    height: 24px;
    margin: 0;
    padding-left: 5px;
    background-color: #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    .desc {
      font-size: 13px;
    }
    .refresh {
      margin-left: auto;
      cursor: pointer;
      color: #409eff;
    }
  }
  .recently-list {
    height: calc(100% - 24px);
    overflow-y: auto;
    border-top: 1px solid #dcdfe6;
    padding-bottom: 5px;
    .recently-item {
      width: 100%;
      height: $itemHeight;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      padding-left: 10px;
      .item-title {
        width: calc(100% - 60px);
        .title-text {
          padding-top: 5px;
          color: #0052cc;
          cursor: pointer;
          :hover {
            color: #9a6e3a;
          }
        }
        .time-tip {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #a3a7af;
        }
      }
      .item-tip {
        width: 50px;
        margin-right: 10px;
        line-height: $itemHeight;
        font-size: 12px;
        .running-text {
          color: #409eff;
        }
        .finish-text {
          color: #67c23a;
        }
      }
    }
  }
}
</style>
