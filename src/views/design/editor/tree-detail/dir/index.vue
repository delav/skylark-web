<template>
  <div class="dir-detail">
    <div class="document">
      <document :cate-document="cateDocument"/>
    </div>
    <div class="fixture-list" v-if="isCaseDir">
      <fixture :cate-fixture="fixtureObject" />
    </div>
  </div>
</template>

<script>
import NODE from "@/constans/node";
import Document from "@/views/design/editor/tree-detail/components/Document";
import Fixture from "@/views/design/editor/tree-detail/components/Fixture";

export default {
  name: 'DirDetail',
  components: {
    Document,
    Fixture,
  },
  computed: {
    isCaseDir() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.TESTCASE
    }
  },
  data() {
    return {
      cateDocument: '',
      fixtureObject: {},
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') {
          return
        }
        const cateInfo = nodeInfo['meta']
        this.cateDocument = cateInfo.document
        if (!this.isCaseDir) {
          this.fixtureObject = {}
          return
        }
        this.fixtureObject = cateInfo['extra_data'][NODE.ExtraDataKey.FIXTURE]
      },
      immediate: true
    },
  },
}
</script>

<style lang="scss" scoped>
.dir-detail {
  width: 100%;
  height: 100%;
  padding: 5px;
  .fixture-list {
    width: 100%;
    min-height: 600px;
  }
}
</style>
