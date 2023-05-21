<template>
  <div class="recently-item">
    <div class="item-name">
      <text-tooltip
        class="title"
        ref-name="itemText"
        :content="itemData['id'].toString()"
      />
    </div>
    <div class="item-tip">
      <el-button type="success" link>详情</el-button>
    </div>
  </div>
</template>

<script>
import TextTooltip from '@/components/TextTooltip'

export default {
  name: 'RecentlyItem',
  components: {
    TextTooltip
  },
  props: {
    itemData: Object
  }
}
</script>

<style lang="scss" scoped>
$itemHeight: 45px;

.recently-item {
  width: 100%;
  height: $itemHeight;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #000;
  .item-name {
    width: calc(100% - 60px);
    margin: 5px 15px 0 0;
    .time-tip {
      margin: 2px 0 0 0;
      font-size: 12px;
    }
  }
  .item-tip {
    width: 50px;
    line-height: $itemHeight;
  }
}
</style>
