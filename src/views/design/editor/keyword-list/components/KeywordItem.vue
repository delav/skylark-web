<template>
  <div class="keyword-item">
    <div class="item-image">
      <el-image style="width: 40px; height: 40px" :src="keywordData['image']" fit="cover" />
    </div>
    <div class="item-name">
      <text-tooltip
        font-size="13px"
        ref-name="itemText"
        :content="keywordData['ext_name']"
      />
    </div>
    <div class="item-tip">
      <el-tooltip
        popper-class="custom-tooltip"
        placement="top-start"
        effect="dark"
        :content="keywordData['desc']"
      >
        <svg-icon class-name="question-icon" icon-class="question"></svg-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";

export default {
  name: 'KeywordItem',
  components: {
    TextTooltip
  },
  props: {
    keywordData: Object
  },
}
</script>

<style lang="scss" scoped>
$itemHeight: 50px;

.keyword-item {
  width: 100%;
  height: $itemHeight;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ebeef5;
  cursor: pointer;
  .item-image {
    padding: 5px 0;
  }
  .item-name {
    width: 150px;
    margin-right: 15px;
    line-height: $itemHeight;
  }
  .item-tip {
    color: #303133;
    font-size: 16px;
    line-height: $itemHeight;
    vertical-align: -5%;
  }
}
</style>
