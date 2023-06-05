<template>
  <div class="keyword-config">
    {{keywordInfo}}
  </div>
</template>

<script>
import NODE from "@/constans/node";
import {deepCopy} from "@/utils/dcopy";

export default {
  name: 'KeywordConfig',
  data() {
    return {
      keywordInfo: {}
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        if (detailType !== NODE.DetailType.CASE) return
        this.initKeywordData()
      },
      immediate: true
    },
  },
  methods: {
    initKeywordData() {
      const nodeInfo = this.$store.state.tree.selectedNode
      this.keywordInfo = deepCopy(nodeInfo['meta'])
    },
  }
}
</script>

<style scoped>

</style>
