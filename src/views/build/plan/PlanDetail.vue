<template>
  <div class="plan-detail">
    <div class="back-header">
      <el-icon class="back-icon" @click="backToPlanList"><Back /></el-icon>
    </div>
  </div>
</template>

<script>
import PAGE from '@/constans/build'

export default {
  name: 'PlanDetail',
  data() {
    return {

    }
  },
  methods: {
    backToPlanList () {
      this.$store.commit('plan/SET_PLAN_PAGE', PAGE.PageType.LIST)
    },
  }
}
</script>

<style scoped>

</style>
