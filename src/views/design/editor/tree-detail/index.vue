<template>
  <div class="tree-detail">
    <empty v-if="isEmpty"></empty>
    <case v-else-if="isCase"></case>
    <category v-else-if="isCategory"></category>
    <const v-else-if="isConst"></const>
    <file v-else-if="isFile"></file>
  </div>
</template>

<script>
import Empty from "@/views/design/editor/tree-detail/empty";
import Case from "@/views/design/editor/tree-detail/case";
import Category from "@/views/design/editor/tree-detail/category";
import Const from "@/views/design/editor/tree-detail/const";
import File from "@/views/design/editor/tree-detail/file";
import NODE from "@/constans/node";

export default {
  name: 'TreeDetail',
  components: {
    Empty,
    Case,
    Category,
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
    isCategory() {
      const type = this.$store.state.tree.detailType
      const category = [NODE.DetailType.ROOT, NODE.DetailType.DIR, NODE.DetailType.SUITE]
      return category.indexOf(type) !== -1
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
