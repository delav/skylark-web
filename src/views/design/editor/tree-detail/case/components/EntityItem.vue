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
<!--      <text-tooltip-->
<!--        ref-name="nameText"-->
<!--        :content="getKeywordAttrByEntityId('ext_name', entityData['keyword_id'])"-->
<!--      />-->
      <el-tooltip
        placement="top-start"
        effect="dark"
        :content="getKeywordAttrByEntityId('ext_name', entityData['keyword_id'])"
        :disabled="false"
      >
        <p class="text-name">{{getKeywordAttrByEntityId('ext_name', entityData['keyword_id'])}}</p>
      </el-tooltip>
    </div>
    <div class="item-out">
<!--      <text-tooltip-->
<!--        ref-name="outText"-->
<!--        content="entityData['output_args']"-->
<!--      />-->
            <el-tooltip
              placement="top-start"
              effect="dark"
              :content="entityData['output_args']"
              :disabled="false"
            >
              <p class="text-out">{{entityData['output_args']}}</p>
            </el-tooltip>
    </div>
    <div class="item-tip">
      <el-tooltip
        placement="top-start"
        effect="dark"
        :content="getKeywordAttrByEntityId('desc', entityData['keyword_id'])"
      >
        <el-icon size="16px" color="#bfcbd9"><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
// import TextTooltip from '@/components/TextTooltip'

export default {
  name: 'EntityItem',
  components: {
    // TextTooltip
  },
  props: {
    entityData: Object
  },
  computed: {
    keywordDict() {
      return this.$store.state.keyword.keywordsObject
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
    width: 100%;
    text-align: center;
    .text-name {
      font-size: 13px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-out {
    height: 20px;
    width: 100%;
    margin-top: 5px;
    text-align: center;
    .text-out {
      font-size: 13px;
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .item-tip {
    top: 0;
    right: 0;
    position: absolute;
  }
}
</style>
