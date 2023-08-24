<template>
  <div class="suite-detail">
    <testsuite v-if="isTestsuite" />
    <const v-if="isConst" />
    <file v-if="isFile" />
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Const from "@/views/design/editor/tree-detail/suite/components/Const";
import File from "@/views/design/editor/tree-detail/suite/components/File";
import Testsuite from '@/views/design/editor/tree-detail/suite/components/Testsuite';

export default {
  name: 'SuiteDetail',
  components: {
    Testsuite,
    Const,
    File,
  },
  computed: {
    isTestsuite() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.TESTCASE
    },
    isConst() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.VARIABLE
    },
    isFile() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.PROJECTFILE
    }
  }
}
</script>

<style lang="scss" scoped>
.suite-detail {
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
      font-size: 14px;
    }
  }
  .variable-list {
    width: 100%;
    margin-top: 10px;
  }
}
:deep(.el-collapse-item__header) {
  background-color: #f4f5f7;
  border-radius: 0;
  box-shadow: 0 0 0 1px #e4e7ed;
  border-bottom: 0;
}
</style>
