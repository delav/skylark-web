<template>
  <div class="recently-item">
    <div class="item-title">
      <text-tooltip
        class="title-text"
        ref-name="itemText"
        font-size="14px"
        :content="itemData['desc'].toString()"
        @click="getRecentlyPlanDetail"
      />
      <p class="time-tip">构建开始时间：{{itemData['create_at']}}</p>
    </div>
    <div class="item-tip">
      <span class="running-text" v-if="itemData['status'] === 0">Running</span>
      <span class="finish-text" v-else-if="itemData['status'] === 1">Finish</span>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";

export default {
  name: 'RecentlyItem',
  components: {
    TextTooltip
  },
  props: {
    itemData: Object
  },
  methods: {
    getRecentlyPlanDetail() {}
  }
}
</script>

<style lang="scss" scoped>
$itemHeight: 48px;

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
    margin-right: 5px;
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
</style>
