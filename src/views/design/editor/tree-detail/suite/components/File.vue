<template>
  <div>{{ content }}</div>
</template>

<script>
import { fetchFileContent } from "@/api/file";

export default {
  name: 'File',
  data() {
    return {
      content: {}
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const nodeInfo = this.$store.state.tree.selectedNode
        if (JSON.stringify(nodeInfo) === '{}') {
          return
        }
        this.getFileContent(nodeInfo['meta']['id'])
      },
      immediate: true
    },
  },
  methods: {
    getFileContent(suiteId) {
      fetchFileContent(suiteId).then(response => {
        this.content = response.data.file_text
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
