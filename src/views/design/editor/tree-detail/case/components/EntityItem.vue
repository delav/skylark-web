<template>
  <div class="entity-item" :style="entityStyle(entityData)">
    <div class="item-image">
      <el-image
        style="width: 40px;height: 40px"
        :src="getKeywordAttrByEntityId('image', entityData['keyword_id'])"
        fit="cover"
      />
    </div>
    <div class="item-name">
      <text-tooltip
        font-size="12px"
        ref-name="outName"
        :content="getKeywordAttrByEntityId('ext_name', entityData['keyword_id'])"
      />
    </div>
    <div class="item-out">
      <text-tooltip
        font-size="12px"
        ref-name="outText"
        :content="entityData['output_args']"
      />
    </div>
    <div class="item-tip">
      <el-tooltip
        popper-class="custom-tooltip"
        placement="top-start"
        effect="dark"
        :content="getKeywordAttrByEntityId('desc', entityData['keyword_id'])"
      >
        <el-icon size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import TextTooltip from '@/components/TextTooltip'
import { guid } from "@/utils/other";

export default {
  name: 'EntityItem',
  components: {
    TextTooltip
  },
  props: {
    entityData: Object
  },
  computed: {
    keywordDict() {
      return this.$store.state.keyword.keywordObjects
    },
  },
  methods: {
    getKeywordAttrByEntityId(attr, kid) {
      return this.keywordDict[kid][attr]
    },
    entityStyle(entityItem) {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) !== -1) {
        return 'background: #dfe1e5'
      }
    },
    getRefName() {
      return guid()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.entity-item {
  width: calc(#{$entityGridWidth} - 4px);
  height: calc(#{$entityGridHeight} - 4px);
  margin: 2px;
  padding: 0 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  background-color: #fff;
  .item-image {
    padding: 5px 0;
    text-align: center;
  }
  .item-name {
    height: 20px;
    text-align: center;
    font-size: 12px;
  }
  .item-out {
    height: 20px;
    margin-top: 5px;
    text-align: center;
    font-size: 12px;
  }
  .item-tip {
    top: 0;
    left: 0;
    position: absolute;
  }
}
</style>
