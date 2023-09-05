<template>
  <div class="tree-detail">
    <case v-if="isCase" />
    <suite v-else-if="isSuite" />
    <dir v-else-if="isDir" />
    <empty else />
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Case from "@/views/design/editor/tree-detail/case";
import Suite from "@/views/design/editor/tree-detail/suite";
import Dir from "@/views/design/editor/tree-detail/dir";
import Empty from "@/views/design/editor/tree-detail/empty";

export default {
  name: 'TreeDetail',
  components: {
    Case,
    Suite,
    Dir,
    Empty,
  },
  computed: {
    isCase() {
      return this.$store.state.tree.detailType === NODE.DetailType.CASE
    },
    isSuite() {
      return this.$store.state.tree.detailType === NODE.DetailType.SUITE
    },
    isDir() {
      return this.$store.state.tree.detailType === NODE.DetailType.DIR
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
