<template>
  <div class="tree-detail">
    <empty v-if="isEmpty(detailType)"></empty>
    <case v-else-if="isCase(detailType)"></case>
    <category v-else-if="isCategory(detailType)"></category>
    <const v-else-if="isConst(detailType)"></const>
    <file v-else-if="isFile(detailType)"></file>
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
    detailType() {
      return this.$store.state.tree.detailType
    }
  },
  methods: {
    isEmpty(type) {
      return type === NODE.DetailType.EMPTY
    },
    isCase(type) {
      return type === NODE.DetailType.CASE
    },
    isCategory(type) {
      const category = [
        NODE.DetailType.ROOT,
        NODE.DetailType.DIR,
        NODE.DetailType.SUITE
      ]
      return category.indexOf(type) !== -1
    },
    isConst(type) {
      return type === NODE.DetailType.CONST
    },
    isFile(type) {
      return type === NODE.DetailType.FILE
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-detail {
  height: 100%;
}
</style>
