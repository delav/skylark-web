<template>
  <div class="category">
    <div class="fixture-list">
      <fixture />
    </div>
    <div class="variable-list" v-if="isSuite">
      <variable />
    </div>
  </div>
</template>

<script>
import Variable from '@/views/design/editor/tree-detail/category/components/Variable';
import Fixture from "@/views/design/editor/tree-detail/category/components/Fixture";
import NODE from "@/constans/node";

export default {
  name: 'Category',
  components: {
    Variable,
    Fixture,
  },
  computed: {
    isSuite() {
      return this.$store.state.tree.detailType === NODE.DetailType.SUITE
    },
  }
}
</script>

<style lang="scss" scoped>
.category {
  width: 100%;
  height: 100%;
  padding: 5px;
  .variable-list {
    width: 100%;
    max-height: calc(100% - 320px);
  }
  .fixture-list {
    width: 100%;
    min-height: 300px;
  }
}
</style>
