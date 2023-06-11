<template>
  <div class="category">
<!--    <div class="variable-list">-->
<!--      <variable :variables="variableArray" module-from="node"></variable>-->
<!--    </div>-->
    <div class="fixture-list">
      <fixture :fixtures="fixtureArray"></fixture>
    </div>
  </div>
</template>

<script>
// import Variable from '@/views/design/editor/components/Variable'
import Fixture from "@/views/design/editor/tree-detail/category/components/Fixture";
import NODE from "@/constans/node";

export default {
  name: 'Category',
  components: {
    // Variable,
    Fixture,
  },
  data() {
    return {
      // cateInfo: {},
      // variableArray: [],
      fixtureArray: [],
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        const categories = [NODE.DetailType.ROOT, NODE.DetailType.DIR, NODE.DetailType.SUITE]
        if (categories.indexOf(detailType) !== -1) {
          const cateInfo = this.$store.state.tree.selectedNode.meta
          // this.variableArray = cateInfo['extra_data'][NODE.ExtraDataKey.VARIABLE]
          this.fixtureArray = cateInfo['extra_data'][NODE.ExtraDataKey.FIXTURE]
        }
      },
      immediate: true
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
