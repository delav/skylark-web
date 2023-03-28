<template>
  <div class="build-detail">
    <div class="back-header">
      <el-icon @click="backToPlanList"><Back /></el-icon>
    </div>
    <div class="detail-body">计划详情页</div>
  </div>
</template>

<script>
export default {
  name: 'BuildDetail',
  methods: {
    backToPlanList () {
      this.$store.commit('build/SET_RIGHT_PAGE', 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.build-detail {
  width: 100%;
  height: 100%;
}
</style>
