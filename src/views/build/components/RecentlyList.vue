<template>
  <div class="recently-content">
    <p class="recently-header">
      <span class="desc">最近构建</span>
      <span class="refresh">
        <el-icon @click="refreshRecentlyRecordList" :size="16" style="margin-top: 5px"><RefreshLeft /></el-icon>
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
            @click="gotoRecordDetail(item.id)"
          />
          <p class="time-tip">构建开始时间：{{item['create_at']}}</p>
        </div>
        <div class="item-tip">
          <span v-if="item['status'] === 0">
            <el-image style="width: 20px; height: 20px" :src="runningGig" />
          </span>
<!--          <svg-icon v-if="item['status'] === 0" icon-class="build-timing" class="run-icon"></svg-icon>-->
          <svg-icon v-else-if="item['status'] === 1" icon-class="build-finish" class="finish-icon"></svg-icon>
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
      runningGig: require('@/assets/running.gif'),
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
    gotoRecordDetail(recordId) {
      this.$router.push(`/build/record/detail/${recordId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$itemHeight: 48px;

.recently-content {
  height: 100%;
  .recently-header {
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
        width: 30px;
        margin-right: 10px;
        line-height: $itemHeight;
        .running-icon {
          font-size: 14px;
          color: #fa7d03;
        }
        .finish-icon {
          font-size: 18px;
          color: #67c23a;
        }
      }
    }
  }
}
</style>
