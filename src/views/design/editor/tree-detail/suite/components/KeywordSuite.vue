<template>
  <div class="keyword-suite">
    <div class="document">
      <document :cate-document="cateDocument"/>
    </div>
  </div>
</template>

<script>
import Document from "@/views/design/editor/tree-detail/components/Document";

export default {
  name: 'KeywordSuite',
  components: {
    Document
  },
  data() {
    return {
      cateDocument: '',
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') return
        this.cateDocument = nodeInfo['meta'].document
      },
      immediate: true
    },
  }
}
</script>

<style lang="scss" scoped>
.keyword-suite {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
}
</style>
