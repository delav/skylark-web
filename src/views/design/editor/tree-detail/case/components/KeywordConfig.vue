<template>
  <div class="keyword-config">
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <div class="collapse-title">设置输入输出</div>
        </template>
        <div class="config-detail">
          <div class="detail-item">
            <span class="item-title">组件说明</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword('document')"
                v-model="extraData.document"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder=""
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">输入参数：</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword('inputs')"
                v-model="extraData.inputs"
                placeholder=""
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">输出参数：</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword('outputs')"
                v-model="extraData.outputs"
                placeholder=""
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>

export default {
  name: 'KeywordConfig',
  props: {
    keywordExtra: Object,
  },
  data() {
    return {
      extraData: this.keywordExtra
    }
  },
  watch: {
    keywordExtra: {
      handler(val) {
        this.extraData = val
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    updateCaseKeyword(field) {
      const params = {
        [field]: this.extraData[field]
      }
      this.$emit('update', params)
    },
  }
}
</script>

<style lang="scss" scoped>
.keyword-config {
  width: 100%;
  .collapse-title {
    .title-pri {
      font-size: 15px;
      width: 80px;
      margin-right: 30px;
    }
    .title-tag {
      margin-left: 5px;
    }
  }
  .config-detail {
    width: 100%;
    padding: 5px;
    .detail-item {
      display: flex;
      padding-bottom: 5px;
      .item-title {
        width: 80px;
        line-height: 32px;
      }
      .item-content {
        width: calc(100% - 80px);
      }
    }
  }
}
:deep(.el-collapse) {
  box-sizing: border-box;
  padding-left: 10px;
  border: none;
  .collapse-title {
    flex: 1 0 90%;
    order: 1;
    height: 40px;
    line-height: 40px;
  }
  .el-collapse-item__header {
    height: 40px;
    border: none;
    background-color: transparent;
  }
  .el-collapse-item__wrap {
    background-color: transparent;
    border: none;
    .el-collapse-item__content {
      padding: 0;
    }
  }
}
</style>
