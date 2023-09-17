<template>
  <div class="test-suite">
    <div class="document">
      <document :cate-document="cateDocument"/>
    </div>
    <div class="fixture-list">
      <el-collapse v-model="activeDetail" accordion>
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse-title">编辑前置后置</div>
          </template>
          <fixture :cate-fixture="fixtureObject"/>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="variable-list">
      <variable :variables="suiteVariables"/>
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Document from "@/views/design/editor/tree-detail/components/Document";
import Fixture from "@/views/design/editor/tree-detail/components/Fixture";
import Variable from '@/views/design/editor/tree-detail/components/Variable';

export default {
  name: 'TestSuite',
  components: {
    Document,
    Fixture,
    Variable,
  },
  data() {
    return {
      cateDocument: '',
      activeDetail: '',
      fixtureObject: {
        'suite_setup': '',
        'suite_teardown': '',
        'suite_setup_desc': '',
        'suite_teardown_desc': '',
        'test_setup': '',
        'test_teardown': '',
        'test_setup_desc': '',
        'test_teardown_desc': ''
      },
      suiteVariables: []
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') return
        const cateInfo = nodeInfo['meta']
        this.cateDocument = cateInfo.document
        this.fixtureObject = cateInfo['extra_data'][NODE.ExtraDataKey.FIXTURE]
        this.suiteVariables = cateInfo['extra_data'][NODE.ExtraDataKey.VARIABLE]
      },
      immediate: true
    },
  }
}
</script>

<style lang="scss" scoped>
.test-suite {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
  .fixture-list {
    width: 100%;
    margin-top: 10px;
    .collapse-title {
      padding-left: 15px;
      color: #606266;
      font-size: 13px;
    }
  }
  .variable-list {
    width: 100%;
    margin-top: 10px;
  }
}
:deep(.el-collapse) {
  .el-collapse-item__header {
    border-radius: 0;
    box-shadow: 0 0 0 1px #e4e7ed;
    border-bottom: 0;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
    box-shadow: 0 0 0 1px #e4e7ed;
  }
  .el-collapse-item__content {
    padding: 0 5px 5px 5px;
  }
}
</style>
