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
export default {
  name: 'CaseConfig',
  data() {
    return {
      caseInfo: {}
    }
  },
  watch: {
    '$store.state.tree.selectedNode': {
      handler() {
        this.caseInfo = this.$store.state.tree.selectedNode.meta
      },
      deep: true,
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
