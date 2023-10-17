<template>
  <div class="entity-item" :style="entityStyle(entityData)">
    <div class="item-content">
      <div class="item-image">
        <el-image
          style="width: 40px;height: 40px"
          :src="getKeywordAttr('image', entityData['keyword_id'], entityData['keyword_type'])"
          fit="cover"
        />
      </div>
      <div class="item-name">
        <text-tooltip
          font-size="12px"
          ref-name="outName"
          :content="getKeywordAttr('ext_name', entityData['keyword_id'], entityData['keyword_type'])"
        />
      </div>
<!--      <div class="item-out">-->
<!--        <text-tooltip-->
<!--          font-size="12px"-->
<!--          ref-name="outText"-->
<!--          :content="entityData['output_args']"-->
<!--        />-->
<!--      </div>-->
    </div>
    <div class="item-tip">
      <el-tooltip
        :hide-after="5"
        popper-class="custom-tooltip"
        placement="top-start"
        effect="dark"
        :content="getKeywordAttr('desc', entityData['keyword_id'], entityData['keyword_type'])"
      >
        <span>
          <svg-icon class-name="question-icon" icon-class="question"></svg-icon>
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import TextTooltip from "@/components/TextTooltip";
import { getKeywordUid } from "@/utils/keyword";

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
    getKeywordAttr(attr, keywordId, keywordType) {
      const nullValue = 'None'
      const keywordUid = getKeywordUid(keywordId, keywordType)
      if (keywordUid in this.keywordDict) {
        if (!this.keywordDict[keywordUid][attr]) {
          return nullValue
        }
        return this.keywordDict[keywordUid][attr]
      }
      return nullValue
    },
    entityStyle(entityItem) {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) !== -1) {
        return 'background: #dfe1e5; color:#00acc1'
      }
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
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  background-color: #fff;
  .item-content {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .item-image {
      padding: 5px 0;
    }
    .item-name {
      padding: 0 3px;
      height: 20px;
      font-size: 12px;
      color: $textColor;
    }
    .item-out {
      height: 20px;
      margin-top: 5px;
      font-size: 12px;
    }
  }
  .item-tip {
    top: 0;
    left: 0;
    position: absolute;
    color: #999595;
    font-size: 14px;
  }
}
</style>
