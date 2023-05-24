<template>
  <div class="instantly-item">
    <div class="item-title">
      <text-tooltip
        class="title-text"
        ref-name="itemText"
        :content="itemData['title']"
        @click="getInstantlyPlanDetail"
      />
      <p class="time-tip">下一次构建时间：{{itemData['periodic']['next_time']}}</p>
    </div>
    <div class="item-tip">
<!--      <el-button type="success" @click="getInstantlyPlanDetail" link>详情</el-button>-->
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";

export default {
  name: 'InstantItem',
  components: {
    TextTooltip
  },
  props: {
    itemData: Object
  },
  methods: {
    getInstantlyPlanDetail() {}
  }
}
</script>

<style lang="scss" scoped>
$itemHeight: 45px;

.instantly-item {
  width: 100%;
  height: $itemHeight;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #000;
  .item-title {
    width: calc(100% - 60px);
    margin: 5px 15px 0 0;
    .title-text {
      color: #0052cc;
      cursor: pointer;
      :hover {
        color: #9a6e3a;
      }
    }
    .time-tip {
      margin: 2px 0 0 0;
      font-size: 12px;
      color: #a3a7af;
    }
  }
  .item-tip {
    width: 60px;
    line-height: $itemHeight;
  }
}
</style>
