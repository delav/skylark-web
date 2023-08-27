<template>
  <div class="suite-detail">
    <test-suite v-if="isTestSuite" />
    <const v-else-if="isConst" />
    <file v-else-if="isFile" />
    <keyword-suite v-else-if="isKeywordSuite" />
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Const from "@/views/design/editor/tree-detail/suite/components/Const";
import File from "@/views/design/editor/tree-detail/suite/components/File";
import KeywordSuite from '@/views/design/editor/tree-detail/suite/components/KeywordSuite';
import TestSuite from '@/views/design/editor/tree-detail/suite/components/TestSuite';

export default {
  name: 'SuiteDetail',
  components: {
    TestSuite,
    Const,
    File,
    KeywordSuite,
  },
  computed: {
    isTestSuite() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.TESTCASE
    },
    isConst() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.VARIABLE
    },
    isFile() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.PROJECTFILE
    },
    isKeywordSuite() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.KEYWORD
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
