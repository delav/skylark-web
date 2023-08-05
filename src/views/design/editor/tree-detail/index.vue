<template>
  <div class="tree-detail">
    <empty v-if="isEmpty"></empty>
    <case v-else-if="isCase"></case>
    <suite v-else-if="isSuite"></suite>
    <dir v-else-if="isDir"></dir>
    <const v-else-if="isConst"></const>
    <file v-else-if="isFile"></file>
  </div>
</template>

<script>
import Empty from "@/views/design/editor/tree-detail/empty";
import Case from "@/views/design/editor/tree-detail/case";
import Suite from "@/views/design/editor/tree-detail/suite";
import Dir from "@/views/design/editor/tree-detail/dir";
import Const from "@/views/design/editor/tree-detail/const";
import File from "@/views/design/editor/tree-detail/file";
import NODE from "@/constans/node";

export default {
  name: 'TreeDetail',
  components: {
    Empty,
    Case,
    Suite,
    Dir,
    Const,
    File,
  },
  computed: {
    isEmpty() {
      return this.$store.state.tree.detailType === NODE.DetailType.EMPTY
    },
    isCase() {
      return this.$store.state.tree.detailType === NODE.DetailType.CASE
    },
    isSuite() {
      return this.$store.state.tree.detailType === NODE.DetailType.SUITE
    },
    isDir() {
      return this.$store.state.tree.detailType === NODE.DetailType.DIR
    },
    isConst() {
      return this.$store.state.tree.detailType === NODE.DetailType.CONST
    },
    isFile() {
      return this.$store.state.tree.detailType === NODE.DetailType.FILE
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.tree-detail {
  height: 100%;
}
</style>
