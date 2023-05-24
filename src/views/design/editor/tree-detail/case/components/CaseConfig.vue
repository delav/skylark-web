<template>
  <div class="case-config">
    <el-collapse>
      <el-collapse-item title="Consistency" name="1">
        <template slot="title">
          <span class="collapse-title"></span>
        </template>
        <div>
          {{caseInfo}}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import NODE from "@/constans/node";

export default {
  name: 'CaseConfig',
  data() {
    return {
      caseInfo: {}
    }
  },
  watch: {
    '$store.state.tree.currentNodeId': {
      handler() {
        const detailType = this.$store.state.tree.detailType
        if (detailType !== NODE.DetailType.CASE) return
        this.caseInfo = this.$store.state.tree.selectedNode
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/element/collapse.scss";
.case-config {
  width: 100%;
}
</style>
