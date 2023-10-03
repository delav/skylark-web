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
            <span class="item-title">
              输入参数
              <el-tooltip
                effect="dark"
                content="传递给该组件的参数，格式为${xxx}，多个参数使用 | 分隔"
                placement="top-start"
              >
                <el-icon style="vertical-align: -15%" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword('inputs')"
                v-model="extraData.inputs"
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">
              输出参数
              <el-tooltip
                effect="dark"
                content="该组件的返回值，可直接使用[Return]组件实现"
                placement="top-start"
              >
                <el-icon style="vertical-align: -15%" size="14px" color="#bfcbd9"><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
            <div class="item-content">
              <el-input
                :disabled="true"
                @blur="updateCaseKeyword('outputs')"
                v-model="extraData.outputs"
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
      extraData: {}
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
      if (field === 'inputs' || field === 'outputs') {
        const pattern = /\$\{.*\}/
        const value = this.extraData[field]
        if (value === undefined) {
          return
        } else if (value === null || value === '') {
          // nothing
        } else if (value.indexOf('|') !== -1) {
          const valueList = value.split('|')
          for (let v in valueList) {
            if (!v.match(pattern)) {
              this.$message.error('参数格式错误')
              return
            }
          }
        } else if (!value.match(pattern))  {
          this.$message.error('参数格式错误')
          return
        }
      }
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
    color: #606266;
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
