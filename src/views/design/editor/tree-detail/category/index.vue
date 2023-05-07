<template>
  <div class="category">
    <div class="variable-list">
      <variable :variables="variableArray" module-from="node"></variable>
    </div>
    <div class="fixture-list">
      <fixture :fixtures="fixtureArray"></fixture>
    </div>
  </div>
</template>

<script>
import Variable from '@/views/design/editor/components/Variable'
import Fixture from './components/Fixture'
import NODE from '@/constans/node'

export default {
  name: 'Category',
  components: {
    Variable,
    Fixture,
  },
  data() {
    return {
      cateInfo: {},
      variableArray: [],
      fixtureArray: [],
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        const categories = [NODE.DetailType.ROOT, NODE.DetailType.DIR, NODE.DetailType.SUITE]
        if (categories.indexOf(detailType) !== -1) {
          this.cateInfo = this.$store.state.tree.selectedNode.meta
          this.variableArray = this.cateInfo['extra_data'][NODE.ExtraDataKey.VARIABLE]
          this.fixtureArray = this.cateInfo['extra_data'][NODE.ExtraDataKey.FIXTURE]
        }
      }
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
    margin-top: 20px;
    width: 100%;
    min-height: 300px;
  }
}
</style>
