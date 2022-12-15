<template>
  <div class="keyword-item" @click="appendKeywordToCase">
    <div class="item-image">
      <el-image style="width: 40px; height: 40px" :src="keywordData['image']" fit="cover" />
    </div>
    <div class="item-text">
      <el-tooltip
        placement="top-start"
        effect="dark"
        :content="keywordData['ext_name']"
        :disabled="keywordData['ext_name'].length <= 10"
      >
        <p class="text-name">{{keywordData['ext_name']}}</p>
      </el-tooltip>
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
import constant from '@/constans/node'
import { guid } from '@/utils/other'
import { deepCopy } from '@/utils/dcopy'

export default {
  name: 'KeywordItem',
  props: {
    keywordData: {}
  },
  methods: {
    appendKeywordToCase() {
      const isSelectedCase = this.$store.state.tree.detailType
      if (isSelectedCase !== constant.DetailType.CASE) return
      const caseEntities = deepCopy(this.$store.state.entity.caseEntities)
      const entity = {
        'keyword_id': this.keywordData['id'],
        'keyword_type': 1,
        'input_args': '',
        'output_args': this.keywordData['output_params'],
        'uuid': guid()
      }
      caseEntities.push(entity)
      this.$store.commit('tree/SET_NODE_DETAIL', caseEntities)
      this.$store.commit('entity/SET_ENTITY_CHANGE', true)
    },
  }
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
  .item-text {
    width: 140px;
    margin-right: 15px;
    line-height: $itemHeight;
    .text-name {
      font-size: 14px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-tip {
    line-height: $itemHeight;
    vertical-align: -10%;
  }
}
</style>
