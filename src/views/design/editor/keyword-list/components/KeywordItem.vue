<template>
  <div class="keyword-item">
    <div class="item-image">
      <el-image style="width: 40px; height: 40px" :src="keywordData['image']" fit="cover" />
    </div>
    <div class="item-name">
      <text-tooltip
        ref-name="itemText"
        :content="keywordData['ext_name']"
      />
    </div>
    <div class="item-tip">
      <el-tooltip
        placement="top-start"
        effect="dark"
        :content="keywordData['desc']"
      >
        <el-icon size="16px" color="#bfcbd9" style="vertical-align: -20%"><QuestionFilled /></el-icon>
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
  padding: 0 10px;
  justify-content: space-between;
  border-bottom: 1px solid #000;
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
    line-height: $itemHeight;
    vertical-align: -10%;
  }
}
</style>
