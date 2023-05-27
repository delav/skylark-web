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
$itemHeight: 48px;

.instantly-item {
  width: 100%;
  height: $itemHeight;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #000;
  padding-left: 5px;
  .item-title {
    width: 100%;
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
  }
}
</style>
