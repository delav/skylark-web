<template>
  <div class="keyword-config">
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <div class="collapse-title">设置输入输出</div>
        </template>
        <div class="config-detail">
          {{keywordInfo}}
          <div class="detail-item">
            <span class="item-title">组件说明</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword"
                v-model="keywordInfo.document"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                placeholder="Please input"
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">输入参数：</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword"
                v-model="keywordInfo.inputs"
                placeholder="Please input"
              />
            </div>
          </div>
          <div class="detail-item">
            <span class="item-title">输出参数：</span>
            <div class="item-content">
              <el-input
                @blur="updateCaseKeyword"
                v-model="keywordInfo.outputs"
                placeholder="Please input"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import { deepCopy } from "@/utils/dcopy";
import { updateCase } from "@/api/case";

export default {
  name: 'KeywordConfig',
  data() {
    return {
      keywordInfo: {}
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        if (detailType !== NODE.DetailType.CASE) return
        this.initKeywordData()
      },
      immediate: true
    },
  },
  methods: {
    initKeywordData() {
      const nodeInfo = this.$store.state.tree.selectedNode
      this.keywordInfo = deepCopy(nodeInfo['meta'])
    },
    updateTreeNode() {
      const treeId = this.$store.state.tree.treeId
      const treeObj = $.fn.zTree.getZTreeObj(treeId)
      const caseNode = this.$store.state.tree.selectedNode
      caseNode['meta'] = this.keywordInfo
      treeObj.updateNode(caseNode)
      this.$store.commit('tree/SET_SELECT_NODE', caseNode)
    },
    updateCaseKeyword() {
      const nodeInfo = this.$store.state.tree.selectedNode
      const oldData = nodeInfo['meta']
      const params = {
        'document': this.keywordInfo.document,
        'inputs': this.keywordInfo.inputs,
        'outputs': this.keywordInfo.outputs
      }
      console.log(oldData)
      console.log(params)
      if (oldData.document === params.document
        && oldData.inputs === params.inputs
        && oldData.outputs === params.outputs) {
        return
      }
      updateCase(this.keywordInfo.id, params).then((response) => {
        this.keywordInfo.document = response.data.document
        this.keywordInfo.inputs = response.data.inputs
        this.keywordInfo.outputs = response.data.outputs
        this.updateTreeNode()
      })
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
